"""
Task Schemas

할 일(Task) 관련 Pydantic 스키마 정의
- 할 일 생성, 수정, 조회
- D-day 및 우선순위 관리
"""

from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator


class TaskBase(BaseModel):
    """할 일 기본 정보"""
    title: str = Field(..., min_length=1, max_length=200, description="할 일 제목")
    description: Optional[str] = Field(None, description="할 일 상세 설명")
    category: str = Field(default="general", max_length=50, description="카테고리")
    due_date: date = Field(..., description="마감일")
    priority: int = Field(default=3, ge=1, le=5, description="우선순위 (1: 가장 높음, 5: 가장 낮음)")
    reminder_enabled: bool = Field(default=True, description="리마인더 활성화")

    @field_validator('category')
    @classmethod
    def validate_category(cls, v):
        allowed = ["general", "policy", "finance", "education", "employment"]
        if v not in allowed:
            raise ValueError(f"카테고리는 다음 중 하나여야 합니다: {', '.join(allowed)}")
        return v


class TaskCreate(TaskBase):
    """할 일 생성 요청"""
    user_policy_id: Optional[str] = Field(None, description="연결된 정책 ID (선택사항)")


class TaskUpdate(BaseModel):
    """할 일 수정 요청 (부분 업데이트 지원)"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None)
    category: Optional[str] = Field(None, max_length=50)
    due_date: Optional[date] = Field(None)
    status: Optional[str] = Field(None, max_length=20)
    priority: Optional[int] = Field(None, ge=1, le=5)
    reminder_enabled: Optional[bool] = Field(None)

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        if v is not None:
            allowed = ["pending", "in_progress", "completed", "cancelled"]
            if v not in allowed:
                raise ValueError(f"상태는 다음 중 하나여야 합니다: {', '.join(allowed)}")
        return v


class TaskResponse(TaskBase):
    """할 일 응답"""
    id: str = Field(..., description="할 일 ID")
    user_id: str = Field(..., description="사용자 ID")
    user_policy_id: Optional[str] = Field(None, description="연결된 정책 ID")
    status: str = Field(..., description="상태 (pending, in_progress, completed, cancelled)")
    completed_at: Optional[datetime] = Field(None, description="완료 시간")
    created_at: datetime = Field(..., description="생성 시간")
    updated_at: Optional[datetime] = Field(None, description="수정 시간")

    # 계산된 필드들
    days_until_due: int = Field(..., description="마감까지 남은 일수")
    is_overdue: bool = Field(..., description="마감일 초과 여부")
    is_due_soon: bool = Field(..., description="마감일 임박 여부 (3일 이내)")

    model_config = {"from_attributes": True}


class TaskListResponse(BaseModel):
    """할 일 목록 응답"""
    total: int = Field(..., description="전체 할 일 수")
    tasks: List[TaskResponse] = Field(..., description="할 일 목록")


class TodayTasksResponse(BaseModel):
    """오늘의 할 일 응답"""
    query_date: date = Field(..., description="조회 날짜", alias="date")
    overdue_count: int = Field(..., description="기한 지난 할 일 수")
    due_today_count: int = Field(..., description="오늘 마감 할 일 수")
    due_soon_count: int = Field(..., description="곧 마감 할 일 수 (3일 이내)")
    tasks: List[TaskResponse] = Field(..., description="오늘의 할 일 목록")

    model_config = {"populate_by_name": True}
