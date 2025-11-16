from sqlalchemy import Boolean, Column, String, DateTime, Integer, Text, ForeignKey, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from datetime import date
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


class UserPolicy(Base):
    """사용자-정책 연결 테이블"""
    __tablename__ = "user_policies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    policy_id = Column(Integer, ForeignKey("youth_policies.id"), nullable=False, index=True)

    status = Column(String(50), default="interested", nullable=False)
    personal_deadline = Column(Date, nullable=True)
    documents_total = Column(Integer, default=0)
    documents_submitted = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
    reminder_enabled = Column(Boolean, default=True)
    reminder_days_before = Column(Integer, default=3)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="user_policies")

    @property
    def documents_remaining(self):
        return max(0, self.documents_total - self.documents_submitted)

    @property
    def days_until_deadline(self):
        if not self.personal_deadline:
            return None
        today = date.today()
        delta = self.personal_deadline - today
        return delta.days


class Task(Base):
    """할 일 테이블"""
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    user_policy_id = Column(UUID(as_uuid=True), ForeignKey("user_policies.id"), nullable=True)

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, default="general")
    due_date = Column(Date, nullable=False)
    status = Column(String(20), default="pending", nullable=False)
    priority = Column(Integer, default=3, nullable=False)
    reminder_enabled = Column(Boolean, default=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="tasks")
    user_policy = relationship("UserPolicy", backref="tasks")

    @property
    def days_until_due(self):
        today = date.today()
        delta = self.due_date - today
        return delta.days

    @property
    def is_overdue(self):
        return self.days_until_due < 0 and self.status == "pending"

    def is_due_soon(self, days=3):
        """마감일이 곧 다가오는지 확인 (기본 3일 이내)"""
        return 0 <= self.days_until_due <= days and self.status == "pending"