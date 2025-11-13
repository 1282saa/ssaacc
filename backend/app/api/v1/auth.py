from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.services.auth_service import auth_service
from app.schemas.auth import UserResponse, Token

router = APIRouter()
security = HTTPBearer()

class GoogleAuthRequest(BaseModel):
    access_token: str

@router.post("/google", response_model=dict)
async def google_auth(
    auth_request: GoogleAuthRequest,
    db: Session = Depends(get_db)
):
    """구글 OAuth 로그인/회원가입"""
    try:
        result = await auth_service.authenticate_with_google(
            db, auth_request.access_token
        )
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="구글 토큰이 유효하지 않습니다"
            )
        
        user, token = result
        return {
            "user": UserResponse.model_validate(user),
            "token": token,
            "message": "로그인 성공"
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="서버 오류가 발생했습니다"
        )

@router.get("/me", response_model=UserResponse)
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """현재 사용자 정보 조회"""
    token = credentials.credentials
    user = auth_service.get_current_user(db, token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다"
        )
    
    return UserResponse.model_validate(user)

@router.post("/logout")
def logout():
    """로그아웃 (클라이언트에서 토큰 제거)"""
    return {"message": "로그아웃 되었습니다"}