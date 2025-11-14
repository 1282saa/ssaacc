"""
Pydantic Schemas

API 요청/응답 스키마 정의
"""

from .auth import *
from .user import *

__all__ = [
    # Auth schemas
    "LoginRequest",
    "LoginResponse", 
    "RegisterRequest",
    "TokenResponse",
    "GoogleAuthRequest",
    
    # User schemas  
    "UserBase",
    "UserCreate",
    "UserResponse",
    "UserProfileBase",
    "UserProfileCreate", 
    "UserProfileResponse",
    "UserConsentBase",
    "UserConsentCreate",
    "UserConsentResponse"
]