"""
Authentication Schemas

인증 관련 Pydantic 스키마 정의
- 로그인/회원가입 요청/응답
- JWT 토큰 응답  
- Google OAuth 요청
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """로그인 요청"""
    email: EmailStr = Field(..., description="이메일")
    password: str = Field(..., min_length=6, description="비밀번호 (최소 6자)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "user@example.com",
                "password": "password123"
            }
        }
    }


class RegisterRequest(BaseModel):
    """회원가입 요청"""
    email: EmailStr = Field(..., description="이메일")
    password: str = Field(..., min_length=6, max_length=50, description="비밀번호 (6-50자)")
    name: str = Field(..., min_length=2, max_length=50, description="이름 (2-50자)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "newuser@example.com", 
                "password": "securepass123",
                "name": "김핀큐"
            }
        }
    }


class GoogleAuthRequest(BaseModel):
    """Google OAuth 인증 요청"""
    access_token: str = Field(..., description="Google Access Token")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "access_token": "ya29.a0AfH6SMC..."
            }
        }
    }


class TokenResponse(BaseModel):
    """JWT 토큰 응답"""
    access_token: str = Field(..., description="JWT 액세스 토큰")
    token_type: str = Field(default="bearer", description="토큰 타입")
    expires_in: int = Field(..., description="토큰 만료 시간 (초)")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "expires_in": 86400
            }
        }
    }


class LoginResponse(BaseModel):
    """로그인 성공 응답"""
    message: str = Field(default="로그인 성공", description="응답 메시지")
    user: dict = Field(..., description="사용자 기본 정보")
    token: TokenResponse = Field(..., description="JWT 토큰 정보")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "로그인 성공",
                "user": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "email": "user@example.com",
                    "name": "김핀큐",
                    "onboarding_completed": False
                },
                "token": {
                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "token_type": "bearer", 
                    "expires_in": 86400
                }
            }
        }
    }


class RegisterResponse(BaseModel):
    """회원가입 성공 응답"""
    message: str = Field(default="회원가입 성공", description="응답 메시지")
    user: dict = Field(..., description="생성된 사용자 정보")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "회원가입 성공",
                "user": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "email": "newuser@example.com",
                    "name": "김핀큐",
                    "created_at": "2024-11-13T10:00:00Z"
                }
            }
        }
    }


class PasswordResetRequest(BaseModel):
    """비밀번호 재설정 요청"""
    email: EmailStr = Field(..., description="비밀번호를 재설정할 이메일")


class PasswordResetConfirm(BaseModel):
    """비밀번호 재설정 확인"""
    token: str = Field(..., description="재설정 토큰")
    new_password: str = Field(..., min_length=6, max_length=50, description="새 비밀번호")


class ChangePasswordRequest(BaseModel):
    """비밀번호 변경 요청 (로그인 상태)"""
    current_password: str = Field(..., description="현재 비밀번호")
    new_password: str = Field(..., min_length=6, max_length=50, description="새 비밀번호")


class AuthErrorResponse(BaseModel):
    """인증 에러 응답"""
    error: str = Field(..., description="에러 타입")
    message: str = Field(..., description="에러 메시지")
    details: Optional[dict] = Field(None, description="추가 에러 정보")

    model_config = {
        "json_schema_extra": {
            "example": {
                "error": "invalid_credentials",
                "message": "이메일 또는 비밀번호가 잘못되었습니다",
                "details": None
            }
        }
    }