from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional
import httpx
from jose import JWTError, jwt
from datetime import datetime, timedelta

from app.models.user import User, UserProfile, UserSocialAccount
from app.core.security import create_access_token, get_password_hash, verify_password
from app.schemas.auth import UserCreate, UserResponse, Token
from app.database import get_db

class AuthService:
    def __init__(self):
        import os
        self.google_client_id = os.getenv("GOOGLE_CLIENT_ID", "4468602791-45erjv17n54g65tcj8mbsdirkp0610p8.apps.googleusercontent.com")
        self.google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET", "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")
        
    async def verify_google_token(self, token: str) -> Optional[dict]:
        """구글 OAuth 토큰 검증"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={token}"
                )
                if response.status_code == 200:
                    token_data = response.json()
                    if token_data.get("aud") == self.google_client_id:
                        return token_data
        except Exception:
            pass
        return None
    
    async def get_google_user_info(self, access_token: str) -> Optional[dict]:
        """구글 사용자 정보 조회"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    headers={"Authorization": f"Bearer {access_token}"}
                )
                if response.status_code == 200:
                    return response.json()
        except Exception:
            pass
        return None
    
    def get_user_by_email(self, db: Session, email: str) -> Optional[User]:
        """이메일로 사용자 조회"""
        return db.query(User).filter(User.email == email).first()
    
    def get_user_by_social_id(self, db: Session, provider: str, social_id: str) -> Optional[User]:
        """소셜 계정으로 사용자 조회"""
        social_account = db.query(UserSocialAccount).filter(
            UserSocialAccount.provider == provider,
            UserSocialAccount.provider_id == social_id
        ).first()
        return social_account.user if social_account else None
    
    def create_user_with_google(self, db: Session, google_user: dict) -> User:
        """구글 계정으로 사용자 생성"""
        try:
            user = User(
                email=google_user["email"],
                name=google_user["name"],
                is_active=True
            )
            db.add(user)
            db.flush()
            
            user_profile = UserProfile(
                user_id=user.id,
                profile_image_url=google_user.get("picture")
            )
            db.add(user_profile)
            
            social_account = UserSocialAccount(
                user_id=user.id,
                provider="google",
                provider_id=google_user["id"],
                provider_email=google_user["email"]
            )
            db.add(social_account)
            
            db.commit()
            db.refresh(user)
            return user
            
        except IntegrityError:
            db.rollback()
            raise ValueError("이미 등록된 이메일입니다")
    
    async def authenticate_with_google(self, db: Session, access_token: str) -> Optional[tuple[User, Token]]:
        """구글 OAuth 인증"""
        google_user = await self.get_google_user_info(access_token)
        if not google_user:
            return None
        
        user = self.get_user_by_social_id(db, "google", google_user["id"])
        if not user:
            user = self.get_user_by_email(db, google_user["email"])
            if not user:
                user = self.create_user_with_google(db, google_user)
            else:
                social_account = UserSocialAccount(
                    user_id=user.id,
                    provider="google", 
                    provider_id=google_user["id"],
                    provider_email=google_user["email"]
                )
                db.add(social_account)
                db.commit()
        
        jwt_token = create_access_token(subject=user.email)
        token = Token(access_token=jwt_token)
        
        return user, token
    
    def get_current_user(self, db: Session, token: str) -> Optional[User]:
        """현재 사용자 조회"""
        try:
            payload = jwt.decode(token, "your-secret-key", algorithms=["HS256"])
            email: str = payload.get("sub")
            if email is None:
                return None
        except JWTError:
            return None
        
        user = self.get_user_by_email(db, email)
        if user is None or not user.is_active:
            return None
        return user

auth_service = AuthService()