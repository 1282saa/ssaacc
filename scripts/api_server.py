#!/usr/bin/env python3
"""
FastAPI REST API Server for FinKuRN Chatbot.
Provides endpoints for React Native frontend integration.
"""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uvicorn
import sys
import os
import json
import asyncio

sys.path.insert(0, os.path.dirname(__file__))
from bedrock_chatbot import BedrockPolicyBot

# Initialize FastAPI app
app = FastAPI(
    title="FinKuRN API",
    description="AI-powered youth policy recommendation chatbot API",
    version="1.0.0"
)

# CORS middleware for React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React Native 앱에서 접근 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'finkurn'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'finkurn2024')
}

# Initialize chatbot (singleton)
chatbot: Optional[BedrockPolicyBot] = None

def get_chatbot() -> BedrockPolicyBot:
    """Get or create chatbot instance."""
    global chatbot
    if chatbot is None:
        chatbot = BedrockPolicyBot(
            db_config=DB_CONFIG,
            aws_profile=None
        )
    return chatbot


# Request/Response Models
class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    conversation_history: Optional[List[Dict[str, str]]] = None
    top_k: Optional[int] = 5

    class Config:
        json_schema_extra = {
            "example": {
                "message": "25살 청년인데 적금 추천해주세요",
                "context": {
                    "age": 25,
                    "region": "서울",
                    "employment_status": "재직자"
                },
                "top_k": 5
            }
        }


class PolicyInfo(BaseModel):
    id: int
    policy_name: str
    category: str
    region: str
    deadline: str
    summary: str
    similarity_score: float


class ChatResponse(BaseModel):
    response: str
    retrieved_policies: List[PolicyInfo]
    timestamp: str


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    database: str
    model: str


class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 10
    similarity_threshold: Optional[float] = 0.3

    class Config:
        json_schema_extra = {
            "example": {
                "query": "청년 주거 지원",
                "top_k": 10,
                "similarity_threshold": 0.3
            }
        }


# API Endpoints
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint."""
    return {
        "message": "FinKuRN API is running",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint."""
    try:
        bot = get_chatbot()
        return HealthResponse(
            status="healthy",
            timestamp=datetime.now().isoformat(),
            database="PostgreSQL + pgvector",
            model="Claude 3.5 Sonnet (us.anthropic.claude-3-5-sonnet-20240620-v1:0)"
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")


@app.post("/api/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    """
    Chat with AI assistant about youth policies.

    - **message**: User's question or message
    - **context**: Optional user context (age, region, employment status, etc.)
    - **conversation_history**: Optional previous conversation turns
    - **top_k**: Number of policies to retrieve (default: 5)
    """
    try:
        bot = get_chatbot()

        # Enhance query with context if provided
        enhanced_query = request.message
        if request.context:
            context_str = ", ".join([f"{k}: {v}" for k, v in request.context.items()])
            enhanced_query = f"{request.message} (사용자 정보: {context_str})"

        # Get chatbot response
        result = bot.chat(
            user_query=enhanced_query,
            top_k=request.top_k or 5,
            conversation_history=request.conversation_history
        )

        # Format policies
        policies = [
            PolicyInfo(
                id=p['id'],
                policy_name=p['policy_name'],
                category=p.get('category', ''),
                region=p.get('region', ''),
                deadline=p.get('deadline', ''),
                summary=p.get('summary', ''),
                similarity_score=p['similarity_score']
            )
            for p in result['retrieved_policies']
        ]

        return ChatResponse(
            response=result['response'],
            retrieved_policies=policies,
            timestamp=result['timestamp']
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.post("/api/chats/{chat_id}/messages", tags=["Chat"])
async def send_message(chat_id: str, request: Dict[str, Any]):
    """
    Send message endpoint for React Native frontend.
    Compatible with /api/chats/{chat_id}/messages pattern.

    - **chat_id**: Chat session ID
    - **message**: User's message
    - **context**: Optional user context
    """
    try:
        bot = get_chatbot()

        # Extract message and context
        user_message = request.get("message", "")
        user_context = request.get("context", {})

        # Enhance query with context if provided
        enhanced_query = user_message
        if user_context:
            context_str = ", ".join([f"{k}: {v}" for k, v in user_context.items()])
            enhanced_query = f"{user_message} (사용자 정보: {context_str})"

        # Get chatbot response with lower similarity threshold
        # Note: Lower threshold to capture more relevant policies
        policies = bot.search_policies(
            query=enhanced_query,
            top_k=5,
            similarity_threshold=0.1  # Lowered from default 0.3
        )

        result = {
            'response': bot.generate_response(
                user_query=enhanced_query,
                retrieved_policies=policies,
                conversation_history=None
            ),
            'retrieved_policies': policies,
            'timestamp': datetime.now().isoformat()
        }

        # Return response in format expected by React Native frontend
        return {
            "id": f"msg_{datetime.now().timestamp()}",
            "chatId": chat_id,
            "content": result['response'],
            "role": "assistant",
            "timestamp": result['timestamp'],
            "metadata": {
                "retrieved_policies": len(result['retrieved_policies']),
                "top_policies": [p['policy_name'] for p in result['retrieved_policies'][:3]]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.post("/api/search", tags=["Search"])
async def search_policies(request: SearchRequest):
    """
    Search for policies using vector similarity.

    - **query**: Search query
    - **top_k**: Number of results to return (default: 10)
    - **similarity_threshold**: Minimum similarity score (default: 0.3)
    """
    try:
        bot = get_chatbot()

        policies = bot.search_policies(
            query=request.query,
            top_k=request.top_k or 10,
            similarity_threshold=request.similarity_threshold or 0.3
        )

        return {
            "query": request.query,
            "total_results": len(policies),
            "policies": [
                {
                    "id": p['id'],
                    "policy_name": p['policy_name'],
                    "category": p.get('category', ''),
                    "region": p.get('region', ''),
                    "deadline": p.get('deadline', ''),
                    "summary": p.get('summary', ''),
                    "support_content": p.get('support_content', ''),
                    "eligibility": p.get('eligibility', {}),
                    "application_info": p.get('application_info', {}),
                    "similarity_score": p['similarity_score']
                }
                for p in policies
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")


@app.get("/api/policies/{policy_id}", tags=["Policies"])
async def get_policy(policy_id: int):
    """
    Get detailed information about a specific policy.

    - **policy_id**: Policy ID
    """
    try:
        bot = get_chatbot()
        cursor = bot.conn.cursor()

        cursor.execute("""
            SELECT
                id, policy_name, policy_number, category, region, deadline,
                summary, support_content, operation_period, application_period,
                support_scale, eligibility, application_info, additional_info,
                tags, last_modified, scraps, views, s3_bucket, s3_key
            FROM youth_policies
            WHERE id = %s
        """, (policy_id,))

        row = cursor.fetchone()
        cursor.close()

        if not row:
            raise HTTPException(status_code=404, detail="Policy not found")

        return {
            "id": row[0],
            "policy_name": row[1],
            "policy_number": row[2],
            "category": row[3],
            "region": row[4],
            "deadline": row[5],
            "summary": row[6],
            "support_content": row[7],
            "operation_period": row[8],
            "application_period": row[9],
            "support_scale": row[10],
            "eligibility": row[11],
            "application_info": row[12],
            "additional_info": row[13],
            "tags": row[14],
            "last_modified": row[15],
            "scraps": row[16],
            "views": row[17],
            "s3_bucket": row[18],
            "s3_key": row[19]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/policies", tags=["Policies"])
async def list_policies(
    category: Optional[str] = None,
    region: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
):
    """
    List all policies with optional filtering.

    - **category**: Filter by category
    - **region**: Filter by region
    - **limit**: Number of results (default: 20, max: 100)
    - **offset**: Pagination offset (default: 0)
    """
    try:
        bot = get_chatbot()
        cursor = bot.conn.cursor()

        # Build query
        query = """
            SELECT id, policy_name, category, region, deadline, summary, views, scraps
            FROM youth_policies
            WHERE 1=1
        """
        params = []

        if category:
            query += " AND category = %s"
            params.append(category)

        if region:
            query += " AND region = %s"
            params.append(region)

        query += " ORDER BY views DESC LIMIT %s OFFSET %s"
        params.extend([min(limit, 100), offset])

        cursor.execute(query, params)
        rows = cursor.fetchall()

        # Get total count
        count_query = "SELECT COUNT(*) FROM youth_policies WHERE 1=1"
        count_params = []
        if category:
            count_query += " AND category = %s"
            count_params.append(category)
        if region:
            count_query += " AND region = %s"
            count_params.append(region)

        cursor.execute(count_query, count_params)
        total = cursor.fetchone()[0]

        cursor.close()

        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "policies": [
                {
                    "id": row[0],
                    "policy_name": row[1],
                    "category": row[2],
                    "region": row[3],
                    "deadline": row[4],
                    "summary": row[5],
                    "views": row[6],
                    "scraps": row[7]
                }
                for row in rows
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/categories", tags=["Metadata"])
async def get_categories():
    """Get list of all policy categories."""
    try:
        bot = get_chatbot()
        cursor = bot.conn.cursor()

        cursor.execute("""
            SELECT category, COUNT(*) as count
            FROM youth_policies
            WHERE category IS NOT NULL AND category != ''
            GROUP BY category
            ORDER BY count DESC
        """)

        rows = cursor.fetchall()
        cursor.close()

        return {
            "categories": [
                {"name": row[0], "count": row[1]}
                for row in rows
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/regions", tags=["Metadata"])
async def get_regions():
    """Get list of all regions."""
    try:
        bot = get_chatbot()
        cursor = bot.conn.cursor()

        cursor.execute("""
            SELECT region, COUNT(*) as count
            FROM youth_policies
            WHERE region IS NOT NULL AND region != ''
            GROUP BY region
            ORDER BY count DESC
        """)

        rows = cursor.fetchall()
        cursor.close()

        return {
            "regions": [
                {"name": row[0], "count": row[1]}
                for row in rows
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.websocket("/ws/chat/{chat_id}")
async def websocket_chat(websocket: WebSocket, chat_id: str):
    """
    WebSocket endpoint for streaming chat responses.

    Message format (client -> server):
    {
        "message": "사용자 질문",
        "context": {"age": 25, "region": "서울"}
    }

    Message format (server -> client):
    {
        "type": "start",
        "chat_id": "...",
        "timestamp": "..."
    }
    {
        "type": "chunk",
        "content": "텍스트 청크"
    }
    {
        "type": "policy",
        "policies": [...]
    }
    {
        "type": "end",
        "full_response": "전체 응답"
    }
    """
    await websocket.accept()

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)

            user_message = message_data.get("message", "")
            user_context = message_data.get("context", {})
            conversation_history = user_context.get("conversation_history", None)

            if not user_message:
                await websocket.send_json({
                    "type": "error",
                    "message": "Empty message"
                })
                continue

            # Send start event
            await websocket.send_json({
                "type": "start",
                "chat_id": chat_id,
                "timestamp": datetime.now().isoformat()
            })

            try:
                bot = get_chatbot()

                # Enhance query with context (exclude conversation_history from context_str)
                enhanced_query = user_message
                context_without_history = {k: v for k, v in user_context.items() if k != "conversation_history"}
                if context_without_history:
                    context_str = ", ".join([f"{k}: {v}" for k, v in context_without_history.items()])
                    enhanced_query = f"{user_message} (사용자 정보: {context_str})"

                # Search policies
                policies = bot.search_policies(
                    query=enhanced_query,
                    top_k=5,
                    similarity_threshold=0.1
                )

                # Send policies
                await websocket.send_json({
                    "type": "policy",
                    "policies": [
                        {
                            "id": p['id'],
                            "policy_name": p['policy_name'],
                            "similarity_score": p['similarity_score']
                        }
                        for p in policies[:3]
                    ]
                })

                # Stream response with conversation history
                full_response = ""
                for chunk in bot.generate_response_stream(
                    user_query=enhanced_query,
                    retrieved_policies=policies,
                    conversation_history=conversation_history
                ):
                    full_response += chunk
                    await websocket.send_json({
                        "type": "chunk",
                        "content": chunk
                    })
                    # Smoother streaming - very small delay
                    await asyncio.sleep(0.005)

                # Send end event
                await websocket.send_json({
                    "type": "end",
                    "full_response": full_response,
                    "timestamp": datetime.now().isoformat()
                })

            except Exception as e:
                await websocket.send_json({
                    "type": "error",
                    "message": str(e)
                })

    except WebSocketDisconnect:
        print(f"WebSocket disconnected for chat {chat_id}")
    except Exception as e:
        print(f"WebSocket error for chat {chat_id}: {str(e)}")
        try:
            await websocket.send_json({
                "type": "error",
                "message": str(e)
            })
        except:
            pass


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    global chatbot
    if chatbot:
        chatbot.close()


# Run server
if __name__ == "__main__":
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
