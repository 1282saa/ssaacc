"""
Task Management API Endpoints

할 일 관리 API 엔드포인트:
- 할 일 생성, 조회, 수정, 삭제
- 오늘의 할 일 조회
- 정책과 연결된 할 일 관리
"""

from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.models.user import Task, UserPolicy
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskListResponse,
    TodayTasksResponse
)
from app.api.v1.users import get_current_user
from app.models.user import User

router = APIRouter()


def task_to_response(task: Task) -> TaskResponse:
    """
    Task 모델을 TaskResponse로 변환
    계산된 필드들을 포함합니다.
    """
    return TaskResponse(
        id=str(task.id),
        user_id=str(task.user_id),
        user_policy_id=str(task.user_policy_id) if task.user_policy_id else None,
        title=task.title,
        description=task.description,
        category=task.category,
        due_date=task.due_date,
        status=task.status,
        priority=task.priority,
        reminder_enabled=task.reminder_enabled,
        completed_at=task.completed_at,
        created_at=task.created_at,
        updated_at=task.updated_at,
        days_until_due=task.days_until_due,
        is_overdue=task.is_overdue,
        is_due_soon=task.is_due_soon()
    )


@router.get("/today", response_model=TodayTasksResponse)
async def get_today_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    오늘의 할 일 조회

    - 기한이 지난 할 일
    - 오늘 마감인 할 일
    - 곧 마감인 할 일 (3일 이내)
    """
    try:
        today = date.today()

        # 사용자의 미완료 할 일 조회 (pending, in_progress)
        tasks = db.query(Task).filter(
            Task.user_id == current_user.id,
            Task.status.in_(["pending", "in_progress"])
        ).all()

        # 분류
        overdue_tasks = []
        due_today_tasks = []
        due_soon_tasks = []

        for task in tasks:
            if task.is_overdue:
                overdue_tasks.append(task)
            elif task.due_date == today:
                due_today_tasks.append(task)
            elif task.is_due_soon():
                due_soon_tasks.append(task)

        # 우선순위 순으로 정렬 (1이 가장 높음)
        all_today_tasks = sorted(
            overdue_tasks + due_today_tasks + due_soon_tasks,
            key=lambda t: (t.priority, t.due_date)
        )

        return TodayTasksResponse(
            query_date=today,
            overdue_count=len(overdue_tasks),
            due_today_count=len(due_today_tasks),
            due_soon_count=len(due_soon_tasks),
            tasks=[task_to_response(task) for task in all_today_tasks]
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"오늘의 할 일 조회 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/", response_model=TaskListResponse)
async def get_all_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    status_filter: Optional[str] = Query(None, description="상태 필터 (pending, in_progress, completed, cancelled)"),
    category: Optional[str] = Query(None, description="카테고리 필터"),
    limit: int = Query(100, ge=1, le=1000, description="조회 개수"),
    offset: int = Query(0, ge=0, description="시작 위치")
):
    """
    할 일 목록 조회

    필터와 페이지네이션을 지원합니다.
    """
    try:
        query = db.query(Task).filter(Task.user_id == current_user.id)

        # 필터 적용
        if status_filter:
            query = query.filter(Task.status == status_filter)
        if category:
            query = query.filter(Task.category == category)

        # 총 개수 조회
        total = query.count()

        # 정렬 및 페이지네이션
        tasks = query.order_by(Task.due_date.asc(), Task.priority.asc()).offset(offset).limit(limit).all()

        return TaskListResponse(
            total=total,
            tasks=[task_to_response(task) for task in tasks]
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"할 일 목록 조회 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    특정 할 일 상세 조회
    """
    try:
        task = db.query(Task).filter(
            Task.id == uuid.UUID(task_id),
            Task.user_id == current_user.id
        ).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="할 일을 찾을 수 없습니다"
            )

        return task_to_response(task)

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="잘못된 할 일 ID 형식입니다"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"할 일 조회 중 오류가 발생했습니다: {str(e)}"
        )


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    request: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    새로운 할 일 생성
    """
    try:
        # user_policy_id 검증 (제공된 경우)
        if request.user_policy_id:
            user_policy = db.query(UserPolicy).filter(
                UserPolicy.id == uuid.UUID(request.user_policy_id),
                UserPolicy.user_id == current_user.id
            ).first()

            if not user_policy:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="연결된 정책을 찾을 수 없습니다"
                )

        # 할 일 생성
        new_task = Task(
            user_id=current_user.id,
            user_policy_id=uuid.UUID(request.user_policy_id) if request.user_policy_id else None,
            title=request.title,
            description=request.description,
            category=request.category,
            due_date=request.due_date,
            priority=request.priority,
            reminder_enabled=request.reminder_enabled,
            status="pending"
        )

        db.add(new_task)
        db.commit()
        db.refresh(new_task)

        return task_to_response(new_task)

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"할 일 생성 중 오류가 발생했습니다: {str(e)}"
        )


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    request: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    할 일 수정
    """
    try:
        task = db.query(Task).filter(
            Task.id == uuid.UUID(task_id),
            Task.user_id == current_user.id
        ).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="할 일을 찾을 수 없습니다"
            )

        # 업데이트할 필드만 수정
        update_data = request.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        # 완료 상태로 변경된 경우 completed_at 설정
        if request.status == "completed" and not task.completed_at:
            task.completed_at = datetime.utcnow()
        # 완료 상태에서 다른 상태로 변경된 경우 completed_at 초기화
        elif request.status and request.status != "completed" and task.completed_at:
            task.completed_at = None

        task.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(task)

        return task_to_response(task)

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="잘못된 할 일 ID 형식입니다"
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"할 일 수정 중 오류가 발생했습니다: {str(e)}"
        )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    할 일 삭제
    """
    try:
        task = db.query(Task).filter(
            Task.id == uuid.UUID(task_id),
            Task.user_id == current_user.id
        ).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="할 일을 찾을 수 없습니다"
            )

        db.delete(task)
        db.commit()

        return None

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="잘못된 할 일 ID 형식입니다"
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"할 일 삭제 중 오류가 발생했습니다: {str(e)}"
        )
