from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
import json

from app.database import get_db
from app.services.auth_service import auth_service

router = APIRouter()
security = HTTPBearer()

class ChatMessage(BaseModel):
    content: str
    role: str = "user"
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    id: str
    chatId: str
    content: str
    role: str = "assistant"
    timestamp: str
    metadata: Optional[dict] = None

@router.post("/chats/{chat_id}/messages", response_model=ChatResponse)
async def send_message(
    chat_id: str,
    message: ChatMessage,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """채팅 메시지 전송 및 AI 응답 생성"""
    
    # 사용자 인증 확인
    token = credentials.credentials
    user = auth_service.get_current_user(db, token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다"
        )
    
    try:
        # Anthropic API 호출
        from app.services.chat_service import chat_service
        
        # 사용자 정보를 컨텍스트에 추가
        user_context = {
            "user_id": str(user.id),
            "user_name": user.name,
            "user_email": user.email,
            **(message.context or {})
        }
        
        ai_response = await chat_service.generate_response(
            message.content,
            user_context
        )
        
        # 응답 포맷팅
        response = ChatResponse(
            id=f"msg_{datetime.utcnow().timestamp()}",
            chatId=chat_id,
            content=ai_response,
            role="assistant",
            timestamp=datetime.utcnow().isoformat(),
            metadata={
                "user_id": str(user.id),
                "model": "claude-3-sonnet"
            }
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"채팅 응답 생성 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/chats/{chat_id}")
async def get_chat_history(
    chat_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """채팅 히스토리 조회"""
    
    # 사용자 인증 확인
    token = credentials.credentials
    user = auth_service.get_current_user(db, token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다"
        )
    
    # TODO: 실제 구현시 데이터베이스에서 채팅 히스토리 조회
    return {
        "chat_id": chat_id,
        "messages": [],
        "user_id": str(user.id)
    }