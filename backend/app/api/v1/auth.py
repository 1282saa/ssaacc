from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import RedirectResponse, HTMLResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import urllib.parse
import json

from app.database import get_db
from app.services.auth_service import auth_service
from app.schemas.auth import UserResponse, Token, UserCreate, UserLogin
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User

router = APIRouter()
security = HTTPBearer()

class GoogleAuthRequest(BaseModel):
    access_token: str

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Email/Password Authentication
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.post("/register", response_model=dict)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """이메일/비밀번호로 회원가입"""
    # 이메일 중복 확인
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 등록된 이메일입니다"
        )

    # 새 사용자 생성
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hashed_password,
        is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # JWT 토큰 생성
    access_token = create_access_token(subject=new_user.email)

    return {
        "user": UserResponse(
            id=str(new_user.id),
            email=new_user.email,
            name=new_user.name,
            is_active=new_user.is_active,
            created_at=new_user.created_at
        ),
        "token": Token(access_token=access_token),
        "message": "회원가입 성공"
    }

@router.post("/login", response_model=dict)
def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """이메일/비밀번호로 로그인"""
    # 사용자 조회
    user = db.query(User).filter(User.email == login_data.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다"
        )

    # 비밀번호 확인
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다"
        )

    # 계정 활성화 확인
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="비활성화된 계정입니다"
        )

    # JWT 토큰 생성
    access_token = create_access_token(subject=user.email)

    return {
        "user": UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            is_active=user.is_active,
            created_at=user.created_at
        ),
        "token": Token(access_token=access_token),
        "message": "로그인 성공"
    }

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Google OAuth
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
    
    print(f"🔍 Google callback received - code: {code is not None}, error: {error}")
    
    if error:
        print(f"❌ OAuth error: {error}")
        error_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:8081')}/auth/error?message={urllib.parse.quote(error)}"
        return RedirectResponse(url=error_url)
    
    if not code:
        print("❌ No authorization code received")
        error_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:8081')}/auth/error?message=authorization_code_missing"
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
            
            # 성공 시 HTML 페이지 반환 (JavaScript로 메시지 전송)
            user_data = {
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat()
            }
            
            # 성공 HTML 페이지 직접 생성
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>로그인 성공</title>
                <meta charset="UTF-8">
                <style>
                    body {{ 
                        font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        height: 100vh; 
                        margin: 0; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }}
                    .container {{ 
                        text-align: center; 
                        background: white; 
                        padding: 40px; 
                        border-radius: 10px; 
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }}
                    .success {{ color: #4CAF50; font-size: 24px; margin-bottom: 20px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h2 class="success">구글 로그인 성공!</h2>
                    <p>로그인이 완료되었습니다.</p>
                    <p>이 창은 자동으로 닫힙니다...</p>
                </div>

                <script>
                    const token = "{jwt_token.access_token}";
                    const user = {json.dumps(user_data)};
                    
                    if (window.opener) {{
                        window.opener.postMessage({{
                            type: 'GOOGLE_AUTH_SUCCESS',
                            token: token,
                            user: user
                        }}, 'http://localhost:8081');
                        window.close();
                    }}
                    
                    setTimeout(() => {{
                        window.close();
                    }}, 3000);
                </script>
            </body>
            </html>
            """
            
            return HTMLResponse(content=html_content)
            
    except Exception as e:
        print(f"Exception in callback: {str(e)}")
        # 에러 시 프론트엔드 에러 페이지로 리디렉션  
        error_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:8081')}/auth/error?message={urllib.parse.quote(str(e))}"
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

    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        is_active=user.is_active,
        created_at=user.created_at
    )

@router.post("/logout")
def logout():
    """로그아웃 (클라이언트에서 토큰 제거)"""
    return {"message": "로그아웃 되었습니다"}