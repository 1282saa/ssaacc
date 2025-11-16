/**
 * 온보딩 서비스 (Onboarding Service)
 *
 * 온보딩 프로세스의 모든 단계를 관리하는 서비스입니다.
 * 사용자의 목표, 기본 정보, 동의 사항을 백엔드에 저장하고
 * 온보딩 상태를 추적합니다.
 *
 * @module services/onboardingService  
 * @category Services
 * @since 1.0.0
 */

import type { 
  UserGoal, 
  JobCategory, 
  IncomeRange,
  GoalSelectionData,
  BasicInfoData,
  ConsentData 
} from '../types/onboarding';

const API_BASE_URL = 'http://localhost:8001/api/v1';

/**
 * 온보딩 상태 응답 인터페이스
 */
export interface OnboardingStatusResponse {
  onboarding_completed: boolean;
  profile_completion_rate: number;
  current_step: string;
}

/**
 * 기본 API 응답 인터페이스
 */
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * 온보딩 완료 응답 인터페이스
 */
export interface OnboardingCompleteResponse extends ApiResponse {
  user_id: string;
}

/**
 * 인증 토큰 가져오기 (AsyncStorage에서)
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    // React Native 환경에서 AsyncStorage 사용
    if (typeof window === 'undefined') {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem('authToken');
    }
    
    // 웹 환경에서는 localStorage 사용
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return null;
  }
};

/**
 * API 헤더 생성
 */
const getApiHeaders = async () => {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * 온보딩 상태 조회
 */
export const getOnboardingStatus = async (): Promise<OnboardingStatusResponse | null> => {
  try {
    const headers = await getApiHeaders();
    
    const response = await fetch(`${API_BASE_URL}/onboarding/status`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('온보딩 상태 조회 실패:', error);
    return null;
  }
};

/**
 * 목표 선택 저장
 */
export const saveGoals = async (goals: UserGoal[]): Promise<ApiResponse> => {
  try {
    const headers = await getApiHeaders();

    const response = await fetch(`${API_BASE_URL}/onboarding/goals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ goals }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API 오류: ${response.status}`);
    }

    // 백엔드가 {message: "..."} 형식으로 반환하므로 success: true 추가
    return {
      success: true,
      message: data.message || '목표가 저장되었습니다.'
    };
  } catch (error) {
    console.error('목표 저장 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '목표 저장에 실패했습니다.'
    };
  }
};

/**
 * 기본 정보 저장
 */
export const saveProfile = async (profile: BasicInfoData): Promise<ApiResponse> => {
  try {
    const headers = await getApiHeaders();

    const requestData = {
      age: profile.age,
      region: profile.region,
      job_category: profile.jobCategory,
      income_range: profile.incomeRange,
    };

    const response = await fetch(`${API_BASE_URL}/onboarding/profile`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API 오류: ${response.status}`);
    }

    // 백엔드가 {message: "..."} 형식으로 반환하므로 success: true 추가
    return {
      success: true,
      message: data.message || '기본 정보가 저장되었습니다.'
    };
  } catch (error) {
    console.error('기본 정보 저장 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '기본 정보 저장에 실패했습니다.'
    };
  }
};

/**
 * 동의 사항 저장
 */
export const saveConsent = async (consent: ConsentData): Promise<ApiResponse> => {
  try {
    const headers = await getApiHeaders();
    
    const requestData = {
      push_notification: consent.pushNotification,
      marketing_notification: consent.marketingNotification, 
      reward_program: consent.rewardProgram,
    };
    
    const response = await fetch(`${API_BASE_URL}/onboarding/consent`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `API 오류: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('동의 사항 저장 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '동의 사항 저장에 실패했습니다.'
    };
  }
};

/**
 * 온보딩 완료
 */
export const completeOnboarding = async (): Promise<OnboardingCompleteResponse | null> => {
  try {
    const headers = await getApiHeaders();
    
    const response = await fetch(`${API_BASE_URL}/onboarding/complete`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `API 오류: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('온보딩 완료 처리 실패:', error);
    return null;
  }
};

/**
 * 온보딩 서비스 객체 Export
 */
export const onboardingService = {
  getOnboardingStatus,
  saveGoals,
  saveProfile,
  saveConsent,
  completeOnboarding,
};