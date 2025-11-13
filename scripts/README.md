# PostgreSQL + pgvector + AWS Bedrock Setup Guide

청년 정책 데이터를 PostgreSQL + pgvector에 로드하고 AWS Bedrock으로 챗봇을 구축하는 가이드입니다.

## 📋 목차

1. [사전 준비](#사전-준비)
2. [데이터 확인](#데이터-확인)
3. [S3 업로드](#s3-업로드)
4. [PostgreSQL 설정](#postgresql-설정)
5. [데이터 로딩](#데이터-로딩)
6. [챗봇 테스트](#챗봇-테스트)

---

## 🔧 사전 준비

### 1. Python 패키지 설치

```bash
cd scripts
pip install -r requirements.txt
```

### 2. PostgreSQL + pgvector 설치

**Option A: Docker (권장)**

```bash
docker run -d \
  --name postgres-pgvector \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=finkurn \
  -p 5432:5432 \
  ankane/pgvector
```

**Option B: 로컬 설치**

```bash
# macOS
brew install postgresql@16
brew install pgvector

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql-16 postgresql-16-pgvector
```

### 3. AWS Credentials 설정

```bash
# AWS CLI 설치
brew install awscli  # macOS
# 또는 pip install awscli

# Credentials 설정
aws configure
# AWS Access Key ID: [입력]
# AWS Secret Access Key: [입력]
# Default region: ap-northeast-2
# Default output format: json
```

**필요한 AWS 권한:**
- `bedrock:InvokeModel` (Claude 3.5 Sonnet, Titan Embeddings V2)
- `s3:PutObject` (S3 업로드용)
- `s3:GetObject` (S3 읽기용)

---

## 📊 데이터 확인

### 데이터 위치
```
ver2/docs/청년/
├── 청년 자산형성 지원(청년도약계좌).txt
├── 청년일자리 도약장려금.txt
├── 청년 주택드림 디딤돌 대출.txt
└── ... (총 24개 파일)
```

### 데이터 구조
각 txt 파일은 다음 정보를 포함:
- 정책명, 지역, 카테고리, 마감일
- 정책 요약 및 상세 설명
- 신청 자격 (나이, 소득, 학력 등)
- 신청 방법 및 웹사이트
- 지원 내용 및 혜택

---

## ☁️ S3 업로드

### 1. S3 버킷 생성 (AWS Console 또는 CLI)

```bash
aws s3 mb s3://finkurn-youth-policies --region ap-northeast-2
```

### 2. txt 파일 업로드

```bash
python3 upload_to_s3.py
```

**입력 예시:**
```
Enter S3 bucket name: finkurn-youth-policies
Enter S3 prefix (default='youth-policies/'): youth-policies/
Enter AWS profile name (press Enter for default):
```

**결과 확인:**
```bash
aws s3 ls s3://finkurn-youth-policies/youth-policies/
```

---

## 🗄️ PostgreSQL 설정

### 1. 데이터베이스 생성

```bash
psql -U postgres
```

```sql
CREATE DATABASE finkurn;
\c finkurn
```

### 2. 스키마 및 테이블 생성

```bash
psql -U postgres -d finkurn -f setup_postgres_schema.sql
```

**생성되는 항목:**
- ✅ `youth_policies` 테이블 (pgvector 컬럼 포함)
- ✅ 인덱스 (HNSW vector index, B-tree indexes)
- ✅ 함수 (`search_policies_by_embedding`, `search_policies_hybrid`)
- ✅ 뷰 (`policy_summary`)

### 3. 스키마 확인

```sql
-- 테이블 구조 확인
\d youth_policies

-- pgvector extension 확인
\dx pgvector

-- 함수 확인
\df search_policies*
```

---

## 📥 데이터 로딩

### 데이터 로딩 스크립트 실행

```bash
python3 load_policies_to_postgres.py
```

**입력 예시:**
```
PostgreSQL host (default: localhost): localhost
PostgreSQL port (default: 5432): 5432
Database name (default: finkurn): finkurn
Username (default: postgres): postgres
Password: yourpassword

AWS profile (press Enter for default):
S3 bucket name (optional): finkurn-youth-policies
S3 prefix (default: youth-policies/): youth-policies/

Proceed with data loading? (y/n): y
```

**처리 과정:**
1. 각 txt 파일 파싱
2. AWS Bedrock Titan Embeddings V2로 1024차원 벡터 생성
3. PostgreSQL에 데이터 + 임베딩 저장
4. 인덱스 자동 생성

**예상 소요 시간:** 약 5-10분 (24개 파일, API 호출 포함)

### 데이터 로딩 확인

```sql
-- 데이터 개수 확인
SELECT COUNT(*) FROM youth_policies;

-- 카테고리별 통계
SELECT category, COUNT(*) FROM youth_policies GROUP BY category;

-- 벡터 임베딩 확인
SELECT policy_name,
       ARRAY_LENGTH(embedding::float[], 1) as vector_dim
FROM youth_policies
LIMIT 5;

-- 샘플 데이터 조회
SELECT * FROM policy_summary LIMIT 5;
```

---

## 🤖 챗봇 테스트

### 대화형 챗봇 실행

```bash
python3 bedrock_chatbot.py
```

**입력 예시:**
```
PostgreSQL host: localhost
PostgreSQL port: 5432
Database name: finkurn
Username: postgres
Password: yourpassword
AWS profile:

👤 You: 25살 청년인데 적금 추천해주세요
🤖 FinKu: [AI 응답...]
```

### Python API 사용 예시

```python
from bedrock_chatbot import BedrockPolicyBot

# 챗봇 초기화
bot = BedrockPolicyBot(
    db_config={
        'host': 'localhost',
        'port': '5432',
        'database': 'finkurn',
        'user': 'postgres',
        'password': 'yourpassword'
    }
)

# 단일 쿼리
result = bot.chat("청년 주거 지원 정책 알려줘")
print(result['response'])

# 대화 히스토리 포함
conversation_history = [
    {'role': 'user', 'content': '안녕하세요'},
    {'role': 'assistant', 'content': '안녕하세요! 어떤 정책을 찾고 계신가요?'}
]
result = bot.chat("서울에 사는 청년 대상 정책", conversation_history=conversation_history)
print(result['response'])

# 검색 결과 확인
for policy in result['retrieved_policies']:
    print(f"- {policy['policy_name']} (유사도: {policy['similarity_score']:.2f})")

bot.close()
```

---

## 🔍 벡터 검색 쿼리 예시

### SQL을 통한 직접 검색

```sql
-- 1. 키워드 기반 검색 (벡터 없이)
SELECT policy_name, category, summary
FROM youth_policies
WHERE policy_name ILIKE '%적금%' OR summary ILIKE '%적금%'
LIMIT 5;

-- 2. 벡터 유사도 검색 (Python에서 임베딩 생성 후)
-- embedding_vector는 Python에서 생성한 벡터
SELECT
    policy_name,
    category,
    1 - (embedding <=> '[0.123, 0.456, ...]'::vector) as similarity
FROM youth_policies
WHERE embedding IS NOT NULL
ORDER BY embedding <=> '[0.123, 0.456, ...]'::vector
LIMIT 5;

-- 3. 저장된 함수 사용
SELECT * FROM search_policies_by_embedding(
    '[0.123, 0.456, ...]'::vector(1024),
    5,  -- limit
    0.7 -- threshold
);
```

---

## 📈 성능 최적화

### 1. HNSW 인덱스 파라미터 조정

```sql
-- 기본 설정 (이미 생성됨)
CREATE INDEX idx_embedding_hnsw ON youth_policies
USING hnsw (embedding vector_cosine_ops);

-- 고성능 설정 (재생성 필요)
DROP INDEX idx_embedding_hnsw;
CREATE INDEX idx_embedding_hnsw ON youth_policies
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

**파라미터 설명:**
- `m`: 연결 수 (기본 16, 높을수록 정확하지만 느림)
- `ef_construction`: 빌드 시 탐색 깊이 (기본 64)

### 2. 쿼리 성능 모니터링

```sql
-- 쿼리 실행 계획 확인
EXPLAIN ANALYZE
SELECT policy_name
FROM youth_policies
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 5;

-- 인덱스 사용 통계
SELECT * FROM pg_stat_user_indexes
WHERE indexrelname = 'idx_embedding_hnsw';
```

---

## 🚀 프로덕션 배포

### AWS RDS PostgreSQL 사용

```bash
# RDS 인스턴스 생성 (AWS Console 또는 CLI)
aws rds create-db-instance \
    --db-instance-identifier finkurn-postgres \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 16.1 \
    --master-username admin \
    --master-user-password yourpassword \
    --allocated-storage 20 \
    --publicly-accessible \
    --region ap-northeast-2

# pgvector extension 설치 (RDS Console에서 Parameter Group 설정)
```

### 환경 변수 설정

```bash
# .env 파일 생성
cat > .env << EOF
DB_HOST=your-rds-endpoint.ap-northeast-2.rds.amazonaws.com
DB_PORT=5432
DB_NAME=finkurn
DB_USER=admin
DB_PASSWORD=yourpassword

AWS_REGION=ap-northeast-2
S3_BUCKET=finkurn-youth-policies
S3_PREFIX=youth-policies/
EOF
```

### Python 스크립트 수정

```python
# .env 파일 사용
from dotenv import load_dotenv
import os

load_dotenv()

db_config = {
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT'),
    'database': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}
```

---

## ❓ 문제 해결

### pgvector extension을 찾을 수 없음

```sql
-- pgvector 설치 확인
SELECT * FROM pg_available_extensions WHERE name = 'vector';

-- 없으면 설치 (Docker 이미지 사용 권장)
docker pull ankane/pgvector
```

### AWS Bedrock 권한 오류

```bash
# IAM 정책 확인
aws iam get-user-policy --user-name your-username --policy-name BedrockAccess

# 필요한 권한 추가
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "*"
    }
  ]
}
```

### 벡터 검색 속도가 느림

```sql
-- 인덱스 재생성
REINDEX INDEX idx_embedding_hnsw;

-- VACUUM ANALYZE 실행
VACUUM ANALYZE youth_policies;

-- 통계 업데이트
ANALYZE youth_policies;
```

---

## 📚 참고 자료

- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Claude 3.5 Sonnet API](https://docs.anthropic.com/claude/reference/messages)
- [PostgreSQL HNSW Index](https://github.com/pgvector/pgvector#hnsw)

---

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. PostgreSQL 연결: `psql -U postgres -d finkurn`
2. AWS credentials: `aws sts get-caller-identity`
3. Python 패키지: `pip list | grep -E 'boto3|psycopg2|pgvector'`
4. 로그 확인: 각 스크립트의 에러 메시지 참고

---

**Made with ❤️ for Korean Youth**
