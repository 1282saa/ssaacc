"""
Youth Policy Pydantic Schemas

청년 정책 데이터 스키마
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime


class YouthPolicyBase(BaseModel):
    """청년 정책 기본 정보"""
    policy_name: str
    category: Optional[str] = None
    region: Optional[str] = None
    deadline: Optional[str] = None
    summary: Optional[str] = None


class YouthPolicyResponse(YouthPolicyBase):
    """청년 정책 응답"""
    id: int
    filename: Optional[str] = None
    policy_number: Optional[str] = None
    full_text: Optional[str] = None
    operation_period: Optional[str] = None
    application_period: Optional[str] = None
    support_content: Optional[str] = None
    support_scale: Optional[str] = None
    eligibility: Optional[Dict[str, Any]] = None
    application_info: Optional[Dict[str, Any]] = None
    additional_info: Optional[Dict[str, Any]] = None
    required_documents: Optional[List[Dict[str, Any]]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class YouthPolicyListResponse(BaseModel):
    """청년 정책 목록 응답"""
    total: int
    policies: List[YouthPolicyResponse]
