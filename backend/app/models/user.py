from sqlalchemy import Boolean, Column, String, DateTime, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    social_accounts = relationship("UserSocialAccount", back_populates="user")
    consents = relationship("UserConsent", back_populates="user", uselist=False)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    age = Column(Integer, nullable=True)
    region = Column(String(100), nullable=True)
    job_category = Column(String(50), nullable=True)
    income_range = Column(String(50), nullable=True)
    goals = Column(Text, nullable=True)  # JSON string for SQLite compatibility
    profile_image_url = Column(String(500), nullable=True)  # 프로필 이미지 URL
    onboarding_completed = Column(Boolean, default=False)
    profile_completion_rate = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")

class UserSocialAccount(Base):
    __tablename__ = "user_social_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    provider = Column(String(50), nullable=False)  # 'kakao', 'naver', 'google'
    provider_id = Column(String(255), nullable=False)
    provider_email = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="social_accounts")

    __table_args__ = ({'sqlite_autoincrement': True},)

class UserConsent(Base):
    __tablename__ = "user_consents"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    push_notification = Column(Boolean, default=False)
    marketing_notification = Column(Boolean, default=False)
    reward_program = Column(Boolean, default=False)
    privacy_policy = Column(Boolean, default=False)
    terms_of_service = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="consents")