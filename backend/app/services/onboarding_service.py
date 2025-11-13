from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional, List
import json

from app.models.user import User, UserProfile, UserConsent
from app.schemas.onboarding import (
    OnboardingGoalsRequest, 
    OnboardingProfileRequest, 
    OnboardingConsentRequest,
    OnboardingStatusResponse,
    OnboardingCompleteResponse
)

class OnboardingService:
    
    def get_onboarding_status(self, db: Session, user_id: str) -> OnboardingStatusResponse:
        """사용자의 온보딩 상태 조회"""
        user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        
        if not user_profile:
            return OnboardingStatusResponse(
                onboarding_completed=False,
                profile_completion_rate=0,
                current_step="goals"
            )
        
        # 단계별 완성도 계산
        completion_rate = 0
        current_step = "goals"
        
        # 목표 설정 완료 여부 (goals 필드 체크)
        if user_profile.goals:
            completion_rate += 25
            current_step = "profile"
        
        # 기본 정보 완료 여부 (age, region 필수)
        if user_profile.age and user_profile.region:
            completion_rate += 25
            current_step = "consent"
        
        # 동의 정보 완료 여부
        user_consent = db.query(UserConsent).filter(UserConsent.user_id == user_id).first()
        if user_consent and user_consent.privacy_policy and user_consent.terms_of_service:
            completion_rate += 25
            current_step = "complete"
        
        # 온보딩 완료 여부
        onboarding_completed = user_profile.onboarding_completed or completion_rate >= 75
        if onboarding_completed:
            completion_rate = 100
            current_step = "completed"
            
        return OnboardingStatusResponse(
            onboarding_completed=onboarding_completed,
            profile_completion_rate=completion_rate,
            current_step=current_step
        )
    
    def save_goals(self, db: Session, user_id: str, goals_request: OnboardingGoalsRequest) -> dict:
        """온보딩 목표 저장"""
        try:
            user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
            
            if not user_profile:
                # UserProfile이 없으면 생성
                user_profile = UserProfile(
                    user_id=user_id,
                    goals=json.dumps(goals_request.goals),
                    profile_completion_rate=25
                )
                db.add(user_profile)
            else:
                # 기존 프로필 업데이트
                user_profile.goals = json.dumps(goals_request.goals)
                # 완성도 재계산
                if user_profile.age and user_profile.region:
                    user_profile.profile_completion_rate = 50
                else:
                    user_profile.profile_completion_rate = 25
            
            db.commit()
            db.refresh(user_profile)
            
            return {"success": True, "message": "목표가 성공적으로 저장되었습니다."}
            
        except Exception as e:
            db.rollback()
            return {"success": False, "error": str(e)}
    
    def save_profile(self, db: Session, user_id: str, profile_request: OnboardingProfileRequest) -> dict:
        """온보딩 프로필 정보 저장"""
        try:
            user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
            
            if not user_profile:
                # UserProfile이 없으면 생성
                user_profile = UserProfile(
                    user_id=user_id,
                    age=profile_request.age,
                    region=profile_request.region,
                    job_category=profile_request.job_category,
                    income_range=profile_request.income_range,
                    profile_completion_rate=25
                )
                db.add(user_profile)
            else:
                # 기존 프로필 업데이트
                user_profile.age = profile_request.age
                user_profile.region = profile_request.region
                user_profile.job_category = profile_request.job_category
                user_profile.income_range = profile_request.income_range
                
                # 완성도 재계산
                completion_rate = 25  # 기본 정보
                if user_profile.goals:
                    completion_rate += 25  # 목표
                user_profile.profile_completion_rate = completion_rate
            
            db.commit()
            db.refresh(user_profile)
            
            return {"success": True, "message": "프로필 정보가 성공적으로 저장되었습니다."}
            
        except Exception as e:
            db.rollback()
            return {"success": False, "error": str(e)}
    
    def save_consent(self, db: Session, user_id: str, consent_request: OnboardingConsentRequest) -> dict:
        """온보딩 동의 정보 저장"""
        try:
            user_consent = db.query(UserConsent).filter(UserConsent.user_id == user_id).first()
            
            if not user_consent:
                # UserConsent가 없으면 생성
                user_consent = UserConsent(
                    user_id=user_id,
                    push_notification=consent_request.push_notification,
                    marketing_notification=consent_request.marketing_notification,
                    reward_program=consent_request.reward_program,
                    privacy_policy=consent_request.privacy_policy,
                    terms_of_service=consent_request.terms_of_service
                )
                db.add(user_consent)
            else:
                # 기존 동의 정보 업데이트
                user_consent.push_notification = consent_request.push_notification
                user_consent.marketing_notification = consent_request.marketing_notification
                user_consent.reward_program = consent_request.reward_program
                user_consent.privacy_policy = consent_request.privacy_policy
                user_consent.terms_of_service = consent_request.terms_of_service
            
            # 프로필 완성도 업데이트
            user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
            if user_profile:
                completion_rate = 75  # 기본 정보 + 목표 + 동의
                user_profile.profile_completion_rate = completion_rate
            
            db.commit()
            
            return {"success": True, "message": "동의 정보가 성공적으로 저장되었습니다."}
            
        except Exception as e:
            db.rollback()
            return {"success": False, "error": str(e)}
    
    def complete_onboarding(self, db: Session, user_id: str) -> OnboardingCompleteResponse:
        """온보딩 완료 처리"""
        try:
            user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
            
            if not user_profile:
                return OnboardingCompleteResponse(
                    success=False,
                    message="사용자 프로필을 찾을 수 없습니다.",
                    user_id=user_id
                )
            
            # 온보딩 완료 표시
            user_profile.onboarding_completed = True
            user_profile.profile_completion_rate = 100
            
            db.commit()
            db.refresh(user_profile)
            
            return OnboardingCompleteResponse(
                success=True,
                message="온보딩이 성공적으로 완료되었습니다!",
                user_id=user_id
            )
            
        except Exception as e:
            db.rollback()
            return OnboardingCompleteResponse(
                success=False,
                message=f"온보딩 완료 처리 중 오류가 발생했습니다: {str(e)}",
                user_id=user_id
            )

onboarding_service = OnboardingService()