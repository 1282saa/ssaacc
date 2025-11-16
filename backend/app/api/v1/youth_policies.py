"""
Youth Policy API Endpoints

모든 청년 정책 조회 API
- 사용자 구분 없이 모든 정책 조회
- 카테고리, 지역별 필터링
- 페이지네이션 지원
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.youth_policy import YouthPolicy
from app.schemas.youth_policy import YouthPolicyResponse, YouthPolicyListResponse

router = APIRouter()


@router.get("/", response_model=YouthPolicyListResponse)
async def get_all_youth_policies(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None, description="카테고리 필터"),
    region: Optional[str] = Query(None, description="지역 필터"),
    sort_by: str = Query("smart", description="정렬 방식: smart(스마트정렬), deadline(마감일순), name(가나다순), created(최신순)"),
    limit: int = Query(100, ge=1, le=1000, description="조회 개수"),
    offset: int = Query(0, ge=0, description="시작 위치")
):
    """
    모든 청년 정책 조회

    사용자 구분 없이 전체 청년 정책을 조회합니다.
    카테고리, 지역별 필터링 및 페이지네이션을 지원합니다.

    정렬 방식:
    - smart: 마감일 있는 것 우선(날짜순) → 상시 모집은 가나다순
    - deadline: 마감일 빠른 순
    - name: 정책명 가나다순
    - created: 최신 등록순
    """
    try:
        query = db.query(YouthPolicy)

        # 필터 적용
        if category:
            query = query.filter(YouthPolicy.category == category)

        if region:
            query = query.filter(YouthPolicy.region == region)

        # 총 개수 조회
        total = query.count()

        # 정렬 적용
        if sort_by == "smart":
            # 스마트 정렬: 마감일 있으면 날짜순, 없으면(상시) 가나다순
            # CASE를 사용하여 deadline이 '상시'인 경우 뒤로, 그 외는 앞으로
            from sqlalchemy import case, func
            policies = query.order_by(
                case(
                    (YouthPolicy.deadline.in_(['상시', '상시 모집', None]), 1),
                    else_=0
                ),
                YouthPolicy.created_at.desc(),  # 마감일 있는 것들은 최신순
                YouthPolicy.policy_name.asc()   # 상시 모집은 가나다순
            ).offset(offset).limit(limit).all()
        elif sort_by == "deadline":
            # 마감일순 (빠른 것 먼저)
            policies = query.order_by(YouthPolicy.deadline.asc()).offset(offset).limit(limit).all()
        elif sort_by == "name":
            # 가나다순
            policies = query.order_by(YouthPolicy.policy_name.asc()).offset(offset).limit(limit).all()
        else:  # created
            # 최신 등록순
            policies = query.order_by(YouthPolicy.created_at.desc()).offset(offset).limit(limit).all()

        return YouthPolicyListResponse(
            total=total,
            policies=[YouthPolicyResponse.model_validate(p) for p in policies]
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"정책 목록 조회 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/{policy_id}", response_model=YouthPolicyResponse)
async def get_youth_policy(
    policy_id: int,
    db: Session = Depends(get_db)
):
    """
    특정 청년 정책 상세 조회
    """
    try:
        policy = db.query(YouthPolicy).filter(YouthPolicy.id == policy_id).first()

        if not policy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="정책을 찾을 수 없습니다"
            )

        return YouthPolicyResponse.model_validate(policy)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"정책 조회 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/categories/list", response_model=List[str])
async def get_categories(db: Session = Depends(get_db)):
    """
    사용 가능한 카테고리 목록 조회
    """
    try:
        categories = db.query(YouthPolicy.category).distinct().all()
        return [cat[0] for cat in categories if cat[0]]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"카테고리 조회 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/regions/list", response_model=List[str])
async def get_regions(db: Session = Depends(get_db)):
    """
    사용 가능한 지역 목록 조회
    """
    try:
        regions = db.query(YouthPolicy.region).distinct().all()
        return [reg[0] for reg in regions if reg[0]]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"지역 조회 중 오류가 발생했습니다: {str(e)}"
        )
