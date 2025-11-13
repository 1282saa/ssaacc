"""
User Management Models

사용자 관리를 위한 SQLAlchemy 모델들:
- User: 기본 사용자 정보
- UserProfile: 온보딩 및 프로필 정보  
- UserConsent: 동의 사항
- UserSocialAccount: 소셜 로그인 연동
"""

from datetime import datetime
from typing import List, Optional
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Mapped
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

Base = declarative_base()


class User(Base):
    """
    기본 사용자 정보
    
    인증 및 기본 식별 정보를 저장
    """
    __tablename__ = "users"

    # Primary Key
    id: Mapped[str] = Column(
        UUID(as_uuid=False), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4()),
        comment="사용자 고유 ID (UUID)"
    )
    
    # 기본 정보
    email: Mapped[str] = Column(
        String(255), 
        unique=True, 
        nullable=False, 
        index=True,
        comment="이메일 (로그인 ID)"
    )
    
    password_hash: Mapped[Optional[str]] = Column(
        String(255), 
        nullable=True,
        comment="비밀번호 해시 (소셜 로그인 시 NULL)"
    )
    
    name: Mapped[str] = Column(
        String(100), 
        nullable=False,
        comment="사용자 이름"
    )
    
    # 상태 정보
    is_active: Mapped[bool] = Column(
        Boolean, 
        default=True,
        comment="계정 활성화 상태"
    )
    
    is_email_verified: Mapped[bool] = Column(
        Boolean, 
        default=False,
        comment="이메일 인증 완료 여부"
    )
    
    # 타임스탬프
    created_at: Mapped[datetime] = Column(
        DateTime(timezone=True), 
        server_default=func.now(),
        comment="계정 생성 시간"
    )
    
    updated_at: Mapped[datetime] = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(),
        comment="최종 업데이트 시간"
    )
    
    last_login: Mapped[Optional[datetime]] = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="마지막 로그인 시간"
    )

    # Relationships
    profile: Mapped[Optional["UserProfile"]] = relationship(
        "UserProfile", 
        back_populates="user", 
        uselist=False,
        cascade="all, delete-orphan"
    )
    
    consent: Mapped[Optional["UserConsent"]] = relationship(
        "UserConsent", 
        back_populates="user", 
        uselist=False,
        cascade="all, delete-orphan"
    )
    
    social_accounts: Mapped[List["UserSocialAccount"]] = relationship(
        "UserSocialAccount", 
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User(id='{self.id}', email='{self.email}', name='{self.name}')>"


class UserProfile(Base):
    """
    사용자 프로필 및 온보딩 정보
    
    AI 개인화를 위한 사용자 컨텍스트 저장
    """
    __tablename__ = "user_profiles"

    # Primary Key (Foreign Key)
    user_id: Mapped[str] = Column(
        UUID(as_uuid=False), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        primary_key=True,
        comment="사용자 ID (FK)"
    )
    
    # 필수 온보딩 정보 (AI 개인화에 필수)
    age: Mapped[Optional[int]] = Column(
        Integer,
        nullable=True,
        comment="나이 (필수 온보딩 정보)"
    )
    
    region: Mapped[Optional[str]] = Column(
        String(100),
        nullable=True,
        comment="거주 지역 (필수 온보딩 정보)"
    )
    
    # 선택적 온보딩 정보
    job_category: Mapped[Optional[str]] = Column(
        String(50),
        nullable=True,
        comment="직업 카테고리 (학생, 직장인, 무직, 기타)"
    )
    
    employment_status: Mapped[Optional[str]] = Column(
        String(50),
        nullable=True,
        comment="고용 상태 (재직, 구직, 자영업, 기타)"
    )
    
    income_range: Mapped[Optional[str]] = Column(
        String(50),
        nullable=True,
        comment="소득 구간 (2000만원 이하, 2000-4000만원, 등)"
    )
    
    education_level: Mapped[Optional[str]] = Column(
        String(50),
        nullable=True,
        comment="학력 (고졸, 대졸, 대학원 등)"
    )
    
    # 목표 및 관심사 (JSON 배열)
    goals: Mapped[Optional[list]] = Column(
        JSON,
        nullable=True,
        comment="사용자 목표 (적금, 투자, 주택 등) JSON 배열"
    )
    
    interests: Mapped[Optional[list]] = Column(
        JSON,
        nullable=True,
        comment="관심 정책 카테고리 JSON 배열"
    )
    
    # 온보딩 완료 상태
    onboarding_completed: Mapped[bool] = Column(
        Boolean,
        default=False,
        comment="온보딩 완료 여부"
    )
    
    profile_completion_rate: Mapped[int] = Column(
        Integer,
        default=0,
        comment="프로필 완성도 퍼센트 (0-100)"
    )
    
    # 개인화 설정
    preferred_language: Mapped[str] = Column(
        String(10),
        default="ko",
        comment="선호 언어 (ko, en)"
    )
    
    ai_personality: Mapped[Optional[str]] = Column(
        String(50),
        nullable=True,
        comment="AI 성격 설정 (친근한, 전문적인, 간결한)"
    )
    
    # 타임스탬프
    created_at: Mapped[datetime] = Column(
        DateTime(timezone=True), 
        server_default=func.now()
    )
    
    updated_at: Mapped[datetime] = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now()
    )

    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="profile")

    def calculate_completion_rate(self) -> int:
        """프로필 완성도 계산"""
        total_weight = 0
        completed_weight = 0
        
        # 가중치 설정 (환경변수에서 가져올 수 있음)
        weights = {
            "age": 20,
            "region": 20,
            "job_category": 15,
            "income_range": 15,
            "goals": 30
        }
        
        for field, weight in weights.items():
            total_weight += weight
            if getattr(self, field) is not None:
                completed_weight += weight
        
        return int((completed_weight / total_weight) * 100) if total_weight > 0 else 0

    def __repr__(self):
        return f"<UserProfile(user_id='{self.user_id}', completion={self.profile_completion_rate}%)>"


class UserConsent(Base):
    """
    사용자 동의 사항
    
    GDPR, 개인정보보호법 준수를 위한 동의 기록
    """
    __tablename__ = "user_consents"

    # Primary Key (Foreign Key)
    user_id: Mapped[str] = Column(
        UUID(as_uuid=False), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        primary_key=True,
        comment="사용자 ID (FK)"
    )
    
    # 필수 동의 사항
    privacy_policy: Mapped[bool] = Column(
        Boolean,
        default=False,
        comment="개인정보 처리방침 동의 (필수)"
    )
    
    terms_of_service: Mapped[bool] = Column(
        Boolean,
        default=False,
        comment="서비스 이용약관 동의 (필수)"
    )
    
    # 선택적 동의 사항
    push_notification: Mapped[bool] = Column(
        Boolean,
        default=False,
        comment="푸시 알림 수신 동의"
    )
    
    marketing_notification: Mapped[bool] = Column(
        Boolean,
        default=False,
        comment="마케팅 알림 수신 동의"
    )
    
    data_analytics: Mapped[bool] = Column(
        Boolean,
        default=False,
        comment="데이터 분석 활용 동의"
    )
    
    personalized_ads: Mapped[bool] = Column(
        Boolean,
        default=False,
        comment="개인화 광고 활용 동의"
    )
    
    # 동의 기록
    consent_version: Mapped[str] = Column(
        String(50),
        default="1.0",
        comment="동의한 약관 버전"
    )
    
    consent_ip: Mapped[Optional[str]] = Column(
        String(45),
        nullable=True,
        comment="동의 시점 IP 주소"
    )
    
    # 타임스탬프
    created_at: Mapped[datetime] = Column(
        DateTime(timezone=True), 
        server_default=func.now(),
        comment="최초 동의 시간"
    )
    
    updated_at: Mapped[datetime] = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(),
        comment="동의 변경 시간"
    )

    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="consent")

    def __repr__(self):
        return f"<UserConsent(user_id='{self.user_id}', privacy={self.privacy_policy}, terms={self.terms_of_service})>"


class UserSocialAccount(Base):
    """
    소셜 로그인 계정 연동
    
    Google, Kakao, Naver 등 외부 인증 연동 정보
    """
    __tablename__ = "user_social_accounts"

    # Primary Key
    id: Mapped[str] = Column(
        UUID(as_uuid=False), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4()),
        comment="소셜 계정 연동 ID"
    )
    
    # Foreign Key
    user_id: Mapped[str] = Column(
        UUID(as_uuid=False), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False,
        comment="사용자 ID (FK)"
    )
    
    # 소셜 제공자 정보
    provider: Mapped[str] = Column(
        String(50),
        nullable=False,
        comment="소셜 제공자 (google, kakao, naver)"
    )
    
    provider_id: Mapped[str] = Column(
        String(255),
        nullable=False,
        comment="제공자별 사용자 고유 ID"
    )
    
    provider_email: Mapped[Optional[str]] = Column(
        String(255),
        nullable=True,
        comment="제공자에서 제공한 이메일"
    )
    
    # 추가 프로필 정보
    provider_data: Mapped[Optional[dict]] = Column(
        JSON,
        nullable=True,
        comment="제공자 프로필 데이터 (이름, 사진 등)"
    )
    
    # 연동 상태
    is_active: Mapped[bool] = Column(
        Boolean,
        default=True,
        comment="연동 활성화 상태"
    )
    
    # 타임스탬프
    created_at: Mapped[datetime] = Column(
        DateTime(timezone=True), 
        server_default=func.now(),
        comment="연동 생성 시간"
    )
    
    updated_at: Mapped[datetime] = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(),
        comment="연동 정보 업데이트 시간"
    )

    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="social_accounts")

    def __repr__(self):
        return f"<UserSocialAccount(provider='{self.provider}', provider_id='{self.provider_id}')>"

    # Composite Index
    __table_args__ = (
        # 제공자별 중복 방지
        {"comment": "사용자 소셜 계정 연동 테이블"}
    )