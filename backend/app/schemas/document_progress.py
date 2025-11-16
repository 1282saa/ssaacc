"""
Document Progress Schemas
문서 완료 현황 관련 Pydantic 스키마

📋 목적:
- API 요청/응답 데이터 검증 및 직렬화
- FastAPI의 자동 문서화 지원
- 타입 안정성 보장

🔗 관련 파일:
- Model: app/models/document_progress.py
- API: app/api/v1/document_progress.py
- Frontend Service: FinKuRN/src/services/documentProgressService.ts

📊 스키마 종류:
1. DocumentProgressBase: 기본 필드 (상속용)
2. DocumentProgressCreate: 생성 요청
3. DocumentProgressUpdate: 업데이트 요청
4. DocumentProgressResponse: API 응답
5. BulkDocumentProgressUpdate: 일괄 업데이트 (향후 사용)
6. DocumentProgressStats: 통계 응답

📅 작성일: 2025-01-16
👤 작성자: Claude Code
"""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class DocumentProgressBase(BaseModel):
    """문서 진행 상황 기본 스키마"""
    policy_id: int
    document_index: int
    document_name: str
    is_completed: bool = False


class DocumentProgressCreate(DocumentProgressBase):
    """문서 진행 상황 생성"""
    pass


class DocumentProgressUpdate(BaseModel):
    """문서 진행 상황 업데이트"""
    is_completed: bool


class DocumentProgressResponse(DocumentProgressBase):
    """문서 진행 상황 응답"""
    id: int
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime]
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class BulkDocumentProgressUpdate(BaseModel):
    """여러 문서 진행 상황 일괄 업데이트"""
    updates: List[dict]
    # updates 예시: [{"policy_id": 1, "document_index": 0, "is_completed": true}, ...]


class DocumentProgressStats(BaseModel):
    """문서 진행 통계"""
    total_documents: int
    completed_documents: int
    completion_percentage: float
