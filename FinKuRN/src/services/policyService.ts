/**
 * 정책 서비스 (Policy Service)
 *
 * 사용자-정책 관리 관련 모든 API 호출을 담당합니다.
 * - 정책 진행 현황 조회
 * - 사용자 정책 목록 조회
 * - 정책 추가, 수정, 삭제
 *
 * @module services/policyService
 * @category Services
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../config/api';

/**
 * API 응답 공통 인터페이스
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 정책 기본 정보
 */
export interface Policy {
  id: number;
  policy_name: string;
  category?: string | null;
  region?: string | null;
  deadline?: string | null;
  summary?: string | null;
}

/**
 * 사용자-정책 정보
 */
export interface UserPolicy {
  id: string;
  user_id: string;
  policy_id: number;
  status: 'interested' | 'in_progress' | 'completed' | 'cancelled';
  personal_deadline?: string | null;
  documents_total: number;
  documents_submitted: number;
  notes?: string | null;
  reminder_enabled: boolean;
  reminder_days_before: number;
  created_at: string;
  updated_at?: string | null;

  // 계산된 필드들
  documents_remaining: number;
  days_until_deadline?: number | null;

  // 정책 정보
  policy: Policy;
}

/**
 * 정책 진행 현황 (PlanScreen용)
 */
export interface UserPolicyProgress {
  id: string;
  policy_name: string;
  status: string;
  documents_total: number;
  documents_submitted: number;
  progress_percentage: number;
  days_until_deadline?: number | null;
  deadline_text: string; // "D-1", "D-Day", "결과 발표 대기" 등
}

/**
 * 사용자-정책 목록 응답
 */
export interface UserPolicyListResponse {
  total: number;
  policies: UserPolicy[];
}

/**
 * 사용자-정책 생성 요청
 */
export interface UserPolicyCreateRequest {
  policy_id: number;
  status?: string;
  personal_deadline?: string;
  documents_total?: number;
  documents_submitted?: number;
  notes?: string;
  reminder_enabled?: boolean;
  reminder_days_before?: number;
}

/**
 * 사용자-정책 수정 요청
 */
export interface UserPolicyUpdateRequest {
  status?: string;
  personal_deadline?: string;
  documents_total?: number;
  documents_submitted?: number;
  notes?: string;
  reminder_enabled?: boolean;
  reminder_days_before?: number;
}

/**
 * 청년 정책 (모든 사용자에게 공통으로 제공되는 정책)
 */
export interface YouthPolicy {
  id: number;
  policy_name: string;
  filename?: string | null;
  policy_number?: string | null;
  category?: string | null;
  region?: string | null;
  deadline?: string | null;
  summary?: string | null;
  full_text?: string | null;
  operation_period?: string | null;
  application_period?: string | null;
  support_content?: string | null;
  support_scale?: string | null;
  eligibility?: {
    age?: { min: number; max: number; description: string };
    income?: { description: string };
    region?: string[];
  } | null;
  application_info?: {
    application_url?: string;
    contact?: string;
    managing_agency?: string;
    operating_agency?: string;
  } | null;
  additional_info?: any | null;
  required_documents?: Array<{
    id: number;
    name: string;
    description?: string;
    is_required: boolean;
    issue_location?: string;
    notes?: string;
  }> | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * 청년 정책 목록 응답
 */
export interface YouthPolicyListResponse {
  total: number;
  policies: YouthPolicy[];
}

/**
 * API 헤더 생성 함수
 */
const getApiHeaders = async (): Promise<HeadersInit> => {
  const token = await AsyncStorage.getItem('authToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * 정책 진행 현황 조회 (PlanScreen용)
 */
export const getPoliciesProgress = async (
  limit: number = 10
): Promise<ApiResponse<UserPolicyProgress[]>> => {
  try {
    const headers = await getApiHeaders();

    const url = `${API_ENDPOINTS.POLICIES.PROGRESS}?limit=${limit}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '정책 진행 현황을 가져오는데 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get policies progress error:', error);
    return {
      success: false,
      error: '정책 진행 현황 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 사용자의 모든 정책 조회
 */
export const getAllUserPolicies = async (params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<UserPolicyListResponse>> => {
  try {
    const headers = await getApiHeaders();

    // URL 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status_filter', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `${API_ENDPOINTS.POLICIES.BASE}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '정책 목록을 가져오는데 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get all user policies error:', error);
    return {
      success: false,
      error: '정책 목록 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 특정 사용자-정책 조회
 */
export const getUserPolicy = async (
  userPolicyId: string
): Promise<ApiResponse<UserPolicy>> => {
  try {
    const headers = await getApiHeaders();

    const response = await fetch(`${API_ENDPOINTS.POLICIES.BASE}/${userPolicyId}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '정책을 가져오는데 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get user policy error:', error);
    return {
      success: false,
      error: '정책 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 사용자-정책 생성 (관심 정책 추가)
 */
export const createUserPolicy = async (
  policy: UserPolicyCreateRequest
): Promise<ApiResponse<UserPolicy>> => {
  try {
    const headers = await getApiHeaders();

    const response = await fetch(API_ENDPOINTS.POLICIES.BASE, {
      method: 'POST',
      headers,
      body: JSON.stringify(policy),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '정책 추가에 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Create user policy error:', error);
    return {
      success: false,
      error: '정책 추가 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 사용자-정책 수정
 */
export const updateUserPolicy = async (
  userPolicyId: string,
  updates: UserPolicyUpdateRequest
): Promise<ApiResponse<UserPolicy>> => {
  try {
    const headers = await getApiHeaders();

    const response = await fetch(`${API_ENDPOINTS.POLICIES.BASE}/${userPolicyId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '정책 수정에 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Update user policy error:', error);
    return {
      success: false,
      error: '정책 수정 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 사용자-정책 삭제 (관심 정책 제거)
 */
export const deleteUserPolicy = async (
  userPolicyId: string
): Promise<ApiResponse<void>> => {
  try {
    const headers = await getApiHeaders();

    const response = await fetch(`${API_ENDPOINTS.POLICIES.BASE}/${userPolicyId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: data.detail || data.error || '정책 삭제에 실패했습니다.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Delete user policy error:', error);
    return {
      success: false,
      error: '정책 삭제 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 모든 청년 정책 조회 (사용자 구분 없음)
 *
 * @param params - 필터링 및 페이지네이션 파라미터
 * @returns 청년 정책 목록
 */
export const getAllYouthPolicies = async (params?: {
  category?: string;
  region?: string;
  sort_by?: 'smart' | 'deadline' | 'name' | 'created';
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<YouthPolicyListResponse>> => {
  try {
    // URL 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.region) queryParams.append('region', params.region);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `${API_ENDPOINTS.YOUTH_POLICIES.BASE}/?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '청년 정책 목록을 가져오는데 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get all youth policies error:', error);
    return {
      success: false,
      error: '청년 정책 목록 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 특정 청년 정책 상세 조회
 *
 * @param policyId - 정책 ID
 * @returns 청년 정책 상세 정보
 */
export const getYouthPolicy = async (
  policyId: number
): Promise<ApiResponse<YouthPolicy>> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.YOUTH_POLICIES.BASE}/${policyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '청년 정책을 가져오는데 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get youth policy error:', error);
    return {
      success: false,
      error: '청년 정책 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 사용 가능한 카테고리 목록 조회
 */
export const getYouthPolicyCategories = async (): Promise<ApiResponse<string[]>> => {
  try {
    const response = await fetch(API_ENDPOINTS.YOUTH_POLICIES.CATEGORIES, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '카테고리 목록을 가져오는데 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get youth policy categories error:', error);
    return {
      success: false,
      error: '카테고리 목록 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 사용 가능한 지역 목록 조회
 */
export const getYouthPolicyRegions = async (): Promise<ApiResponse<string[]>> => {
  try {
    const response = await fetch(API_ENDPOINTS.YOUTH_POLICIES.REGIONS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '지역 목록을 가져오는데 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get youth policy regions error:', error);
    return {
      success: false,
      error: '지역 목록 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 정책 서비스 객체 Export
 */
export const policyService = {
  // 사용자별 정책 관리
  getPoliciesProgress,
  getAllUserPolicies,
  getUserPolicy,
  createUserPolicy,
  updateUserPolicy,
  deleteUserPolicy,

  // 모든 사용자 공통 청년 정책
  getAllYouthPolicies,
  getYouthPolicy,
  getYouthPolicyCategories,
  getYouthPolicyRegions,
};
