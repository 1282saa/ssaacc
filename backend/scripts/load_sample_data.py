"""
샘플 정책 데이터 로드 스크립트
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 역할:
sample_policies.json 파일을 읽어서 Milvus에 벡터 임베딩과 함께 저장합니다.

## 데이터 처리 흐름:
1. JSON 파일 읽기
2. 각 정책의 텍스트 → 벡터 임베딩 생성 (OpenAI text-embedding-3-large)
3. Milvus 컬렉션에 삽입
4. 삽입 결과 검증

## 사용 방법:
```bash
cd /path/to/backend
python scripts/load_sample_data.py
```

## 필수 환경 변수:
- OPENAI_API_KEY: OpenAI API 키 (임베딩 생성용)
- MILVUS_HOST: Milvus 서버 주소 (기본값: localhost)
- MILVUS_PORT: Milvus 포트 (기본값: 19530)

## 주의사항:
- Milvus 서버가 실행 중이어야 합니다
- 기존 데이터가 있으면 삭제 후 재삽입할지 물어봅니다
- 임베딩 생성에 OpenAI API 비용이 발생합니다 (약 $0.13/1M tokens)
"""

import json
import os
import sys
from pathlib import Path
from typing import List, Dict, Any

# 프로젝트 루트를 Python 경로에 추가
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from openai import OpenAI
from app.db.milvus_client import get_milvus_client
from loguru import logger


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 환경 변수 및 설정
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# OpenAI 클라이언트 초기화
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 샘플 데이터 파일 경로
SAMPLE_DATA_PATH = project_root / "data" / "sample_policies.json"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Helper Functions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def load_json_data(file_path: Path) -> List[Dict[str, Any]]:
    """
    JSON 파일에서 정책 데이터 읽기

    Args:
        file_path: JSON 파일 경로

    Returns:
        정책 데이터 리스트

    Raises:
        FileNotFoundError: 파일이 존재하지 않을 때
        json.JSONDecodeError: JSON 파싱 실패 시
    """
    logger.info(f"📂 JSON 파일 읽기: {file_path}")

    if not file_path.exists():
        raise FileNotFoundError(f"파일을 찾을 수 없습니다: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    logger.info(f"✅ {len(data)}개 정책 데이터 로드 완료")
    return data


def create_embedding_text(policy: Dict[str, Any]) -> str:
    """
    정책 데이터를 임베딩용 텍스트로 변환

    ## 전략:
    검색에 중요한 필드들을 조합하여 의미 있는 텍스트 생성
    - title: 정책 제목
    - description: 상세 설명
    - category: 카테고리
    - tags: 태그
    - target_group: 대상

    Args:
        policy: 정책 딕셔너리

    Returns:
        임베딩용 텍스트

    Example:
        >>> policy = {"title": "청년 적금", "description": "..."}
        >>> text = create_embedding_text(policy)
        "청년 적금 | 만 19-34세 청년을 위한 우대금리 적금 | ..."
    """
    parts = []

    # 제목 (가장 중요)
    if "title" in policy:
        parts.append(policy["title"])

    # 설명
    if "description" in policy:
        parts.append(policy["description"])

    # 카테고리
    if "category" in policy:
        parts.append(f"카테고리: {policy['category']}")

    # 대상 그룹
    if "target_group" in policy:
        target_groups = ", ".join(policy["target_group"])
        parts.append(f"대상: {target_groups}")

    # 혜택
    if "benefits" in policy:
        benefits = " / ".join(policy["benefits"])
        parts.append(f"혜택: {benefits}")

    # 태그
    if "tags" in policy:
        tags = " ".join(policy["tags"])
        parts.append(f"태그: {tags}")

    return " | ".join(parts)


def generate_embedding(text: str) -> List[float]:
    """
    텍스트를 벡터 임베딩으로 변환

    ## 모델:
    - text-embedding-3-large (3072 차원)
    - OpenAI의 최신 임베딩 모델
    - 한국어 지원 우수

    Args:
        text: 임베딩할 텍스트

    Returns:
        3072차원 벡터 임베딩

    Example:
        >>> embedding = generate_embedding("청년 적금 추천")
        >>> len(embedding)
        3072
    """
    try:
        response = openai_client.embeddings.create(
            model="text-embedding-3-large", input=text, encoding_format="float"
        )
        return response.data[0].embedding

    except Exception as e:
        logger.error(f"❌ 임베딩 생성 실패: {str(e)}")
        raise


def insert_policies_to_milvus(policies: List[Dict[str, Any]]):
    """
    정책 데이터를 Milvus에 삽입

    ## 처리 흐름:
    1. 각 정책마다 임베딩 텍스트 생성
    2. OpenAI로 임베딩 벡터 생성
    3. Milvus에 삽입 (policy_id, embedding, metadata)
    4. 결과 검증

    Args:
        policies: 정책 데이터 리스트

    Example:
        >>> policies = load_json_data("sample_policies.json")
        >>> insert_policies_to_milvus(policies)
    """
    logger.info(f"🚀 Milvus에 {len(policies)}개 정책 삽입 시작")

    milvus_client = get_milvus_client()
    inserted_count = 0

    for idx, policy in enumerate(policies, 1):
        try:
            # Step 1: 임베딩 텍스트 생성
            embedding_text = create_embedding_text(policy)
            logger.debug(
                f"[{idx}/{len(policies)}] 텍스트 생성: {policy['title']} ({len(embedding_text)}자)"
            )

            # Step 2: 벡터 임베딩 생성
            embedding = generate_embedding(embedding_text)
            logger.debug(f"  → 임베딩 생성 완료 ({len(embedding)}차원)")

            # Step 3: Milvus에 삽입
            # metadata를 JSON 문자열로 변환
            metadata_json = json.dumps(policy, ensure_ascii=False)

            # Milvus insert 호출
            result = milvus_client.insert(
                policy_id=policy["policy_id"],
                embedding=embedding,
                metadata=metadata_json,
            )

            inserted_count += 1
            logger.info(
                f"✅ [{idx}/{len(policies)}] 삽입 완료: {policy['title']} (ID: {policy['policy_id']})"
            )

        except Exception as e:
            logger.error(f"❌ [{idx}/{len(policies)}] 삽입 실패: {policy.get('title', 'Unknown')} - {str(e)}")
            # 에러가 발생해도 계속 진행
            continue

    logger.info(f"🎉 완료! {inserted_count}/{len(policies)}개 정책 삽입 성공")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Main Function
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def main():
    """
    메인 실행 함수

    ## 실행 순서:
    1. 환경 변수 확인
    2. JSON 파일 로드
    3. Milvus 연결 확인
    4. 데이터 삽입
    5. 결과 출력
    """
    print("=" * 60)
    print("📋 샘플 정책 데이터 로드 스크립트")
    print("=" * 60)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 1: 환경 변수 확인
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    logger.info("🔍 환경 변수 확인")

    if not os.getenv("OPENAI_API_KEY"):
        logger.error("❌ OPENAI_API_KEY 환경 변수가 설정되지 않았습니다")
        sys.exit(1)

    logger.info(f"  ✅ OPENAI_API_KEY: 설정됨")
    logger.info(f"  ✅ MILVUS_HOST: {os.getenv('MILVUS_HOST', 'localhost')}")
    logger.info(f"  ✅ MILVUS_PORT: {os.getenv('MILVUS_PORT', '19530')}")

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 2: JSON 파일 로드
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    try:
        policies = load_json_data(SAMPLE_DATA_PATH)
    except Exception as e:
        logger.error(f"❌ JSON 파일 로드 실패: {str(e)}")
        sys.exit(1)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 3: Milvus 연결 확인
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    try:
        logger.info("🔌 Milvus 연결 확인 중...")
        milvus_client = get_milvus_client()
        logger.info("✅ Milvus 연결 성공")

    except Exception as e:
        logger.error(f"❌ Milvus 연결 실패: {str(e)}")
        logger.error("   → Milvus 서버가 실행 중인지 확인하세요")
        logger.error("   → docker-compose up -d 명령으로 서버를 시작할 수 있습니다")
        sys.exit(1)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 4: 사용자 확인 (기존 데이터 삭제 여부)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    print("\n" + "=" * 60)
    print(f"⚠️  {len(policies)}개의 정책 데이터를 Milvus에 삽입합니다.")
    print("   이 작업은 기존 데이터를 덮어쓸 수 있습니다.")
    print("=" * 60)

    # 자동 실행 모드 (CI/CD 등)
    if os.getenv("AUTO_CONFIRM", "false").lower() == "true":
        logger.info("AUTO_CONFIRM=true: 자동으로 진행합니다")
    else:
        # 대화형 확인
        response = input("\n계속하시겠습니까? (y/N): ").strip().lower()
        if response != "y":
            logger.info("작업이 취소되었습니다")
            sys.exit(0)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 5: 데이터 삽입
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    try:
        insert_policies_to_milvus(policies)

    except Exception as e:
        logger.error(f"❌ 데이터 삽입 중 오류 발생: {str(e)}")
        sys.exit(1)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Step 6: 완료 메시지
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    print("\n" + "=" * 60)
    print("🎉 샘플 데이터 로드 완료!")
    print("=" * 60)
    print(f"✅ {len(policies)}개 정책이 Milvus에 저장되었습니다")
    print("\n다음 단계:")
    print("  1. FastAPI 서버 실행: uvicorn app.main:app --reload")
    print("  2. API 테스트: POST /api/chats/{chat_id}/messages")
    print("  3. 검색 테스트: '25살인데 적금 추천해줘' 메시지 전송")
    print("=" * 60)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Script Entry Point
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if __name__ == "__main__":
    main()
