from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.auth_service import auth_service
from app.services.onboarding_service import onboarding_service
from app.schemas.onboarding import (
    OnboardingGoalsRequest,
    OnboardingProfileRequest, 
    OnboardingConsentRequest,
    OnboardingStatusResponse,
    OnboardingCompleteResponse
)

router = APIRouter()
security = HTTPBearer()

def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """현재 사용자 ID 조회"""
    token = credentials.credentials
    user = auth_service.get_current_user(db, token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다"
        )
    
    return str(user.id)

@router.get("/status", response_model=OnboardingStatusResponse)
async def get_onboarding_status(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """온보딩 상태 조회"""
    try:
        status = onboarding_service.get_onboarding_status(db, user_id)
        return status
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"온보딩 상태 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/goals")
async def save_goals(
    goals_request: OnboardingGoalsRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """온보딩 목표 저장"""
    try:
        result = onboarding_service.save_goals(db, user_id, goals_request)
        
        if result["success"]:
            return {"message": result["message"]}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"목표 저장 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/profile")
async def save_profile(
    profile_request: OnboardingProfileRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """온보딩 프로필 정보 저장"""
    try:
        result = onboarding_service.save_profile(db, user_id, profile_request)
        
        if result["success"]:
            return {"message": result["message"]}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"프로필 저장 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/consent")
async def save_consent(
    consent_request: OnboardingConsentRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """온보딩 동의 정보 저장"""
    try:
        result = onboarding_service.save_consent(db, user_id, consent_request)
        
        if result["success"]:
            return {"message": result["message"]}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"동의 정보 저장 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/complete", response_model=OnboardingCompleteResponse)
async def complete_onboarding(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """온보딩 완료 처리"""
    try:
        result = onboarding_service.complete_onboarding(db, user_id)
        
        if not result.success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.message
            )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"온보딩 완료 처리 중 오류가 발생했습니다: {str(e)}"
        )