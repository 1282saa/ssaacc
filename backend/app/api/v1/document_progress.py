"""
Document Progress API Router
문서 완료 현황 관련 API 엔드포인트

📋 목적:
- PlanScreen의 문서 체크박스 상태를 데이터베이스에 저장/조회
- 사용자별 정책 문서 준비 현황 추적
- 페이지 새로고침 시에도 체크 상태 유지

🔐 인증:
- 모든 엔드포인트는 JWT Bearer Token 필요
- get_current_user_id() 의존성 주입으로 사용자 인증

🔗 관련 파일:
- Model: app/models/document_progress.py
- Schema: app/schemas/document_progress.py
- Frontend: FinKuRN/src/screens/plan/PlanScreen.tsx
- Service: FinKuRN/src/services/documentProgressService.ts

📡 API 엔드포인트:
1. GET /document-progress/
   - 사용자의 모든 문서 진행 상황 조회
   - 응답: DocumentProgressResponse[]

2. GET /document-progress/policy/{policy_id}
   - 특정 정책의 문서 진행 상황 조회
   - 응답: DocumentProgressResponse[]

3. POST /document-progress/toggle
   - 문서 완료 상태 토글 (체크박스 클릭)
   - Body: {policy_id, document_index, document_name}
   - 응답: DocumentProgressResponse

4. GET /document-progress/stats
   - 사용자의 전체 문서 진행 통계
   - 응답: DocumentProgressStats {total, completed, percentage}

🔄 데이터 흐름:
1. 프론트엔드에서 JWT 토큰과 함께 API 요청
2. get_current_user_id()가 토큰 검증 및 user_id 추출
3. user_id로 해당 사용자의 데이터만 조회/수정
4. 데이터베이스 작업 후 응답 반환

📅 작성일: 2025-01-16
👤 작성자: Claude Code
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid

from app.database import get_db
from app.services.auth_service import auth_service
from app.models.document_progress import DocumentProgress
from app.schemas.document_progress import (
    DocumentProgressResponse,
    DocumentProgressUpdate,
    DocumentProgressStats
)

router = APIRouter()
security = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> str:
    """현재 사용자 ID 가져오기"""
    token = credentials.credentials
    user = auth_service.get_current_user(db, token)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다"
        )

    return str(user.id)


@router.get("/", response_model=List[DocumentProgressResponse])
def get_user_document_progress(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    사용자의 모든 문서 진행 상황 조회
    """
    progress_list = db.query(DocumentProgress).filter(
        DocumentProgress.user_id == uuid.UUID(user_id)
    ).all()

    return [
        DocumentProgressResponse(
            id=p.id,
            user_id=str(p.user_id),
            policy_id=p.policy_id,
            document_index=p.document_index,
            document_name=p.document_name,
            is_completed=p.is_completed,
            created_at=p.created_at,
            updated_at=p.updated_at,
            completed_at=p.completed_at
        )
        for p in progress_list
    ]


@router.get("/policy/{policy_id}", response_model=List[DocumentProgressResponse])
def get_policy_document_progress(
    policy_id: int,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    특정 정책의 문서 진행 상황 조회
    """
    progress_list = db.query(DocumentProgress).filter(
        DocumentProgress.user_id == uuid.UUID(user_id),
        DocumentProgress.policy_id == policy_id
    ).all()

    return [
        DocumentProgressResponse(
            id=p.id,
            user_id=str(p.user_id),
            policy_id=p.policy_id,
            document_index=p.document_index,
            document_name=p.document_name,
            is_completed=p.is_completed,
            created_at=p.created_at,
            updated_at=p.updated_at,
            completed_at=p.completed_at
        )
        for p in progress_list
    ]


@router.post("/toggle")
def toggle_document_completion(
    policy_id: int,
    document_index: int,
    document_name: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    문서 완료 상태 토글 (체크박스 클릭)

    프론트엔드의 PlanScreen에서 체크박스 클릭 시 호출
    - 존재하지 않으면 생성 (is_completed=True)
    - 존재하면 is_completed 토글

    Args:
        policy_id (int): 정책 ID
        document_index (int): 문서 인덱스 (required_documents 배열의 인덱스)
        document_name (str): 문서명 (예: "신분증", "통장 사본")
        user_id (str): JWT 토큰에서 추출한 사용자 ID (자동 주입)
        db (Session): 데이터베이스 세션 (자동 주입)

    Returns:
        DocumentProgressResponse: 업데이트된 문서 진행 상황

    Example:
        POST /document-progress/toggle
        Body: {
            "policy_id": 1,
            "document_index": 0,
            "document_name": "신분증"
        }

        Response: {
            "id": 123,
            "user_id": "550e8400-e29b-41d4-a716-446655440000",
            "policy_id": 1,
            "document_index": 0,
            "document_name": "신분증",
            "is_completed": true,
            "created_at": "2025-01-16T10:00:00Z",
            "updated_at": "2025-01-16T10:05:00Z",
            "completed_at": "2025-01-16T10:05:00Z"
        }
    """
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 1: 기존 레코드 조회
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # user_id, policy_id, document_index로 고유하게 식별
    progress = db.query(DocumentProgress).filter(
        DocumentProgress.user_id == uuid.UUID(user_id),
        DocumentProgress.policy_id == policy_id,
        DocumentProgress.document_index == document_index
    ).first()

    if progress:
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # Step 2a: 기존 레코드 업데이트 (토글)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # is_completed를 반대로 변경
        progress.is_completed = not progress.is_completed
        progress.updated_at = datetime.now()

        # 완료 상태가 True면 completed_at 기록, False면 초기화
        if progress.is_completed:
            progress.completed_at = datetime.now()
        else:
            progress.completed_at = None
    else:
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # Step 2b: 새 레코드 생성 (첫 클릭 시)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 첫 클릭 시에는 완료(True)로 설정
        progress = DocumentProgress(
            user_id=uuid.UUID(user_id),
            policy_id=policy_id,
            document_index=document_index,
            document_name=document_name,
            is_completed=True,
            completed_at=datetime.now()
        )
        db.add(progress)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 3: 데이터베이스에 커밋 및 새로고침
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    db.commit()
    db.refresh(progress)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 4: 응답 반환 (user_id는 문자열로 변환)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    return {
        "id": progress.id,
        "user_id": str(progress.user_id),
        "policy_id": progress.policy_id,
        "document_index": progress.document_index,
        "document_name": progress.document_name,
        "is_completed": progress.is_completed,
        "created_at": progress.created_at,
        "updated_at": progress.updated_at,
        "completed_at": progress.completed_at
    }


@router.get("/stats", response_model=DocumentProgressStats)
def get_document_progress_stats(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    사용자의 전체 문서 진행 통계
    """
    all_progress = db.query(DocumentProgress).filter(
        DocumentProgress.user_id == uuid.UUID(user_id)
    ).all()

    total = len(all_progress)
    completed = sum(1 for p in all_progress if p.is_completed)
    percentage = (completed / total * 100) if total > 0 else 0

    return DocumentProgressStats(
        total_documents=total,
        completed_documents=completed,
        completion_percentage=round(percentage, 2)
    )
