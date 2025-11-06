# Plan Components

Plan 화면에서 사용하는 재사용 가능한 UI 컴포넌트 모듈입니다. 단일 책임 원칙(Single Responsibility Principle)을 준수하여 각 컴포넌트가 하나의 명확한 역할을 수행합니다.

## 📁 파일 구조

```
src/components/plan/
├── README.md                # 이 파일
├── index.ts                 # Export 통합 파일
├── ProgressCard.tsx         # 주간 진행률 카드
├── TaskItemCard.tsx         # 개별 할 일 아이템
├── UpcomingItemCard.tsx     # 다가오는 일정 아이템
└── GoalCard.tsx             # 목표별 체크리스트 카드
```

## 🎯 컴포넌트 개요

| 컴포넌트 | 역할 | 사용 위치 |
|---------|------|----------|
| `ProgressCard` | 주간 완료 현황 및 다음 마감일 표시 | Plan 화면 상단 |
| `TaskItemCard` | 개별 할 일 표시 및 완료 토글 | Today's Tasks 섹션 |
| `UpcomingItemCard` | 예정된 일정 표시 | Upcoming Schedule 섹션 |
| `GoalCard` | 목표별 체크리스트 진행 현황 | 목표별 실천 현황 섹션 |

---

## 📄 컴포넌트 상세 설명

### 1. `index.ts`
**역할**: 모든 Plan 컴포넌트를 중앙에서 export하여 import를 간소화합니다.

**사용 예시**:
```typescript
import { ProgressCard, TaskItemCard, UpcomingItemCard, GoalCard } from '@/components/plan';
```

---

### 2. `ProgressCard.tsx`

**파일 위치**: `src/components/plan/ProgressCard.tsx`

**목적**: 이번 주 완료한 할 일 개수와 진행률, 다음 마감일을 시각적으로 표시합니다.

**Props 인터페이스**:
```typescript
interface ProgressCardProps {
  completed: number;        // 완료된 개수
  total: number;            // 전체 개수
  percentage: number;       // 완료율 (0-100)
  nextDueTitle: string;     // 다음 마감 항목 제목
  nextDueDDay: number;      // D-day 일수
}
```

**UI 구조**:
```
┌──────────────────────────────┐
│  이번 주 5개 중 3개를 완료   │
│  했어요 👏                   │
│                              │
│  ████████░░░░  60%          │
│                              │
│  다음 마감: 청년도약계좌 D-2│
└──────────────────────────────┘
```

**사용 예시**:
```typescript
<ProgressCard
  completed={3}
  total={5}
  percentage={60}
  nextDueTitle="청년도약계좌 서류 제출"
  nextDueDDay={2}
/>
```

**주요 기능**:
- 완료 개수와 전체 개수를 강조 표시
- 진행률 바 (Progress Bar) 시각화
- 다음 마감일 D-day 표시

**스타일 특징**:
- 카드 배경: 흰색
- Border radius: `theme.borderRadius.xxxl` (32px)
- 진행률 바 색상: `theme.colors.primary`

---

### 3. `TaskItemCard.tsx`

**파일 위치**: `src/components/plan/TaskItemCard.tsx`

**목적**: 개별 할 일 항목을 표시하고 체크박스로 완료 여부를 토글합니다.

**Props 인터페이스**:
```typescript
interface TaskItemCardProps {
  id: string;              // Task 고유 ID
  title: string;           // Task 제목
  completed: boolean;      // 완료 여부
  dDay: number;           // D-day 일수
  encouragement?: string; // 완료 시 응원 메시지
  onToggle: (id: string) => void; // 완료 토글 핸들러
}
```

**UI 구조 (미완료)**:
```
┌──────────────────────────────┐
│  ○  공과금 납부          D-DAY│
│     이번 달 전기요금 43,200원 │
│     오늘 납부하지 않으면...    │
└──────────────────────────────┘
```

**UI 구조 (완료)**:
```
┌──────────────────────────────┐
│  ✓  공과금 납부          완료  │
│     이번 달 전기요금 43,200원 │
│     💙 완료했어요! 연체료... │
└──────────────────────────────┘
```

**사용 예시**:
```typescript
<TaskItemCard
  id="task-1"
  title="공과금 납부"
  completed={false}
  dDay={0}
  encouragement="완료했어요! 연체료 걱정 없이 한 달을 시작하세요"
  onToggle={handleToggleTask}
/>
```

**주요 기능**:
- 체크박스 클릭으로 완료/미완료 토글
- D-day 표시 (D-DAY, D-2, D-7 등)
- 완료 시 취소선 및 응원 메시지 표시
- 낙관적 업데이트 (Optimistic Update) 지원

**상태별 스타일**:
- **미완료**: 빈 원형 체크박스, 검은색 텍스트
- **완료**: 파란색 체크 표시, 회색 취소선 텍스트, 응원 메시지

**D-day 포맷**:
```typescript
const formatDDay = (dDay: number): string => {
  if (dDay === 0) return 'D-DAY';
  if (dDay < 0) return `지남`;
  return `D-${dDay}`;
};
```

---

### 4. `UpcomingItemCard.tsx`

**파일 위치**: `src/components/plan/UpcomingItemCard.tsx`

**목적**: 다가오는 일정을 간단하게 표시합니다.

**Props 인터페이스**:
```typescript
interface UpcomingItemCardProps {
  id: string;        // 일정 고유 ID
  icon: string;      // 아이콘 (이모지)
  title: string;     // 일정 제목
  dDay: number;      // D-day 일수
}
```

**UI 구조**:
```
┌──────────────────────────────┐
│  💳  신용카드 결제일     D-3  │
└──────────────────────────────┘
```

**사용 예시**:
```typescript
<UpcomingItemCard
  id="upcoming-1"
  icon="💳"
  title="신용카드 결제일"
  dDay={3}
/>
```

**주요 기능**:
- 아이콘으로 카테고리 시각화
- D-day 표시
- 간결한 1줄 레이아웃

**스타일 특징**:
- 카드 배경: 흰색
- 높이: 고정 (컴팩트한 디자인)
- flexDirection: row, 좌우 정렬

---

### 5. `GoalCard.tsx`

**파일 위치**: `src/components/plan/GoalCard.tsx`

**목적**: 특정 목표에 대한 체크리스트 항목들과 진행률을 표시합니다.

**Props 인터페이스**:
```typescript
interface GoalCardProps {
  id: string;                    // 목표 고유 ID
  title: string;                 // 목표 제목
  category: GoalCategory;        // 카테고리
  completed: number;             // 완료된 개수
  total: number;                 // 전체 개수
  percentage: number;            // 완료율 (0-100)
  checklists: ChecklistItem[];   // 체크리스트 항목 배열
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}
```

**UI 구조**:
```
┌──────────────────────────────┐
│  🏠 내 집 마련 적금   2/3 완료│
│                              │
│  ████████░░░░  67%          │
│                              │
│  ✓ 적금 상품 비교하기        │
│  ✓ 은행 방문하여 계좌 개설   │
│  ○ 자동이체 설정하기         │
└──────────────────────────────┘
```

**사용 예시**:
```typescript
<GoalCard
  id="goal-1"
  title="🏠 내 집 마련 적금"
  category="저축"
  completed={2}
  total={3}
  percentage={67}
  checklists={[
    { id: '1', text: '적금 상품 비교하기', completed: true },
    { id: '2', text: '은행 방문하여 계좌 개설', completed: true },
    { id: '3', text: '자동이체 설정하기', completed: false },
  ]}
/>
```

**주요 기능**:
- 목표별 진행률 시각화
- 체크리스트 항목 표시
- 완료/미완료 상태 구분
- 체크박스 UI

**체크리스트 스타일**:
- **완료**: 파란색 체크 표시, 검은색 텍스트
- **미완료**: 빈 원형 체크박스, 회색 텍스트

**진행률 바**:
- 높이: 8px
- 배경: `#E5E5E5`
- 채움: `theme.colors.primary`

---

## 🎨 공통 디자인 패턴

### 카드 스타일
모든 카드 컴포넌트는 동일한 디자인 패턴을 따릅니다:

```typescript
const commonCardStyle = {
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.xxxl,  // 32px
  padding: theme.spacing.xl,              // 20px
  marginBottom: theme.spacing.md,         // 12px
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
};
```

### 체크박스 스타일
```typescript
// 미완료
<View style={{
  width: 24,
  height: 24,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: '#D0D0D0',
  backgroundColor: theme.colors.white,
}} />

// 완료
<View style={{
  width: 24,
  height: 24,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: theme.colors.primary,
  backgroundColor: theme.colors.primary,
}}>
  <Text style={{ color: 'white' }}>✓</Text>
</View>
```

### Progress Bar
```typescript
<View style={{
  height: 8,
  backgroundColor: '#E5E5E5',
  borderRadius: 4,
  overflow: 'hidden',
}}>
  <View style={{
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: theme.colors.primary,
  }} />
</View>
```

---

## 🔗 관련 파일

### 타입 정의
- `src/types/plan.ts`: Plan 관련 모든 타입 정의

### API
- `src/api/planApi.ts`: Plan 데이터 fetch 및 업데이트 API

### 화면
- `src/screens/PlanScreen.tsx`: Plan 화면 (컴포넌트 사용처)

---

## 📊 데이터 플로우

```
PlanScreen
    │
    ├─ fetchPlanData() → API
    │       ↓
    ├─ setState(planData)
    │       ↓
    ├─→ ProgressCard (props: planData.progress)
    │
    ├─→ TaskItemCard[] (props: planData.todayTasks)
    │       │
    │       └─ onToggle(taskId)
    │           ↓
    │       handleToggleTask()
    │           ↓
    │       updateTaskCompletion() → API
    │
    ├─→ UpcomingItemCard[] (props: planData.upcomingSchedule)
    │
    └─→ GoalCard[] (props: planData.goals)
```

---

## 🧪 테스트 예시

### ProgressCard 테스트
```typescript
it('should display correct completion percentage', () => {
  const { getByText } = render(
    <ProgressCard
      completed={3}
      total={5}
      percentage={60}
      nextDueTitle="청년도약계좌"
      nextDueDDay={2}
    />
  );

  expect(getByText(/5개 중 3개/)).toBeTruthy();
  expect(getByText('60%')).toBeTruthy();
});
```

### TaskItemCard 테스트
```typescript
it('should call onToggle when checkbox is pressed', () => {
  const mockOnToggle = jest.fn();
  const { getByTestId } = render(
    <TaskItemCard
      id="task-1"
      title="공과금 납부"
      completed={false}
      dDay={0}
      onToggle={mockOnToggle}
    />
  );

  fireEvent.press(getByTestId('checkbox'));
  expect(mockOnToggle).toHaveBeenCalledWith('task-1');
});
```

---

## 🚀 사용 예시

### PlanScreen에서 컴포넌트 사용
```typescript
import { ProgressCard, TaskItemCard, UpcomingItemCard, GoalCard } from '@/components/plan';

export const PlanScreen: React.FC = () => {
  const [planData, setPlanData] = useState<PlanScreenData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPlanData('user123');
      setPlanData(data);
    };
    loadData();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    // 낙관적 업데이트 + API 동기화
    const updatedTasks = planData.todayTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setPlanData({ ...planData, todayTasks: updatedTasks });

    await updateTaskCompletion('user123', taskId, task.completed);
  };

  if (!planData) return <LoadingIndicator />;

  return (
    <ScrollView>
      {/* 진행률 카드 */}
      <ProgressCard {...planData.progress} />

      {/* 오늘의 할 일 */}
      {planData.todayTasks.map((task) => (
        <TaskItemCard
          key={task.id}
          {...task}
          onToggle={handleToggleTask}
        />
      ))}

      {/* 다가오는 일정 */}
      {planData.upcomingSchedule.map((item) => (
        <UpcomingItemCard key={item.id} {...item} />
      ))}

      {/* 목표별 실천 현황 */}
      {planData.goals?.map((goal) => (
        <GoalCard key={goal.id} {...goal} />
      ))}
    </ScrollView>
  );
};
```

---

## 📝 개발 가이드

### 새 컴포넌트 추가 시
1. 파일명: `[ComponentName]Card.tsx` 형식 사용
2. Props interface 명확히 정의
3. JSDoc 주석 작성
4. `index.ts`에 export 추가
5. README 업데이트

### Props 네이밍 규칙
- Boolean: `is-`, `has-`, `should-` 접두사 사용
- Handler: `on-` 접두사 사용 (예: `onToggle`, `onClick`)
- 데이터: 명사형 (예: `title`, `completed`, `percentage`)

### 스타일 가이드
- 모든 스타일은 컴포넌트 하단에 `StyleSheet.create()` 사용
- Theme 시스템 적극 활용
- Magic number 지양, 상수화

---

## 🔄 버전 히스토리

### v1.0.0 (2025-01-15)
- ✅ ProgressCard 구현
- ✅ TaskItemCard 구현
- ✅ UpcomingItemCard 구현
- ✅ GoalCard 구현
- ✅ 단일 책임 원칙 적용
- ✅ JSDoc 문서화 완료

---

## 📚 참고 문서
- [PlanScreen 가이드](../../screens/PlanScreen.tsx)
- [타입 정의](../../types/plan.ts)
- [API 함수](../../api/planApi.ts)
