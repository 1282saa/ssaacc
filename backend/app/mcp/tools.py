"""
FastMCP Tools - Model Context Protocol 도구 정의
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

메이크리 AI 워크플로우 아키텍처에서 사용하는 공유 도구들을 정의합니다.

## 아키텍처 위치:
Supervisor Agent → 전문 에이전트들 → **FastMCP Tools** → Database (PostgreSQL + pgvector)

## 도구 목록:
1. search_policies: 벡터 유사도 기반 정책 검색 (PostgreSQL + pgvector)
2. find_related_policies: 관계 기반 정책 찾기 (Neo4j) - Phase 2
3. check_eligibility: 사용자 자격 조건 확인

## FastMCP란?
- Model Context Protocol의 FastAPI 구현체
- LLM이 외부 도구를 호출할 수 있게 하는 표준 프로토콜
- 여러 에이전트가 동일한 도구를 공유할 수 있음

## 사용 예시:
```python
# Policy Search Agent에서 호출
result = await search_policies(
    query="25세 청년 적금 추천",
    top_k=5
)
```
"""

from typing import List, Dict, Any, Optional
from fastmcp import FastMCP
from app.db.pgvector_client import get_pgvector_client
from app.llm_config import get_embeddings  # ⭐ AWS Bedrock Titan Embeddings
import os
from loguru import logger

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FastMCP 초기화
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# FastMCP 인스턴스 생성
# - name: MCP 서버 이름
# - 여러 에이전트가 이 도구들을 공유함
mcp = FastMCP("FinKuRN-Policy-Tools")

# 임베딩 모델 초기화 (AWS Bedrock Titan 또는 OpenAI)
# - USE_AWS_BEDROCK=true → AWS Bedrock Titan Embeddings (1024 차원)
# - USE_AWS_BEDROCK=false → OpenAI text-embedding-3-large (3072 차원)
embeddings_model = get_embeddings()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Helper Functions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def generate_embedding(text: str) -> List[float]:
    """
    텍스트를 벡터 임베딩으로 변환

    Args:
        text: 임베딩할 텍스트 (예: "25세 청년 적금 추천")

    Returns:
        벡터 임베딩
        - AWS Bedrock: 1024차원 (Titan Embeddings V2)
        - OpenAI: 3072차원 (text-embedding-3-large)

    Purpose:
        - 사용자 쿼리를 벡터로 변환하여 Milvus에서 유사도 검색
        - 정책 데이터도 동일한 모델로 임베딩되어 있어야 함

    Example:
        >>> embedding = generate_embedding("청년 적금 추천")
        >>> len(embedding)  # 1024 (Bedrock) 또는 3072 (OpenAI)
    """
    try:
        # LangChain Embeddings 인터페이스 사용
        # - embed_query: 단일 텍스트 임베딩 생성
        embedding = embeddings_model.embed_query(text)
        logger.debug(f"Generated embedding with dimension: {len(embedding)}")
        return embedding
    except Exception as e:
        logger.error(f"Failed to generate embedding: {str(e)}")
        raise


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MCP Tool 1: 정책 검색 (Milvus 벡터 검색)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@mcp.tool()
async def search_policies(
    query: str,
    top_k: int = 5,
    filters: Optional[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    """
    벡터 유사도 기반 정책 검색

    ## 기능:
    사용자 쿼리를 임베딩으로 변환하여 Milvus에서 가장 유사한 정책을 검색합니다.

    ## Args:
        query (str): 사용자 검색 쿼리
            예: "25세 청년 적금 추천", "대학생 장학금"

        top_k (int, optional): 반환할 최대 결과 개수. Defaults to 5.

        filters (dict, optional): 필터링 조건. Defaults to None.
            예: {"age_min": 19, "age_max": 34}

    ## Returns:
        List[Dict]: 검색된 정책 리스트
            [
                {
                    "policy_id": "POLICY_001",
                    "title": "청년 적금 우대 이자",
                    "description": "만 19-34세 청년을 위한...",
                    "similarity_score": 0.92,
                    "metadata": {...}
                },
                ...
            ]

    ## 데이터 흐름:
    1. query → 임베딩 생성 (AWS Bedrock Titan Embeddings V2)
    2. 임베딩 → pgvector 벡터 검색 (COSINE 유사도)
    3. 결과 → JSON 파싱 및 반환

    ## 사용 예시:
    ```python
    # Policy Search Agent에서 호출
    policies = await search_policies(
        query="대학생 장학금",
        top_k=3
    )
    ```

    ## TODO:
    - [ ] 필터링 조건 구현 (나이, 지역, 카테고리 등)
    - [ ] 재검색 로직 (결과가 부족할 경우)
    - [ ] 캐싱 추가 (동일 쿼리 반복 방지)
    """
    try:
        logger.info(f"🔍 Searching policies for: '{query}'")

        # Step 1: 쿼리를 벡터 임베딩으로 변환
        query_embedding = generate_embedding(query)
        logger.debug(f"Generated embedding with dimension: {len(query_embedding)}")

        # Step 2: pgvector에서 유사도 검색
        pgvector_client = get_pgvector_client()
        results = pgvector_client.search(
            query_embedding=query_embedding,
            top_k=top_k
        )

        # Step 3: 결과 포맷팅
        formatted_results = []
        for result in results:
            import json
            metadata = json.loads(result.get("metadata", "{}"))

            formatted_results.append({
                "policy_id": result.get("policy_id"),
                "title": metadata.get("title", "제목 없음"),
                "description": metadata.get("description", ""),
                "category": metadata.get("category", ""),
                "age_range": metadata.get("age_range", ""),
                "region": metadata.get("region", "전국"),
                "similarity_score": round(result.get("distance", 0), 4),
                "metadata": metadata
            })

        logger.info(f"✅ Found {len(formatted_results)} policies")
        return formatted_results

    except Exception as e:
        logger.error(f"❌ Policy search failed: {str(e)}")
        return []


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MCP Tool 2: 관련 정책 찾기 (Neo4j 그래프 검색)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@mcp.tool()
async def find_related_policies(
    policy_id: str,
    relationship_type: Optional[str] = None,
    max_depth: int = 2
) -> List[Dict[str, Any]]:
    """
    관계 기반 정책 추천 (Neo4j 그래프 검색)

    ## 기능:
    특정 정책과 관련된 다른 정책들을 그래프 관계를 통해 찾습니다.

    ## Args:
        policy_id (str): 기준 정책 ID
            예: "POLICY_001"

        relationship_type (str, optional): 관계 타입 필터
            예: "SIMILAR_TO", "PREREQUISITE_FOR", "COMBINES_WITH"

        max_depth (int, optional): 그래프 탐색 깊이. Defaults to 2.

    ## Returns:
        List[Dict]: 관련 정책 리스트
            [
                {
                    "policy_id": "POLICY_002",
                    "title": "청년 전세 자금 대출",
                    "relationship": "COMBINES_WITH",
                    "confidence": 0.85
                },
                ...
            ]

    ## Phase:
    Phase 2에서 구현 예정 (Neo4j 연동 후)

    ## TODO:
    - [ ] Neo4j 클라이언트 연동
    - [ ] Cypher 쿼리 작성
    - [ ] 관계 타입 정의 (SIMILAR_TO, PREREQUISITE_FOR 등)
    - [ ] 그래프 시각화 데이터 반환
    """
    logger.warning("⚠️  find_related_policies: Phase 2 feature - Not implemented yet")

    # TODO Phase 2: Neo4j 그래프 검색 구현
    return [{
        "policy_id": policy_id,
        "message": "Phase 2에서 구현 예정",
        "status": "not_implemented"
    }]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MCP Tool 3: 자격 조건 확인
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@mcp.tool()
async def check_eligibility(
    policy_id: str,
    user_profile: Dict[str, Any]
) -> Dict[str, Any]:
    """
    사용자가 특정 정책의 자격 조건을 만족하는지 확인

    ## 기능:
    정책의 자격 조건과 사용자 프로필을 비교하여 적격 여부를 판단합니다.

    ## Args:
        policy_id (str): 확인할 정책 ID

        user_profile (dict): 사용자 프로필
            {
                "age": 25,
                "region": "서울",
                "employment_status": "재직",
                "income": 3000,  # 만원 단위
                "education": "대학 재학"
            }

    ## Returns:
        Dict: 자격 확인 결과
            {
                "eligible": True,
                "policy_id": "POLICY_001",
                "matched_criteria": ["나이", "지역"],
                "failed_criteria": [],
                "confidence": 0.95,
                "explanation": "모든 조건을 충족합니다."
            }

    ## 로직:
    1. policy_id로 정책 정보 조회 (Milvus)
    2. 정책 조건과 user_profile 비교
    3. 각 조건별 매칭 여부 확인
    4. 종합 판단 및 설명 생성

    ## TODO:
    - [ ] 정책별 자격 조건 파싱 로직
    - [ ] 복잡한 조건 처리 (AND/OR 로직)
    - [ ] LLM 기반 조건 해석 (자연어 → 구조화)
    - [ ] 부분 적격 점수 계산
    """
    logger.info(f"📋 Checking eligibility for policy: {policy_id}")

    try:
        # Step 1: 정책 정보 조회
        # TODO: Milvus에서 policy_id로 조회

        # Step 2: 조건 비교 로직 (임시 구현)
        age = user_profile.get("age", 0)

        # 간단한 예시 로직
        if 19 <= age <= 34:
            return {
                "eligible": True,
                "policy_id": policy_id,
                "matched_criteria": ["나이"],
                "failed_criteria": [],
                "confidence": 0.85,
                "explanation": f"{age}세는 청년 정책 대상 연령(19-34세)에 해당합니다."
            }
        else:
            return {
                "eligible": False,
                "policy_id": policy_id,
                "matched_criteria": [],
                "failed_criteria": ["나이"],
                "confidence": 0.95,
                "explanation": f"{age}세는 청년 정책 대상 연령(19-34세)을 벗어납니다."
            }

    except Exception as e:
        logger.error(f"❌ Eligibility check failed: {str(e)}")
        return {
            "eligible": False,
            "error": str(e)
        }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FastMCP 서버 노출
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def get_mcp_server():
    """
    FastMCP 서버 인스턴스 반환

    ## 사용처:
    - LangGraph Agent에서 도구 호출
    - FastAPI 라우터에 마운트

    ## Example:
    ```python
    from app.mcp.tools import get_mcp_server

    mcp_server = get_mcp_server()
    tools = mcp_server.get_tools()
    ```
    """
    return mcp


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 개발/테스트용 코드
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if __name__ == "__main__":
    import asyncio

    async def test_tools():
        """FastMCP 도구 테스트"""

        print("=" * 60)
        print("FastMCP Tools 테스트")
        print("=" * 60)

        # Test 1: 정책 검색
        print("\n[Test 1] 정책 검색")
        results = await search_policies("25세 청년 적금", top_k=3)
        print(f"검색 결과: {len(results)}개")

        # Test 2: 자격 확인
        print("\n[Test 2] 자격 확인")
        eligibility = await check_eligibility(
            policy_id="POLICY_001",
            user_profile={"age": 25, "region": "서울"}
        )
        print(f"적격 여부: {eligibility['eligible']}")

    # asyncio.run(test_tools())
