"""
Authentication API Endpoints

사용자 인증 관련 API 엔드포인트:
- 회원가입 (이메일)
- 로그인 (이메일) 
- 소셜 로그인 (Google)
- 토큰 갱신
- 로그아웃
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.models.user import User, UserProfile, UserConsent
from app.schemas.auth import (
    RegisterRequest, RegisterResponse, 
    LoginRequest, LoginResponse,
    TokenResponse, GoogleAuthRequest
)
from app.utils.auth import (
    get_password_hash, verify_password, 
    create_user_token, get_user_from_token
)

router = APIRouter()


@router.post("/register", response_model=RegisterResponse)
async def register_user(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    이메일 회원가입
    
    새로운 사용자 계정을 생성합니다.
    기본 User, UserProfile, UserConsent 레코드를 모두 생성합니다.
    """
    try:
        # 이메일 중복 확인
        existing_user = db.query(User).filter(User.email == request.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 존재하는 이메일입니다"
            )
        
        # 비밀번호 해싱
        hashed_password = get_password_hash(request.password)
        
        # 새 사용자 생성
        new_user = User(
            email=request.email,
            password_hash=hashed_password,
            name=request.name,
            is_active=True,
            is_email_verified=False
        )
        
        db.add(new_user)
        db.flush()  # ID 생성을 위해 플러시
        
        # 기본 프로필 생성
        user_profile = UserProfile(
            user_id=new_user.id,
            onboarding_completed=False,
            profile_completion_rate=0
        )
        db.add(user_profile)
        
        # 기본 동의 설정 생성 (필수 동의만 True)
        user_consent = UserConsent(
            user_id=new_user.id,
            privacy_policy=True,
            terms_of_service=True,
            push_notification=False,
            marketing_notification=False,
            data_analytics=False,
            personalized_ads=False
        )
        db.add(user_consent)
        
        # 커밋
        db.commit()
        db.refresh(new_user)
        
        return RegisterResponse(
            message="회원가입이 완료되었습니다",
            user={
                "id": new_user.id,
                "email": new_user.email,
                "name": new_user.name,
                "created_at": new_user.created_at.isoformat()
            }
        )
        
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 존재하는 이메일입니다"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"회원가입 중 오류가 발생했습니다: {str(e)}"
        )


@router.post("/login", response_model=LoginResponse)
async def login_user(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    이메일 로그인
    
    이메일과 비밀번호로 로그인하여 JWT 토큰을 발급합니다.
    """
    try:
        # 사용자 조회
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="이메일 또는 비밀번호가 잘못되었습니다"
            )
        
        # 계정 활성화 상태 확인
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="비활성화된 계정입니다"
            )
        
        # 비밀번호 검증
        if not user.password_hash or not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="이메일 또는 비밀번호가 잘못되었습니다"
            )
        
        # 프로필 및 온보딩 상태 조회
        profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        onboarding_completed = profile.onboarding_completed if profile else False
        
        # JWT 토큰 생성
        access_token = create_user_token(user.id, user.email)
        
        # 토큰 만료 시간 (초)
        from app.utils.auth import ACCESS_TOKEN_EXPIRE_MINUTES
        expires_in = ACCESS_TOKEN_EXPIRE_MINUTES * 60
        
        # 마지막 로그인 시간 업데이트
        from datetime import datetime
        user.last_login = datetime.utcnow()
        db.commit()
        
        return LoginResponse(
            message="로그인 성공",
            user={
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "onboarding_completed": onboarding_completed
            },
            token=TokenResponse(
                access_token=access_token,
                token_type="bearer",
                expires_in=expires_in
            )
        )
        
    except HTTPException:
        # FastAPI HTTPException은 그대로 재전파
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"로그인 중 오류가 발생했습니다: {str(e)}"
        )


@router.post("/google", response_model=LoginResponse)
async def google_login(
    request: GoogleAuthRequest,
    db: Session = Depends(get_db)
):
    """
    Google OAuth 로그인
    
    Google Access Token을 사용하여 로그인/회원가입을 처리합니다.
    신규 사용자의 경우 자동으로 계정을 생성합니다.
    """
    try:
        # Google API를 통한 사용자 정보 조회
        import httpx
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {request.access_token}"}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="유효하지 않은 Google Access Token입니다"
                )
            
            google_user_info = response.json()
        
        google_email = google_user_info.get("email")
        google_name = google_user_info.get("name", google_email.split("@")[0])
        google_id = google_user_info.get("id")
        
        if not google_email or not google_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google 사용자 정보를 가져올 수 없습니다"
            )
        
        # 기존 사용자 확인 (이메일 기준)
        existing_user = db.query(User).filter(User.email == google_email).first()
        
        if existing_user:
            # 기존 사용자 로그인
            user = existing_user
        else:
            # 신규 사용자 생성
            new_user = User(
                email=google_email,
                password_hash=None,  # 소셜 로그인은 비밀번호 없음
                name=google_name,
                is_active=True,
                is_email_verified=True  # Google 이메일은 검증된 것으로 간주
            )
            
            db.add(new_user)
            db.flush()
            
            # 기본 프로필 생성
            user_profile = UserProfile(
                user_id=new_user.id,
                onboarding_completed=False,
                profile_completion_rate=0
            )
            db.add(user_profile)
            
            # 기본 동의 설정
            user_consent = UserConsent(
                user_id=new_user.id,
                privacy_policy=True,
                terms_of_service=True,
                push_notification=False,
                marketing_notification=False,
                data_analytics=False,
                personalized_ads=False
            )
            db.add(user_consent)
            
            # 소셜 계정 연동 정보 저장
            from app.models.user import UserSocialAccount
            social_account = UserSocialAccount(
                user_id=new_user.id,
                provider="google",
                provider_id=google_id,
                provider_email=google_email,
                provider_data=google_user_info,
                is_active=True
            )
            db.add(social_account)
            
            user = new_user
        
        # 프로필 및 온보딩 상태 조회
        profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        onboarding_completed = profile.onboarding_completed if profile else False
        
        # JWT 토큰 생성
        access_token = create_user_token(user.id, user.email)
        
        # 토큰 만료 시간
        from app.utils.auth import ACCESS_TOKEN_EXPIRE_MINUTES
        expires_in = ACCESS_TOKEN_EXPIRE_MINUTES * 60
        
        # 마지막 로그인 시간 업데이트
        from datetime import datetime
        user.last_login = datetime.utcnow()
        db.commit()
        
        return LoginResponse(
            message="Google 로그인 성공",
            user={
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "onboarding_completed": onboarding_completed
            },
            token=TokenResponse(
                access_token=access_token,
                token_type="bearer",
                expires_in=expires_in
            )
        )
        
    except HTTPException:
        # FastAPI HTTPException은 그대로 재전파
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google 로그인 중 오류가 발생했습니다: {str(e)}"
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    authorization: str = Depends(lambda req: req.headers.get("Authorization")),
    db: Session = Depends(get_db)
):
    """
    JWT 토큰 갱신
    
    유효한 JWT 토큰을 사용하여 새로운 토큰을 발급받습니다.
    """
    try:
        if not authorization:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization 헤더가 필요합니다",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Bearer 토큰 추출
        token = authorization.replace("Bearer ", "").strip()
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Bearer 토큰이 필요합니다",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # 토큰 검증 및 사용자 정보 추출
        user_info = get_user_from_token(token)
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="유효하지 않거나 만료된 토큰입니다",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # 사용자 존재 및 활성화 상태 확인
        user = db.query(User).filter(User.id == user_info["user_id"]).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="사용자를 찾을 수 없거나 비활성화된 계정입니다",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # 새 토큰 생성
        new_access_token = create_user_token(user.id, user.email)
        
        # 토큰 만료 시간
        from app.utils.auth import ACCESS_TOKEN_EXPIRE_MINUTES
        expires_in = ACCESS_TOKEN_EXPIRE_MINUTES * 60
        
        return TokenResponse(
            access_token=new_access_token,
            token_type="bearer",
            expires_in=expires_in
        )
        
    except HTTPException:
        # FastAPI HTTPException은 그대로 재전파
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"토큰 갱신 중 오류가 발생했습니다: {str(e)}"
        )


@router.post("/logout")
async def logout_user():
    """
    로그아웃
    
    JWT 토큰 기반 시스템에서는 서버 측에서 토큰을 무효화할 수 없으므로,
    클라이언트에서 토큰을 삭제하도록 안내하는 메시지를 반환합니다.
    """
    return {
        "message": "로그아웃 완료",
        "detail": "클라이언트에서 토큰을 삭제해주세요"
    }