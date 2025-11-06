# 온보딩 시스템 구현 가이드

## 📋 개요

FinKuRN 앱의 온보딩(Onboarding) 시스템은 신규 사용자가 앱을 처음 사용할 때 필요한 정보를 수집하고, 맞춤형 금융 서비스를 제공하기 위한 초기 설정 프로세스입니다.

## 🎯 온보딩 흐름

```
1. 환영 화면 (OnboardingWelcomeScreen)
   └─> 핀쿠 인사 + 서비스 소개

2. 목표 선택 (OnboardingGoalsScreen)
   └─> 저축 / 학자금 / 신용관리 / 투자기초 (최대 3개 선택)

3. 기본 정보 입력 (OnboardingBasicInfoScreen)
   └─> 연령 / 직업 / 소득 / 지역

4. 알림 및 동의 (OnboardingConsentScreen)
   └─> 푸시 알림 / 마케팅 알림 / 리워드 프로그램

5. 완료 (OnboardingCompleteScreen)
   └─> 축하 메시지 + 메인 앱 진입
```

## 📁 파일 구조

```
src/
├── screens/onboarding/
│   ├── OnboardingWelcomeScreen.tsx      # 1단계: 환영 화면
│   ├── OnboardingGoalsScreen.tsx        # 2단계: 목표 선택
│   ├── OnboardingBasicInfoScreen.tsx    # 3단계: 기본 정보 입력
│   ├── OnboardingConsentScreen.tsx      # 4단계: 알림 및 동의
│   ├── OnboardingCompleteScreen.tsx     # 5단계: 완료
│   └── index.ts                         # Export 통합
├── types/
│   └── onboarding.ts                    # 온보딩 타입 정의
├── api/
│   └── onboardingApi.ts                 # 온보딩 API 함수
└── navigation/
    └── MainNavigator.tsx                # 온보딩 화면 통합
```

## 🔧 주요 기능

### 1. OnboardingWelcomeScreen (환영 화면)

**위치**: `src/screens/onboarding/OnboardingWelcomeScreen.tsx`

**기능**:
- 핀쿠(🐧) 캐릭터 소개
- 서비스 핵심 기능 3가지 소개
  - 💰 맞춤형 금융 정보
  - 📋 실천 가능한 체크리스트
  - 🏆 목표 달성 리워드
- 진행 표시 (1/4 활성화)
- "시작하기" 버튼으로 다음 단계 진행

**코드 예시**:
```tsx
import { OnboardingWelcomeScreen } from '@/screens/onboarding';

// 네비게이션에서 사용
navigation.navigate('OnboardingWelcome');
```

---

### 2. OnboardingGoalsScreen (목표 선택)

**위치**: `src/screens/onboarding/OnboardingGoalsScreen.tsx`

**기능**:
- 4가지 금융 목표 중 최대 3개 선택
  - 💰 저축
  - 🎓 학자금
  - 💳 신용관리
  - 📈 투자기초
- 선택된 목표는 파란색 하이라이트 + 체크 표시
- 선택 개수 표시 (예: "2/3 선택됨")
- 최소 1개 이상 선택 시 "다음" 버튼 활성화
- 진행 표시 (2/4 활성화)

**타입 정의**:
```typescript
// src/types/onboarding.ts
export type UserGoal = '저축' | '학자금' | '신용관리' | '투자기초';

export interface GoalSelectionData {
  selectedGoals: UserGoal[];
}
```

**상태 관리**:
```tsx
const [selectedGoals, setSelectedGoals] = useState<UserGoal[]>([]);

const handleToggleGoal = (goal: UserGoal) => {
  if (selectedGoals.includes(goal)) {
    setSelectedGoals(selectedGoals.filter((g) => g !== goal));
  } else {
    if (selectedGoals.length >= 3) {
      // 최대 3개 제한
      return;
    }
    setSelectedGoals([...selectedGoals, goal]);
  }
};
```

---

### 3. OnboardingBasicInfoScreen (기본 정보 입력)

**위치**: `src/screens/onboarding/OnboardingBasicInfoScreen.tsx`

**기능**:
- **연령**: 숫자 입력 (만 나이)
- **직업**: 6가지 카테고리 중 선택
  - 학생 / 취업준비생 / 직장인 / 프리랜서 / 자영업 / 기타
- **월 소득**: 5가지 구간 중 선택
  - 100만원 미만 / 100-200만원 / 200-300만원 / 300-400만원 / 400만원 이상
- **거주 지역**: 텍스트 입력 (예: "서울특별시 강남구")
- 모든 필드 입력 시 "다음" 버튼 활성화
- 진행 표시 (3/4 활성화)

**타입 정의**:
```typescript
// src/types/onboarding.ts
export type JobCategory =
  | '학생'
  | '취업준비생'
  | '직장인'
  | '프리랜서'
  | '자영업'
  | '기타';

export type IncomeRange =
  | '100만원 미만'
  | '100-200만원'
  | '200-300만원'
  | '300-400만원'
  | '400만원 이상';

export interface BasicInfoData {
  age: number;
  jobCategory: JobCategory;
  incomeRange: IncomeRange;
  region: string;
}
```

**입력 검증**:
```tsx
// 연령: 숫자만 허용
const handleAgeChange = (value: string) => {
  const numericValue = value.replace(/[^0-9]/g, '');
  setAge(numericValue);
};

// 다음 버튼 활성화 조건
const isNextButtonEnabled =
  age.length > 0 &&
  jobCategory !== null &&
  incomeRange !== null &&
  region.trim().length > 0;
```

---

### 4. OnboardingConsentScreen (알림 및 동의)

**위치**: `src/screens/onboarding/OnboardingConsentScreen.tsx`

**기능**:
- **전체 동의** 버튼으로 모든 항목 일괄 동의
- 개별 동의 항목 (모두 선택사항):
  - 🔔 푸시 알림: 마감일 알림과 맞춤형 금융 정보
  - 📬 마케팅 알림: 새로운 혜택과 이벤트 소식
  - 🎁 리워드 프로그램: 목표 달성 시 핀쿠 포인트
- 안내 문구: "💡 알림을 허용하면 마감일을 놓치지 않고..."
- 진행 표시 (4/4 활성화)
- "완료" 버튼으로 다음 단계 진행

**타입 정의**:
```typescript
// src/types/onboarding.ts
export interface ConsentData {
  pushNotification: boolean;
  marketingNotification: boolean;
  rewardProgram: boolean;
}
```

**전체 동의 기능**:
```tsx
const handleAgreeAll = () => {
  setConsents({
    pushNotification: true,
    marketingNotification: true,
    rewardProgram: true,
  });
};

const isAllAgreed =
  consents.pushNotification &&
  consents.marketingNotification &&
  consents.rewardProgram;
```

---

### 5. OnboardingCompleteScreen (완료)

**위치**: `src/screens/onboarding/OnboardingCompleteScreen.tsx`

**기능**:
- 🐧 핀쿠 캐릭터 + 축하 효과 (🎉✨🎊)
- 완료 메시지: "모든 준비가 완료되었어요!"
- 하이라이트 기능 재안내 (3가지)
- "핀쿠와 함께 시작하기" 버튼으로 메인 앱 진입
- 온보딩 완료 상태 저장 (AsyncStorage)
- 네비게이션 스택 리셋하여 메인 화면으로 이동

**네비게이션 리셋**:
```tsx
const handleStart = async () => {
  try {
    // AsyncStorage에 온보딩 완료 저장
    // await AsyncStorage.setItem('onboarding_completed', 'true');

    // 백엔드 API 호출
    // await submitOnboardingData(onboardingData);

    // 메인 화면으로 이동 (스택 리셋)
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  } catch (error) {
    console.error('Failed to complete onboarding:', error);
  }
};
```

---

## 🔌 API 연동

### API 파일 구조

**위치**: `src/api/onboardingApi.ts`

### 1. submitOnboardingData

온보딩 완료 시 전체 데이터를 서버에 제출합니다.

**함수 시그니처**:
```typescript
export const submitOnboardingData = async (
  data: OnboardingData
): Promise<OnboardingSubmitResponse>
```

**요청 데이터**:
```typescript
interface OnboardingData {
  goals: GoalSelectionData;
  basicInfo: BasicInfoData;
  consent: ConsentData;
  userId?: string;
  completedAt?: Date;
}
```

**API 엔드포인트**:
```
POST /api/v1/onboarding
Content-Type: application/json

Request Body:
{
  "goals": {
    "selectedGoals": ["저축", "투자기초"]
  },
  "basicInfo": {
    "age": 25,
    "jobCategory": "직장인",
    "incomeRange": "200-300만원",
    "region": "서울특별시 강남구"
  },
  "consent": {
    "pushNotification": true,
    "marketingNotification": false,
    "rewardProgram": true
  }
}

Response:
{
  "success": true,
  "data": {
    "userId": "usr_1234567890",
    "completedAt": "2025-01-15T10:30:00.000Z",
    "welcomePoints": 500
  },
  "message": "온보딩이 완료되었습니다"
}
```

**사용 예시**:
```tsx
import { submitOnboardingData } from '@/api/onboardingApi';

const handleComplete = async () => {
  const onboardingData = {
    goals: { selectedGoals: ['저축', '투자기초'] },
    basicInfo: {
      age: 25,
      jobCategory: '직장인',
      incomeRange: '200-300만원',
      region: '서울특별시 강남구'
    },
    consent: {
      pushNotification: true,
      marketingNotification: false,
      rewardProgram: true
    }
  };

  try {
    const result = await submitOnboardingData(onboardingData);
    console.log('User ID:', result.userId);
    console.log('Welcome Points:', result.welcomePoints);
  } catch (error) {
    console.error('Failed to submit:', error);
  }
};
```

---

### 2. checkOnboardingStatus

사용자의 온보딩 완료 여부를 확인합니다.

**함수 시그니처**:
```typescript
export const checkOnboardingStatus = async (
  userId: string
): Promise<OnboardingStatusResponse>
```

**API 엔드포인트**:
```
GET /api/v1/onboarding/status/:userId

Response:
{
  "success": true,
  "data": {
    "completed": true,
    "completedAt": "2025-01-15T10:30:00.000Z",
    "data": null
  }
}
```

**사용 예시**:
```tsx
import { checkOnboardingStatus } from '@/api/onboardingApi';

const checkStatus = async (userId: string) => {
  try {
    const status = await checkOnboardingStatus(userId);
    if (status.completed) {
      navigation.navigate('Main');
    } else {
      navigation.navigate('OnboardingWelcome');
    }
  } catch (error) {
    console.error('Failed to check status:', error);
  }
};
```

---

### 3. saveOnboardingProgress

온보딩 진행 중 데이터를 임시 저장합니다.

**함수 시그니처**:
```typescript
export const saveOnboardingProgress = async (
  userId: string,
  data: Partial<OnboardingData>
): Promise<void>
```

**API 엔드포인트**:
```
PATCH /api/v1/onboarding/progress/:userId
Content-Type: application/json

Request Body:
{
  "goals": {
    "selectedGoals": ["저축", "투자기초"]
  }
}

Response:
{
  "success": true,
  "message": "온보딩 진행 상황이 저장되었습니다"
}
```

**사용 예시**:
```tsx
import { saveOnboardingProgress } from '@/api/onboardingApi';

// 목표 선택 후 임시 저장
await saveOnboardingProgress(userId, {
  goals: { selectedGoals: ['저축', '투자기초'] }
});

// 기본 정보 입력 후 임시 저장
await saveOnboardingProgress(userId, {
  goals: { selectedGoals: ['저축', '투자기초'] },
  basicInfo: {
    age: 25,
    jobCategory: '직장인',
    incomeRange: '200-300만원',
    region: '서울특별시 강남구'
  }
});
```

---

## 🎨 디자인 시스템

### 색상 (Colors)

- **Primary**: `theme.colors.primary` - 파란색 (버튼, 활성 상태)
- **Background**: `theme.colors.background` - 배경색
- **White**: `theme.colors.white` - 카드 배경
- **Text Primary**: `theme.colors.textPrimary` - 주요 텍스트
- **Text Secondary**: `theme.colors.textSecondary` - 보조 텍스트
- **Selected Background**: `#F0F6FF` - 선택된 항목 배경

### 간격 (Spacing)

- `theme.spacing.xs` - 4px
- `theme.spacing.sm` - 8px
- `theme.spacing.md` - 12px
- `theme.spacing.lg` - 16px
- `theme.spacing.xl` - 20px
- `theme.spacing.xxl` - 24px
- `theme.spacing.xxxl` - 32px

### 둥근 모서리 (Border Radius)

- `theme.borderRadius.xl` - 16px (카드)
- `theme.borderRadius.full` - 9999px (버튼)

### 타이포그래피 (Typography)

- **Title**: 28-32px, 굵기 700
- **Subtitle**: 16px, 굵기 400
- **Body**: 14-16px, 굵기 400-600
- **Button**: 18px, 굵기 600

---

## 🔄 상태 관리 (추후 개선 사항)

### Context API 사용 (권장)

온보딩 데이터를 여러 화면에서 공유하기 위해 Context API 사용을 권장합니다.

**OnboardingContext 예시**:
```tsx
// src/contexts/OnboardingContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { OnboardingData } from '@/types/onboarding';

interface OnboardingContextType {
  onboardingData: Partial<OnboardingData>;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  resetOnboardingData: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const resetOnboardingData = () => {
    setOnboardingData({});
  };

  return (
    <OnboardingContext.Provider
      value={{ onboardingData, updateOnboardingData, resetOnboardingData }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
```

**사용 예시**:
```tsx
// OnboardingGoalsScreen.tsx
import { useOnboarding } from '@/contexts/OnboardingContext';

const { onboardingData, updateOnboardingData } = useOnboarding();

const handleNext = () => {
  updateOnboardingData({
    goals: { selectedGoals }
  });
  navigation.navigate('OnboardingBasicInfo');
};
```

---

## 📱 네비게이션 통합

### MainNavigator 설정

**위치**: `src/navigation/MainNavigator.tsx`

온보딩 화면들이 Stack Navigator에 통합되어 있습니다:

```tsx
<Stack.Navigator>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Signup" component={SignupScreen} />

  {/* 온보딩 화면 */}
  <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcomeScreen} />
  <Stack.Screen name="OnboardingGoals" component={OnboardingGoalsScreen} />
  <Stack.Screen name="OnboardingBasicInfo" component={OnboardingBasicInfoScreen} />
  <Stack.Screen name="OnboardingConsent" component={OnboardingConsentScreen} />
  <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />

  {/* 메인 앱 */}
  <Stack.Screen name="Main" component={TabNavigator} />
  {/* ... */}
</Stack.Navigator>
```

### 첫 화면 결정 로직

앱 시작 시 온보딩 완료 여부를 확인하여 첫 화면을 결정합니다:

```tsx
// App.tsx 또는 LoginScreen.tsx
import { checkOnboardingStatus } from '@/api/onboardingApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const checkInitialRoute = async () => {
  try {
    // 방법 1: AsyncStorage 확인
    const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');

    if (onboardingCompleted === 'true') {
      return 'Main';
    } else {
      return 'OnboardingWelcome';
    }

    // 방법 2: API 확인
    // const userId = await getUserId();
    // const status = await checkOnboardingStatus(userId);
    // return status.completed ? 'Main' : 'OnboardingWelcome';
  } catch (error) {
    console.error('Failed to check initial route:', error);
    return 'OnboardingWelcome'; // 기본값
  }
};
```

---

## ✅ 체크리스트

### 백엔드 개발자를 위한 체크리스트

- [ ] POST `/api/v1/onboarding` 엔드포인트 구현
- [ ] GET `/api/v1/onboarding/status/:userId` 엔드포인트 구현
- [ ] PATCH `/api/v1/onboarding/progress/:userId` 엔드포인트 구현
- [ ] 온보딩 데이터 DB 스키마 생성
- [ ] 사용자별 온보딩 완료 플래그 관리
- [ ] 첫 가입 보너스 포인트 지급 로직

### 프론트엔드 개발자를 위한 체크리스트

- [x] 5개 온보딩 화면 구현
- [x] 타입 정의 (onboarding.ts)
- [x] API 함수 정의 (onboardingApi.ts)
- [x] 네비게이션 통합
- [ ] Context API 또는 상태 관리 라이브러리 연동
- [ ] AsyncStorage로 온보딩 완료 상태 저장
- [ ] 실제 API 호출로 Mock 함수 대체
- [ ] 에러 처리 및 Toast 메시지 추가
- [ ] 로딩 인디케이터 추가
- [ ] 애니메이션 효과 추가 (선택사항)

---

## 🚀 다음 단계

1. **Context API 통합**: 온보딩 데이터를 전역 상태로 관리
2. **AsyncStorage 연동**: 온보딩 완료 상태 로컬 저장
3. **API 연동**: Mock 함수를 실제 API 호출로 대체
4. **에러 처리**: Toast 메시지 및 에러 UI 추가
5. **테스트**: 전체 온보딩 플로우 E2E 테스트
6. **애니메이션**: 화면 전환 및 완료 애니메이션 추가
7. **분석**: 온보딩 단계별 이탈률 추적

---

## 📚 관련 문서

- [타입 정의](./src/types/onboarding.ts)
- [API 함수](./src/api/onboardingApi.ts)
- [네비게이션 구조](./src/navigation/MainNavigator.tsx)
- [Plan 화면 가이드](./PLAN_SCREEN_GUIDE.md) - Plan 화면 구현 참고

---

## 💡 참고 사항

- 모든 화면은 `HOME_GRADIENTS`를 배경으로 사용하여 일관성 유지
- 진행 표시(Progress Dots)로 사용자에게 현재 단계 표시
- 각 화면의 "다음" 버튼은 필수 입력 사항 완료 시에만 활성화
- 온보딩 완료 후 메인 화면으로 이동 시 네비게이션 스택 리셋 필수
- 모든 함수와 컴포넌트는 JSDoc으로 상세하게 문서화되어 있음

---

**작성일**: 2025-01-15
**버전**: 1.0.0
**작성자**: Claude Code
