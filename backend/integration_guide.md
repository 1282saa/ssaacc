# FinKuRN 통합 시스템 구성 가이드

## 개요

v1-chatbot-complete 브랜치의 AWS Bedrock + PostgreSQL 기반 정책 검색 시스템과 feature/user-management-api 브랜치의 사용자 관리 시스템을 통합하는 방법입니다.

## 통합 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                    FinKuRN 통합 시스템                            │
├─────────────────────────────────────────────────────────────────┤
│ 1. React Native App (FinKuRN/)                                 │
│    - Google OAuth 로그인                                        │
│    - 온보딩 플로우                                                │
│    - 개인화된 채팅                                                │
├─────────────────────────────────────────────────────────────────┤
│ 2. FastAPI Backend (backend/)                                  │
│    ┌─────────────────┐  ┌─────────────────┐                    │
│    │ User Management │  │ AI Chat Service │                    │
│    │ - JWT Auth      │  │ - Bedrock Chat  │                    │
│    │ - Onboarding    │  │ - Policy Search │                    │
│    │ - Profile       │  │ - Vector DB     │                    │
│    └─────────────────┘  └─────────────────┘                    │
├─────────────────────────────────────────────────────────────────┤
│ 3. PostgreSQL Database                                         │
│    ┌─────────────────┐  ┌─────────────────┐                    │
│    │ User Tables     │  │ Policy Tables   │                    │
│    │ - users         │  │ - youth_policies│                    │
│    │ - user_profiles │  │ - policy_vectors│                    │
│    │ - consents      │  │                 │                    │
│    └─────────────────┘  └─────────────────┘                    │
├─────────────────────────────────────────────────────────────────┤
│ 4. AWS Bedrock                                                 │
│    - Claude 3.5 Sonnet (채팅)                                  │
│    - Titan Embeddings (벡터 검색)                               │
└─────────────────────────────────────────────────────────────────┘
```

## 데이터베이스 통합

### 1. 기존 PostgreSQL에 사용자 테이블 추가

```sql
-- 1. 사용자 기본 정보
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(100),
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 소셜 로그인 연동
CREATE TABLE user_social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider, provider_id)
);

-- 3. 사용자 프로필 (온보딩 정보)
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    region VARCHAR(100),
    job_category VARCHAR(50),
    monthly_income VARCHAR(50),
    goals TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 동의 정보
CREATE TABLE user_consents (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    push_notification BOOLEAN DEFAULT false,
    marketing_notification BOOLEAN DEFAULT false,
    reward_program BOOLEAN DEFAULT false,
    privacy_policy BOOLEAN DEFAULT false,
    terms_of_service BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 온보딩 상태
CREATE TABLE user_onboarding_status (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    goals_completed BOOLEAN DEFAULT false,
    profile_completed BOOLEAN DEFAULT false,
    consent_completed BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 채팅 히스토리 (개인화를 위한)
CREATE TABLE user_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES user_chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message_type VARCHAR(20) CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. 기존 정책 테이블 (그대로 유지)
- `youth_policies`: 정책 메타데이터
- 벡터 확장 및 임베딩 테이블들

## API 통합 방법

### 1. 현재 백엔드 구조 개선

```python
# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from app.api.v1 import auth, onboarding, chat
from app.services.bedrock_service import BedrockPolicyBot
from app.db.database import get_db

app = FastAPI(title="FinKuRN Integrated API")

# 기존 v1-chatbot-complete의 BedrockPolicyBot 통합
bedrock_bot = BedrockPolicyBot(db_config=DB_CONFIG, aws_profile=None)

# 라우터 등록
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(onboarding.router, prefix="/api/onboarding", tags=["Onboarding"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])

# 기존 API 엔드포인트도 유지
@app.post("/api/chats/{chat_id}/messages")
async def enhanced_chat(
    chat_id: str, 
    request: ChatRequest,
    current_user: User = Depends(get_current_user)  # JWT 인증
):
    # 사용자 온보딩 정보 조회
    user_context = await get_user_context(current_user.id)
    
    # 개인화된 시스템 instruction 생성
    system_instruction = build_personalized_instruction(user_context)
    
    # Bedrock 챗봇에 컨텍스트 전달
    result = bedrock_bot.chat_with_context(
        user_query=request.message,
        user_context=user_context,
        system_instruction=system_instruction
    )
    
    return result
```

### 2. 개인화된 시스템 instruction 생성

```python
# backend/app/services/personalization_service.py
def build_personalized_instruction(user_context: dict) -> str:
    """사용자 온보딩 정보를 기반으로 개인화된 시스템 instruction 생성"""
    
    base_instruction = """
    당신은 청년 맞춤형 금융 정책 전문 상담사입니다.
    사용자의 상황에 맞는 정책을 추천하고 친근하게 상담해주세요.
    """
    
    if not user_context:
        return base_instruction
    
    # 사용자 정보 추가
    personalized_parts = []
    
    if user_context.get('age'):
        personalized_parts.append(f"사용자는 {user_context['age']}세입니다.")
    
    if user_context.get('region'):
        personalized_parts.append(f"거주지는 {user_context['region']}입니다.")
    
    if user_context.get('job_category'):
        personalized_parts.append(f"직업은 {user_context['job_category']}입니다.")
    
    if user_context.get('monthly_income'):
        personalized_parts.append(f"월 소득은 {user_context['monthly_income']}입니다.")
    
    if user_context.get('goals'):
        goals_str = ", ".join(user_context['goals'])
        personalized_parts.append(f"관심 분야: {goals_str}")
    
    if personalized_parts:
        user_info = "\n".join(personalized_parts)
        return f"{base_instruction}\n\n[사용자 정보]\n{user_info}\n\n위 정보를 바탕으로 맞춤형 상담을 제공해주세요."
    
    return base_instruction
```

## 통합 절차

### 1. PostgreSQL 데이터베이스 확장

```bash
# 1. 기존 PostgreSQL 접속
psql -h localhost -U postgres -d finkurn

# 2. 사용자 테이블 추가
\i backend/sql/create_user_tables.sql

# 3. 확인
\dt  # 테이블 목록 확인
```

### 2. 백엔드 코드 통합

```bash
# 1. v1-chatbot-complete의 bedrock_chatbot.py 파일 복사
cp ../scripts/bedrock_chatbot.py backend/app/services/bedrock_service.py

# 2. 통합 API 구현
# - 기존 /api/chats/{chat_id}/messages 엔드포인트 개선
# - JWT 인증 추가
# - 사용자 컨텍스트 연동

# 3. 개인화 서비스 추가
# backend/app/services/personalization_service.py
```

### 3. 환경 변수 설정

```bash
# 1. 통합 환경 설정 파일 사용
cp backend/.env.integrated backend/.env

# 2. 실제 값으로 수정
# - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
# - DB_PASSWORD
# - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
# - SECRET_KEY
```

### 4. 프론트엔드 연동

현재 React Native의 chatService.ts는 이미 `/api/chats/{chat_id}/messages` 엔드포인트를 사용하고 있으므로, JWT 토큰만 추가하면 됩니다.

```typescript
// FinKuRN/src/services/chatService.ts (수정 필요)
async sendMessage(chatId: string, messageText: string, context: Record<string, any> = {}) {
    const userToken = await AsyncStorage.getItem('access_token');
    
    const response = await fetch(API_ENDPOINTS.CHAT_MESSAGES(chatId), {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`  // JWT 토큰 추가
        },
        body: JSON.stringify({
            message: messageText,
            context: context,
        }),
    });
    
    // ... rest of the code
}
```

## 기대 효과

### 1. 개인화된 AI 상담
- 사용자의 나이, 지역, 직업, 소득에 맞는 정책 우선 추천
- 온보딩에서 선택한 관심 분야 중심으로 상담
- 채팅 히스토리 기반 연속성 있는 대화

### 2. 정확한 정책 매칭
- Bedrock의 벡터 검색 + 사용자 프로필 결합
- 지역별 정책 필터링
- 연령/소득 조건 자동 체크

### 3. 사용자 경험 개선
- 로그인 후 즉시 맞춤 상담 가능
- 반복 질문 없이 컨텍스트 유지
- 개인별 상담 히스토리 관리

## 주의사항

1. **AWS 권한**: 팀원의 AWS 계정 접근이 제한적이므로, 애플리케이션 레벨에서만 수정
2. **데이터베이스 백업**: 기존 정책 데이터 손실 방지
3. **점진적 통합**: 기존 API 유지하며 새 기능 추가
4. **환경 분리**: 개발/운영 환경별 설정 관리

이 가이드를 따라 단계별로 진행하시면 기존 인프라를 건드리지 않고 안전하게 통합할 수 있습니다.