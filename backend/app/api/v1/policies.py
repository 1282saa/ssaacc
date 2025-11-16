"""
User Policy Management API Endpoints

사용자-정책 관리 API 엔드포인트:
- 사용자가 관심있는 정책 조회
- 정책 진행 현황 추적
- 정책 추가, 수정, 삭제
"""

from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.models.user import UserPolicy
from app.models.youth_policy import YouthPolicy
from app.schemas.policy import (
    UserPolicyCreate,
    UserPolicyUpdate,
    UserPolicyResponse,
    UserPolicyListResponse,
    UserPolicyProgressResponse,
    PolicyBase
)
from app.api.v1.users import get_current_user
from app.models.user import User

router = APIRouter()


def calculate_progress_percentage(documents_submitted: int, documents_total: int) -> int:
    """진행률 계산"""
    if documents_total == 0:
        return 0
    return min(100, int((documents_submitted / documents_total) * 100))


def get_deadline_text(user_policy: UserPolicy) -> str:
    """마감일 텍스트 생성"""
    if not user_policy.personal_deadline:
        if user_policy.status == "completed":
            return "결과 발표 대기"
        return "마감일 미정"

    days = user_policy.days_until_deadline
    if days is None:
        return "마감일 미정"

    if days < 0:
        return f"D+{abs(days)}"
    elif days == 0:
        return "D-Day"
    elif days == 1:
        return "D-1"
    else:
        return f"D-{days}"


def user_policy_to_response(user_policy: UserPolicy, policy: YouthPolicy) -> UserPolicyResponse:
    """UserPolicy 모델을 UserPolicyResponse로 변환"""
    policy_base = PolicyBase(
        id=policy.id,
        policy_name=policy.policy_name,
        category=policy.category,
        region=policy.region,
        deadline=policy.deadline,
        summary=policy.summary
    )

    return UserPolicyResponse(
        id=str(user_policy.id),
        user_id=str(user_policy.user_id),
        policy_id=user_policy.policy_id,
        status=user_policy.status,
        personal_deadline=user_policy.personal_deadline,
        documents_total=user_policy.documents_total,
        documents_submitted=user_policy.documents_submitted,
        notes=user_policy.notes,
        reminder_enabled=user_policy.reminder_enabled,
        reminder_days_before=user_policy.reminder_days_before,
        created_at=user_policy.created_at,
        updated_at=user_policy.updated_at,
        documents_remaining=user_policy.documents_remaining,
        days_until_deadline=user_policy.days_until_deadline,
        policy=policy_base
    )


def user_policy_to_progress(user_policy: UserPolicy, policy: YouthPolicy) -> UserPolicyProgressResponse:
    """UserPolicy 모델을 UserPolicyProgressResponse로 변환 (PlanScreen용)"""
    progress_percentage = calculate_progress_percentage(
        user_policy.documents_submitted,
        user_policy.documents_total
    )

    return UserPolicyProgressResponse(
        id=str(user_policy.id),
        policy_name=policy.policy_name,
        status=user_policy.status,
        documents_total=user_policy.documents_total,
        documents_submitted=user_policy.documents_submitted,
        progress_percentage=progress_percentage,
        days_until_deadline=user_policy.days_until_deadline,
        deadline_text=get_deadline_text(user_policy)
    )


@router.get("/progress", response_model=List[UserPolicyProgressResponse])
async def get_user_policies_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100, description="조회 개수")
):
    """
    정책 진행 현황 조회 (PlanScreen용)

    진행 중 또는 완료된 정책들의 간단한 진행 현황을 반환합니다.
    """
    try:
        # 사용자의 정책 조회 (진행 중, 완료 상태만)
        user_policies = db.query(UserPolicy).filter(
            UserPolicy.user_id == current_user.id,
            UserPolicy.status.in_(["in_progress", "completed"])
        ).order_by(
            UserPolicy.updated_at.desc()
        ).limit(limit).all()

        # YouthPolicy 정보도 함께 조회
        result = []
        for user_policy in user_policies:
            policy = db.query(YouthPolicy).filter(
                YouthPolicy.id == user_policy.policy_id
            ).first()

            if policy:
                result.append(user_policy_to_progress(user_policy, policy))

        return result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"정책 진행 현황 조회 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/", response_model=UserPolicyListResponse)
async def get_all_user_policies(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    status_filter: Optional[str] = Query(None, description="상태 필터"),
    limit: int = Query(100, ge=1, le=1000, description="조회 개수"),
    offset: int = Query(0, ge=0, description="시작 위치")
):
    """
    사용자의 모든 정책 조회

    필터와 페이지네이션을 지원합니다.
    """
    try:
        query = db.query(UserPolicy).filter(UserPolicy.user_id == current_user.id)

        # 필터 적용
        if status_filter:
            query = query.filter(UserPolicy.status == status_filter)

        # 총 개수 조회
        total = query.count()

        # 정렬 및 페이지네이션
        user_policies = query.order_by(UserPolicy.updated_at.desc()).offset(offset).limit(limit).all()

        # YouthPolicy 정보도 함께 조회
        result = []
        for user_policy in user_policies:
            policy = db.query(YouthPolicy).filter(
                YouthPolicy.id == user_policy.policy_id
            ).first()

            if policy:
                result.append(user_policy_to_response(user_policy, policy))

        return UserPolicyListResponse(
            total=total,
            policies=result
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"정책 목록 조회 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/{user_policy_id}", response_model=UserPolicyResponse)
async def get_user_policy(
    user_policy_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    특정 사용자-정책 상세 조회
    """
    try:
        user_policy = db.query(UserPolicy).filter(
            UserPolicy.id == uuid.UUID(user_policy_id),
            UserPolicy.user_id == current_user.id
        ).first()

        if not user_policy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="정책을 찾을 수 없습니다"
            )

        # YouthPolicy 정보 조회
        policy = db.query(YouthPolicy).filter(
            YouthPolicy.id == user_policy.policy_id
        ).first()

        if not policy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="정책 정보를 찾을 수 없습니다"
            )

        return user_policy_to_response(user_policy, policy)

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="잘못된 정책 ID 형식입니다"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"정책 조회 중 오류가 발생했습니다: {str(e)}"
        )


@router.post("/", response_model=UserPolicyResponse, status_code=status.HTTP_201_CREATED)
async def create_user_policy(
    request: UserPolicyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    새로운 사용자-정책 생성 (관심 정책 추가)
    """
    try:
        # 정책 존재 확인
        policy = db.query(YouthPolicy).filter(
            YouthPolicy.id == request.policy_id
        ).first()

        if not policy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="해당 정책을 찾을 수 없습니다"
            )

        # 이미 추가된 정책인지 확인
        existing = db.query(UserPolicy).filter(
            UserPolicy.user_id == current_user.id,
            UserPolicy.policy_id == request.policy_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 추가된 정책입니다"
            )

        # 사용자-정책 생성
        new_user_policy = UserPolicy(
            user_id=current_user.id,
            policy_id=request.policy_id,
            status=request.status,
            personal_deadline=request.personal_deadline,
            documents_total=request.documents_total,
            documents_submitted=request.documents_submitted,
            notes=request.notes,
            reminder_enabled=request.reminder_enabled,
            reminder_days_before=request.reminder_days_before
        )

        db.add(new_user_policy)
        db.commit()
        db.refresh(new_user_policy)

        return user_policy_to_response(new_user_policy, policy)

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"정책 추가 중 오류가 발생했습니다: {str(e)}"
        )


@router.put("/{user_policy_id}", response_model=UserPolicyResponse)
async def update_user_policy(
    user_policy_id: str,
    request: UserPolicyUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    사용자-정책 수정
    """
    try:
        user_policy = db.query(UserPolicy).filter(
            UserPolicy.id == uuid.UUID(user_policy_id),
            UserPolicy.user_id == current_user.id
        ).first()

        if not user_policy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="정책을 찾을 수 없습니다"
            )

        # 업데이트할 필드만 수정
        update_data = request.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user_policy, field, value)

        user_policy.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(user_policy)

        # YouthPolicy 정보 조회
        policy = db.query(YouthPolicy).filter(
            YouthPolicy.id == user_policy.policy_id
        ).first()

        return user_policy_to_response(user_policy, policy)

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="잘못된 정책 ID 형식입니다"
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"정책 수정 중 오류가 발생했습니다: {str(e)}"
        )


@router.delete("/{user_policy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_policy(
    user_policy_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    사용자-정책 삭제 (관심 정책 제거)
    """
    try:
        user_policy = db.query(UserPolicy).filter(
            UserPolicy.id == uuid.UUID(user_policy_id),
            UserPolicy.user_id == current_user.id
        ).first()

        if not user_policy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="정책을 찾을 수 없습니다"
            )

        db.delete(user_policy)
        db.commit()

        return None

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="잘못된 정책 ID 형식입니다"
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"정책 삭제 중 오류가 발생했습니다: {str(e)}"
        )
