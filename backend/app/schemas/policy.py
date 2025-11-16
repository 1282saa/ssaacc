"""
Policy Schemas

사용자-정책(UserPolicy) 관련 Pydantic 스키마 정의
- 사용자가 관심있는 정책 목록 조회
- 정책 진행 현황 추적
"""

from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field


class PolicyBase(BaseModel):
    """정책 기본 정보 (youth_policies 테이블)"""
    id: int = Field(..., description="정책 ID")
    policy_name: str = Field(..., description="정책명")
    category: Optional[str] = Field(None, description="카테고리")
    region: Optional[str] = Field(None, description="지역")
    deadline: Optional[str] = Field(None, description="신청 마감일")
    summary: Optional[str] = Field(None, description="정책 요약")

    model_config = {"from_attributes": True}


class UserPolicyBase(BaseModel):
    """사용자-정책 기본 정보"""
    policy_id: int = Field(..., description="정책 ID")
    status: str = Field(default="interested", description="상태 (interested, in_progress, completed, cancelled)")
    personal_deadline: Optional[date] = Field(None, description="개인 마감일")
    documents_total: int = Field(default=0, description="필요 서류 총 개수")
    documents_submitted: int = Field(default=0, description="제출한 서류 개수")
    notes: Optional[str] = Field(None, description="메모")
    reminder_enabled: bool = Field(default=True, description="리마인더 활성화")
    reminder_days_before: int = Field(default=3, description="리마인더 알림 일수")


class UserPolicyCreate(UserPolicyBase):
    """사용자-정책 생성 요청"""
    pass


class UserPolicyUpdate(BaseModel):
    """사용자-정책 수정 요청 (부분 업데이트 지원)"""
    status: Optional[str] = Field(None)
    personal_deadline: Optional[date] = Field(None)
    documents_total: Optional[int] = Field(None)
    documents_submitted: Optional[int] = Field(None)
    notes: Optional[str] = Field(None)
    reminder_enabled: Optional[bool] = Field(None)
    reminder_days_before: Optional[int] = Field(None)


class UserPolicyResponse(UserPolicyBase):
    """사용자-정책 응답 (정책 정보 포함)"""
    id: str = Field(..., description="사용자-정책 ID")
    user_id: str = Field(..., description="사용자 ID")
    created_at: datetime = Field(..., description="생성 시간")
    updated_at: Optional[datetime] = Field(None, description="수정 시간")

    # 계산된 필드들
    documents_remaining: int = Field(..., description="남은 서류 개수")
    days_until_deadline: Optional[int] = Field(None, description="마감까지 남은 일수")

    # 정책 정보
    policy: PolicyBase = Field(..., description="정책 상세 정보")

    model_config = {"from_attributes": True}


class UserPolicyListResponse(BaseModel):
    """사용자-정책 목록 응답"""
    total: int = Field(..., description="전체 정책 수")
    policies: List[UserPolicyResponse] = Field(..., description="사용자-정책 목록")


class UserPolicyProgressResponse(BaseModel):
    """정책 진행 현황 응답 (PlanScreen용)"""
    id: str = Field(..., description="사용자-정책 ID")
    policy_name: str = Field(..., description="정책명")
    status: str = Field(..., description="진행 상태")
    documents_total: int = Field(..., description="필요 서류 총 개수")
    documents_submitted: int = Field(..., description="제출한 서류 개수")
    progress_percentage: int = Field(..., description="진행률 (%)")
    days_until_deadline: Optional[int] = Field(None, description="마감까지 남은 일수")
    deadline_text: str = Field(..., description="마감일 표시 텍스트 (D-1, D-Day, 결과 발표 대기 등)")

    model_config = {"from_attributes": True}
