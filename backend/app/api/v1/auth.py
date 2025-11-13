from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import urllib.parse

from app.database import get_db
from app.services.auth_service import auth_service
from app.schemas.auth import UserResponse, Token

router = APIRouter()
security = HTTPBearer()

class GoogleAuthRequest(BaseModel):
    access_token: str

@router.get("/google/login")
async def google_login():
    """구글 로그인 페이지로 리디렉션"""
    import os
    
    params = {
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "redirect_uri": f"{os.getenv('BASE_URL', 'http://localhost:8000')}/api/v1/auth/google/callback",
        "scope": "openid email profile",
        "response_type": "code",
        "access_type": "offline"
    }
    
    google_auth_url = "https://accounts.google.com/o/oauth2/auth?" + urllib.parse.urlencode(params)
    return RedirectResponse(url=google_auth_url)

@router.get("/google/callback")
async def google_callback(code: str = None, error: str = None, db: Session = Depends(get_db)):
    """구글 OAuth 콜백 처리"""
    import os
    
    if error:
        error_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/auth/error?message={urllib.parse.quote(error)}"
        return RedirectResponse(url=error_url)
    
    if not code:
        error_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/auth/error?message=authorization_code_missing"
        return RedirectResponse(url=error_url)
    
    try:
        import httpx
        import os
        
        # Authorization code를 access token으로 교환
        import os
        token_data = {
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": f"{os.getenv('BASE_URL', 'http://localhost:8000')}/api/v1/auth/google/callback"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://oauth2.googleapis.com/token",
                data=token_data
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail="토큰 교환 실패"
                )
            
            token_info = response.json()
            access_token = token_info.get("access_token")
            
            # 기존 authenticate_with_google 로직 사용
            result = await auth_service.authenticate_with_google(db, access_token)
            
            if not result:
                raise HTTPException(
                    status_code=401,
                    detail="인증 실패"
                )
            
            user, jwt_token = result
            
            # 성공 시 프론트엔드로 리디렉션 (토큰과 함께)
            frontend_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/auth/success?token={jwt_token.access_token}"
            return RedirectResponse(url=frontend_url)
            
    except Exception as e:
        # 에러 시 프론트엔드 에러 페이지로 리디렉션
        error_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/auth/error?message={urllib.parse.quote(str(e))}"
        return RedirectResponse(url=error_url)

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