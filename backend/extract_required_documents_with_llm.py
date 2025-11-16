"""
LLM을 사용하여 청년 정책의 필요 서류 추출

youth_policies_all.json 파일에서 각 정책의 full_text를 분석하여
필요 서류 목록을 추출하고 데이터베이스에 업데이트합니다.
"""

import json
import os
import psycopg2
from anthropic import Anthropic

# Anthropic API 클라이언트 초기화
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# 데이터베이스 연결
conn = psycopg2.connect(
    dbname="finkurn",
    user="postgres",
    password="postgres123",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

def extract_documents_with_llm(policy_name: str, full_text: str) -> list:
    """
    LLM을 사용하여 정책 텍스트에서 필요 서류 추출

    Args:
        policy_name: 정책명
        full_text: 정책 전체 텍스트

    Returns:
        필요 서류 목록 (JSON 배열)
    """
    prompt = f"""다음은 "{policy_name}" 청년 정책의 상세 정보입니다.

{full_text}

위 텍스트에서 신청 시 필요한 서류, 제출 서류, 구비 서류 등을 모두 찾아서 JSON 배열로 정리해주세요.

각 서류는 다음 형식으로 작성해주세요:
{{
  "id": 1,
  "name": "서류명",
  "description": "발급 요건이나 주의사항 (예: 최근 3개월 이내 발급)",
  "is_required": true 또는 false,
  "issue_location": "발급처 (예: 주민센터, 정부24, 국세청 홈택스 등)",
  "notes": "추가 참고사항"
}}

주의사항:
1. description, issue_location, notes는 텍스트에 명시된 경우만 포함하세요
2. 필수 서류는 is_required: true, 선택 서류는 false로 설정하세요
3. 서류가 전혀 언급되지 않았다면 빈 배열 []을 반환하세요
4. JSON 배열만 반환하고 다른 설명은 포함하지 마세요

예시:
[
  {{
    "id": 1,
    "name": "주민등록등본",
    "description": "최근 1개월 이내 발급",
    "is_required": true,
    "issue_location": "주민센터 또는 정부24",
    "notes": "가족관계 포함"
  }},
  {{
    "id": 2,
    "name": "임대차계약서 사본",
    "is_required": true
  }}
]"""

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        response_text = message.content[0].text.strip()

        # JSON 배열 추출 (```json ``` 마크다운 제거)
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()

        # JSON 파싱
        documents = json.loads(response_text)

        return documents

    except Exception as e:
        print(f"  ❌ LLM 추출 실패: {e}")
        return []


def update_policy_documents(policy_id: int, documents: list):
    """
    데이터베이스에 필요 서류 업데이트

    Args:
        policy_id: 정책 ID
        documents: 필요 서류 목록
    """
    try:
        cursor.execute(
            """
            UPDATE youth_policies
            SET required_documents = %s::jsonb
            WHERE id = %s
            """,
            (json.dumps(documents, ensure_ascii=False), policy_id)
        )
        conn.commit()
        print(f"  ✅ 데이터베이스 업데이트 완료 ({len(documents)}개 서류)")

    except Exception as e:
        print(f"  ❌ 데이터베이스 업데이트 실패: {e}")
        conn.rollback()


def main():
    """메인 실행 함수"""

    # JSON 파일 로드
    json_file = "/Users/yeong-gwang/Documents/배움 오전 1.38.42/외부/공모전/새싹ai/개발/ver3/backend/youth_policies_all.json"

    print(f"📂 JSON 파일 로드 중: {json_file}")
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    policies = data.get('policies', [])
    print(f"✅ {len(policies)}개 정책 로드 완료\n")

    # 각 정책에 대해 LLM으로 서류 추출
    for idx, policy in enumerate(policies, 1):
        policy_id = policy.get('id')
        policy_name = policy.get('policy_name', 'Unknown')
        full_text = policy.get('full_text', '')

        print(f"[{idx}/{len(policies)}] {policy_name} (ID: {policy_id})")

        if not full_text:
            print("  ⚠️  full_text 없음, 건너뜀\n")
            continue

        # LLM으로 서류 추출
        print("  🤖 LLM으로 필요 서류 추출 중...")
        documents = extract_documents_with_llm(policy_name, full_text)

        if documents:
            print(f"  📋 추출된 서류:")
            for doc in documents:
                required_mark = "✓" if doc.get('is_required', True) else "○"
                print(f"     {required_mark} {doc.get('name')}")

            # 데이터베이스 업데이트
            update_policy_documents(policy_id, documents)
        else:
            print("  ⚠️  추출된 서류 없음")

        print()  # 빈 줄

    print("\n✅ 모든 정책 처리 완료!")

    # 통계 출력
    cursor.execute("""
        SELECT
            COUNT(*) as total,
            COUNT(CASE WHEN required_documents IS NOT NULL
                       AND jsonb_array_length(required_documents) > 0
                  THEN 1 END) as with_docs
        FROM youth_policies
    """)
    total, with_docs = cursor.fetchone()
    print(f"\n📊 최종 통계:")
    print(f"   전체 정책: {total}개")
    print(f"   서류 있음: {with_docs}개 ({with_docs/total*100:.1f}%)")

    cursor.close()
    conn.close()


if __name__ == "__main__":
    main()
