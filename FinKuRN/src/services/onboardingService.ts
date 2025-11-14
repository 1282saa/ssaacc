/**
 * 온보딩 서비스 (Onboarding Service)
 *
 * 사용자 온보딩 과정 관련 모든 기능을 제공하는 서비스 레이어입니다.
 * 목표 선택, 기본 정보 입력, 동의 사항 처리 등 온보딩 관련 API 호출을 담당합니다.
 *
 * @module services/onboardingService
 * @category Services
 * @since 1.0.0
 */

import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';
import { 
  UserGoal, 
  JobCategory, 
  IncomeRange, 
  GoalSelectionData, 
  BasicInfoData, 
  ConsentData,
  OnboardingStep 
} from '../types/onboarding';

/**
 * HTTP 에러 응답 인터페이스
 */
interface ErrorResponse {
  detail: string;
}

/**
 * 서비스 응답 인터페이스
 */
interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * API 요청 헤더 생성
 */
const createHeaders = (token: string): Record<string, string> => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

/**
 * API 요청 래퍼 함수
 */
const apiRequest = async <T>(
  url: string,
  options: RequestInit,
  token: string
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...createHeaders(token),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ErrorResponse;
    throw new Error(errorData.detail || '요청 실패');
  }

  return data as T;
};

/**
 * 목표 선택 저장
 *
 * 사용자가 선택한 금융 목표를 백엔드에 저장합니다.
 *
 * @async
 * @param {UserGoal[]} goals - 선택된 목표 배열
 * @param {UserGoal} [priorityGoal] - 최우선 목표
 * @returns {Promise<ServiceResponse>} 목표 저장 결과
 */
export const saveGoals = async (
  goals: UserGoal[],
  priorityGoal?: UserGoal
): Promise<ServiceResponse> => {
  try {
    const token = await authService.getStoredToken();
    
    if (!token) {
      return {
        success: false,
        error: "인증이 필요합니다.",
      };
    }

    const requestData = {
      goals,
      priority_goal: priorityGoal,
    };

    const response = await apiRequest(
      API_ENDPOINTS.ONBOARDING.GOALS,
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      },
      token
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Save goals error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "목표 저장에 실패했습니다.",
    };
  }
};

/**
 * 기본 정보 저장
 *
 * 사용자의 기본 정보(나이, 지역, 직업, 소득 등)를 백엔드에 저장합니다.
 *
 * @async
 * @param {BasicInfoData} profileData - 기본 정보 데이터
 * @returns {Promise<ServiceResponse>} 기본 정보 저장 결과
 */
export const saveProfile = async (
  profileData: BasicInfoData
): Promise<ServiceResponse> => {
  try {
    const token = await authService.getStoredToken();
    
    if (!token) {
      return {
        success: false,
        error: "인증이 필요합니다.",
      };
    }

    const requestData = {
      age: profileData.age,
      region: profileData.region,
      job_category: profileData.jobCategory,
      employment_status: profileData.jobCategory, // 기본값으로 job_category 사용
      income_range: profileData.incomeRange,
      education_level: "대졸", // 기본값
    };

    const response = await apiRequest(
      API_ENDPOINTS.ONBOARDING.PROFILE,
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      },
      token
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Save profile error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "기본 정보 저장에 실패했습니다.",
    };
  }
};

/**
 * 동의 사항 저장
 *
 * 사용자의 동의 사항을 백엔드에 저장합니다.
 *
 * @async
 * @param {ConsentData} consentData - 동의 사항 데이터
 * @returns {Promise<ServiceResponse>} 동의 사항 저장 결과
 */
export const saveConsent = async (
  consentData: ConsentData
): Promise<ServiceResponse> => {
  try {
    const token = await authService.getStoredToken();
    
    if (!token) {
      return {
        success: false,
        error: "인증이 필요합니다.",
      };
    }

    const requestData = {
      push_notification: consentData.pushNotification,
      marketing_notification: consentData.marketingNotification,
      data_analytics: consentData.rewardProgram, // rewardProgram을 data_analytics로 매핑
      personalized_ads: false, // 기본값
      ai_personality: "친근한", // 기본값
    };

    const response = await apiRequest(
      API_ENDPOINTS.ONBOARDING.CONSENT,
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      },
      token
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Save consent error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "동의 사항 저장에 실패했습니다.",
    };
  }
};

/**
 * 온보딩 상태 조회
 *
 * 사용자의 온보딩 진행 상태를 조회합니다.
 *
 * @async
 * @returns {Promise<ServiceResponse>} 온보딩 상태 조회 결과
 */
export const getOnboardingStatus = async (): Promise<ServiceResponse> => {
  try {
    const token = await authService.getStoredToken();
    
    if (!token) {
      return {
        success: false,
        error: "인증이 필요합니다.",
      };
    }

    const response = await apiRequest(
      API_ENDPOINTS.ONBOARDING.STATUS,
      {
        method: 'GET',
      },
      token
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Get onboarding status error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "온보딩 상태 조회에 실패했습니다.",
    };
  }
};

/**
 * 온보딩 서비스 객체 Export
 */
export const onboardingService = {
  saveGoals,
  saveProfile,
  saveConsent,
  getOnboardingStatus,
};