/**
 * Onboarding 타입 정의
 *
 * @module types/onboarding
 * @category Types
 * @since 1.0.0
 *
 * @description
 * 온보딩 프로세스에서 사용하는 모든 타입을 정의합니다.
 *
 * 온보딩 흐름:
 * 1. 핀쿠 인사 + 서비스 소개
 * 2. 목표 선택 (저축 / 학자금 / 신용관리 / 투자기초)
 * 3. 기본 정보 입력 (연령 / 직업 / 소득 / 지역)
 * 4. 알림 및 리워드 동의
 * 5. 완료 및 홈 진입
 */

/**
 * 사용자 목표 타입
 *
 * @description
 * 사용자가 선택할 수 있는 금융 목표를 정의합니다.
 */
export type UserGoal = '지원금' | '주거·임대 지원' | '취업·경력 개발' | '가족·생활 지원';

/**
 * 직업 카테고리 타입
 *
 * @description
 * 사용자의 직업 카테고리를 정의합니다.
 */
export type JobCategory =
  | '학생'
  | '취업준비생'
  | '직장인'
  | '프리랜서'
  | '자영업'
  | '기타';

/**
 * 소득 구간 타입
 *
 * @description
 * 사용자의 월 소득 구간을 정의합니다.
 */
export type IncomeRange =
  | '100만원 미만'
  | '100-200만원'
  | '200-300만원'
  | '300-400만원'
  | '400만원 이상';

/**
 * 목표 선택 데이터 인터페이스
 *
 * @interface GoalSelectionData
 * @property {UserGoal[]} selectedGoals - 선택된 목표 배열 (최대 3개)
 */
export interface GoalSelectionData {
  selectedGoals: UserGoal[];
}

/**
 * 기본 정보 입력 데이터 인터페이스
 *
 * @interface BasicInfoData
 * @property {number} age - 사용자 연령
 * @property {JobCategory} jobCategory - 직업 카테고리
 * @property {IncomeRange} incomeRange - 소득 구간
 * @property {string} region - 거주 지역 (예: "서울특별시 강남구")
 */
export interface BasicInfoData {
  age: number;
  jobCategory: JobCategory;
  incomeRange: IncomeRange;
  region: string;
}

/**
 * 알림 및 동의 데이터 인터페이스
 *
 * @interface ConsentData
 * @property {boolean} pushNotification - 푸시 알림 동의 여부
 * @property {boolean} marketingNotification - 마케팅 알림 동의 여부
 * @property {boolean} rewardProgram - 리워드 프로그램 참여 동의 여부
 */
export interface ConsentData {
  pushNotification: boolean;
  marketingNotification: boolean;
  rewardProgram: boolean;
}

/**
 * 온보딩 전체 데이터 인터페이스
 *
 * @interface OnboardingData
 * @property {GoalSelectionData} goals - 목표 선택 데이터
 * @property {BasicInfoData} basicInfo - 기본 정보 데이터
 * @property {ConsentData} consent - 알림 및 동의 데이터
 * @property {string} userId - 사용자 ID (서버에서 생성)
 * @property {Date} completedAt - 온보딩 완료 시간
 */
export interface OnboardingData {
  goals: GoalSelectionData;
  basicInfo: BasicInfoData;
  consent: ConsentData;
  userId?: string;
  completedAt?: Date;
}

/**
 * 온보딩 단계 타입
 *
 * @description
 * 현재 온보딩 프로세스의 진행 단계를 나타냅니다.
 */
export type OnboardingStep =
  | 'welcome' // 인사 및 소개
  | 'goals' // 목표 선택
  | 'basicInfo' // 기본 정보
  | 'consent' // 알림 동의
  | 'complete'; // 완료
