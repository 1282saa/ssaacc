#!/usr/bin/env python3
"""
Milvus Mock Data Loader
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

목업 정책 데이터를 Milvus에 로드하는 스크립트

## 기능:
1. data/mock_policies.json 파일 읽기
2. 각 정책에 대해 AWS Bedrock Titan Embeddings 생성
3. Milvus에 정책 데이터 삽입
4. 로드 결과 검증

## 사용법:
```bash
# 프로젝트 루트에서 실행
python scripts/load_mock_data.py

# 또는 Docker 컨테이너 내부에서
docker exec -it finkurn-backend python scripts/load_mock_data.py
```
"""

import asyncio
import json
import os
import sys
from pathlib import Path
from typing import List, Dict, Any

# 프로젝트 루트를 sys.path에 추가
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from loguru import logger
from app.db.milvus_client import get_milvus_client, init_milvus
from app.llm_config import get_embeddings


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 설정
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 목업 데이터 파일 경로
MOCK_DATA_PATH = project_root / "data" / "mock_policies.json"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Helper Functions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def load_mock_policies() -> List[Dict[str, Any]]:
    """
    목업 정책 데이터 로드

    Returns:
        List[Dict]: 정책 리스트
    """
    if not MOCK_DATA_PATH.exists():
        raise FileNotFoundError(f"Mock data file not found: {MOCK_DATA_PATH}")

    with open(MOCK_DATA_PATH, "r", encoding="utf-8") as f:
        policies = json.load(f)

    logger.info(f"📂 Loaded {len(policies)} policies from {MOCK_DATA_PATH}")
    return policies


def create_embedding_text(policy: Dict[str, Any]) -> str:
    """
    정책 데이터를 임베딩 생성에 적합한 텍스트로 변환

    ## 전략:
    - 제목, 설명, 카테고리, 연령대, 지역, 혜택을 하나의 텍스트로 결합
    - 중요한 정보가 앞쪽에 오도록 배치

    Args:
        policy: 정책 데이터

    Returns:
        str: 임베딩용 텍스트
    """
    parts = [
        f"제목: {policy.get('title', '')}",
        f"카테고리: {policy.get('category', '')}",
        f"연령대: {policy.get('age_range', '')}",
        f"지역: {policy.get('region', '전국')}",
        f"설명: {policy.get('description', '')}",
    ]

    # 혜택 추가
    benefits = policy.get("benefits", [])
    if benefits:
        parts.append(f"혜택: {', '.join(benefits)}")

    return " | ".join(parts)


async def generate_embeddings_batch(
    texts: List[str],
    embeddings_model
) -> List[List[float]]:
    """
    여러 텍스트에 대한 임베딩 일괄 생성

    Args:
        texts: 임베딩할 텍스트 리스트
        embeddings_model: LangChain Embeddings 모델

    Returns:
        List[List[float]]: 임베딩 벡터 리스트
    """
    logger.info(f"🔄 Generating embeddings for {len(texts)} policies...")

    # LangChain의 embed_documents는 여러 텍스트를 한 번에 처리
    embeddings = embeddings_model.embed_documents(texts)

    logger.info(f"✅ Generated {len(embeddings)} embeddings (dimension: {len(embeddings[0])})")
    return embeddings


async def insert_to_milvus(
    policies: List[Dict[str, Any]],
    embeddings: List[List[float]]
) -> int:
    """
    정책 데이터와 임베딩을 Milvus에 삽입

    Args:
        policies: 정책 데이터 리스트
        embeddings: 임베딩 벡터 리스트

    Returns:
        int: 삽입된 레코드 수
    """
    if len(policies) != len(embeddings):
        raise ValueError(f"Policies count ({len(policies)}) != Embeddings count ({len(embeddings)})")

    milvus_client = get_milvus_client()

    # Milvus 삽입 데이터 준비
    policy_ids = []
    metadata_list = []

    for policy in policies:
        policy_ids.append(policy["policy_id"])
        # metadata를 JSON 문자열로 직렬화
        metadata_json = json.dumps(policy, ensure_ascii=False)
        metadata_list.append(metadata_json)

    logger.info(f"💾 Inserting {len(policy_ids)} records into Milvus...")

    # Milvus에 삽입 (insert_embeddings 메서드 사용)
    insert_result = milvus_client.insert_embeddings(
        policy_ids=policy_ids,
        embeddings=embeddings,
        metadata=metadata_list
    )

    logger.info(f"✅ Inserted {len(policy_ids)} records into Milvus")
    return len(policy_ids)


async def verify_data() -> Dict[str, Any]:
    """
    Milvus에 로드된 데이터 검증

    Returns:
        Dict: 검증 결과
    """
    milvus_client = get_milvus_client()
    count = milvus_client.count()

    logger.info(f"📊 Milvus Statistics:")
    logger.info(f"  - Total entities: {count}")

    return {"row_count": count}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Main Function
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


async def main():
    """
    메인 실행 함수
    """
    logger.info("=" * 60)
    logger.info("🚀 Milvus Mock Data Loader")
    logger.info("=" * 60)

    try:
        # Step 1: Milvus 초기화
        logger.info("\n[Step 1] Milvus 초기화")
        await init_milvus()

        # Step 2: 목업 데이터 로드
        logger.info("\n[Step 2] 목업 정책 데이터 로드")
        policies = load_mock_policies()

        # Step 3: 임베딩 모델 초기화
        logger.info("\n[Step 3] 임베딩 모델 초기화")
        embeddings_model = get_embeddings()

        # Step 4: 임베딩 텍스트 생성
        logger.info("\n[Step 4] 임베딩 텍스트 생성")
        embedding_texts = [create_embedding_text(policy) for policy in policies]

        # 첫 번째 정책의 임베딩 텍스트 출력 (확인용)
        logger.debug(f"Example embedding text:\n{embedding_texts[0][:200]}...")

        # Step 5: 임베딩 생성
        logger.info("\n[Step 5] 임베딩 생성")
        embeddings = await generate_embeddings_batch(embedding_texts, embeddings_model)

        # Step 6: Milvus에 삽입
        logger.info("\n[Step 6] Milvus에 데이터 삽입")
        insert_count = await insert_to_milvus(policies, embeddings)

        # Step 7: 검증
        logger.info("\n[Step 7] 데이터 검증")
        stats = await verify_data()

        # 완료
        logger.info("\n" + "=" * 60)
        logger.info("✅ Mock Data Loading Completed Successfully!")
        logger.info(f"📊 Total policies loaded: {insert_count}")
        logger.info(f"📊 Milvus row count: {stats.get('row_count', 0)}")
        logger.info("=" * 60)

    except Exception as e:
        logger.error(f"\n❌ Error during data loading: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
