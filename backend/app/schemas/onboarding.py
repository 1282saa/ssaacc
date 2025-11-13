from pydantic import BaseModel
from typing import List, Optional

class OnboardingGoalsRequest(BaseModel):
    goals: List[str]

class OnboardingProfileRequest(BaseModel):
    age: int
    region: str
    job_category: Optional[str] = None
    income_range: Optional[str] = None

class OnboardingConsentRequest(BaseModel):
    push_notification: bool = False
    marketing_notification: bool = False
    reward_program: bool = False
    privacy_policy: bool = True
    terms_of_service: bool = True

class OnboardingStatusResponse(BaseModel):
    onboarding_completed: bool
    profile_completion_rate: int
    current_step: str

class OnboardingCompleteResponse(BaseModel):
    success: bool
    message: str
    user_id: str