# FinKuRN 프로젝트 개발 가이드

## 프로젝트 개요

**FinKuRN**은 AI를 활용한 청년 맞춤형 금융 정책 추천 서비스입니다.

### 핵심 가치
- 청년의 금융 정보 접근 불평등 해소
- AI 기반 개인화된 금융 정책 큐레이션
- 간편한 소셜 로그인과 선택적 개인정보 수집

### 수익 모델
1. **핀큐패스 구독**: 월 3,900-4,900원 개인 맞춤 AI 금융 코칭
2. **제휴 배너**: AI 기반 맞춤 금융상품 추천 수수료
3. **데이터 리포트**: 익명화된 청년 금융 트렌드 분석 판매

## 기술 스택

### Frontend (React Native)
- React Native + TypeScript
- Expo 프레임워크
- React Navigation
- 소셜 로그인: 카카오/네이버/구글

### Backend (FastAPI + uv)
- Python 3.11 + uv 패키지 관리
- FastAPI 웹 프레임워크
- PostgreSQL/SQLite 데이터베이스
- SQLAlchemy ORM
- JWT 인증
- Anthropic Claude API (AI 챗봇)

### 인프라
- Docker 컨테이너 배포
- AWS/GCP (추후 결정)

## 개발 지침

### 1. 코드 작성 규칙
- **모든 코드에 이모지 사용 금지**
- **불필요한 주석 작성 금지**
- 코드는 명확하고 자체 문서화되도록 작성
- 함수명과 변수명은 의도를 명확히 표현
- 타입 힌트 필수 사용 (Python)

### 2. 작업 진행 규칙 (필수)
- **각 TODO 항목 완료 시마다 반드시 커밋**
- **커밋 전 CLAUDE.md 파일에 완료 항목 `[x]` 체크 표시**
- 커밋 메시지 형식: `feat: [기능명] 구현`
- **각 작업 완료 후 구조 설명을 CLAUDE.md에 반영**
- 모든 변경사항은 단계별로 커밋 (한 번에 여러 기능 커밋 금지)

### 3. 진행 상황 추적 (필수)
- **다른 세션에서도 진행 상황 파악 가능하도록 체크리스트 실시간 업데이트**
- **각 Phase 완료 시점에 진행률을 CLAUDE.md에 기록**
- **블로킹 이슈 발생 시 즉시 CLAUDE.md에 문서화**
- **작업 시작 전 현재 진행 상황을 CLAUDE.md에서 확인**

### 4. Git 관리
- main 브랜치: 안정화된 코드
- feature/ 브랜치: 기능 개발
- 현재 작업 브랜치: `feature/user-management-api`

## 개발 로드맵

### Phase 1: 사용자 관리 시스템 구축
**목표**: 회원가입/로그인/온보딩 완성

#### Backend 개발
- [ ] uv 환경 설정 및 의존성 관리
- [ ] 데이터베이스 스키마 설계
- [ ] 사용자 모델 구현 (SQLAlchemy)
- [ ] JWT 인증 시스템 구현
- [ ] 회원가입 API 엔드포인트
- [ ] 로그인 API 엔드포인트
- [ ] 소셜 로그인 API (카카오 우선)
- [ ] 온보딩 API (단계별 정보 수집)
- [ ] 사용자 프로필 관리 API

#### Frontend 연동
- [ ] 소셜 로그인 라이브러리 연동
- [ ] 기존 UI와 새 API 연결
- [ ] 온보딩 플로우 개선 (선택적 입력)
- [ ] 사용자 상태 관리 (Context/Redux)

#### 예상 완료: 2-3주

### Phase 2: AI 챗봇 개인화
**목표**: 사용자 컨텍스트 기반 맞춤 응답

- [ ] 기존 AI 챗봇에 사용자 정보 연동
- [ ] 개인화된 프롬프트 설계
- [ ] 채팅 히스토리 저장/관리
- [ ] 정책 추천 정확도 개선

#### 예상 완료: 1-2주

### Phase 3: 수익화 모델 구현
**목표**: 핀큐패스 구독 시스템

- [ ] 구독 결제 시스템
- [ ] 프리미엄 기능 제한 로직
- [ ] 사용량 추적 및 분석
- [ ] 제휴 배너 시스템

#### 예상 완료: 2-3주

## 데이터베이스 설계

### 사용자 관리
```sql
-- 기본 사용자 정보
users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- 소셜 로그인 연동
user_social_accounts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    provider VARCHAR(50), -- 'kakao', 'naver', 'google'
    provider_id VARCHAR(255),
    provider_email VARCHAR(255),
    created_at TIMESTAMP,
    UNIQUE(provider, provider_id)
)

-- 사용자 프로필 (온보딩 정보)
user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    age INTEGER, -- 필수
    region VARCHAR(100), -- 필수
    job_category VARCHAR(50), -- 선택적
    income_range VARCHAR(50), -- 선택적
    goals TEXT[], -- 선택적
    onboarding_completed BOOLEAN DEFAULT false,
    profile_completion_rate INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- 사용자 동의 정보
user_consents (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    push_notification BOOLEAN DEFAULT false,
    marketing_notification BOOLEAN DEFAULT false,
    reward_program BOOLEAN DEFAULT false,
    privacy_policy BOOLEAN DEFAULT false, -- 필수
    terms_of_service BOOLEAN DEFAULT false, -- 필수
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

## API 설계

### 인증 관련
```
POST /api/auth/register          # 이메일 회원가입
POST /api/auth/login             # 이메일 로그인
POST /api/auth/social-login      # 소셜 로그인/회원가입
POST /api/auth/refresh           # 토큰 갱신
POST /api/auth/logout            # 로그아웃
```

### 사용자 관리
```
GET  /api/users/me               # 내 정보 조회
PUT  /api/users/me               # 내 정보 수정
DELETE /api/users/me             # 회원 탈퇴
```

### 온보딩
```
POST /api/onboarding/goals       # 목표 선택 (1단계)
POST /api/onboarding/profile     # 기본 정보 (2단계)
POST /api/onboarding/consent     # 동의 사항 (3단계)
GET  /api/onboarding/status      # 온보딩 진행 상태
```

### AI 챗봇
```
POST /api/chat/messages          # 메시지 전송 (사용자 컨텍스트 포함)
GET  /api/chat/history           # 채팅 히스토리 조회
```

## 현재 진행 상황

### 완료된 작업
- [x] 프로젝트 구조 분석
- [x] 요구사항 정의 및 비교 분석
- [x] 백엔드 API 설계
- [x] 데이터베이스 스키마 설계
- [x] 개발 우선순위 수립

### 현재 작업 중
- [ ] 기존 backend 구조에 uv 적용 및 환경 설정

### 다음 단계
1. uv 프로젝트 초기화 및 의존성 설정
2. 사용자 관리 데이터베이스 구현
3. JWT 인증 시스템 구현
4. 회원가입/로그인 API 구현

## 개발 환경

### 필수 도구
- Python 3.11+
- uv (패키지 관리)
- Docker & Docker Compose
- PostgreSQL (프로덕션) / SQLite (개발)
- Git

### 환경 변수 (.env)
```
# Database
DATABASE_URL=sqlite:///./finkurn.db  # 개발용
# DATABASE_URL=postgresql://user:pass@localhost/finkurn  # 프로덕션용

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI
ANTHROPIC_API_KEY=sk-ant-api03-your-key

# OAuth
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Git Ignore 설정

```gitignore
# Claude Code 관련
.claude/
claude-*
.claude_history
*claude*

# Python
__pycache__/
*.py[cod]
*.so
.Python
*.egg-info/
dist/
build/

# Virtual Environment
.venv/
venv/
.env

# Database
*.db
*.sqlite3

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# uv
uv.lock
```

## 프로젝트 실행

### 개발 환경 설정
```bash
# 저장소 클론 후
cd ssaacc/backend

# uv 설치 (macOS)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 의존성 설치
uv sync

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집

# 데이터베이스 마이그레이션
uv run alembic upgrade head

# 개발 서버 실행
uv run uvicorn app.main:app --reload
```

### 프론트엔드 실행
```bash
cd ssaacc/FinKuRN

# 의존성 설치
npm install

# Expo 개발 서버 실행
npm start
```

---

**최종 업데이트**: 2024-11-11
**현재 브랜치**: feature/user-management-api
**진행률**: Phase 1 시작 단계