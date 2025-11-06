# FinKuRN 프로젝트 구조

Financial Knowledge & Resource Navigator - 청년을 위한 맞춤형 금융 서비스 앱

## 📂 전체 디렉토리 구조

```
FinKuRN/
├── src/
│   ├── api/                      # API 통신 레이어
│   │   ├── onboardingApi.ts      # 온보딩 API
│   │   └── planApi.ts            # Plan(할 일) API
│   │
│   ├── components/               # 재사용 가능한 UI 컴포넌트
│   │   ├── common/               # 공통 컴포넌트
│   │   │   ├── BackgroundGradient.tsx
│   │   │   └── StatusBar.tsx
│   │   ├── home/                 # 홈 화면 전용 컴포넌트
│   │   ├── plan/                 # Plan 화면 전용 컴포넌트
│   │   │   ├── README.md         # Plan 컴포넌트 문서
│   │   │   ├── index.ts
│   │   │   ├── ProgressCard.tsx
│   │   │   ├── TaskItemCard.tsx
│   │   │   ├── UpcomingItemCard.tsx
│   │   │   └── GoalCard.tsx
│   │   └── NavIcons.tsx          # 네비게이션 아이콘
│   │
│   ├── constants/                # 상수 및 설정
│   │   ├── theme.ts              # 디자인 시스템 (색상, 타이포그래피)
│   │   └── gradients.ts          # 그라디언트 설정
│   │
│   ├── navigation/               # 네비게이션 구조
│   │   └── MainNavigator.tsx     # 메인 네비게이터 (Stack + Tab)
│   │
│   ├── screens/                  # 화면 컴포넌트
│   │   ├── onboarding/           # 온보딩 화면
│   │   │   ├── README.md         # 온보딩 문서
│   │   │   ├── index.ts
│   │   │   ├── OnboardingWelcomeScreen.tsx
│   │   │   ├── OnboardingGoalsScreen.tsx
│   │   │   ├── OnboardingBasicInfoScreen.tsx
│   │   │   ├── OnboardingConsentScreen.tsx
│   │   │   └── OnboardingCompleteScreen.tsx
│   │   ├── LoginScreen.tsx       # 로그인
│   │   ├── SignupScreen.tsx      # 회원가입
│   │   ├── HomeScreen.tsx        # 홈 대시보드
│   │   ├── ChatbotScreenV2.tsx   # 챗봇
│   │   ├── ExploreScreen.tsx     # 탐색/혜택
│   │   ├── PlanScreen.tsx        # Plan (할 일 관리)
│   │   └── TodayListScreen.tsx   # 오늘의 할 일 상세
│   │
│   ├── services/                 # 비즈니스 로직
│   │   └── authService.ts        # 인증 서비스
│   │
│   ├── types/                    # TypeScript 타입 정의
│   │   ├── navigation.ts         # 네비게이션 타입
│   │   ├── onboarding.ts         # 온보딩 타입
│   │   └── plan.ts               # Plan 타입
│   │
│   └── App.tsx                   # 루트 컴포넌트
│
├── assets/                       # 정적 리소스
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md                     # 프로젝트 소개
├── ONBOARDING_README.md          # 온보딩 시스템 가이드
└── PROJECT_STRUCTURE.md          # 이 파일
```

---

## 🎯 핵심 기능별 파일 위치

### 1. 온보딩 시스템
```
📁 화면: src/screens/onboarding/
📁 타입: src/types/onboarding.ts
📁 API: src/api/onboardingApi.ts
📄 문서: src/screens/onboarding/README.md
📄 가이드: ONBOARDING_README.md
```

### 2. Plan (할 일 관리) 시스템
```
📁 화면: src/screens/PlanScreen.tsx
📁 컴포넌트: src/components/plan/
📁 타입: src/types/plan.ts
📁 API: src/api/planApi.ts
📄 문서: src/components/plan/README.md
```

### 3. 인증 시스템
```
📁 화면: src/screens/LoginScreen.tsx, SignupScreen.tsx
📁 서비스: src/services/authService.ts
```

### 4. 홈 대시보드
```
📁 화면: src/screens/HomeScreen.tsx
📁 컴포넌트: src/components/home/
```

### 5. 네비게이션
```
📁 네비게이터: src/navigation/MainNavigator.tsx
📁 타입: src/types/navigation.ts
```

---

## 📋 주요 디렉토리 설명

### `src/api/` - API 통신 레이어

**역할**: 백엔드 API와의 통신을 담당하는 함수들을 모아둔 디렉토리

**파일**:
- `onboardingApi.ts`: 온보딩 데이터 제출, 상태 조회, 진행 상황 저장
- `planApi.ts`: Plan 데이터 조회, Task 완료 상태 업데이트, Goal 업데이트

**특징**:
- Mock 데이터와 실제 API 호출 예시 포함
- TypeScript로 타입 안전성 보장
- JSDoc으로 상세한 API 문서화

**사용 예시**:
```typescript
import { fetchPlanData, updateTaskCompletion } from '@/api/planApi';

const data = await fetchPlanData('user123');
await updateTaskCompletion('user123', 'task-1', true);
```

---

### `src/components/` - UI 컴포넌트

**역할**: 재사용 가능한 UI 컴포넌트를 기능별로 분류

**구조**:
```
components/
├── common/          # 앱 전체에서 사용하는 공통 컴포넌트
├── home/            # 홈 화면 전용
├── plan/            # Plan 화면 전용 (README 포함)
└── NavIcons.tsx     # 네비게이션 아이콘
```

**설계 원칙**:
- **단일 책임 원칙**: 각 컴포넌트는 하나의 명확한 역할
- **Props 인터페이스**: 모든 Props를 TypeScript로 정의
- **JSDoc 문서화**: 컴포넌트 사용법 명시

---

### `src/constants/` - 상수 및 설정

**역할**: 앱 전체에서 사용하는 상수 값 관리

**파일**:
- `theme.ts`: 색상, 타이포그래피, 간격, 테두리 등 디자인 시스템
- `gradients.ts`: 그라디언트 배경 설정

**Theme 구조**:
```typescript
export const theme = {
  colors: {
    primary: '#3060F1',
    background: '#F5F5F5',
    white: '#FFFFFF',
    // ...
  },
  typography: {
    heading1: { fontSize: 28, fontWeight: '700' },
    // ...
  },
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32
  },
  borderRadius: {
    sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, full: 9999
  }
};
```

---

### `src/navigation/` - 네비게이션 구조

**역할**: 앱의 화면 전환 및 라우팅 관리

**파일**:
- `MainNavigator.tsx`: Stack Navigator + Bottom Tab Navigator

**네비게이션 구조**:
```
Stack Navigator (Root)
├── Login
├── Signup
├── OnboardingWelcome
├── OnboardingGoals
├── OnboardingBasicInfo
├── OnboardingConsent
├── OnboardingComplete
└── Main (Tab Navigator)
    ├── HomeTab
    ├── ChatTab
    ├── ExploreTab
    ├── PlanTab
    └── ProfileTab
```

---

### `src/screens/` - 화면 컴포넌트

**역할**: 앱의 각 화면을 담당하는 최상위 컴포넌트

**디렉토리 구조**:
```
screens/
├── onboarding/              # 온보딩 화면 (5개 파일 + README)
├── LoginScreen.tsx          # 로그인
├── SignupScreen.tsx         # 회원가입
├── HomeScreen.tsx           # 홈 대시보드
├── ChatbotScreenV2.tsx      # 챗봇
├── ExploreScreen.tsx        # 탐색/혜택
├── PlanScreen.tsx           # Plan (할 일 관리)
└── TodayListScreen.tsx      # 오늘의 할 일 상세
```

**화면별 책임**:
- 데이터 Fetching (API 호출)
- 상태 관리 (useState, useEffect)
- 이벤트 핸들링
- 컴포넌트 조합

---

### `src/services/` - 비즈니스 로직

**역할**: 복잡한 비즈니스 로직을 분리하여 관리

**파일**:
- `authService.ts`: 로그인, 회원가입, 소셜 로그인

**특징**:
- 화면 컴포넌트에서 비즈니스 로직 분리
- 재사용 가능한 서비스 함수
- 에러 처리 중앙화

---

### `src/types/` - TypeScript 타입 정의

**역할**: 앱 전체에서 사용하는 타입을 중앙에서 관리

**파일**:
- `navigation.ts`: 네비게이션 관련 타입
- `onboarding.ts`: 온보딩 관련 타입
- `plan.ts`: Plan 관련 타입

**타입 안전성**:
```typescript
// navigation.ts
export type AppNavigation = NavigationProp<RootStackParamList>;

// onboarding.ts
export type UserGoal = '저축' | '학자금' | '신용관리' | '투자기초';

// plan.ts
export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  dDay: number;
}
```

---

## 🎨 디자인 시스템

### 색상 팔레트
```typescript
primary: '#3060F1'      // 메인 파란색
background: '#F5F5F5'   // 배경색
white: '#FFFFFF'        // 카드 배경
black: '#000000'        // 텍스트
textPrimary: '#1A1A1A'  // 주요 텍스트
textSecondary: '#666666' // 보조 텍스트
error: '#FF3B30'        // 에러
```

### 타이포그래피
```
heading1: 28px, bold       - 화면 제목
heading2: 24px, 600        - 섹션 제목
heading3: 20px, 600        - 카드 제목
heading4: 18px, 600        - 서브 제목
body1: 16px, regular       - 본문
body2: 14px, regular       - 보조 본문
body3: 13px, regular       - 작은 텍스트
```

### 간격 (Spacing)
```
xs: 4px    md: 12px   xl: 20px
sm: 8px    lg: 16px   xxl: 24px   xxxl: 32px
```

### 테두리 (Border Radius)
```
sm: 8px    lg: 16px   xxl: 24px
md: 12px   xl: 20px   xxxl: 32px   full: 9999px
```

---

## 🔧 기술 스택

### 코어
- **React Native**: 크로스 플랫폼 모바일 앱 개발
- **Expo**: React Native 개발 플랫폼
- **TypeScript**: 타입 안전성

### 네비게이션
- **React Navigation**: Stack + Bottom Tab Navigator

### UI
- **Expo Linear Gradient**: 그라디언트 배경
- **@expo/vector-icons**: 아이콘

### 상태 관리
- **useState**: 로컬 상태
- **useEffect**: 사이드 이펙트
- (추후) Context API / Redux

---

## 📝 코드 작성 가이드

### 1. 파일 명명 규칙
- **컴포넌트**: PascalCase (예: `OnboardingWelcomeScreen.tsx`)
- **유틸리티**: camelCase (예: `authService.ts`)
- **타입**: camelCase (예: `onboarding.ts`)

### 2. 컴포넌트 구조
```typescript
/**
 * JSDoc 주석
 */
import React, { useState } from 'react';
import { View, Text } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => {}, []);

  // Event Handlers
  const handlePress = () => {};

  // Render
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles
});
```

### 3. JSDoc 작성 규칙
```typescript
/**
 * 컴포넌트 설명
 *
 * @component
 * @param {Props} props - Props 설명
 * @returns {JSX.Element} 반환값 설명
 *
 * @example
 * ```tsx
 * <MyComponent title="Hello" onPress={() => {}} />
 * ```
 */
```

### 4. Import 순서
```typescript
// 1. React
import React, { useState } from 'react';

// 2. React Native
import { View, Text } from 'react-native';

// 3. Third-party
import { useNavigation } from '@react-navigation/native';

// 4. Internal components
import { BackgroundGradient } from '@/components/common';

// 5. Internal utils
import { theme } from '@/constants/theme';

// 6. Types
import type { AppNavigation } from '@/types/navigation';
```

---

## 🔄 데이터 플로우

### 온보딩 플로우
```
User Input (화면)
    ↓
State (useState)
    ↓
Navigation (다음 화면)
    ↓
...모든 단계 완료
    ↓
API 제출 (submitOnboardingData)
    ↓
AsyncStorage 저장
    ↓
Main 화면 진입
```

### Plan 화면 플로우
```
PlanScreen Mount
    ↓
fetchPlanData() → API
    ↓
setState(planData)
    ↓
Render Components
    ↓
User Interaction (Task Toggle)
    ↓
Optimistic Update (setState)
    ↓
updateTaskCompletion() → API
    ↓
(실패 시 Rollback)
```

---

## 🧪 테스트 전략

### 단위 테스트
```typescript
// Component Test
describe('ProgressCard', () => {
  it('should display correct percentage', () => {
    // ...
  });
});

// API Test
describe('planApi', () => {
  it('should fetch plan data', async () => {
    // ...
  });
});
```

### E2E 테스트
```typescript
// 온보딩 플로우
it('should complete onboarding flow', async () => {
  // Welcome → Goals → BasicInfo → Consent → Complete → Main
});
```

---

## 📚 문서 위치

### 메인 문서
- `README.md`: 프로젝트 소개
- `PROJECT_STRUCTURE.md`: 이 파일 (프로젝트 구조)
- `ONBOARDING_README.md`: 온보딩 시스템 가이드

### 모듈별 문서
- `src/screens/onboarding/README.md`: 온보딩 화면 문서
- `src/components/plan/README.md`: Plan 컴포넌트 문서

### 인라인 문서
- 모든 파일 상단: 파일 설명 JSDoc
- 모든 컴포넌트/함수: 상세한 JSDoc 주석

---

## 🚀 시작하기

### 설치
```bash
npm install
# or
yarn install
```

### 실행
```bash
# Expo 개발 서버 시작
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### 빌드
```bash
# Production 빌드
expo build:android
expo build:ios
```

---

## 🔐 환경 변수

```env
# .env
API_BASE_URL=https://api.finkurn.com/v1
EXPO_PUBLIC_API_URL=https://api.finkurn.com/v1
```

---

## 📌 TODO

### 즉시 필요
- [ ] AsyncStorage 통합 (온보딩 완료 상태)
- [ ] 실제 API 엔드포인트 연동
- [ ] 에러 처리 및 Toast 메시지
- [ ] 로딩 인디케이터

### 중기 계획
- [ ] Context API / Redux 도입
- [ ] 단위 테스트 작성
- [ ] E2E 테스트 작성
- [ ] CI/CD 파이프라인

### 장기 계획
- [ ] 오프라인 모드
- [ ] 푸시 알림
- [ ] 애니메이션 개선
- [ ] 접근성 (Accessibility)

---

## 🤝 기여 가이드

### Commit 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드, 설정 변경
```

### Pull Request
1. Feature 브랜치 생성
2. 코드 작성 및 테스트
3. README 업데이트
4. PR 생성 및 리뷰 요청

---

**작성일**: 2025-01-15
**버전**: 1.0.0
**작성자**: FinKuRN Development Team
