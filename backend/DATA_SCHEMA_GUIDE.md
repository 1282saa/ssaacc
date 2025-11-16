# 청년 정책 데이터 입력 가이드

## 📋 테이블 구조

### 1. youth_policies (청년 정책 마스터 데이터)

정책의 기본 정보와 필수 서류를 저장하는 테이블입니다.

#### 필수 필드

| 필드명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| `policy_name` | String(500) | 정책명 | "청년 월세 지원" |
| `filename` | String(255) | 고유 식별자 (중복 불가) | "youth_rent_support_2024.pdf" |
| `full_text` | Text | 정책 전문 | "청년 월세 지원은..." |

#### 기본 정보 필드

| 필드명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| `policy_number` | String(100) | 정책 번호 | "POLICY-2024-001" |
| `region` | String(100) | 지역 | "서울", "전국", "경기" |
| `category` | String(100) | 카테고리 | "주거", "금융", "교육", "취업" |
| `deadline` | String(100) | 신청 마감일 | "2024-12-31", "상시모집" |
| `summary` | Text | 정책 요약 (2-3줄) | "청년들의 주거비 부담을 경감..." |

#### 기간 관련 필드

| 필드명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| `operation_period` | String(200) | 운영 기간 | "2024.01.01 ~ 2024.12.31" |
| `application_period` | String(200) | 신청 기간 | "2024.03.01 ~ 2024.11.30" |
| `support_content` | Text | 지원 내용 | "월 최대 20만원 지원" |
| `support_scale` | String(100) | 지원 규모 | "월 20만원", "최대 300만원" |

#### JSON 필드 (중요!)

##### `application_info` (신청 정보)
```json
{
  "application_url": "https://www.gov.kr/portal/...",
  "submission_method": "온라인",
  "submission_location": "복지로 홈페이지",
  "contact": {
    "phone": "02-1234-5678",
    "email": "support@gov.kr",
    "kakao": "@정책상담"
  },
  "how_to_apply": "복지로 홈페이지 접속 → 로그인 → 신청서 작성 → 서류 제출"
}
```

##### `required_documents` (필수 서류 목록) - **새로 추가됨!**
```json
[
  {
    "id": 1,
    "name": "주민등록등본",
    "description": "최근 1개월 이내 발급",
    "is_required": true,
    "issue_location": "주민센터 또는 정부24",
    "notes": "가족관계 포함"
  },
  {
    "id": 2,
    "name": "임대차계약서 사본",
    "description": null,
    "is_required": true,
    "issue_location": "계약서 원본",
    "notes": null
  },
  {
    "id": 3,
    "name": "소득증명서",
    "description": "최근 3개월",
    "is_required": true,
    "issue_location": "국세청 홈택스",
    "notes": "재직자만 해당"
  }
]
```

##### `eligibility` (자격 조건)
```json
{
  "age": {
    "min": 19,
    "max": 34,
    "description": "만 19세 ~ 34세"
  },
  "region": ["서울", "전국"],
  "income": {
    "type": "중위소득",
    "threshold": "150%",
    "description": "중위소득 150% 이하"
  },
  "employment_status": ["재직자", "구직자"],
  "additional_conditions": [
    "서울시 거주 6개월 이상",
    "무주택 세대원"
  ]
}
```

##### `additional_info` (추가 정보)
```json
{
  "benefits": [
    "월 최대 20만원 임차료 지원",
    "최장 12개월 지원"
  ],
  "restrictions": [
    "1인 1회 한정",
    "타 주거지원 정책과 중복 불가"
  ],
  "tips": [
    "신청 전 자격 확인 필수",
    "서류 미비 시 반려 가능"
  ]
}
```

---

## 🗂️ 데이터 입력 예시 (SQL)

### 예시 1: 청년 월세 지원

```sql
INSERT INTO youth_policies (
  policy_name,
  filename,
  policy_number,
  region,
  category,
  deadline,
  summary,
  full_text,
  operation_period,
  application_period,
  support_content,
  support_scale,
  application_info,
  required_documents,
  eligibility,
  additional_info
) VALUES (
  '청년 월세 지원',
  'youth_rent_support_2024',
  'POLICY-2024-R001',
  '서울',
  '주거',
  '2024-11-30',
  '서울시에 거주하는 청년들의 월세 부담을 경감하기 위한 지원 정책입니다.',
  '청년 월세 지원은 만 19세부터 34세까지의 서울시 거주 청년들에게 월 최대 20만원의 임차료를 지원하는 정책입니다...',
  '2024.01.01 ~ 2024.12.31',
  '2024.03.01 ~ 2024.11.30',
  '월 최대 20만원 임차료 지원 (최장 12개월)',
  '월 20만원',
  '{"application_url": "https://youth.seoul.go.kr", "submission_method": "온라인", "submission_location": "서울시 청년포털", "contact": {"phone": "02-123-4567", "email": "youth@seoul.go.kr"}, "how_to_apply": "서울시 청년포털 접속 → 회원가입 → 신청서 작성 → 서류 업로드"}'::jsonb,
  '[
    {"id": 1, "name": "주민등록등본", "description": "최근 1개월 이내 발급", "is_required": true, "issue_location": "주민센터 또는 정부24"},
    {"id": 2, "name": "임대차계약서 사본", "description": null, "is_required": true, "issue_location": "계약서 원본"},
    {"id": 3, "name": "소득증명서", "description": "최근 3개월", "is_required": true, "issue_location": "국세청 홈택스"}
  ]'::jsonb,
  '{"age": {"min": 19, "max": 34}, "region": ["서울"], "income": {"type": "중위소득", "threshold": "150%"}, "additional_conditions": ["서울시 거주 6개월 이상", "무주택 세대원"]}'::jsonb,
  '{"benefits": ["월 최대 20만원 임차료 지원", "최장 12개월 지원"], "restrictions": ["1인 1회 한정", "타 주거지원 정책과 중복 불가"]}'::jsonb
);
```

---

## 📝 CSV/Excel 템플릿

CSV나 Excel로 데이터를 준비하신다면 아래 형식을 사용하세요:

### 기본 정보 (필수)
| policy_name | filename | region | category | deadline | summary |
|-------------|----------|--------|----------|----------|---------|
| 청년 월세 지원 | youth_rent_2024 | 서울 | 주거 | 2024-11-30 | 월세 부담 경감 |

### JSON 데이터 (별도 시트)

**Sheet: required_documents**
| policy_filename | doc_id | doc_name | description | is_required | issue_location |
|-----------------|--------|----------|-------------|-------------|----------------|
| youth_rent_2024 | 1 | 주민등록등본 | 최근 1개월 이내 | TRUE | 주민센터 |
| youth_rent_2024 | 2 | 임대차계약서 | | TRUE | 계약서 원본 |

**Sheet: application_info**
| policy_filename | application_url | submission_method | phone | email |
|-----------------|-----------------|-------------------|-------|-------|
| youth_rent_2024 | https://... | 온라인 | 02-123-4567 | youth@seoul.go.kr |

---

## 🔧 테이블 업데이트 스크립트

아래 스크립트를 실행하여 `required_documents` 컬럼을 추가하세요:

```sql
-- youth_policies 테이블에 required_documents 컬럼 추가
ALTER TABLE youth_policies
ADD COLUMN IF NOT EXISTS required_documents JSONB;

-- 인덱스 추가 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_youth_policies_required_docs
ON youth_policies USING GIN (required_documents);

-- 기존 데이터에 빈 배열 설정 (필요시)
UPDATE youth_policies
SET required_documents = '[]'::jsonb
WHERE required_documents IS NULL;
```

---

## 📊 Python으로 데이터 입력하기

```python
import psycopg2
import json

conn = psycopg2.connect(
    host="localhost",
    database="finkurn",
    user="postgres",
    password="postgres123"
)
cursor = conn.cursor()

# 정책 데이터
policy_data = {
    "policy_name": "청년 월세 지원",
    "filename": "youth_rent_2024",
    "region": "서울",
    "category": "주거",
    "deadline": "2024-11-30",
    "summary": "월세 부담 경감 지원",
    "full_text": "정책 전문...",
    "support_content": "월 최대 20만원",
    "application_info": {
        "application_url": "https://youth.seoul.go.kr",
        "submission_method": "온라인",
        "contact": {
            "phone": "02-123-4567"
        }
    },
    "required_documents": [
        {
            "id": 1,
            "name": "주민등록등본",
            "description": "최근 1개월 이내",
            "is_required": True,
            "issue_location": "주민센터"
        },
        {
            "id": 2,
            "name": "임대차계약서",
            "is_required": True
        }
    ],
    "eligibility": {
        "age": {"min": 19, "max": 34},
        "region": ["서울"]
    }
}

# 데이터 삽입
cursor.execute("""
    INSERT INTO youth_policies (
        policy_name, filename, region, category, deadline, summary, full_text,
        support_content, application_info, required_documents, eligibility
    ) VALUES (
        %(policy_name)s, %(filename)s, %(region)s, %(category)s, %(deadline)s,
        %(summary)s, %(full_text)s, %(support_content)s,
        %(application_info)s::jsonb, %(required_documents)s::jsonb, %(eligibility)s::jsonb
    )
""", {
    **policy_data,
    "application_info": json.dumps(policy_data["application_info"]),
    "required_documents": json.dumps(policy_data["required_documents"]),
    "eligibility": json.dumps(policy_data["eligibility"])
})

conn.commit()
cursor.close()
conn.close()
```

---

## ✅ 체크리스트

데이터를 입력하기 전에 확인하세요:

- [ ] `required_documents` 컬럼이 테이블에 추가되었는지 확인
- [ ] JSON 데이터가 올바른 형식인지 검증 (https://jsonlint.com)
- [ ] `filename`이 고유한지 확인 (중복 시 에러)
- [ ] 필수 필드 (policy_name, filename, full_text)가 모두 입력되었는지 확인
- [ ] 날짜 형식이 일관적인지 확인 (YYYY-MM-DD 권장)

---

## 🆘 문제 해결

### Q: JSON 형식 오류가 발생해요
A: https://jsonlint.com 에서 JSON 검증 후 입력하세요.

### Q: filename 중복 오류
A: filename은 UNIQUE 제약조건이 있습니다. 고유한 값을 사용하세요.

### Q: 한글이 깨져요
A: 데이터베이스 인코딩을 UTF8로 설정하세요.
```sql
ALTER DATABASE finkurn SET client_encoding TO 'UTF8';
```
