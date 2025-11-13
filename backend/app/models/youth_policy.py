"""
Youth Policy Model (기존 시스템 참조용)

기존 PostgreSQL youth_policies 테이블과 호환되는 SQLAlchemy 모델
벡터 검색 및 정책 데이터를 위한 참조 모델
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy import Column, DateTime, Integer, String, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import func

Base = declarative_base()


class YouthPolicy(Base):
    """
    청년 정책 정보
    
    기존 scripts/setup_postgres_schema.sql의 youth_policies 테이블과 호환
    벡터 검색을 통한 AI 챗봇 정책 추천에 사용
    """
    __tablename__ = "youth_policies"

    # Primary Key
    id: int = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        comment="정책 고유 ID"
    )
    
    # 정책 메타데이터
    policy_name: str = Column(
        String(500),
        nullable=False,
        comment="정책명"
    )
    
    policy_number: Optional[str] = Column(
        String(100),
        nullable=True,
        comment="정책 번호"
    )
    
    filename: str = Column(
        String(255),
        nullable=False,
        unique=True,
        comment="원본 파일명"
    )
    
    # 기본 정보
    region: Optional[str] = Column(
        String(100),
        nullable=True,
        comment="지역 (서울, 경기, 전국 등)"
    )
    
    category: Optional[str] = Column(
        String(100),
        nullable=True,
        comment="카테고리 (금융, 주거, 교육, 고용 등)"
    )
    
    deadline: Optional[str] = Column(
        String(100),
        nullable=True,
        comment="신청 마감일"
    )
    
    summary: Optional[str] = Column(
        Text,
        nullable=True,
        comment="정책 요약"
    )
    
    # 콘텐츠
    full_text: str = Column(
        Text,
        nullable=False,
        comment="정책 전문"
    )
    
    # 통계
    last_modified: Optional[str] = Column(
        String(50),
        nullable=True,
        comment="최종 수정일"
    )
    
    scraps: int = Column(
        Integer,
        default=0,
        comment="스크랩 수"
    )
    
    views: int = Column(
        Integer,
        default=0,
        comment="조회 수"
    )
    
    # 태그 (PostgreSQL ARRAY)
    tags: Optional[List[str]] = Column(
        ARRAY(Text),
        nullable=True,
        comment="태그 배열"
    )
    
    # 구조화된 데이터
    support_content: Optional[str] = Column(
        Text,
        nullable=True,
        comment="지원 내용"
    )
    
    operation_period: Optional[str] = Column(
        String(200),
        nullable=True,
        comment="운영 기간"
    )
    
    application_period: Optional[str] = Column(
        String(200),
        nullable=True,
        comment="신청 기간"
    )
    
    support_scale: Optional[str] = Column(
        String(100),
        nullable=True,
        comment="지원 규모"
    )
    
    # JSONB 필드들
    eligibility: Optional[Dict[str, Any]] = Column(
        JSON,
        nullable=True,
        comment="자격 조건 JSON"
    )
    
    application_info: Optional[Dict[str, Any]] = Column(
        JSON,
        nullable=True,
        comment="신청 정보 JSON"
    )
    
    additional_info: Optional[Dict[str, Any]] = Column(
        JSON,
        nullable=True,
        comment="추가 정보 JSON"
    )
    
    # S3 참조 (현재 미사용)
    s3_bucket: Optional[str] = Column(
        String(255),
        nullable=True,
        comment="S3 버킷명"
    )
    
    s3_key: Optional[str] = Column(
        String(500),
        nullable=True,
        comment="S3 객체 키"
    )
    
    # 타임스탬프
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

    def __repr__(self):
        return f"<YouthPolicy(id={self.id}, name='{self.policy_name}', category='{self.category}')>"

    @property
    def age_requirements(self) -> Optional[Dict[str, Any]]:
        """자격조건에서 나이 관련 정보 추출"""
        if self.eligibility and isinstance(self.eligibility, dict):
            return self.eligibility.get("age", None)
        return None
    
    @property
    def region_requirements(self) -> Optional[List[str]]:
        """자격조건에서 지역 관련 정보 추출"""
        if self.eligibility and isinstance(self.eligibility, dict):
            regions = self.eligibility.get("region", [])
            if isinstance(regions, list):
                return regions
            elif isinstance(regions, str):
                return [regions]
        return None
    
    @property
    def income_requirements(self) -> Optional[Dict[str, Any]]:
        """자격조건에서 소득 관련 정보 추출"""
        if self.eligibility and isinstance(self.eligibility, dict):
            return self.eligibility.get("income", None)
        return None

    def is_eligible_for_user(self, user_profile: "UserProfile") -> bool:
        """
        사용자 프로필을 기반으로 정책 자격 여부 판단
        
        Args:
            user_profile: UserProfile 객체
            
        Returns:
            bool: 자격 여부
        """
        # 나이 조건 확인
        age_req = self.age_requirements
        if age_req and user_profile.age:
            min_age = age_req.get("min")
            max_age = age_req.get("max")
            
            if min_age and user_profile.age < min_age:
                return False
            if max_age and user_profile.age > max_age:
                return False
        
        # 지역 조건 확인
        region_req = self.region_requirements
        if region_req and user_profile.region:
            if "전국" not in region_req and user_profile.region not in region_req:
                return False
        
        # 기본적으로 자격 있음으로 판단
        return True

    def to_search_dict(self) -> Dict[str, Any]:
        """벡터 검색을 위한 딕셔너리 변환"""
        return {
            "id": self.id,
            "policy_name": self.policy_name,
            "category": self.category,
            "region": self.region,
            "summary": self.summary,
            "tags": self.tags or [],
            "support_content": self.support_content,
            "eligibility": self.eligibility or {},
            "application_info": self.application_info or {}
        }