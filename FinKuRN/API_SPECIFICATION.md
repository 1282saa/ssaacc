# FinKuRN API Specification

백엔드 개발자를 위한 API 명세서입니다. 프론트엔드가 기대하는 정확한 요청/응답 형식이 정의되어 있습니다.

## 목차

1. [인증](#인증)
2. [Home API](#home-api)
3. [Chat API](#chat-api)
4. [에러 처리](#에러-처리)
5. [타입 정의 참고](#타입-정의-참고)

---

## 인증

### 헤더

모든 인증이 필요한 요청은 다음 헤더를 포함해야 합니다:

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### 인증 에러

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "인증이 필요합니다"
  }
}
```

---

## Home API

### 1. 홈 화면 데이터 조회

전체 홈 화면에 필요한 모든 데이터를 한 번에 반환합니다.

**Endpoint**: `GET /api/home`

**요청 헤더**:
```
Authorization: Bearer {token}
```

**요청 예시**:
```bash
curl -X GET https://api.example.com/api/home \
  -H "Authorization: Bearer eyJhbGc..."
```

**응답 (200 OK)**:
```json
{
  "greeting": {
    "userName": "은별",
    "greetingMessage": "좋은 아침이에요, 은별님",
    "motivationMessage": "오늘은 커피값만큼 절약 도전 어떨까요? 💙"
  },
  "todayItemsCount": 5,
  "todayItems": [
    {
      "id": "today-1",
      "title": "공과금 납부",
      "dday": "D-DAY",
      "detailText": "이번 달 전기요금 ",
      "detailAmount": "43,200원",
      "description": "오늘 납부하지 않으면 연체료 2%가 부가돼요"
    },
    {
      "id": "today-2",
      "title": "청년도약계좌 서류 제출 마감",
      "dday": "D-2",
      "detailText": "남은 서류 2개",
      "detailAmount": null,
      "description": "이번 주 안에 제출해야 정부 지원금 받을 수 있어요"
    }
  ],
  "savingsFilters": ["전체", "내 집 마련 적금", "여름 여행", "비상금"],
  "savings": {
    "id": "savings-1",
    "name": "내 집 마련 적금",
    "startDate": "2024.02",
    "monthlyDeposit": 300000,
    "currentAmount": 3500000,
    "targetAmount": 30000000,
    "chartData": [20, 50, 10, 80, 60, 20]
  },
  "spendingFilters": ["오늘", "이번 주", "이번 달"],
  "spending": {
    "totalAmount": 1234567,
    "categories": [
      {
        "category": "식비",
        "amount": 450000,
        "percentage": 36,
        "color": "#FF6B6B"
      },
      {
        "category": "교통비",
        "amount": 200000,
        "percentage": 16,
        "color": "#4ECDC4"
      }
    ]
  }
}
```

**필드 설명**:

| 필드 | 타입 | 설명 | 필수 |
|------|------|------|------|
| `greeting.userName` | string | 사용자 이름 | ✓ |
| `greeting.greetingMessage` | string | 인사말 메시지 | ✓ |
| `greeting.motivationMessage` | string | 동기부여 메시지 | ✓ |
| `todayItemsCount` | number | 오늘의 할 일 총 개수 | ✓ |
| `todayItems[].id` | string | 할 일 고유 ID | ✓ |
| `todayItems[].title` | string | 할 일 제목 | ✓ |
| `todayItems[].dday` | string | D-day 표시 (예: "D-DAY", "D-2") | ✓ |
| `todayItems[].detailText` | string | 상세 텍스트 | ✓ |
| `todayItems[].detailAmount` | string \| null | 금액 표시 (없으면 null) | ✓ |
| `todayItems[].description` | string | 설명/경고 텍스트 | ✓ |
| `savings.id` | string | 저축 상품 ID | ✓ |
| `savings.name` | string | 저축 상품명 | ✓ |
| `savings.startDate` | string | 시작일 (YYYY.MM 형식) | ✓ |
| `savings.monthlyDeposit` | number | 월 납입액 | ✓ |
| `savings.currentAmount` | number | 현재 금액 | ✓ |
| `savings.targetAmount` | number | 목표 금액 | ✓ |
| `savings.chartData` | number[] | 차트 데이터 (0-100 퍼센티지) | ✓ |
| `spending.totalAmount` | number | 총 지출액 | ✓ |
| `spending.categories[].category` | string | 카테고리명 | ✓ |
| `spending.categories[].amount` | number | 카테고리별 금액 | ✓ |
| `spending.categories[].percentage` | number | 비율 (0-100) | ✓ |
| `spending.categories[].color` | string | 차트 색상 (hex code) | ✓ |

**TypeScript 타입 참고**: `src/types/home.ts`

---

### 2. 오늘의 할 일 목록 조회

**Endpoint**: `GET /api/today-items`

**요청 예시**:
```bash
curl -X GET https://api.example.com/api/today-items \
  -H "Authorization: Bearer eyJhbGc..."
```

**응답 (200 OK)**:
```json
[
  {
    "id": "today-1",
    "title": "공과금 납부",
    "dday": "D-DAY",
    "detailText": "이번 달 전기요금 ",
    "detailAmount": "43,200원",
    "description": "오늘 납부하지 않으면 연체료 2%가 부가돼요"
  }
]
```

---

### 3. 저축 데이터 조회

**Endpoint**: `GET /api/savings`

**쿼리 파라미터**:
- `filter` (optional): 필터 ID

**요청 예시**:
```bash
# 전체 조회
curl -X GET https://api.example.com/api/savings \
  -H "Authorization: Bearer eyJhbGc..."

# 필터링 조회
curl -X GET "https://api.example.com/api/savings?filter=savings-1" \
  -H "Authorization: Bearer eyJhbGc..."
```

**응답 (200 OK)**:
```json
{
  "id": "savings-1",
  "name": "내 집 마련 적금",
  "startDate": "2024.02",
  "monthlyDeposit": 300000,
  "currentAmount": 3500000,
  "targetAmount": 30000000,
  "chartData": [20, 50, 10, 80, 60, 20]
}
```

---

### 4. 지출 데이터 조회

**Endpoint**: `GET /api/spending`

**쿼리 파라미터**:
- `period` (optional): 조회 기간 ("오늘", "이번 주", "이번 달")

**요청 예시**:
```bash
curl -X GET "https://api.example.com/api/spending?period=이번%20달" \
  -H "Authorization: Bearer eyJhbGc..."
```

**응답 (200 OK)**:
```json
{
  "totalAmount": 1234567,
  "categories": [
    {
      "category": "식비",
      "amount": 450000,
      "percentage": 36,
      "color": "#FF6B6B"
    }
  ]
}
```

---

## Chat API

### 1. 채팅 목록 조회

**Endpoint**: `GET /api/chats`

**요청 예시**:
```bash
curl -X GET https://api.example.com/api/chats \
  -H "Authorization: Bearer eyJhbGc..."
```

**응답 (200 OK)**:
```json
[
  {
    "id": "chat-1",
    "title": "청년도약계좌 관련 문의",
    "lastMessageTime": "2025-01-04T10:30:00Z",
    "unreadCount": 2
  },
  {
    "id": "chat-2",
    "title": "적금 추천 받기",
    "lastMessageTime": "2025-01-04T08:00:00Z",
    "unreadCount": 0
  }
]
```

**필드 설명**:

| 필드 | 타입 | 설명 | 필수 |
|------|------|------|------|
| `id` | string | 채팅 고유 ID | ✓ |
| `title` | string | 채팅 제목/요약 | ✓ |
| `lastMessageTime` | string | ISO 8601 형식 타임스탬프 | ✓ |
| `unreadCount` | number | 읽지 않은 메시지 수 | ✓ |

---

### 2. 채팅 메시지 조회

**Endpoint**: `GET /api/chats/:chatId/messages`

**요청 예시**:
```bash
curl -X GET https://api.example.com/api/chats/chat-1/messages \
  -H "Authorization: Bearer eyJhbGc..."
```

**응답 (200 OK)**:
```json
[
  {
    "id": 1,
    "text": "청년도약계좌에 대해 알려주세요",
    "isUser": true,
    "timestamp": "2025-01-04T10:00:00Z"
  },
  {
    "id": 2,
    "text": "청년도약계좌는 만 19~34세 청년을 위한 정책금융상품입니다.",
    "isUser": false,
    "timestamp": "2025-01-04T10:00:30Z"
  }
]
```

**필드 설명**:

| 필드 | 타입 | 설명 | 필수 |
|------|------|------|------|
| `id` | number | 메시지 ID | ✓ |
| `text` | string | 메시지 내용 | ✓ |
| `isUser` | boolean | true: 사용자, false: AI | ✓ |
| `timestamp` | string | ISO 8601 형식 타임스탬프 | ✓ |

---

### 3. 메시지 전송

**Endpoint**: `POST /api/chats/:chatId/messages`

**요청 본문**:
```json
{
  "text": "적금 추천해주세요"
}
```

**요청 예시**:
```bash
curl -X POST https://api.example.com/api/chats/chat-1/messages \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"text":"적금 추천해주세요"}'
```

**응답 (200 OK)**:
```json
{
  "userMessage": {
    "id": 3,
    "text": "적금 추천해주세요",
    "isUser": true,
    "timestamp": "2025-01-04T10:30:00Z"
  },
  "aiResponse": {
    "id": 4,
    "text": "목표 금액과 기간을 알려주시면 맞춤 적금을 추천해드릴게요.",
    "isUser": false,
    "timestamp": "2025-01-04T10:30:05Z"
  }
}
```

**중요**: 응답은 반드시 `userMessage`와 `aiResponse` 두 개를 모두 포함해야 합니다.

---

### 4. 채팅 생성

**Endpoint**: `POST /api/chats`

**요청 본문**:
```json
{
  "initialMessage": "청년 지원 정책 알려주세요"
}
```

**요청 예시**:
```bash
curl -X POST https://api.example.com/api/chats \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"initialMessage":"청년 지원 정책 알려주세요"}'
```

**응답 (201 Created)**:
```json
{
  "id": "chat-3",
  "title": "청년 지원 정책 알려주세요",
  "lastMessageTime": "2025-01-04T11:00:00Z",
  "unreadCount": 0
}
```

---

### 5. 채팅 삭제

**Endpoint**: `DELETE /api/chats/:chatId`

**요청 예시**:
```bash
curl -X DELETE https://api.example.com/api/chats/chat-1 \
  -H "Authorization: Bearer eyJhbGc..."
```

**응답 (204 No Content)**:
```
(빈 응답)
```

---

## 에러 처리

### 표준 에러 응답 형식

모든 에러는 다음 형식을 따릅니다:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "사용자에게 표시할 메시지",
    "details": {} // optional
  }
}
```

### HTTP 상태 코드

| 코드 | 의미 | 사용 예시 |
|------|------|-----------|
| 200 | OK | 성공적인 GET 요청 |
| 201 | Created | 성공적인 POST (생성) 요청 |
| 204 | No Content | 성공적인 DELETE 요청 |
| 400 | Bad Request | 잘못된 요청 형식 |
| 401 | Unauthorized | 인증 실패 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스 없음 |
| 500 | Internal Server Error | 서버 오류 |

### 에러 코드 목록

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `UNAUTHORIZED` | 401 | 인증이 필요함 |
| `INVALID_TOKEN` | 401 | 유효하지 않은 토큰 |
| `FORBIDDEN` | 403 | 접근 권한 없음 |
| `NOT_FOUND` | 404 | 리소스를 찾을 수 없음 |
| `VALIDATION_ERROR` | 400 | 입력 데이터 검증 실패 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

### 에러 응답 예시

**401 Unauthorized**:
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "인증이 필요합니다. 로그인해주세요."
  }
}
```

**404 Not Found**:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "채팅을 찾을 수 없습니다.",
    "details": {
      "chatId": "chat-999"
    }
  }
}
```

**400 Validation Error**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 데이터가 올바르지 않습니다.",
    "details": {
      "field": "text",
      "issue": "메시지 내용은 비어있을 수 없습니다."
    }
  }
}
```

---

## 타입 정의 참고

모든 타입은 TypeScript로 정의되어 있습니다:

### Home 관련 타입
**파일**: `src/types/home.ts`

```typescript
export interface TodayItemData {
  id: string;
  title: string;
  dday: string;
  detailText: string;
  detailAmount?: string;
  description: string;
}

export interface GreetingData {
  userName: string;
  greetingMessage: string;
  motivationMessage: string;
}

export interface SavingsData {
  id: string;
  name: string;
  startDate: string;
  monthlyDeposit: number;
  currentAmount: number;
  targetAmount: number;
  chartData: number[];
}

export interface SpendingCategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface SpendingData {
  totalAmount: number;
  categories: SpendingCategoryData[];
}

export interface HomeScreenData {
  greeting: GreetingData;
  todayItems: TodayItemData[];
  todayItemsCount: number;
  savingsFilters: string[];
  spendingFilters: string[];
  savings: SavingsData;
  spending: SpendingData;
}
```

### Chat 관련 타입
**파일**: `src/types/chat.ts`

```typescript
export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp?: Date; // ISO 8601 string으로 전달
}

export interface ChatItem {
  id: string;
  title: string;
  lastMessageTime?: Date; // ISO 8601 string으로 전달
  unreadCount?: number;
}
```

---

## 개발 환경 설정

### CORS 설정

프론트엔드는 Expo 개발 서버에서 실행되므로 CORS를 허용해야 합니다:

```javascript
// Express 예시
app.use(cors({
  origin: [
    'http://localhost:19006', // Expo web dev server
    'http://localhost:8081',  // Expo Metro bundler
  ],
  credentials: true,
}));
```

### 환경 변수

백엔드 URL은 환경 변수로 설정:

```bash
# .env.development
API_URL=http://localhost:3000/api

# .env.production
API_URL=https://api.production.com/api
```

---

## 테스트

### Postman Collection

모든 API 엔드포인트를 테스트할 수 있는 Postman collection을 제공합니다.

**Import URL**: (추가 예정)

### 샘플 데이터

프론트엔드의 더미 데이터를 참고하세요:
- `src/services/homeService.ts` - `DUMMY_HOME_DATA`
- `src/services/chatService.ts` - `DUMMY_CHAT_LIST`, `DUMMY_MESSAGES`

---

## 연락처

- 프론트엔드 담당: [이름]
- API 질문: [이메일/슬랙]
- 긴급 이슈: [연락처]

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|-----------|
| 2025-01-04 | 1.0.0 | 초기 API 명세 작성 |

---

## 다음 단계

1. 이 명세에 따라 API 구현
2. 각 엔드포인트 테스트
3. 프론트엔드 팀에게 API URL 전달
4. 통합 테스트 진행
