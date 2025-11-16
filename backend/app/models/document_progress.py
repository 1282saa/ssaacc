"""
Document Progress Model
사용자별 정책 문서 준비 현황 추적

📋 목적:
- PlanScreen에서 사용자가 체크한 문서 완료 상태를 데이터베이스에 저장
- 페이지 새로고침/재방문 시에도 체크 상태 유지

🗄️ 테이블: user_document_progress
- Primary Key: id (SERIAL)
- Foreign Keys:
  - user_id → users.id (UUID)
  - policy_id → youth_policies.id (INTEGER)
- Unique Constraint: (user_id, policy_id, document_index)
  → 한 사용자가 한 정책의 한 문서는 하나의 레코드만 가질 수 있음

🔗 관련 파일:
- API: app/api/v1/document_progress.py
- Schema: app/schemas/document_progress.py
- Frontend: FinKuRN/src/screens/plan/PlanScreen.tsx

📅 작성일: 2025-01-16
👤 작성자: Claude Code
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class DocumentProgress(Base):
    """
    사용자별 정책 문서 완료 현황

    각 사용자가 특정 정책의 특정 문서를 준비했는지 추적
    PlanScreen의 체크박스 상태를 데이터베이스에 저장
    """
    __tablename__ = "user_document_progress"

    # Primary Key
    id: int = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        comment="진행 상황 고유 ID"
    )

    # Foreign Keys
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        comment="사용자 ID"
    )

    policy_id: int = Column(
        Integer,
        ForeignKey("youth_policies.id", ondelete="CASCADE"),
        nullable=False,
        comment="정책 ID"
    )

    # Document Information
    document_index: int = Column(
        Integer,
        nullable=False,
        comment="문서 인덱스 (required_documents 배열의 인덱스)"
    )

    document_name: str = Column(
        String(200),
        nullable=False,
        comment="문서명 (신분증, 통장 사본 등)"
    )

    # Completion Status
    is_completed: bool = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="완료 여부"
    )

    # Timestamps
    created_at: datetime = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        comment="생성 시간"
    )

    updated_at: datetime = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        comment="업데이트 시간"
    )

    completed_at: datetime = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="완료 시간"
    )

    # Unique Constraint: 한 사용자가 한 정책의 한 문서는 하나의 레코드만 가질 수 있음
    __table_args__ = (
        UniqueConstraint('user_id', 'policy_id', 'document_index', name='uq_user_policy_document'),
    )

    # Relationships (optional, if needed)
    # user = relationship("User", back_populates="document_progress")
    # policy = relationship("YouthPolicy", back_populates="document_progress")

    def __repr__(self):
        return f"<DocumentProgress(user_id={self.user_id}, policy_id={self.policy_id}, doc='{self.document_name}', completed={self.is_completed})>"
