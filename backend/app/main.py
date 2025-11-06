"""
FinKuRN Backend - FastAPI Main Application
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

메이크리 AI 워크플로우 아키텍처 기반 챗봇 API
- Supervisor Agent → 5개 전문 에이전트 → Synthesizer
- FastMCP를 통한 Tool 추상화
- LangGraph를 통한 Multi-Agent 오케스트레이션
- Milvus(Vector DB) + Neo4j(Graph DB)
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger
import os
from datetime import datetime

# FastAPI 앱 초기화
app = FastAPI(
    title="FinKuRN AI Backend",
    description="메이크리 AI 워크플로우 기반 금융 상담 챗봇",
    version="1.0.0",
)

# CORS 설정 (React Native에서 접근 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Health Check & Status Endpoints
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.get("/")
async def root():
    """루트 엔드포인트 - API 정보 반환"""
    return {
        "service": "FinKuRN AI Backend",
        "version": "1.0.0",
        "status": "running",
        "architecture": "메이크리 AI 워크플로우",
        "components": {
            "orchestration": "LangGraph",
            "tools": "FastMCP",
            "vector_db": "Milvus",
            "graph_db": "Neo4j",
            "llm": "Claude 3.5 Sonnet (AWS Bedrock)",
        },
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/health")
async def health_check():
    """
    헬스체크 엔드포인트
    - Docker healthcheck에서 사용
    - 모든 의존성 서비스 상태 확인
    """
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {},
    }

    # TODO: Milvus 연결 확인
    try:
        # from app.db.milvus_client import check_connection
        # milvus_healthy = check_connection()
        health_status["services"]["milvus"] = "not_implemented"
    except Exception as e:
        health_status["services"]["milvus"] = f"error: {str(e)}"

    # TODO: Neo4j 연결 확인
    try:
        # from app.db.neo4j_client import check_connection
        # neo4j_healthy = check_connection()
        health_status["services"]["neo4j"] = "not_implemented"
    except Exception as e:
        health_status["services"]["neo4j"] = f"error: {str(e)}"

    # 전체 상태 판단
    if any("error" in str(v) for v in health_status["services"].values()):
        health_status["status"] = "degraded"

    return health_status


@app.get("/api/status")
async def api_status():
    """
    API 상태 상세 정보
    - 환경 변수 확인 (민감 정보 제외)
    - 데이터베이스 연결 상태
    """
    return {
        "api_version": "1.0.0",
        "environment": {
            "anthropic_api_configured": bool(os.getenv("ANTHROPIC_API_KEY")),
            "openai_api_configured": bool(os.getenv("OPENAI_API_KEY")),
            "milvus_host": os.getenv("MILVUS_HOST", "localhost"),
            "neo4j_uri": os.getenv("NEO4J_URI", "bolt://localhost:7687"),
        },
        "features": {
            "chat": "ready",
            "policy_search": "ready",
            "eligibility_check": "ready",
            "graph_inference": "not_implemented",  # Phase 2
            "emotional_analysis": "not_implemented",  # Phase 3
        },
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Chat API Endpoints
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.post("/api/chats/{chat_id}/messages")
async def send_message(chat_id: str, request: Request):
    """
    채팅 메시지 전송 엔드포인트

    Flow:
    1. 사용자 메시지 수신
    2. LangGraph Workflow 실행
       - Supervisor Agent: 의도 파악 & 라우팅
       - Specialized Agents: 각자 역할 수행
       - Synthesizer Agent: 최종 응답 생성
    3. 응답 반환

    TODO: 실제 LangGraph 워크플로우 구현
    """
    try:
        body = await request.json()
        user_message = body.get("message", "")
        user_context = body.get("context", {})

        logger.info(f"Chat {chat_id}: Received message: {user_message}")

        # TODO: LangGraph 워크플로우 실행
        # from app.langgraph.graph import run_workflow
        # response = await run_workflow(user_message, user_context)

        # 임시 응답 (구현 완료 전까지)
        mock_response = {
            "id": f"msg_{datetime.utcnow().timestamp()}",
            "chatId": chat_id,
            "content": f"[테스트 응답] 메시지를 받았습니다: '{user_message}'\n\n실제 LangGraph 워크플로우는 아직 구현 중입니다.",
            "role": "assistant",
            "timestamp": datetime.utcnow().isoformat(),
            "metadata": {
                "workflow_status": "not_implemented",
                "agents_triggered": [],
                "tools_used": [],
            },
        }

        return mock_response

    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error", "detail": str(e)},
        )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Startup & Shutdown Events
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.on_event("startup")
async def startup_event():
    """서버 시작 시 실행"""
    logger.info("🚀 FinKuRN AI Backend starting...")
    logger.info("📋 Architecture: 메이크리 AI 워크플로우")
    logger.info("🔧 Orchestration: LangGraph")
    logger.info("🛠️  Tools: FastMCP")
    logger.info("🗄️  Vector DB: Milvus")
    logger.info("🕸️  Graph DB: Neo4j")

    # TODO: 데이터베이스 연결 초기화
    # await init_milvus()
    # await init_neo4j()


@app.on_event("shutdown")
async def shutdown_event():
    """서버 종료 시 실행"""
    logger.info("👋 FinKuRN AI Backend shutting down...")
    # TODO: 데이터베이스 연결 종료


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # 개발 모드에서만 사용
        log_level="info",
    )
