"""
User Management API Endpoints

사용자 정보 관련 API 엔드포인트:
- 사용자 정보 조회
- 사용자 정보 수정
- 사용자 프로필 관리
"""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Annotated
import json

from app.core.database import get_db
from app.models.user import User, UserProfile, UserConsent
from app.schemas.user import UserResponse, UserProfileResponse, UserUpdate

router = APIRouter()


def parse_goals(goals_text):
    """
    goals 필드를 JSON 문자열에서 리스트로 파싱
    """
    if goals_text is None:
        return []
    if isinstance(goals_text, list):
        return goals_text
    try:
        return json.loads(goals_text)
    except (json.JSONDecodeError, TypeError):
        return []


def get_current_user(
    authorization: Annotated[str, Header(alias="Authorization")],
    db: Session = Depends(get_db)
) -> User:
    """
    현재 인증된 사용자 조회

    JWT 토큰에서 사용자 정보를 추출하여 데이터베이스에서 조회합니다.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization 헤더가 필요합니다",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Bearer 토큰 추출
    token = authorization.replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer 토큰이 필요합니다",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # 토큰 검증 및 이메일 추출
    from app.core.security import verify_token
    email = verify_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않거나 만료된 토큰입니다",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # 데이터베이스에서 사용자 조회 (이메일로 조회)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="비활성화된 계정입니다"
        )

    return user


@router.get("/me", response_model=UserResponse)
async def get_my_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    내 정보 조회
    
    인증된 사용자의 기본 정보, 프로필, 동의 정보를 모두 조회합니다.
    """
    try:
        # 사용자 프로필 조회
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        
        # 사용자 동의 정보 조회
        consent = db.query(UserConsent).filter(UserConsent.user_id == current_user.id).first()
        
        return UserResponse(
            id=str(current_user.id),
            email=current_user.email,
            name=current_user.name,
            is_active=current_user.is_active,
            created_at=current_user.created_at,
            updated_at=current_user.updated_at,
            profile=UserProfileResponse(
                user_id=str(profile.user_id) if profile else str(current_user.id),
                age=profile.age if profile else None,
                region=profile.region if profile else None,
                job_category=profile.job_category if profile else None,
                income_range=profile.income_range if profile else None,
                goals=parse_goals(profile.goals) if profile else [],
                onboarding_completed=profile.onboarding_completed if profile else False,
                profile_completion_rate=profile.profile_completion_rate if profile else 0,
                created_at=profile.created_at if profile else None,
                updated_at=profile.updated_at if profile else None
            ) if profile else None,
            consents={
                "privacy_policy": consent.privacy_policy if consent else False,
                "terms_of_service": consent.terms_of_service if consent else False,
                "push_notification": consent.push_notification if consent else False,
                "marketing_notification": consent.marketing_notification if consent else False,
                "reward_program": consent.reward_program if consent else False
            } if consent else None
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"사용자 정보 조회 중 오류가 발생했습니다: {str(e)}"
        )


@router.put("/me", response_model=UserResponse)
async def update_my_info(
    request: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    내 정보 수정
    
    인증된 사용자의 기본 정보, 프로필, 동의 정보를 수정합니다.
    """
    try:
        # 기본 사용자 정보 업데이트
        if request.name is not None:
            current_user.name = request.name
            current_user.updated_at = datetime.utcnow()
        
        # 프로필 정보 업데이트
        if request.profile is not None:
            profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
            
            if not profile:
                # 프로필이 없으면 새로 생성
                profile = UserProfile(
                    user_id=current_user.id,
                    onboarding_completed=False,
                    profile_completion_rate=0
                )
                db.add(profile)
            
            # 프로필 필드 업데이트
            profile_data = request.profile.model_dump(exclude_unset=True)
            for field, value in profile_data.items():
                if hasattr(profile, field):
                    setattr(profile, field, value)
            
            # 프로필 완성도 계산
            profile_fields = ['age', 'region', 'job_category', 'income_range', 'goals']
            completed_fields = sum(1 for field in profile_fields if getattr(profile, field) is not None)
            profile.profile_completion_rate = int((completed_fields / len(profile_fields)) * 100)
            profile.updated_at = datetime.utcnow()
        
        # 동의 정보 업데이트
        if request.consents is not None:
            consent = db.query(UserConsent).filter(UserConsent.user_id == current_user.id).first()
            
            if not consent:
                # 동의 정보가 없으면 새로 생성 (기본 필수 동의만 True)
                consent = UserConsent(
                    user_id=current_user.id,
                    privacy_policy=True,
                    terms_of_service=True,
                    push_notification=False,
                    marketing_notification=False,
                    reward_program=False
                )
                db.add(consent)
            
            # 선택적 동의만 업데이트 (필수 동의는 변경 불가)
            consent_data = request.consents.model_dump(exclude_unset=True)
            for field, value in consent_data.items():
                if hasattr(consent, field):
                    setattr(consent, field, value)
            
            consent.updated_at = datetime.utcnow()
        
        # 변경사항 저장
        db.commit()
        db.refresh(current_user)
        
        # 최신 정보 다시 조회
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        consent = db.query(UserConsent).filter(UserConsent.user_id == current_user.id).first()
        
        return UserResponse(
            id=str(current_user.id),
            email=current_user.email,
            name=current_user.name,
            is_active=current_user.is_active,
            created_at=current_user.created_at,
            updated_at=current_user.updated_at,
            profile=UserProfileResponse(
                user_id=str(profile.user_id) if profile else str(current_user.id),
                age=profile.age if profile else None,
                region=profile.region if profile else None,
                job_category=profile.job_category if profile else None,
                income_range=profile.income_range if profile else None,
                goals=parse_goals(profile.goals) if profile else [],
                onboarding_completed=profile.onboarding_completed if profile else False,
                profile_completion_rate=profile.profile_completion_rate if profile else 0,
                created_at=profile.created_at if profile else None,
                updated_at=profile.updated_at if profile else None
            ) if profile else None,
            consents={
                "privacy_policy": consent.privacy_policy if consent else False,
                "terms_of_service": consent.terms_of_service if consent else False,
                "push_notification": consent.push_notification if consent else False,
                "marketing_notification": consent.marketing_notification if consent else False,
                "reward_program": consent.reward_program if consent else False
            } if consent else None
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"사용자 정보 수정 중 오류가 발생했습니다: {str(e)}"
        )