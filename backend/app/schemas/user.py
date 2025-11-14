"""
User Schemas

사용자 관련 Pydantic 스키마 정의
- 사용자 기본 정보
- 프로필 및 온보딩 정보
- 동의 사항
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserBase(BaseModel):
    """사용자 기본 정보"""
    email: EmailStr = Field(..., description="이메일")
    name: str = Field(..., min_length=2, max_length=50, description="이름")


class UserCreate(UserBase):
    """사용자 생성 요청"""
    password: str = Field(..., min_length=6, max_length=50, description="비밀번호")


class UserUpdate(BaseModel):
    """사용자 기본 정보 수정 요청"""
    name: Optional[str] = Field(None, min_length=2, max_length=50, description="이름")
    profile: Optional["UserProfileUpdate"] = Field(None, description="프로필 정보")
    consents: Optional["UserConsentUpdate"] = Field(None, description="동의 정보")


class UserResponse(UserBase):
    """사용자 정보 응답"""
    id: str = Field(..., description="사용자 ID")
    is_active: bool = Field(..., description="계정 활성화 상태")
    is_email_verified: bool = Field(..., description="이메일 인증 여부")
    created_at: datetime = Field(..., description="계정 생성 시간")
    updated_at: datetime = Field(..., description="계정 업데이트 시간")
    last_login: Optional[datetime] = Field(None, description="마지막 로그인 시간")
    profile: Optional["UserProfileResponse"] = Field(None, description="프로필 정보")
    consents: Optional[Dict[str, bool]] = Field(None, description="동의 정보")

    model_config = {"from_attributes": True}


class UserProfileBase(BaseModel):
    """사용자 프로필 기본 정보"""
    age: Optional[int] = Field(None, ge=14, le=100, description="나이 (14-100세)")
    region: Optional[str] = Field(None, max_length=100, description="거주 지역")
    job_category: Optional[str] = Field(None, max_length=50, description="직업 카테고리")
    employment_status: Optional[str] = Field(None, max_length=50, description="고용 상태")
    income_range: Optional[str] = Field(None, max_length=50, description="소득 구간")
    education_level: Optional[str] = Field(None, max_length=50, description="학력")
    goals: Optional[List[str]] = Field(None, description="사용자 목표 리스트")
    interests: Optional[List[str]] = Field(None, description="관심 분야 리스트")
    preferred_language: str = Field(default="ko", description="선호 언어")
    ai_personality: Optional[str] = Field(None, max_length=50, description="AI 성격 설정")

    @field_validator('job_category')
    @classmethod
    def validate_job_category(cls, v):
        if v is not None:
            allowed = ["학생", "취업준비생", "직장인", "프리랜서", "자영업", "기타"]
            if v not in allowed:
                raise ValueError(f"직업 카테고리는 다음 중 하나여야 합니다: {', '.join(allowed)}")
        return v

    @field_validator('employment_status')
    @classmethod
    def validate_employment_status(cls, v):
        if v is not None:
            allowed = ["재직", "구직", "자영업", "학업", "휴직", "기타"]
            if v not in allowed:
                raise ValueError(f"고용 상태는 다음 중 하나여야 합니다: {', '.join(allowed)}")
        return v

    @field_validator('income_range')
    @classmethod
    def validate_income_range(cls, v):
        if v is not None:
            allowed = [
                "100만원 미만", "100-200만원", "200-300만원", 
                "300-400만원", "400만원 이상"
            ]
            if v not in allowed:
                raise ValueError(f"소득 구간은 다음 중 하나여야 합니다: {', '.join(allowed)}")
        return v

    @field_validator('education_level')
    @classmethod
    def validate_education_level(cls, v):
        if v is not None:
            allowed = ["중졸 이하", "고졸", "전문대졸", "대졸", "대학원졸"]
            if v not in allowed:
                raise ValueError(f"학력은 다음 중 하나여야 합니다: {', '.join(allowed)}")
        return v

    @field_validator('ai_personality')
    @classmethod
    def validate_ai_personality(cls, v):
        if v is not None:
            allowed = ["친근한", "전문적인", "간결한", "상세한"]
            if v not in allowed:
                raise ValueError(f"AI 성격은 다음 중 하나여야 합니다: {', '.join(allowed)}")
        return v


class UserProfileCreate(UserProfileBase):
    """사용자 프로필 생성 요청"""
    pass


class UserProfileUpdate(BaseModel):
    """사용자 프로필 업데이트 요청 (부분 업데이트 지원)"""
    age: Optional[int] = Field(None, ge=14, le=100)
    region: Optional[str] = Field(None, max_length=100)
    job_category: Optional[str] = Field(None, max_length=50)
    employment_status: Optional[str] = Field(None, max_length=50)
    income_range: Optional[str] = Field(None, max_length=50)
    education_level: Optional[str] = Field(None, max_length=50)
    goals: Optional[List[str]] = Field(None)
    interests: Optional[List[str]] = Field(None)
    ai_personality: Optional[str] = Field(None, max_length=50)


class UserProfileResponse(UserProfileBase):
    """사용자 프로필 응답"""
    user_id: str = Field(..., description="사용자 ID")
    onboarding_completed: bool = Field(..., description="온보딩 완료 여부")
    profile_completion_rate: int = Field(..., ge=0, le=100, description="프로필 완성도")
    created_at: datetime = Field(..., description="프로필 생성 시간")
    updated_at: datetime = Field(..., description="프로필 업데이트 시간")

    model_config = {"from_attributes": True}


class UserConsentBase(BaseModel):
    """사용자 동의 사항 기본 정보"""
    privacy_policy: bool = Field(..., description="개인정보 처리방침 동의 (필수)")
    terms_of_service: bool = Field(..., description="서비스 이용약관 동의 (필수)")
    push_notification: bool = Field(default=False, description="푸시 알림 수신 동의")
    marketing_notification: bool = Field(default=False, description="마케팅 알림 수신 동의")
    data_analytics: bool = Field(default=False, description="데이터 분석 활용 동의")
    personalized_ads: bool = Field(default=False, description="개인화 광고 활용 동의")

    @field_validator('privacy_policy', 'terms_of_service')
    @classmethod
    def required_consents_must_be_true(cls, v, info):
        if not v:
            field_name = "개인정보 처리방침" if info.field_name == "privacy_policy" else "서비스 이용약관"
            raise ValueError(f"{field_name} 동의는 필수입니다")
        return v


class UserConsentCreate(UserConsentBase):
    """사용자 동의 생성 요청"""
    consent_ip: Optional[str] = Field(None, description="동의 시점 IP 주소")


class UserConsentUpdate(BaseModel):
    """사용자 동의 업데이트 요청 (선택적 동의만 변경 가능)"""
    push_notification: Optional[bool] = Field(None, description="푸시 알림 수신 동의")
    marketing_notification: Optional[bool] = Field(None, description="마케팅 알림 수신 동의")
    data_analytics: Optional[bool] = Field(None, description="데이터 분석 활용 동의")
    personalized_ads: Optional[bool] = Field(None, description="개인화 광고 활용 동의")


class UserConsentResponse(UserConsentBase):
    """사용자 동의 응답"""
    user_id: str = Field(..., description="사용자 ID")
    consent_version: str = Field(..., description="동의한 약관 버전")
    consent_ip: Optional[str] = Field(None, description="동의 시점 IP 주소")
    created_at: datetime = Field(..., description="최초 동의 시간")
    updated_at: datetime = Field(..., description="동의 변경 시간")

    model_config = {"from_attributes": True}


class OnboardingStepRequest(BaseModel):
    """온보딩 단계별 요청"""
    step: str = Field(..., description="온보딩 단계 (goals, profile, consent)")
    data: Dict[str, Any] = Field(..., description="단계별 데이터")

    @field_validator('step')
    @classmethod
    def validate_step(cls, v):
        allowed_steps = ["goals", "profile", "consent"]
        if v not in allowed_steps:
            raise ValueError(f"온보딩 단계는 다음 중 하나여야 합니다: {', '.join(allowed_steps)}")
        return v


class OnboardingStatusResponse(BaseModel):
    """온보딩 상태 응답"""
    user_id: str = Field(..., description="사용자 ID")
    onboarding_completed: bool = Field(..., description="온보딩 완료 여부")
    profile_completion_rate: int = Field(..., description="프로필 완성도")
    completed_steps: List[str] = Field(..., description="완료된 온보딩 단계")
    next_step: Optional[str] = Field(None, description="다음 온보딩 단계")

    model_config = {
        "json_schema_extra": {
            "example": {
                "user_id": "123e4567-e89b-12d3-a456-426614174000",
                "onboarding_completed": False,
                "profile_completion_rate": 60,
                "completed_steps": ["goals", "profile"],
                "next_step": "consent"
            }
        }
    }


class UserFullResponse(BaseModel):
    """완전한 사용자 정보 응답 (프로필 + 동의 포함)"""
    user: UserResponse = Field(..., description="기본 사용자 정보")
    profile: Optional[UserProfileResponse] = Field(None, description="프로필 정보")
    consent: Optional[UserConsentResponse] = Field(None, description="동의 정보")

    model_config = {"from_attributes": True}