from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None

class UserCreate(UserBase):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfileResponse(BaseModel):
    """사용자 프로필 응답 스키마"""
    age: Optional[int] = None
    region: Optional[str] = None
    job_category: Optional[str] = None
    income_range: Optional[str] = None
    goals: Optional[str] = None
    profile_image_url: Optional[str] = None
    onboarding_completed: bool = False
    profile_completion_rate: int = 0

    class Config:
        from_attributes = True

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    profile: Optional[UserProfileResponse] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None