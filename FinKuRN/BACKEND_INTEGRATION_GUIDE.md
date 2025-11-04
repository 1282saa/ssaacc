# Backend Integration Guide

백엔드 개발자를 위한 통합 가이드입니다. 프론트엔드와 원활하게 협업하기 위한 모든 정보가 포함되어 있습니다.

## 목차

1. [빠른 시작](#빠른-시작)
2. [프로젝트 구조 이해](#프로젝트-구조-이해)
3. [API 구현 체크리스트](#api-구현-체크리스트)
4. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
5. [테스트 방법](#테스트-방법)
6. [배포 전 체크리스트](#배포-전-체크리스트)
7. [자주 묻는 질문](#자주-묻는-질문)

---

## 빠른 시작

### 1단계: 문서 읽기

다음 파일들을 순서대로 읽어주세요:

1. **API_SPECIFICATION.md** (필수)
   - 모든 API 엔드포인트 명세
   - 요청/응답 형식
   - 에러 처리 방법

2. **src/types/home.ts** (참고)
   - Home 화면 데이터 타입 정의

3. **src/types/chat.ts** (참고)
   - Chat 기능 데이터 타입 정의

4. **src/services/README.md** (참고)
   - 프론트엔드 서비스 레이어 구조

### 2단계: 샘플 데이터 확인

프론트엔드가 현재 사용 중인 더미 데이터를 확인하세요:

```bash
# 프로젝트 클론 후
cd FinKuRN

# Home 데이터 샘플 확인
cat src/services/homeService.ts | grep -A 100 "DUMMY_HOME_DATA"

# Chat 데이터 샘플 확인
cat src/services/chatService.ts | grep -A 50 "DUMMY_CHAT_LIST"
```

### 3단계: API 구현

`API_SPECIFICATION.md`에 정의된 엔드포인트를 순서대로 구현:

**우선순위 1 (필수)**:
- `GET /api/home` - 홈 화면 데이터
- `GET /api/chats` - 채팅 목록
- `GET /api/chats/:chatId/messages` - 채팅 메시지
- `POST /api/chats/:chatId/messages` - 메시지 전송

**우선순위 2 (선택)**:
- `GET /api/today-items`
- `GET /api/savings`
- `GET /api/spending`
- `POST /api/chats`
- `DELETE /api/chats/:chatId`

### 4단계: 프론트엔드에 알리기

API가 준비되면 프론트엔드 팀에게 전달:
- 베이스 URL (예: `https://api-dev.example.com`)
- 인증 방법 (Bearer token 등)
- Postman collection 또는 OpenAPI spec

---

## 프로젝트 구조 이해

### 프론트엔드 아키텍처

```
FinKuRN/
├── src/
│   ├── services/          # ← 백엔드와 연동되는 부분
│   │   ├── homeService.ts    # Home API 호출
│   │   ├── chatService.ts    # Chat API 호출
│   │   └── README.md         # 서비스 레이어 문서
│   │
│   ├── types/             # ← TypeScript 타입 정의
│   │   ├── home.ts           # Home 데이터 타입
│   │   └── chat.ts           # Chat 데이터 타입
│   │
│   ├── screens/           # UI 화면 (API와 직접 통신 안 함)
│   └── components/        # UI 컴포넌트 (API와 직접 통신 안 함)
│
└── API_SPECIFICATION.md  # ← 백엔드가 구현할 API 명세
```

### 중요 원칙

**분리된 레이어**:
- **서비스 레이어** (`src/services/`): 데이터 fetching
- **UI 레이어** (`src/screens/`, `src/components/`): 화면 렌더링

**백엔드는 서비스 레이어만 신경쓰면 됩니다!**

UI 컴포넌트는 서비스를 통해서만 데이터를 가져옵니다:

```
Backend API → Service Layer → UI Components
```

---

## API 구현 체크리스트

### Home API

- [ ] `GET /api/home` 엔드포인트 구현
  - [ ] 사용자 인증 확인
  - [ ] 사용자별 인사말 생성
  - [ ] 오늘의 할 일 목록 조회
  - [ ] 저축 데이터 조회
  - [ ] 지출 데이터 조회
  - [ ] 응답 형식이 `HomeScreenData` 타입과 일치하는지 확인

- [ ] `GET /api/today-items` 엔드포인트 구현 (선택)
  - [ ] 사용자 인증 확인
  - [ ] D-day 계산 로직 구현
  - [ ] 응답 형식이 `TodayItemData[]` 타입과 일치하는지 확인

- [ ] `GET /api/savings` 엔드포인트 구현 (선택)
  - [ ] 필터 파라미터 처리
  - [ ] 차트 데이터 생성
  - [ ] 응답 형식이 `SavingsData` 타입과 일치하는지 확인

- [ ] `GET /api/spending` 엔드포인트 구현 (선택)
  - [ ] 기간 파라미터 처리 (오늘/이번 주/이번 달)
  - [ ] 카테고리별 집계
  - [ ] 퍼센티지 계산
  - [ ] 응답 형식이 `SpendingData` 타입과 일치하는지 확인

### Chat API

- [ ] `GET /api/chats` 엔드포인트 구현
  - [ ] 사용자별 채팅 목록 조회
  - [ ] 최근 메시지 시간 정렬
  - [ ] 읽지 않은 메시지 수 계산
  - [ ] 응답 형식이 `ChatItem[]` 타입과 일치하는지 확인

- [ ] `GET /api/chats/:chatId/messages` 엔드포인트 구현
  - [ ] chatId 유효성 검증
  - [ ] 메시지 시간순 정렬
  - [ ] 응답 형식이 `Message[]` 타입과 일치하는지 확인

- [ ] `POST /api/chats/:chatId/messages` 엔드포인트 구현
  - [ ] 메시지 내용 검증 (빈 문자열 방지)
  - [ ] AI 응답 생성 (또는 AI API 호출)
  - [ ] **중요**: `userMessage`와 `aiResponse` 모두 반환
  - [ ] 응답 형식 확인

- [ ] `POST /api/chats` 엔드포인트 구현 (선택)
  - [ ] 새 채팅 생성
  - [ ] 초기 메시지 처리
  - [ ] 고유 ID 생성

- [ ] `DELETE /api/chats/:chatId` 엔드포인트 구현 (선택)
  - [ ] 소프트 삭제 또는 하드 삭제
  - [ ] 204 No Content 반환

### 공통 요구사항

- [ ] CORS 설정 (`http://localhost:19006`, `http://localhost:8081` 허용)
- [ ] 인증 미들웨어 구현 (Bearer token)
- [ ] 에러 처리 미들웨어
  - [ ] 표준 에러 형식 사용
  - [ ] 적절한 HTTP 상태 코드
- [ ] 요청 로깅
- [ ] API 응답 시간 모니터링

---

## 로컬 개발 환경 설정

### 백엔드 서버 실행

```bash
# 예시: Express 서버
cd your-backend-project
npm install
npm run dev  # http://localhost:3000에서 실행
```

### 프론트엔드 설정

프론트엔드가 로컬 백엔드를 가리키도록 설정:

**방법 1: 환경 변수 파일 생성**

```bash
# FinKuRN/.env.development
API_URL=http://localhost:3000/api
```

**방법 2: 서비스 파일 직접 수정** (개발 중에만)

```typescript
// src/services/homeService.ts
async getHomeScreenData(): Promise<HomeScreenData> {
  // 개발 중에는 실제 API 호출
  const response = await fetch('http://localhost:3000/api/home', {
    headers: {
      'Authorization': `Bearer ${await getToken()}`,
    },
  });
  return response.json();

  // 기존 더미 데이터 반환 주석 처리
  // return Promise.resolve(DUMMY_HOME_DATA);
}
```

### CORS 문제 해결

백엔드에서 CORS 허용:

**Express 예시**:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:19006',  // Expo web
    'http://localhost:8081',   // Metro bundler
    'http://192.168.x.x:19006', // 실제 IP (필요 시)
  ],
  credentials: true,
}));
```

**NestJS 예시**:
```typescript
app.enableCors({
  origin: [
    'http://localhost:19006',
    'http://localhost:8081',
  ],
  credentials: true,
});
```

---

## 테스트 방법

### 1. Postman / Insomnia로 테스트

**샘플 요청 (Home API)**:
```bash
curl -X GET http://localhost:3000/api/home \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**예상 응답 확인**:
- `API_SPECIFICATION.md`의 응답 예시와 비교
- 모든 필수 필드 포함 여부 확인
- 타입이 일치하는지 확인

### 2. 프론트엔드와 통합 테스트

**단계**:
1. 백엔드 서버 실행 (`http://localhost:3000`)
2. 프론트엔드 Expo 서버 실행
3. 브라우저에서 `http://localhost:19006` 열기
4. 브라우저 개발자 도구 → Network 탭 확인
5. API 호출 로그 확인

**확인 사항**:
- [ ] API 요청이 성공하는지 (200 OK)
- [ ] 응답 데이터가 화면에 올바르게 표시되는지
- [ ] 에러가 발생하면 적절한 메시지가 표시되는지

### 3. 에러 케이스 테스트

다음 시나리오를 테스트하세요:

- [ ] 인증 없이 요청 → 401 Unauthorized
- [ ] 잘못된 토큰 → 401 Invalid Token
- [ ] 존재하지 않는 리소스 → 404 Not Found
- [ ] 잘못된 요청 형식 → 400 Bad Request
- [ ] 서버 오류 → 500 Internal Server Error

**예시 (존재하지 않는 채팅)**:
```bash
curl -X GET http://localhost:3000/api/chats/invalid-id \
  -H "Authorization: Bearer YOUR_TOKEN"

# 예상 응답:
# HTTP 404
# {
#   "error": {
#     "code": "NOT_FOUND",
#     "message": "채팅을 찾을 수 없습니다."
#   }
# }
```

---

## 배포 전 체크리스트

### API 검증

- [ ] 모든 엔드포인트가 `API_SPECIFICATION.md`와 일치
- [ ] 타입스크립트 타입 정의와 응답 형식 일치
- [ ] 에러 처리가 표준 형식을 따름
- [ ] CORS가 프로덕션 도메인을 허용

### 성능

- [ ] API 응답 시간 < 1초
- [ ] 데이터베이스 쿼리 최적화
- [ ] 캐싱 전략 적용 (필요 시)
- [ ] Rate limiting 적용

### 보안

- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] HTTPS 적용
- [ ] 민감한 정보 로깅 방지
- [ ] 인증 토큰 만료 시간 설정

### 모니터링

- [ ] API 호출 로깅
- [ ] 에러 추적 (Sentry 등)
- [ ] 성능 모니터링 (New Relic 등)

---

## 자주 묻는 질문

### Q1: 프론트엔드가 사용하는 더미 데이터는 어디에 있나요?

**A**: `src/services/`에 있습니다:
- Home: `src/services/homeService.ts` → `DUMMY_HOME_DATA`
- Chat: `src/services/chatService.ts` → `DUMMY_CHAT_LIST`, `DUMMY_MESSAGES`

이 데이터를 참고해서 실제 API 응답을 만들면 됩니다.

---

### Q2: API 응답 형식을 어떻게 확인하나요?

**A**: 두 가지 방법이 있습니다:

**방법 1**: TypeScript 타입 정의 보기
```bash
cat src/types/home.ts
cat src/types/chat.ts
```

**방법 2**: API 명세서 보기
```bash
cat API_SPECIFICATION.md
```

---

### Q3: 프론트엔드는 언제 실제 API를 사용하나요?

**A**: 프론트엔드 개발자가 서비스 파일을 수정하면 됩니다.

**현재 (더미 데이터)**:
```typescript
async getHomeScreenData() {
  return Promise.resolve(DUMMY_HOME_DATA);
}
```

**변경 후 (실제 API)**:
```typescript
async getHomeScreenData() {
  const response = await fetch('https://api.example.com/api/home');
  return response.json();
}
```

백엔드는 API만 제공하면 되고, 전환은 프론트엔드가 처리합니다.

---

### Q4: 타임스탬프는 어떤 형식으로 보내야 하나요?

**A**: ISO 8601 형식 문자열로 보내주세요:

```json
{
  "timestamp": "2025-01-04T10:30:00Z"
}
```

프론트엔드에서 자동으로 `Date` 객체로 파싱합니다.

---

### Q5: AI 응답은 어떻게 생성하나요?

**A**: 두 가지 옵션이 있습니다:

**옵션 1**: 외부 AI API 호출 (OpenAI, Claude 등)
```javascript
const aiResponse = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: userMessage }],
});
```

**옵션 2**: 키워드 기반 규칙 (간단한 경우)
```javascript
if (userMessage.includes('적금')) {
  return '적금 상품을 추천해드리겠습니다...';
}
```

프론트엔드의 `src/services/chatService.ts`에 샘플 로직이 있습니다 (`generateDummyResponse` 메서드 참고).

---

### Q6: 에러가 발생하면 어떻게 처리하나요?

**A**: 표준 에러 형식을 사용하세요:

```javascript
// Express 예시
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || '서버 오류가 발생했습니다.',
    },
  });
});
```

---

### Q7: 개발 환경에서 인증을 테스트하려면?

**A**: 간단한 개발용 토큰을 만드세요:

```javascript
// 개발 환경에서만
if (process.env.NODE_ENV === 'development') {
  app.use('/api/dev-token', (req, res) => {
    const token = jwt.sign(
      { userId: 'dev-user-1', username: '은별' },
      'dev-secret',
      { expiresIn: '7d' }
    );
    res.json({ token });
  });
}
```

프론트엔드에서 이 토큰을 사용해서 테스트할 수 있습니다.

---

### Q8: 프론트엔드 코드를 직접 확인하고 싶어요

**A**: 다음 파일들을 확인하세요:

**서비스 레이어** (데이터 fetching):
- `src/services/homeService.ts`
- `src/services/chatService.ts`

**타입 정의** (데이터 구조):
- `src/types/home.ts`
- `src/types/chat.ts`

**화면** (UI, 참고용):
- `src/screens/HomeScreen.tsx`
- `src/screens/ChatbotScreenV2.tsx`

---

## 연락처

질문이나 문제가 있으면:
- 프론트엔드 담당자: [이름/연락처]
- Slack: #finukurn-dev
- 이메일: [이메일]

---

## 추가 리소스

- [API Specification](./API_SPECIFICATION.md) - 전체 API 명세
- [Services README](./src/services/README.md) - 서비스 레이어 문서
- [TypeScript Types](./src/types/) - 타입 정의
- [Frontend README](./README.md) - 프로젝트 개요
