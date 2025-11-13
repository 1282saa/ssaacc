"""
Onboarding API Endpoints

온보딩 관련 API 엔드포인트:
- 목표 선택 (1단계)
- 기본 정보 입력 (2단계)
- 동의 사항 처리 (3단계)
- 온보딩 상태 조회
"""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Annotated

from app.core.database import get_db
from app.models.user import User, UserProfile, UserConsent
from app.schemas.onboarding import (
    GoalsSelectionRequest, GoalsSelectionResponse,
    ProfileInfoRequest, ProfileInfoResponse,
    ConsentRequest, ConsentResponse,
    OnboardingStatusResponse, OnboardingStep
)
from app.utils.auth import get_user_from_token

router = APIRouter()


def get_current_user(
    authorization: Annotated[str, Header(alias="Authorization")],
    db: Session = Depends(get_db)
) -> User:
    """
    현재 인증된 사용자 조회
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization 헤더가 필요합니다",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = authorization.replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer 토큰이 필요합니다",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user_info = get_user_from_token(token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않거나 만료된 토큰입니다",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user = db.query(User).filter(User.id == user_info["user_id"]).first()
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


@router.post("/goals", response_model=GoalsSelectionResponse)
async def select_goals(
    request: GoalsSelectionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    온보딩 1단계: 목표 선택
    
    사용자가 관심 있는 금융 목표를 선택합니다.
    """
    try:
        # 사용자 프로필 조회 또는 생성
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        
        if not profile:
            # 프로필이 없으면 새로 생성
            profile = UserProfile(
                user_id=current_user.id,
                onboarding_completed=False,
                profile_completion_rate=0
            )
            db.add(profile)
            db.flush()
        
        # 목표 저장 (goals 필드는 List[str]로 저장)
        goals_list = [goal.value for goal in request.goals]
        profile.goals = goals_list
        
        # 최우선 목표가 있으면 첫 번째에 배치
        if request.priority_goal:
            priority = request.priority_goal.value
            if priority in goals_list:
                goals_list.remove(priority)
                goals_list.insert(0, priority)
                profile.goals = goals_list
        
        # 프로필 완성도 업데이트 (목표 선택으로 20% 증가)
        profile.profile_completion_rate = max(profile.profile_completion_rate, 20)
        profile.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(profile)
        
        return GoalsSelectionResponse(
            message="목표가 성공적으로 저장되었습니다",
            goals=request.goals,
            priority_goal=request.priority_goal,
            next_step=OnboardingStep.PROFILE
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"목표 선택 중 오류가 발생했습니다: {str(e)}"
        )


@router.post("/profile", response_model=ProfileInfoResponse)
async def update_profile_info(
    request: ProfileInfoRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    온보딩 2단계: 기본 정보 입력
    
    사용자의 나이, 지역, 직업, 소득 등 기본 정보를 입력합니다.
    """
    try:
        # 사용자 프로필 조회
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="먼저 목표를 선택해주세요"
            )
        
        # 기본 정보 업데이트
        profile.age = request.age
        profile.region = request.region
        profile.job_category = request.job_category.value
        profile.employment_status = request.employment_status
        profile.income_range = request.income_range.value
        profile.education_level = request.education_level
        
        # 프로필 완성도 계산 (기본 정보로 추가 60% 증가, 총 80%)
        base_completion = 20 if profile.goals else 0  # 목표 선택 여부
        profile_completion = 60  # 기본 정보 입력
        profile.profile_completion_rate = base_completion + profile_completion
        
        profile.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(profile)
        
        return ProfileInfoResponse(
            message="기본 정보가 성공적으로 저장되었습니다",
            profile_completion_rate=profile.profile_completion_rate,
            next_step=OnboardingStep.CONSENT
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"기본 정보 저장 중 오류가 발생했습니다: {str(e)}"
        )


@router.post("/consent", response_model=ConsentResponse)
async def update_consent(
    request: ConsentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    온보딩 3단계: 동의 사항 처리
    
    마케팅, 개인화 등 선택적 동의 사항을 처리하고 온보딩을 완료합니다.
    """
    try:
        # 사용자 프로필 조회
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="먼저 이전 단계를 완료해주세요"
            )
        
        # AI 성격 설정이 있으면 프로필에 저장
        if request.ai_personality:
            profile.ai_personality = request.ai_personality
        
        # 동의 정보 업데이트
        consent = db.query(UserConsent).filter(UserConsent.user_id == current_user.id).first()
        
        if not consent:
            # 동의 정보가 없으면 기본값으로 생성
            consent = UserConsent(
                user_id=current_user.id,
                privacy_policy=True,  # 필수
                terms_of_service=True,  # 필수
                push_notification=request.push_notification,
                marketing_notification=request.marketing_notification,
                data_analytics=request.data_analytics,
                personalized_ads=request.personalized_ads
            )
            db.add(consent)
        else:
            # 기존 동의 정보 업데이트 (선택적 동의만)
            consent.push_notification = request.push_notification
            consent.marketing_notification = request.marketing_notification
            consent.data_analytics = request.data_analytics
            consent.personalized_ads = request.personalized_ads
            consent.updated_at = datetime.utcnow()
        
        # 온보딩 완료 처리
        profile.onboarding_completed = True
        profile.profile_completion_rate = 100
        profile.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(profile)
        
        return ConsentResponse(
            message="온보딩이 완료되었습니다! 이제 맞춤형 금융 서비스를 이용하실 수 있습니다",
            onboarding_completed=True,
            next_step=OnboardingStep.COMPLETED
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"동의 사항 처리 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/status", response_model=OnboardingStatusResponse)
async def get_onboarding_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    온보딩 진행 상태 조회
    
    현재 사용자의 온보딩 진행 상황과 다음 단계를 확인합니다.
    """
    try:
        # 사용자 프로필 조회
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        
        if not profile:
            # 프로필이 없으면 처음 상태
            return OnboardingStatusResponse(
                user_id=current_user.id,
                current_step=OnboardingStep.GOALS,
                onboarding_completed=False,
                profile_completion_rate=0,
                completed_steps=[],
                next_step=OnboardingStep.GOALS,
                progress_data={}
            )
        
        # 완료된 단계 판단
        completed_steps = []
        progress_data = {}
        
        # 목표 선택 완료 여부
        if profile.goals:
            completed_steps.append(OnboardingStep.GOALS)
            progress_data["goals"] = profile.goals
            if len(profile.goals) > 0:
                progress_data["priority_goal"] = profile.goals[0]
        
        # 기본 정보 입력 완료 여부
        if profile.age and profile.region and profile.job_category and profile.income_range:
            completed_steps.append(OnboardingStep.PROFILE)
            progress_data["profile"] = {
                "age": profile.age,
                "region": profile.region,
                "job_category": profile.job_category,
                "income_range": profile.income_range
            }
        
        # 동의 사항 완료 여부 (온보딩 완료와 동일)
        if profile.onboarding_completed:
            completed_steps.append(OnboardingStep.CONSENT)
            completed_steps.append(OnboardingStep.COMPLETED)
        
        # 현재 단계 및 다음 단계 결정
        if profile.onboarding_completed:
            current_step = OnboardingStep.COMPLETED
            next_step = None
        elif OnboardingStep.PROFILE in completed_steps:
            current_step = OnboardingStep.CONSENT
            next_step = OnboardingStep.CONSENT
        elif OnboardingStep.GOALS in completed_steps:
            current_step = OnboardingStep.PROFILE
            next_step = OnboardingStep.PROFILE
        else:
            current_step = OnboardingStep.GOALS
            next_step = OnboardingStep.GOALS
        
        return OnboardingStatusResponse(
            user_id=current_user.id,
            current_step=current_step,
            onboarding_completed=profile.onboarding_completed,
            profile_completion_rate=profile.profile_completion_rate,
            completed_steps=completed_steps,
            next_step=next_step,
            progress_data=progress_data
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"온보딩 상태 조회 중 오류가 발생했습니다: {str(e)}"
        )