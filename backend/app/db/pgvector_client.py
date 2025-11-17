"""
PostgreSQL + pgvector Client
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

청년 정책 벡터 검색을 위한 pgvector 클라이언트
"""

from typing import List, Dict, Any, Optional
import psycopg2
import os
import json
from loguru import logger


class PgVectorClient:
    """
    PostgreSQL + pgvector 클라이언트

    28개 청년 정책 데이터의 벡터 유사도 검색
    """

    def __init__(self, database_url: Optional[str] = None):
        """
        클라이언트 초기화

        Args:
            database_url: PostgreSQL 연결 문자열
        """
        self.database_url = database_url or os.getenv("POSTGRES_DATABASE_URL")

        if not self.database_url:
            raise ValueError("POSTGRES_DATABASE_URL environment variable is required")

        logger.info(f"🔧 Connecting to PostgreSQL with pgvector...")

        try:
            self.conn = psycopg2.connect(self.database_url)
            logger.info("✅ Connected to PostgreSQL + pgvector")
        except Exception as e:
            logger.error(f"❌ Failed to connect to PostgreSQL: {e}")
            raise

    def search(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        output_fields: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        벡터 유사도 검색

        Args:
            query_embedding: 쿼리 임베딩 벡터 (1024차원)
            top_k: 반환할 최대 결과 개수
            output_fields: 반환할 필드 목록 (사용 안함, 호환성 유지용)

        Returns:
            검색 결과 리스트
        """
        # 임베딩을 PostgreSQL vector 형식으로 변환
        embedding_str = '[' + ','.join(map(str, query_embedding)) + ']'

        # pgvector 검색 쿼리
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT
                id,
                policy_number,
                policy_name,
                category,
                region,
                deadline,
                summary,
                full_text,
                filename,
                operation_period,
                application_period,
                support_content,
                support_scale,
                eligibility,
                application_info,
                additional_info,
                required_documents,
                tags,
                1 - (embedding <=> %s::vector) as similarity_score
            FROM youth_policies
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """, (embedding_str, embedding_str, top_k))

        # 결과 포맷팅
        results = []
        for row in cursor.fetchall():
            metadata = {
                "title": row[2],
                "description": row[7] or row[6],
                "category": row[3],
                "region": row[4],
                "deadline": row[5],
                "summary": row[6],
                "full_text": row[7],
                "filename": row[8],
                "operation_period": row[9],
                "application_period": row[10],
                "support_content": row[11],
                "support_scale": row[12],
                "eligibility": row[13] if isinstance(row[13], dict) else {},
                "application_info": row[14] if isinstance(row[14], dict) else {},
                "additional_info": row[15] if isinstance(row[15], dict) else {},
                "required_documents": row[16] if isinstance(row[16], list) else [],
                "tags": row[17] if isinstance(row[17], list) else []
            }

            results.append({
                "id": row[0],
                "policy_id": row[1] or f"POLICY_{row[0]:03d}",
                "distance": 1.0 - float(row[18]),  # distance (낮을수록 유사)
                "metadata": json.dumps(metadata, ensure_ascii=False)
            })

        cursor.close()
        logger.info(f"✅ Found {len(results)} policies from pgvector")
        return results

    def close(self):
        """연결 종료"""
        if self.conn:
            self.conn.close()
            logger.info("🔌 PostgreSQL connection closed")


# 전역 클라이언트 인스턴스 (싱글톤 패턴)
_global_client: Optional[PgVectorClient] = None


def get_pgvector_client() -> PgVectorClient:
    """전역 pgvector 클라이언트 반환"""
    global _global_client

    if _global_client is None:
        logger.info("🔧 Creating global pgvector client")
        _global_client = PgVectorClient()

    return _global_client
