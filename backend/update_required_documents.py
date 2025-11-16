"""
GPT로부터 추출한 required_documents 데이터를 데이터베이스에 업데이트

사용법:
1. GPT가 제공한 JSON 데이터를 prepared_documents.json 파일로 저장
2. 이 스크립트 실행: python update_required_documents.py
"""

import json
import psycopg2

# 데이터베이스 연결
conn = psycopg2.connect(
    dbname="finkurn",
    user="postgres",
    password="postgres123",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

# GPT가 제공한 데이터 (2개 파일 합친 것)
gpt_data = {
    "policies": [
        {
            "id": 1,
            "policy_name": "(국민연금) 실업크레딧 지원",
            "required_documents": [
                {"name": "신분증"},
                {"name": "구직급여 수급 증명서류"},
                {"name": "필요 서류는 고용센터 문의"}
            ]
        },
        {
            "id": 2,
            "policy_name": "고용보험 미적용자 출산급여 지원",
            "required_documents": [
                {"name": "고용보험 미적용자 출산급여 신청서"},
                {"name": "주민등록표 등본", "description": "출산 자녀가 등록된"},
                {"name": "소득활동 증빙자료", "description": "출산 전 18개월 중 3개월 이상"},
                {"name": "유형별 추가 서류", "description": "고용센터에서 안내"}
            ]
        },
        {
            "id": 3,
            "policy_name": "고용유지지원금",
            "required_documents": [
                {"name": "고용유지조치계획서"},
                {"name": "매출액 증빙서류", "description": "장부, 세금계산서 등"},
                {"name": "노사협의 증빙서류"},
                {"name": "취업규칙 또는 단체협약"},
                {"name": "지원금 신청서", "notes": "실시종료 후 제출"}
            ]
        },
        {
            "id": 4,
            "policy_name": "구직급여",
            "required_documents": [
                {"name": "신분증"},
                {"name": "거주지 관할 고용센터 방문시 별도 안내"}
            ]
        },
        {
            "id": 5,
            "policy_name": "기후동행카드 청년할인 서비스",
            "required_documents": [
                {"name": "티머니 홈페이지 가입", "description": "본인 연령 인증 필수"}
            ]
        },
        {
            "id": 6,
            "policy_name": "미혼청년 주거급여 분리지급",
            "required_documents": [
                {"name": "신청서"},
                {"name": "금융정보 등 제공 동의서"},
                {"name": "임대차 계약서", "notes": "해당자에 한함"}
            ]
        },
        {
            "id": 7,
            "policy_name": "빈곤 청년에 대한 근로인센티브 확대",
            "required_documents": [
                {"name": "사회보장급여 신청(변경)서"},
                {"name": "금융정보 등 제공 동의서"},
                {"name": "기타 구비서류"}
            ]
        },
        {
            "id": 8,
            "policy_name": "서울시 고립·은둔청년 지원사업",
            "required_documents": [
                {"name": "신분증"},
                {"name": "필요 서류는 서울청년기지개센터 문의"}
            ]
        },
        {
            "id": 9,
            "policy_name": "예술인 고용보험",
            "required_documents": [
                {"name": "피보험자격 취득·상실신고서"},
                {"name": "노무제공내용확인신고서"},
                {"name": "문화예술용역 계약서"}
            ]
        },
        {
            "id": 10,
            "policy_name": "자립준비청년 의료비 지원 사업",
            "required_documents": [
                {"name": "자립준비청년 의료비 지원 신청서"},
                {"name": "신분증"},
                {"name": "보호종료확인서"}
            ]
        },
        {
            "id": 11,
            "policy_name": "자립준비청년 자립수당 지원",
            "required_documents": [
                {"name": "신청서"},
                {"name": "신분증"},
                {"name": "보호종료 확인서류"}
            ]
        },
        {
            "id": 12,
            "policy_name": "자립준비청년 자립지원 사업",
            "required_documents": [
                {"name": "신분증"},
                {"name": "필요 서류는 해당 기관 문의"}
            ]
        },
        {
            "id": 13,
            "policy_name": "제대군인 전직지원금",
            "required_documents": [
                {"name": "전직지원금지급신청서"},
                {"name": "개인정보 이용·제공 사전 동의서"},
                {"name": "구직활동 증명서류", "notes": "매월 1회 이상, 해당자에 한함"}
            ]
        },
        {
            "id": 14,
            "policy_name": "조기재취업수당",
            "required_documents": [
                {"name": "조기재취업수당 청구서"},
                {"name": "수급자격증"},
                {"name": "재직증명서 또는 근로계약서", "description": "12개월 이상 고용 증명"}
            ]
        },
        {
            "id": 15,
            "policy_name": "청년 국가기술자격시험 응시료 지원사업",
            "required_documents": [
                {"name": "신분증"},
                {"name": "온라인 원서접수 시 자동 적용"}
            ]
        },
        {
            "id": 16,
            "policy_name": "청년 자산형성 지원(청년도약계좌)",
            "required_documents": [
                {"name": "신분증"},
                {"name": "취급은행 앱을 통한 온라인 신청"}
            ]
        },
        {
            "id": 17,
            "policy_name": "청년 주택드림 디딤돌 대출",
            "required_documents": [
                {"name": "주민등록증", "description": "운전면허증, 여권 중 택1"},
                {"name": "주민등록등본", "description": "1개월 이내 발급분"},
                {"name": "소득증명서류", "description": "소득구분별 서류"},
                {"name": "분양계약서"},
                {"name": "청약통장 거래내역서"}
            ]
        },
        {
            "id": 18,
            "policy_name": "청년도전지원사업",
            "required_documents": [
                {"name": "신분증"},
                {"name": "통장사본"},
                {"name": "개인정보 동의서"}
            ]
        },
        {
            "id": 19,
            "policy_name": "청년안심주택 공급(매입)",
            "required_documents": [
                {"name": "신분증"},
                {"name": "필요 서류는 SH공사 문의"}
            ]
        },
        {
            "id": 20,
            "policy_name": "청년안심주택 공급활성화(임차보증금 무이자지원)",
            "required_documents": [
                {"name": "임대차계약서"},
                {"name": "소득 증빙서류"},
                {"name": "자산 증빙서류"}
            ]
        },
        {
            "id": 21,
            "policy_name": "청년일자리 도약장려금",
            "required_documents": [
                {"name": "사업자등록증"},
                {"name": "고용보험 가입확인서"},
                {"name": "임금대장"},
                {"name": "근로계약서"}
            ]
        },
        {
            "id": 22,
            "policy_name": "청년주택드림청약통장",
            "required_documents": [
                {"name": "신분증"},
                {"name": "소득증명서류", "description": "직전년도 신고소득 확인"},
                {"name": "무주택 확인서류"}
            ]
        },
        {
            "id": 23,
            "policy_name": "취업지원대상자 취업능력개발비용 지원(국가보훈부)",
            "required_documents": [
                {"name": "취업능력개발 비용 지원 신청 및 확인서"},
                {"name": "수강료 영수증"},
                {"name": "서약서"},
                {"name": "수강완료 증빙서류"},
                {"name": "응시확인서류", "description": "시험일이 경과한 응시표, 성적표, 합격증 등"}
            ]
        }
    ]
}


def normalize_document(doc, doc_id):
    """
    서류 데이터를 표준 형식으로 변환

    Args:
        doc: 원본 서류 데이터
        doc_id: 서류 ID

    Returns:
        표준화된 서류 데이터
    """
    normalized = {
        "id": doc_id,
        "name": doc.get("name", ""),
        "is_required": doc.get("is_required", True)  # 기본값: 필수
    }

    # 선택 필드들 추가 (값이 있는 경우만)
    if "description" in doc and doc["description"]:
        normalized["description"] = doc["description"]

    if "issue_location" in doc and doc["issue_location"]:
        normalized["issue_location"] = doc["issue_location"]

    if "notes" in doc and doc["notes"]:
        normalized["notes"] = doc["notes"]

    return normalized


def update_policy_documents(policy_id, policy_name, documents):
    """
    정책의 required_documents 업데이트

    Args:
        policy_id: 정책 ID
        policy_name: 정책명
        documents: 서류 목록
    """
    try:
        # ID 추가 및 표준화
        normalized_docs = [
            normalize_document(doc, idx + 1)
            for idx, doc in enumerate(documents)
        ]

        # 데이터베이스 업데이트
        cursor.execute(
            """
            UPDATE youth_policies
            SET required_documents = %s::jsonb
            WHERE id = %s
            """,
            (json.dumps(normalized_docs, ensure_ascii=False), policy_id)
        )

        print(f"✅ [{policy_id}] {policy_name} - {len(normalized_docs)}개 서류 업데이트")

    except Exception as e:
        print(f"❌ [{policy_id}] {policy_name} - 업데이트 실패: {e}")
        conn.rollback()
        raise


def main():
    """메인 실행 함수"""

    print("=" * 80)
    print("📋 Required Documents 데이터 업데이트")
    print("=" * 80)
    print()

    policies = gpt_data["policies"]
    success_count = 0
    error_count = 0

    for policy in policies:
        policy_id = policy["id"]
        policy_name = policy["policy_name"]
        documents = policy.get("required_documents", [])

        try:
            update_policy_documents(policy_id, policy_name, documents)
            success_count += 1
        except Exception as e:
            print(f"   오류: {e}")
            error_count += 1

    # 커밋
    conn.commit()

    print()
    print("=" * 80)
    print(f"📊 업데이트 완료")
    print(f"   성공: {success_count}개")
    print(f"   실패: {error_count}개")
    print("=" * 80)

    # 최종 통계
    cursor.execute("""
        SELECT
            COUNT(*) as total,
            COUNT(CASE WHEN required_documents IS NOT NULL
                       AND jsonb_array_length(required_documents) > 0
                  THEN 1 END) as with_docs
        FROM youth_policies
    """)
    total, with_docs = cursor.fetchone()

    print()
    print("📈 전체 통계:")
    print(f"   전체 정책: {total}개")
    print(f"   서류 있음: {with_docs}개 ({with_docs/total*100:.1f}%)")
    print(f"   서류 없음: {total - with_docs}개")

    cursor.close()
    conn.close()


if __name__ == "__main__":
    main()
