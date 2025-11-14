"""
Onboarding Schemas

온보딩 관련 Pydantic 스키마 정의
- 단계별 온보딩 요청/응답
- 목표 선택, 기본 정보, 동의 사항
- 온보딩 진행 상태 관리
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator
from enum import Enum


class OnboardingStep(str, Enum):
    """온보딩 단계"""
    GOALS = "goals"
    PROFILE = "profile" 
    CONSENT = "consent"
    COMPLETED = "completed"


class FinancialGoal(str, Enum):
    """금융 목표 옵션"""
    SAVINGS = "저축"
    STUDENT_LOAN = "학자금"
    CREDIT_MANAGEMENT = "신용관리"
    INVESTMENT_BASICS = "투자기초"


class JobCategory(str, Enum):
    """직업 카테고리"""
    STUDENT = "학생"
    JOB_SEEKER = "취업준비생"
    EMPLOYEE = "직장인"
    FREELANCER = "프리랜서"
    SELF_EMPLOYED = "자영업"
    OTHER = "기타"


class IncomeRange(str, Enum):
    """소득 구간"""
    UNDER_100 = "100만원 미만"
    RANGE_100_200 = "100-200만원"
    RANGE_200_300 = "200-300만원"
    RANGE_300_400 = "300-400만원"
    OVER_400 = "400만원 이상"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 단계 1: 목표 선택 
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class GoalsSelectionRequest(BaseModel):
    """목표 선택 요청"""
    goals: List[FinancialGoal] = Field(
        ..., 
        min_length=1,
        max_length=5,
        description="선택한 금융 목표 (1~5개)"
    )
    priority_goal: Optional[FinancialGoal] = Field(
        None,
        description="최우선 목표 (goals 중 하나여야 함)"
    )
    
    @field_validator('priority_goal')
    @classmethod
    def validate_priority_goal(cls, v, info):
        if v is not None and 'goals' in info.data:
            if v not in info.data['goals']:
                raise ValueError("최우선 목표는 선택한 목표 중 하나여야 합니다")
        return v


class GoalsSelectionResponse(BaseModel):
    """목표 선택 응답"""
    message: str = Field(..., description="응답 메시지")
    goals: List[FinancialGoal] = Field(..., description="저장된 목표")
    priority_goal: Optional[FinancialGoal] = Field(None, description="최우선 목표")
    next_step: OnboardingStep = Field(default=OnboardingStep.PROFILE, description="다음 단계")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 단계 2: 기본 정보 입력
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ProfileInfoRequest(BaseModel):
    """기본 정보 입력 요청"""
    age: int = Field(..., ge=14, le=100, description="나이 (14-100세)")
    region: str = Field(..., min_length=1, max_length=50, description="거주 지역")
    job_category: JobCategory = Field(..., description="직업 카테고리")
    employment_status: Optional[str] = Field(
        None,
        max_length=50,
        description="구체적 고용 상태 (재직, 구직, 휴직 등)"
    )
    income_range: IncomeRange = Field(..., description="소득 구간")
    education_level: Optional[str] = Field(
        None,
        max_length=50,
        description="최종 학력"
    )
    
    @field_validator('region')
    @classmethod
    def validate_region(cls, v):
        # 한국 주요 지역 검증
        valid_regions = [
            "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
            "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
        ]
        if not any(region in v for region in valid_regions):
            return v  # 유연하게 허용하되 추후 정규화 가능
        return v


class ProfileInfoResponse(BaseModel):
    """기본 정보 입력 응답"""
    message: str = Field(..., description="응답 메시지")
    profile_completion_rate: int = Field(..., description="프로필 완성도 (%)")
    next_step: OnboardingStep = Field(default=OnboardingStep.CONSENT, description="다음 단계")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 단계 3: 동의 사항 처리
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ConsentRequest(BaseModel):
    """동의 사항 요청"""
    push_notification: bool = Field(default=True, description="푸시 알림 수신 동의")
    marketing_notification: bool = Field(default=False, description="마케팅 정보 수신 동의")
    data_analytics: bool = Field(default=True, description="서비스 개선을 위한 데이터 분석 동의")
    personalized_ads: bool = Field(default=False, description="개인화 광고 활용 동의")
    ai_personality: Optional[str] = Field(
        None,
        description="AI 챗봇 성격 설정 (친근한, 전문적인, 간결한, 상세한)"
    )
    
    @field_validator('ai_personality')
    @classmethod
    def validate_ai_personality(cls, v):
        if v is not None:
            allowed = ["친근한", "전문적인", "간결한", "상세한"]
            if v not in allowed:
                raise ValueError(f"AI 성격은 다음 중 하나여야 합니다: {', '.join(allowed)}")
        return v


class ConsentResponse(BaseModel):
    """동의 사항 응답"""
    message: str = Field(..., description="응답 메시지")
    onboarding_completed: bool = Field(default=True, description="온보딩 완료 여부")
    next_step: OnboardingStep = Field(default=OnboardingStep.COMPLETED, description="다음 단계")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 온보딩 상태 조회
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class OnboardingStatusResponse(BaseModel):
    """온보딩 상태 응답"""
    user_id: str = Field(..., description="사용자 ID")
    current_step: OnboardingStep = Field(..., description="현재 온보딩 단계")
    onboarding_completed: bool = Field(..., description="온보딩 완료 여부")
    profile_completion_rate: int = Field(..., ge=0, le=100, description="프로필 완성도 (%)")
    completed_steps: List[OnboardingStep] = Field(..., description="완료된 단계")
    next_step: Optional[OnboardingStep] = Field(None, description="다음 단계")
    progress_data: Dict[str, Any] = Field(default_factory=dict, description="진행 상황 데이터")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "user_id": "123e4567-e89b-12d3-a456-426614174000",
                "current_step": "profile",
                "onboarding_completed": False,
                "profile_completion_rate": 60,
                "completed_steps": ["goals"],
                "next_step": "profile",
                "progress_data": {
                    "goals": ["저축", "투자기초"],
                    "priority_goal": "저축"
                }
            }
        }
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 통합 온보딩 요청 (단계별 처리용)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class OnboardingStepRequest(BaseModel):
    """통합 온보딩 단계 요청"""
    step: OnboardingStep = Field(..., description="처리할 온보딩 단계")
    data: Dict[str, Any] = Field(..., description="단계별 데이터")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "step": "goals",
                "data": {
                    "goals": ["저축", "투자기초"],
                    "priority_goal": "저축"
                }
            }
        }
    }