# FinKuRN Backend - AI Chatbot Server

> FastAPI + LangGraph + FastMCP 기반 금융 챗봇 백엔드 서버

**최종 업데이트**: 2025-01-05
**버전**: 1.0.0-MVP
**개발 기간 예상**: 1-2주

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [아키텍처](#아키텍처)
3. [기술 스택](#기술-스택)
4. [폴더 구조](#폴더-구조)
5. [시작하기](#시작하기)
6. [개발 가이드](#개발-가이드)
7. [배포](#배포)
8. [비용](#비용)

---

## 프로젝트 개요

### 목표
React Native 앱(FinKuRN)에 AI 챗봇 기능을 제공하는 백엔드 서버 구축

### 주요 기능
- ✅ 자연어로 금융 정책 검색
- ✅ 사용자 자격 조건 자동 확인
- ✅ 관련 정책 추천
- ✅ 실시간 대화형 응답

### MVP 범위 (Phase 1)
```
Phase 1 (1주): 기본 챗봇
├── Supervisor Agent (질문 분석)
├── Policy Search Agent (정책 검색)
└── Response Generator (응답 생성)

Phase 2 (1주): 관계 검색
├── Neo4j 그래프 추가
└── Cypher Agent (관련 정책 찾기)

Phase 3 (나중): 감성 기능
├── Empathy Agent (공감)
└── Reflection Agent (성찰)
```

---

## 아키텍처

### 전체 시스템 구조

```
┌─────────────────────────────────────────────────┐
│  React Native (FinKuRN)                         │
│  - chatService.ts                               │
└──────────────┬──────────────────────────────────┘
               │ HTTPS
┌──────────────▼──────────────────────────────────┐
│  FastAPI Server (Port 8000)                     │
│  POST /api/chats/{chatId}/messages              │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│  LangGraph Workflow Engine                      │
│  ┌─────────────────────────────────────────┐   │
│  │  1. Supervisor Agent                    │   │
│  │     "사용자가 뭘 원하지?"               │   │
│  │     ↓                                   │   │
│  │  2. Policy Search Agent                 │   │
│  │     "관련 정책 검색"                    │   │
│  │     ↓                                   │   │
│  │  3. Response Generator                  │   │
│  │     "친절하게 응답 생성"                │   │
│  └─────────────────────────────────────────┘   │
└──────────────┬──────────────────────────────────┘
               │ MCP Protocol
┌──────────────▼──────────────────────────────────┐
│  FastMCP Tools Layer                            │
│  ┌─────────────────────────────────────────┐   │
│  │  search_policies(query)                 │   │
│  │  find_related_policies(policy_id)       │   │
│  │  check_eligibility(age, income)         │   │
│  │  get_policy_details(policy_id)          │   │
│  └─────────────────────────────────────────┘   │
└─────────┬──────────────────┬────────────────────┘
          │                  │
     ┌────▼──────┐      ┌────▼──────┐
     │  Milvus   │      │  Neo4j    │
     │  Vector   │      │  Graph    │
     │  DB       │      │  DB       │
     └───────────┘      └───────────┘
          │                  │
     (정책 검색)        (관계 추론)
```

### 데이터 흐름

```
사용자: "25살인데 적금 추천해줘"
    ↓
1. FastAPI가 요청 받음
    ↓
2. LangGraph 실행 시작
    ↓
3. Supervisor Agent
   → "정책 검색이 필요하네"
    ↓
4. Policy Search Agent
   → MCP Tool 호출: search_policies("25세 적금")
   → Milvus에서 유사도 검색
   → 결과: [청년도약계좌, 청년희망적금, ...]
    ↓
5. Response Generator
   → Claude로 응답 생성
   → "25살이시라면 청년도약계좌를 추천드려요..."
    ↓
6. FastAPI가 응답 반환
    ↓
프론트엔드: 사용자에게 메시지 표시
```

---

## 기술 스택

### Core
```yaml
Language: Python 3.11+
Framework: FastAPI 0.109.0
AI Orchestration: LangGraph 0.0.26
Tools Provider: FastMCP 0.2.0
```

### AI/ML
```yaml
LLM: AWS Bedrock Claude 3.5 Sonnet
Embedding: OpenAI text-embedding-3-large
LangChain: 0.1.9
```

### Databases
```yaml
Vector DB: Milvus 2.3.6 (의미 검색)
Graph DB: Neo4j 5.15 (관계 검색) - Phase 2
```

### Infrastructure
```yaml
Container: Docker + Docker Compose
Local Dev: Docker Compose
Production: AWS Lightsail ($20/월)
```

---

## 폴더 구조

```
backend/
├── README.md                          # 이 파일
├── ARCHITECTURE.md                    # 상세 아키텍처 문서
├── DEVELOPMENT.md                     # 개발 가이드
│
├── docker-compose.yml                 # 로컬 개발 환경
├── Dockerfile                         # FastAPI 컨테이너
├── requirements.txt                   # Python 의존성
├── .env.example                       # 환경변수 예시
├── .gitignore
│
├── app/
│   ├── main.py                        # FastAPI 진입점
│   │                                  # ✅ TODO: API 엔드포인트 정의
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   └── chat.py                    # POST /api/chats/{id}/messages
│   │                                  # ✅ TODO: 채팅 API 구현
│   │
│   ├── langgraph/
│   │   ├── __init__.py
│   │   ├── graph.py                   # LangGraph Workflow 정의
│   │   │                              # ✅ TODO: StateGraph 구성
│   │   ├── state.py                   # State 타입 정의
│   │   │                              # ✅ TODO: AgentState 정의
│   │   └── agents/
│   │       ├── __init__.py
│   │       ├── supervisor.py          # Supervisor Agent
│   │       │                          # ✅ TODO: 질문 분석 로직
│   │       ├── policy_search.py       # Policy Search Agent
│   │       │                          # ✅ TODO: MCP Tools 연동
│   │       └── response_generator.py  # Response Generator
│   │                                  # ✅ TODO: Claude 응답 생성
│   │
│   ├── mcp/
│   │   ├── __init__.py
│   │   ├── tools.py                   # FastMCP Tools 정의
│   │   │                              # ✅ TODO: @mcp.tool() 데코레이터
│   │   └── server.py                  # MCP 서버 (optional)
│   │
│   ├── db/
│   │   ├── __init__.py
│   │   ├── milvus_client.py           # Milvus 연결
│   │   │                              # ✅ TODO: 검색 함수 구현
│   │   └── neo4j_client.py            # Neo4j 연결 (Phase 2)
│   │                                  # ⏳ LATER: Cypher 쿼리
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── chat.py                    # Pydantic 모델 (Message, ChatItem)
│   │   └── policy.py                  # Policy 모델
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── embeddings.py              # OpenAI Embedding
│   │   ├── prompts.py                 # Agent 프롬프트
│   │   └── config.py                  # 설정 관리
│   │
│   └── tests/
│       ├── __init__.py
│       ├── test_tools.py              # MCP Tools 테스트
│       └── test_agents.py             # Agent 테스트
│
├── scripts/
│   ├── init_milvus.py                 # Milvus 초기화
│   │                                  # ✅ TODO: Collection 생성
│   ├── load_policies.py               # 정책 데이터 임베딩 + 적재
│   │                                  # ✅ TODO: CSV/JSON → Milvus
│   └── test_connection.py             # DB 연결 테스트
│
└── data/
    ├── policies.json                  # 샘플 정책 데이터
    └── .gitkeep
```

---

## 시작하기

### Prerequisites

```bash
# 필수 설치
- Docker Desktop
- Python 3.11+
- Git

# API Keys 필요
- AWS Bedrock 액세스 (Claude)
- OpenAI API Key (Embedding)
```

### 1. 환경 설정

```bash
# 레포지토리 이동
cd backend

# 환경변수 파일 생성
cp .env.example .env

# .env 파일 편집
# ANTHROPIC_API_KEY=sk-ant-...
# OPENAI_API_KEY=sk-...
```

### 2. Docker Compose로 실행

```bash
# 전체 스택 실행 (FastAPI + Milvus + Neo4j)
docker-compose up -d

# 로그 확인
docker-compose logs -f api

# 정상 작동 확인
curl http://localhost:8000/health
# {"status": "ok"}
```

### 3. 샘플 데이터 적재

```bash
# Python 가상환경
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# Milvus 초기화 + 샘플 정책 적재
python scripts/init_milvus.py
python scripts/load_policies.py
```

### 4. API 테스트

```bash
# 채팅 메시지 전송
curl -X POST http://localhost:8000/api/chats/test-chat-1/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "청년도약계좌에 대해 알려줘"}'

# 응답 예시
{
  "userMessage": {
    "id": 1,
    "text": "청년도약계좌에 대해 알려줘",
    "isUser": true,
    "timestamp": "2025-01-05T10:00:00Z"
  },
  "aiResponse": {
    "id": 2,
    "text": "청년도약계좌는 만 19~34세 청년을 위한...",
    "isUser": false,
    "timestamp": "2025-01-05T10:00:05Z"
  }
}
```

---

## 개발 가이드

### Phase 1: 기본 챗봇 (1주)

#### Day 1-2: 인프라 구축
```bash
✅ TODO
1. docker-compose.yml 작성
2. Milvus + FastAPI 컨테이너 실행
3. 연결 테스트 (scripts/test_connection.py)
```

#### Day 3-4: FastMCP Tools
```bash
✅ TODO
1. app/mcp/tools.py 작성
   - search_policies() 구현
   - Milvus 연동

2. 테스트
   python -m pytest tests/test_tools.py
```

#### Day 5-6: LangGraph Agents
```bash
✅ TODO
1. app/langgraph/state.py - State 정의
2. app/langgraph/agents/supervisor.py - 기본 라우팅
3. app/langgraph/agents/policy_search.py - MCP Tools 사용
4. app/langgraph/graph.py - Workflow 연결
```

#### Day 7: FastAPI 통합
```bash
✅ TODO
1. app/api/chat.py - POST endpoint
2. LangGraph 실행 연동
3. 프론트엔드 테스트
```

### Phase 2: Neo4j 관계 검색 (1주)

```bash
⏳ LATER
1. docker-compose.yml에 Neo4j 추가
2. app/db/neo4j_client.py 구현
3. app/mcp/tools.py에 find_related_policies() 추가
4. Cypher Agent 구현
```

---

## 배포

### AWS Lightsail 배포

```bash
# 1. Lightsail 인스턴스 생성 ($20/월, 4GB RAM)
AWS Console → Lightsail → Ubuntu 22.04

# 2. SSH 접속 후 설정
ssh ubuntu@your-lightsail-ip

sudo apt update
curl -fsSL https://get.docker.com | sh
sudo apt install docker-compose -y

# 3. 코드 배포
git clone https://github.com/your-repo/backend.git
cd backend
echo "ANTHROPIC_API_KEY=..." > .env
docker-compose up -d

# 4. 방화벽 설정
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## 비용

### 개발 단계 ($15/월)
```
- 로컬 Docker (무료)
- Bedrock API (테스트) $10/월
- OpenAI Embedding $5/월
━━━━━━━━━━━━━━━━━━━━━
총: ~$15/월
```

### 프로덕션 ($75/월)
```
- AWS Lightsail $20/월
- Bedrock Claude API $30-50/월
- Neptune (선택) $56/월
━━━━━━━━━━━━━━━━━━━━━
총: ~$75/월 (Neo4j 없이)
총: ~$130/월 (Neptune 포함)
```

---

## 다음 단계

1. ✅ **지금**: `docker-compose.yml` 작성
2. ✅ **다음**: FastMCP Tools 구현
3. ✅ **그 다음**: LangGraph Agents
4. ⏳ **나중**: AWS 배포

---

## 문서

- [ARCHITECTURE.md](./ARCHITECTURE.md) - 상세 아키텍처
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발 가이드
- [API.md](./API.md) - API 명세

---

## 라이센스

Copyright 2025. All rights reserved.

---

## 문의

- 프론트엔드: `../FinKuRN/README.md` 참고
- 백엔드: 이 문서

---

**마지막 업데이트**: 2025-01-05
**다음 작업**: Docker Compose 설정 파일 작성
