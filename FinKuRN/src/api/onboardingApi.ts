/**
 * Onboarding API
 *
 * @module API/OnboardingApi
 * @category API
 * @since 1.0.0
 *
 * @description
 * 온보딩 프로세스와 관련된 모든 API 함수를 정의합니다.
 * - 온보딩 데이터 임시 저장
 * - 온보딩 완료 데이터 제출
 * - 온보딩 상태 조회
 *
 * @example
 * ```tsx
 * import { submitOnboardingData, checkOnboardingStatus } from '@/api/onboardingApi';
 *
 * // 온보딩 데이터 제출
 * const result = await submitOnboardingData(onboardingData);
 *
 * // 온보딩 완료 여부 확인
 * const status = await checkOnboardingStatus(userId);
 * ```
 *
 * @architecture
 * 현재는 Mock 데이터를 사용하며, 실제 백엔드 구현 시
 * fetch 또는 axios를 사용하여 API 호출로 대체합니다.
 */

import type { OnboardingData } from '../types/onboarding';

/**
 * API 기본 URL
 *
 * @constant API_BASE_URL
 * @description
 * 백엔드 API의 기본 URL입니다.
 * 환경 변수 또는 설정 파일에서 관리하는 것을 권장합니다.
 *
 * @example
 * ```typescript
 * // .env 파일에서 관리
 * API_BASE_URL=process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
 * ```
 */
const API_BASE_URL = 'https://api.finkurn.com/v1'; // TODO: 실제 API URL로 변경

/**
 * API 응답 타입
 *
 * @interface ApiResponse
 * @template T - 응답 데이터 타입
 * @property {boolean} success - 성공 여부
 * @property {T} data - 응답 데이터
 * @property {string} [message] - 응답 메시지 (선택사항)
 * @property {string} [error] - 에러 메시지 (선택사항)
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * 온보딩 제출 응답 데이터
 *
 * @interface OnboardingSubmitResponse
 * @property {string} userId - 생성된 또는 업데이트된 사용자 ID
 * @property {string} completedAt - 온보딩 완료 시간 (ISO 8601 형식)
 * @property {number} welcomePoints - 첫 가입 보너스 포인트
 */
interface OnboardingSubmitResponse {
  userId: string;
  completedAt: string;
  welcomePoints: number;
}

/**
 * 온보딩 상태 응답 데이터
 *
 * @interface OnboardingStatusResponse
 * @property {boolean} completed - 온보딩 완료 여부
 * @property {string | null} completedAt - 온보딩 완료 시간 (ISO 8601 형식)
 * @property {OnboardingData | null} data - 저장된 온보딩 데이터 (있는 경우)
 */
interface OnboardingStatusResponse {
  completed: boolean;
  completedAt: string | null;
  data: OnboardingData | null;
}

// ============================================
// API Functions
// ============================================

/**
 * 온보딩 데이터 제출 API
 *
 * @async
 * @function submitOnboardingData
 * @param {OnboardingData} data - 온보딩 데이터
 * @returns {Promise<OnboardingSubmitResponse>} 제출 결과
 *
 * @description
 * 사용자가 입력한 온보딩 데이터를 서버에 제출합니다.
 * - 목표 선택 정보
 * - 기본 정보 (연령, 직업, 소득, 지역)
 * - 알림 및 동의 정보
 *
 * @throws {Error} 네트워크 오류 또는 서버 오류 발생 시
 *
 * @example
 * ```typescript
 * const onboardingData: OnboardingData = {
 *   goals: { selectedGoals: ['저축', '투자기초'] },
 *   basicInfo: {
 *     age: 25,
 *     jobCategory: '직장인',
 *     incomeRange: '200-300만원',
 *     region: '서울특별시 강남구'
 *   },
 *   consent: {
 *     pushNotification: true,
 *     marketingNotification: false,
 *     rewardProgram: true
 *   }
 * };
 *
 * try {
 *   const result = await submitOnboardingData(onboardingData);
 *   console.log('User ID:', result.userId);
 *   console.log('Welcome Points:', result.welcomePoints);
 * } catch (error) {
 *   console.error('Failed to submit onboarding:', error);
 * }
 * ```
 *
 * @apiEndpoint POST /onboarding
 * @apiRequestBody
 * ```json
 * {
 *   "goals": { "selectedGoals": ["저축", "투자기초"] },
 *   "basicInfo": {
 *     "age": 25,
 *     "jobCategory": "직장인",
 *     "incomeRange": "200-300만원",
 *     "region": "서울특별시 강남구"
 *   },
 *   "consent": {
 *     "pushNotification": true,
 *     "marketingNotification": false,
 *     "rewardProgram": true
 *   }
 * }
 * ```
 *
 * @apiResponse
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "userId": "usr_1234567890",
 *     "completedAt": "2025-01-15T10:30:00.000Z",
 *     "welcomePoints": 500
 *   },
 *   "message": "온보딩이 완료되었습니다"
 * }
 * ```
 */
export const submitOnboardingData = async (
  data: OnboardingData
): Promise<OnboardingSubmitResponse> => {
  try {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch(`${API_BASE_URL}/onboarding`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    //
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    //
    // const result: ApiResponse<OnboardingSubmitResponse> = await response.json();
    //
    // if (!result.success) {
    //   throw new Error(result.error || 'Failed to submit onboarding data');
    // }
    //
    // return result.data;

    // Mock 응답 (300ms 지연)
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log('Submitting onboarding data:', data);

    return {
      userId: 'usr_' + Date.now(),
      completedAt: new Date().toISOString(),
      welcomePoints: 500,
    };
  } catch (error) {
    console.error('submitOnboardingData error:', error);
    throw error;
  }
};

/**
 * 온보딩 상태 조회 API
 *
 * @async
 * @function checkOnboardingStatus
 * @param {string} userId - 사용자 ID
 * @returns {Promise<OnboardingStatusResponse>} 온보딩 상태
 *
 * @description
 * 특정 사용자의 온보딩 완료 여부를 확인합니다.
 * 앱 시작 시 온보딩 화면을 표시할지 메인 화면을 표시할지 결정하는 데 사용됩니다.
 *
 * @throws {Error} 네트워크 오류 또는 서버 오류 발생 시
 *
 * @example
 * ```typescript
 * try {
 *   const status = await checkOnboardingStatus('usr_1234567890');
 *   if (status.completed) {
 *     // 메인 화면으로 이동
 *     navigation.navigate('Main');
 *   } else {
 *     // 온보딩 화면으로 이동
 *     navigation.navigate('OnboardingWelcome');
 *   }
 * } catch (error) {
 *   console.error('Failed to check onboarding status:', error);
 * }
 * ```
 *
 * @apiEndpoint GET /onboarding/status/:userId
 * @apiResponse
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "completed": true,
 *     "completedAt": "2025-01-15T10:30:00.000Z",
 *     "data": null
 *   }
 * }
 * ```
 */
export const checkOnboardingStatus = async (
  userId: string
): Promise<OnboardingStatusResponse> => {
  try {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch(`${API_BASE_URL}/onboarding/status/${userId}`);
    //
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    //
    // const result: ApiResponse<OnboardingStatusResponse> = await response.json();
    //
    // if (!result.success) {
    //   throw new Error(result.error || 'Failed to check onboarding status');
    // }
    //
    // return result.data;

    // Mock 응답 (200ms 지연)
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log('Checking onboarding status for user:', userId);

    // Mock: 기본적으로 온보딩 미완료로 반환
    return {
      completed: false,
      completedAt: null,
      data: null,
    };
  } catch (error) {
    console.error('checkOnboardingStatus error:', error);
    throw error;
  }
};

/**
 * 온보딩 데이터 임시 저장 API
 *
 * @async
 * @function saveOnboardingProgress
 * @param {string} userId - 사용자 ID
 * @param {Partial<OnboardingData>} data - 부분 온보딩 데이터
 * @returns {Promise<void>}
 *
 * @description
 * 온보딩 진행 중 데이터를 임시로 저장합니다.
 * 사용자가 중간에 이탈했다가 돌아왔을 때 이어서 진행할 수 있도록 합니다.
 *
 * @throws {Error} 네트워크 오류 또는 서버 오류 발생 시
 *
 * @example
 * ```typescript
 * // 목표 선택 후 임시 저장
 * await saveOnboardingProgress(userId, {
 *   goals: { selectedGoals: ['저축', '투자기초'] }
 * });
 *
 * // 기본 정보 입력 후 임시 저장
 * await saveOnboardingProgress(userId, {
 *   goals: { selectedGoals: ['저축', '투자기초'] },
 *   basicInfo: {
 *     age: 25,
 *     jobCategory: '직장인',
 *     incomeRange: '200-300만원',
 *     region: '서울특별시 강남구'
 *   }
 * });
 * ```
 *
 * @apiEndpoint PATCH /onboarding/progress/:userId
 * @apiRequestBody
 * ```json
 * {
 *   "goals": { "selectedGoals": ["저축", "투자기초"] }
 * }
 * ```
 *
 * @apiResponse
 * ```json
 * {
 *   "success": true,
 *   "message": "온보딩 진행 상황이 저장되었습니다"
 * }
 * ```
 */
export const saveOnboardingProgress = async (
  userId: string,
  data: Partial<OnboardingData>
): Promise<void> => {
  try {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch(`${API_BASE_URL}/onboarding/progress/${userId}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    //
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    //
    // const result: ApiResponse<void> = await response.json();
    //
    // if (!result.success) {
    //   throw new Error(result.error || 'Failed to save onboarding progress');
    // }

    // Mock 응답 (200ms 지연)
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log('Saving onboarding progress for user:', userId, data);
  } catch (error) {
    console.error('saveOnboardingProgress error:', error);
    throw error;
  }
};

/**
 * Mock 온보딩 데이터
 *
 * @constant MOCK_ONBOARDING_DATA
 * @description
 * 개발 및 테스트용 Mock 온보딩 데이터입니다.
 */
export const MOCK_ONBOARDING_DATA: OnboardingData = {
  goals: {
    selectedGoals: ['저축', '투자기초'],
  },
  basicInfo: {
    age: 25,
    jobCategory: '직장인',
    incomeRange: '200-300만원',
    region: '서울특별시 강남구',
  },
  consent: {
    pushNotification: true,
    marketingNotification: false,
    rewardProgram: true,
  },
  userId: 'usr_mock_123',
  completedAt: new Date('2025-01-15T10:30:00.000Z'),
};
