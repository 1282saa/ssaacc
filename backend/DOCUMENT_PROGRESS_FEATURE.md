# 문서 완료 현황 추적 기능 (Document Progress Tracking)

## 📋 개요

사용자가 정책별로 필요한 서류를 체크하면 그 상태가 데이터베이스에 저장되어, 페이지를 새로고침하거나 다시 방문해도 체크 상태가 유지되는 기능입니다.

**구현 날짜**: 2025-01-16
**작업자**: Claude Code
**버전**: v1.0.0

---

## 🏗️ 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React Native)              │
│                                                               │
│  PlanScreen.tsx                                              │
│  ├─ loadDocumentProgress() ──────────┐                      │
│  ├─ handleCheckboxToggle() ──────────┤                      │
│  └─ calculateProgress()              │                      │
│                                       │                      │
│  documentProgressService.ts          │                      │
│  ├─ getAllDocumentProgress() ────────┤                      │
│  ├─ toggleDocumentCompletion() ──────┤                      │
│  └─ getDocumentProgressStats() ──────┤                      │
└───────────────────────────────────────┼──────────────────────┘
                                        │
                                        │ HTTP/JSON
                                        │
┌───────────────────────────────────────┼──────────────────────┐
│                        Backend (FastAPI)                     │
│                                       │                      │
│  /api/v1/document-progress/*          │                      │
│  document_progress.py (Router)        │                      │
│  ├─ GET  /                            │                      │
│  ├─ GET  /policy/{id}                 │                      │
│  ├─ POST /toggle                      │                      │
│  └─ GET  /stats                       │                      │
│                                       │                      │
│  document_progress.py (Schema)        │                      │
│  ├─ DocumentProgressResponse          │                      │
│  ├─ DocumentProgressUpdate            │                      │
│  └─ DocumentProgressStats             │                      │
│                                       │                      │
│  document_progress.py (Model)         │                      │
│  └─ DocumentProgress (SQLAlchemy)     │                      │
└───────────────────────────────────────┼──────────────────────┘
                                        │
                                        │ SQL
                                        │
┌───────────────────────────────────────┼──────────────────────┐
│                    PostgreSQL Database                       │
│                                       │                      │
│  user_document_progress               │                      │
│  ├─ id (SERIAL PK)                    │                      │
│  ├─ user_id (UUID FK → users)         │                      │
│  ├─ policy_id (INTEGER FK → youth_policies)                 │
│  ├─ document_index (INTEGER)          │                      │
│  ├─ document_name (VARCHAR)           │                      │
│  ├─ is_completed (BOOLEAN)            │                      │
│  ├─ created_at (TIMESTAMP)            │                      │
│  ├─ updated_at (TIMESTAMP)            │                      │
│  ├─ completed_at (TIMESTAMP)          │                      │
│  └─ UNIQUE(user_id, policy_id, document_index)              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📂 파일 구조

### Backend

```
backend/
├── app/
│   ├── models/
│   │   └── document_progress.py          # SQLAlchemy 모델
│   │       └── DocumentProgress           # 문서 진행 상황 모델
│   │
│   ├── schemas/
│   │   └── document_progress.py          # Pydantic 스키마
│   │       ├── DocumentProgressResponse   # API 응답 스키마
│   │       ├── DocumentProgressUpdate     # 업데이트 요청 스키마
│   │       └── DocumentProgressStats      # 통계 응답 스키마
│   │
│   └── api/v1/
│       ├── __init__.py                   # 라우터 등록
│       └── document_progress.py          # API 엔드포인트
│           ├── GET  /document-progress/
│           ├── GET  /document-progress/policy/{id}
│           ├── POST /document-progress/toggle
│           └── GET  /document-progress/stats
│
├── create_document_progress_table_sql.py # 테이블 생성 스크립트
└── DOCUMENT_PROGRESS_FEATURE.md          # 이 문서
```

### Frontend

```
FinKuRN/
└── src/
    ├── services/
    │   └── documentProgressService.ts    # API 호출 서비스
    │       ├── getAllDocumentProgress()   # 모든 진행 상황 조회
    │       ├── getPolicyDocumentProgress()# 정책별 진행 상황 조회
    │       ├── toggleDocumentCompletion() # 완료 상태 토글
    │       └── getDocumentProgressStats() # 통계 조회
    │
    └── screens/plan/
        └── PlanScreen.tsx                # 메인 화면 (API 연동)
            ├── loadDocumentProgress()     # 페이지 로드 시 상태 복원
            ├── handleCheckboxToggle()     # 체크박스 클릭 시 저장
            └── calculateProgress()        # 진행률 계산
```

---

## 🗄️ 데이터베이스 스키마

### user_document_progress 테이블

| 컬럼명             | 타입                      | 제약 조건           | 설명                              |
| ------------------ | ------------------------- | ------------------- | --------------------------------- |
| `id`               | `SERIAL`                  | PRIMARY KEY         | 고유 ID                           |
| `user_id`          | `UUID`                    | NOT NULL, FK        | 사용자 ID (users 테이블 참조)    |
| `policy_id`        | `INTEGER`                 | NOT NULL, FK        | 정책 ID (youth_policies 참조)    |
| `document_index`   | `INTEGER`                 | NOT NULL            | 문서 인덱스 (0부터 시작)         |
| `document_name`    | `VARCHAR(200)`            | NOT NULL            | 문서명 (예: "신분증", "통장사본") |
| `is_completed`     | `BOOLEAN`                 | NOT NULL, DEFAULT FALSE | 완료 여부                      |
| `created_at`       | `TIMESTAMP WITH TIMEZONE` | DEFAULT NOW()       | 생성 시간                         |
| `updated_at`       | `TIMESTAMP WITH TIMEZONE` | DEFAULT NOW()       | 업데이트 시간                     |
| `completed_at`     | `TIMESTAMP WITH TIMEZONE` | NULLABLE            | 완료 시간                         |

**제약 조건:**
- `UNIQUE(user_id, policy_id, document_index)`: 한 사용자가 한 정책의 한 문서는 하나의 레코드만 가질 수 있음
- `ON DELETE CASCADE`: 사용자나 정책이 삭제되면 관련 진행 상황도 삭제

**인덱스:**
- `idx_user_document_progress_user_id` on `user_id`
- `idx_user_document_progress_policy_id` on `policy_id`

---

## 🔌 API 엔드포인트

### 1. 모든 문서 진행 상황 조회

```http
GET /api/v1/document-progress/
Authorization: Bearer {token}
```

**응답 예시:**
```json
[
  {
    "id": 1,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "policy_id": 5,
    "document_index": 0,
    "document_name": "신분증",
    "is_completed": true,
    "created_at": "2025-01-16T10:00:00Z",
    "updated_at": "2025-01-16T10:05:00Z",
    "completed_at": "2025-01-16T10:05:00Z"
  }
]
```

---

### 2. 특정 정책의 문서 진행 상황 조회

```http
GET /api/v1/document-progress/policy/{policy_id}
Authorization: Bearer {token}
```

**파라미터:**
- `policy_id` (path): 정책 ID

**응답 예시:**
```json
[
  {
    "id": 1,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "policy_id": 5,
    "document_index": 0,
    "document_name": "신분증",
    "is_completed": true,
    "created_at": "2025-01-16T10:00:00Z",
    "updated_at": "2025-01-16T10:05:00Z",
    "completed_at": "2025-01-16T10:05:00Z"
  },
  {
    "id": 2,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "policy_id": 5,
    "document_index": 1,
    "document_name": "통장 사본",
    "is_completed": false,
    "created_at": "2025-01-16T10:00:00Z",
    "updated_at": null,
    "completed_at": null
  }
]
```

---

### 3. 문서 완료 상태 토글

```http
POST /api/v1/document-progress/toggle
Authorization: Bearer {token}
Content-Type: application/json
```

**요청 바디:**
```json
{
  "policy_id": 5,
  "document_index": 0,
  "document_name": "신분증"
}
```

**동작 방식:**
1. 레코드가 **존재하지 않으면**: `is_completed=True`로 생성 (첫 클릭)
2. 레코드가 **존재하면**: `is_completed` 값을 토글 (True ↔ False)

**응답 예시:**
```json
{
  "id": 1,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "policy_id": 5,
  "document_index": 0,
  "document_name": "신분증",
  "is_completed": true,
  "created_at": "2025-01-16T10:00:00Z",
  "updated_at": "2025-01-16T10:05:00Z",
  "completed_at": "2025-01-16T10:05:00Z"
}
```

---

### 4. 문서 진행 통계 조회

```http
GET /api/v1/document-progress/stats
Authorization: Bearer {token}
```

**응답 예시:**
```json
{
  "total_documents": 8,
  "completed_documents": 3,
  "completion_percentage": 37.5
}
```

---

## 🎯 핵심 로직

### 1. 페이지 로드 시 체크박스 상태 복원 (Frontend)

**파일**: `FinKuRN/src/screens/plan/PlanScreen.tsx`

```typescript
// 문서 완료 현황 로드
const loadDocumentProgress = async () => {
  try {
    const progressList = await documentProgressService.getAllDocumentProgress();

    // API 응답을 checkedItems 형식으로 변환
    const newCheckedItems: Record<number, Record<number, boolean>> = {};

    progressList.forEach((progress) => {
      if (!newCheckedItems[progress.policy_id]) {
        newCheckedItems[progress.policy_id] = {};
      }
      newCheckedItems[progress.policy_id][progress.document_index] = progress.is_completed;
    });

    setCheckedItems(newCheckedItems);
    console.log('📦 문서 진행 상황 로드 완료:', progressList.length, '개');
  } catch (err) {
    console.error('Load document progress error:', err);
    // 에러가 있어도 화면은 계속 표시
  }
};
```

**설명:**
- 페이지 로드 시 `loadData()` → `loadDocumentProgress()` 호출
- API로부터 모든 진행 상황 데이터 조회
- `{ policyId: { docIndex: boolean } }` 형식으로 변환하여 state에 저장

---

### 2. 체크박스 클릭 시 데이터베이스 저장 (Frontend)

**파일**: `FinKuRN/src/screens/plan/PlanScreen.tsx`

```typescript
// 체크박스 토글 핸들러 (API 연동)
const handleCheckboxToggle = async (policyId: number, docIndex: number, documentName: string) => {
  try {
    // 먼저 UI 업데이트 (낙관적 업데이트)
    setCheckedItems(prev => {
      const newState = { ...prev };
      if (!newState[policyId]) {
        newState[policyId] = {};
      }
      newState[policyId][docIndex] = !newState[policyId]?.[docIndex];
      return newState;
    });

    // API 호출로 데이터베이스에 저장
    await documentProgressService.toggleDocumentCompletion(
      policyId,
      docIndex,
      documentName
    );

    console.log(`✅ 체크박스 토글 완료: 정책 ${policyId}, 문서 ${docIndex} (${documentName})`);
  } catch (err) {
    console.error('Toggle checkbox error:', err);

    // 에러 발생 시 UI 복원
    setCheckedItems(prev => {
      const newState = { ...prev };
      if (newState[policyId]) {
        newState[policyId][docIndex] = !newState[policyId][docIndex];
      }
      return newState;
    });
  }
};
```

**설명:**
1. **낙관적 업데이트 (Optimistic Update)**: UI를 먼저 업데이트하여 즉각적인 반응 제공
2. **API 호출**: 백엔드에 상태 저장 요청
3. **에러 처리**: API 호출 실패 시 UI를 원래 상태로 복원

---

### 3. 문서 완료 상태 토글 로직 (Backend)

**파일**: `backend/app/api/v1/document_progress.py`

```python
@router.post("/toggle")
def toggle_document_completion(
    policy_id: int,
    document_index: int,
    document_name: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    문서 완료 상태 토글 (체크박스 클릭)
    - 존재하지 않으면 생성 (is_completed=True)
    - 존재하면 is_completed 토글
    """
    # 기존 레코드 조회
    progress = db.query(DocumentProgress).filter(
        DocumentProgress.user_id == uuid.UUID(user_id),
        DocumentProgress.policy_id == policy_id,
        DocumentProgress.document_index == document_index
    ).first()

    if progress:
        # 기존 레코드 업데이트
        progress.is_completed = not progress.is_completed
        progress.updated_at = datetime.now()

        if progress.is_completed:
            progress.completed_at = datetime.now()
        else:
            progress.completed_at = None
    else:
        # 새 레코드 생성 (첫 클릭 시 완료로 설정)
        progress = DocumentProgress(
            user_id=uuid.UUID(user_id),
            policy_id=policy_id,
            document_index=document_index,
            document_name=document_name,
            is_completed=True,
            completed_at=datetime.now()
        )
        db.add(progress)

    db.commit()
    db.refresh(progress)

    return {
        "id": progress.id,
        "user_id": str(progress.user_id),
        "policy_id": progress.policy_id,
        "document_index": progress.document_index,
        "document_name": progress.document_name,
        "is_completed": progress.is_completed,
        "created_at": progress.created_at,
        "updated_at": progress.updated_at,
        "completed_at": progress.completed_at
    }
```

**설명:**
1. **레코드 조회**: 사용자 ID, 정책 ID, 문서 인덱스로 기존 레코드 검색
2. **존재하면 토글**: `is_completed` 값을 반전 (True → False 또는 False → True)
3. **존재하지 않으면 생성**: 첫 클릭은 "완료"로 간주하여 `is_completed=True`로 레코드 생성
4. **타임스탬프 업데이트**: `updated_at`, `completed_at` 자동 갱신

---

## 🚀 설치 및 실행

### 1. 데이터베이스 테이블 생성

```bash
cd backend
export DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/finkurn"
python create_document_progress_table_sql.py
```

**출력 예시:**
```
============================================================
🔨 Creating user_document_progress Table (SQL)
============================================================
✅ user_document_progress 테이블 생성 완료!
📍 Database: postgresql://postgres:postgres123@localhost:5432/finkurn

📊 테이블 구조 (9개 컬럼):
------------------------------------------------------------
  id                        integer              NOT NULL
  user_id                   uuid                 NOT NULL
  policy_id                 integer              NOT NULL
  document_index            integer              NOT NULL
  document_name             character varying    NOT NULL
  is_completed              boolean              NOT NULL
  created_at                timestamp with time zone NULL
  updated_at                timestamp with time zone NULL
  completed_at              timestamp with time zone NULL
------------------------------------------------------------
```

---

### 2. 백엔드 서버 실행

백엔드는 자동으로 새 라우터를 감지하여 재시작됩니다.

```bash
# 이미 실행 중이면 자동 재시작됨
cd backend
python -m uvicorn app.main:app --reload --port 8001 --host 0.0.0.0
```

**API 문서 확인:**
- Swagger UI: http://localhost:8001/docs
- 새로운 엔드포인트가 `document-progress` 태그 아래 표시됨

---

### 3. 프론트엔드 실행

```bash
cd FinKuRN
npx expo start --web
```

브라우저에서 http://localhost:8081 접속 후:
1. 로그인
2. "할 일" 탭으로 이동
3. 체크박스 클릭하여 테스트

---

## 🧪 테스트

### 1. 수동 테스트

**시나리오 1: 체크박스 클릭 → 새로고침 → 상태 유지 확인**

1. PlanScreen에서 체크박스 클릭
2. 개발자 도구 콘솔에서 API 호출 확인:
   ```
   ✅ 체크박스 토글 완료: 정책 5, 문서 0 (신분증)
   ```
3. 페이지 새로고침 (F5)
4. 체크박스 상태가 유지되는지 확인

**시나리오 2: 여러 정책의 체크박스 클릭**

1. 4개 정책의 각 체크박스를 랜덤하게 클릭
2. 진행률 표시가 올바르게 업데이트되는지 확인:
   ```
   오늘 챙길 서류 8개 중 3개를 완료했어요
   진행률 38%
   ```

---

### 2. API 테스트 (cURL)

**전체 진행 상황 조회:**
```bash
curl -X GET "http://localhost:8001/api/v1/document-progress/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**특정 정책 진행 상황 조회:**
```bash
curl -X GET "http://localhost:8001/api/v1/document-progress/policy/5" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**체크박스 토글:**
```bash
curl -X POST "http://localhost:8001/api/v1/document-progress/toggle" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "policy_id": 5,
    "document_index": 0,
    "document_name": "신분증"
  }'
```

**통계 조회:**
```bash
curl -X GET "http://localhost:8001/api/v1/document-progress/stats" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 3. 데이터베이스 직접 조회

```sql
-- 모든 진행 상황 조회
SELECT * FROM user_document_progress;

-- 특정 사용자의 진행 상황
SELECT * FROM user_document_progress
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

-- 완료된 문서만 조회
SELECT * FROM user_document_progress
WHERE is_completed = true;

-- 정책별 완료율 조회
SELECT
    policy_id,
    COUNT(*) as total_docs,
    SUM(CASE WHEN is_completed THEN 1 ELSE 0 END) as completed_docs,
    ROUND(100.0 * SUM(CASE WHEN is_completed THEN 1 ELSE 0 END) / COUNT(*), 2) as completion_rate
FROM user_document_progress
GROUP BY policy_id;
```

---

## 📊 데이터 흐름

### 체크박스 클릭 시 데이터 흐름

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (PlanScreen)
    participant S as Service (documentProgressService)
    participant A as API (document_progress.py)
    participant D as Database (PostgreSQL)

    U->>F: 체크박스 클릭
    F->>F: setCheckedItems (낙관적 업데이트)
    F->>S: toggleDocumentCompletion(policyId, docIndex, name)
    S->>A: POST /document-progress/toggle
    A->>D: SELECT 기존 레코드 조회

    alt 레코드 존재
        A->>D: UPDATE is_completed = !is_completed
    else 레코드 없음
        A->>D: INSERT is_completed = true
    end

    D-->>A: 업데이트된 레코드 반환
    A-->>S: DocumentProgress 응답
    S-->>F: 성공
    F-->>U: UI 업데이트 완료

    alt API 에러 발생
        S-->>F: 에러
        F->>F: setCheckedItems (롤백)
        F-->>U: 원래 상태로 복원
    end
```

---

## 🔒 보안

### 인증 및 권한

1. **JWT 토큰 인증**: 모든 API 엔드포인트는 `Authorization: Bearer {token}` 헤더 필수
2. **사용자 격리**: `get_current_user_id()` 의존성을 통해 현재 사용자 ID만 조회/수정 가능
3. **SQL Injection 방지**: SQLAlchemy ORM 사용으로 자동 방어
4. **CSRF 방지**: RESTful API 구조로 CSRF 공격 벡터 최소화

### 데이터 무결성

1. **Unique 제약**: `(user_id, policy_id, document_index)` 조합으로 중복 방지
2. **Foreign Key**: `ON DELETE CASCADE`로 데이터 일관성 유지
3. **낙관적 업데이트 + 롤백**: API 실패 시 UI 자동 복원

---

## 🐛 알려진 이슈 및 제한사항

### 현재 제한사항

1. **실시간 동기화 없음**:
   - 여러 디바이스에서 동시 접속 시 실시간 동기화 안 됨
   - 해결 방법: WebSocket 또는 Server-Sent Events 도입 필요

2. **오프라인 지원 없음**:
   - 네트워크 오프라인 상태에서 체크박스 클릭 시 에러 발생
   - 해결 방법: IndexedDB/AsyncStorage + 동기화 큐 구현 필요

3. **벌크 작업 미지원**:
   - 한 번에 여러 체크박스를 토글하는 API 없음
   - 해결 방법: `POST /document-progress/bulk-update` 엔드포인트 추가

### 알려진 버그

없음 (2025-01-16 기준)

---

## 🔮 향후 개선 사항

### Phase 2: 성능 최적화

- [ ] Redis 캐싱 추가 (자주 조회되는 진행 상황)
- [ ] 배치 업데이트 API 구현
- [ ] GraphQL Subscription으로 실시간 동기화

### Phase 3: 기능 확장

- [ ] 문서별 메모 기능 (예: "은행 영업 시간 확인 필요")
- [ ] 문서 업로드 기능 (S3 연동)
- [ ] 알림 기능 (마감일 3일 전 미완료 서류 리마인드)
- [ ] 통계 대시보드 (월별 완료율, 정책별 진행 현황)

### Phase 4: 협업 기능

- [ ] 가족/친구와 진행 상황 공유
- [ ] 멘토링 기능 (선배 사용자가 후배 도와주기)

---

## 📞 문의 및 지원

**작업자**: Claude Code
**GitHub**: https://github.com/anthropics/claude-code
**문서 버전**: 1.0.0
**최종 수정**: 2025-01-16
