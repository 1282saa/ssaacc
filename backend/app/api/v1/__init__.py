"""
API v1 라우터

FastAPI 라우터 모음
"""

from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router

api_router = APIRouter()

# 인증 관련 라우터
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])

# 사용자 관리 라우터
api_router.include_router(users_router, prefix="/users", tags=["users"])

__all__ = ["api_router"]