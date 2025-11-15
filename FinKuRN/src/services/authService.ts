/**
 * 인증 서비스 (Authentication Service)
 *
 * 이 파일은 모든 사용자 인증 관련 기능을 제공하는 서비스 레이어입니다.
 * 로그인, 로그아웃, 회원가입, 토큰 관리 등 인증과 관련된 모든 API 호출을 담당합니다.
 *
 * @module services/authService
 * @category Services
 * @since 1.0.0
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
 * 사용자 정보 인터페이스
 */
export interface User {
  id: string;
  email: string;
  name: string;
  is_active?: boolean;
  created_at?: string;
}

/**
 * 토큰 정보 인터페이스
 */
export interface Token {
  access_token: string;
  token_type: string;
}

/**
 * 로그인 응답 데이터
 */
export interface LoginData {
  user: User;
  token: Token;
}

/**
 * 소셜 로그인 제공자 타입
 */
export type SocialProvider = 'kakao' | 'naver' | 'google';

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
 * 이메일/비밀번호 로그인
 */
export const login = async (
  email: string,
  password: string
): Promise<ApiResponse<LoginData>> => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '로그인에 실패했습니다.',
      };
    }

    // 토큰 저장
    if (data.token?.access_token) {
      await AsyncStorage.setItem('authToken', data.token.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    }

    return {
      success: true,
      data: {
        user: data.user,
        token: data.token,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
};

/**
 * 회원가입
 */
export const register = async (
  email: string,
  password: string,
  name: string
): Promise<ApiResponse<LoginData>> => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '회원가입에 실패했습니다.',
      };
    }

    // 토큰 저장
    if (data.token?.access_token) {
      await AsyncStorage.setItem('authToken', data.token.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    }

    return {
      success: true,
      data: {
        user: data.user,
        token: data.token,
      },
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      error: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
};

/**
 * 소셜 로그인
 */
export const socialLogin = async (
  provider: SocialProvider,
  accessToken: string
): Promise<ApiResponse<LoginData>> => {
  try {
    if (provider === 'google') {
      const response = await fetch(API_ENDPOINTS.AUTH.GOOGLE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || data.error || 'Google 로그인에 실패했습니다.',
        };
      }

      // 토큰 저장
      if (data.token?.access_token) {
        await AsyncStorage.setItem('authToken', data.token.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
      }

      return {
        success: true,
        data: {
          user: data.user,
          token: data.token,
        },
      };
    }

    // 카카오, 네이버는 아직 미구현
    return {
      success: false,
      error: `${provider} 로그인은 아직 지원하지 않습니다.`,
    };
  } catch (error) {
    console.error(`${provider} login error:`, error);
    return {
      success: false,
      error: `${provider} 로그인 중 오류가 발생했습니다.`,
    };
  }
};

/**
 * 현재 사용자 정보 조회
 */
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const headers = await getApiHeaders();

    const response = await fetch(API_ENDPOINTS.USERS.ME, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '사용자 정보를 가져오는데 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      error: '사용자 정보 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 자동 로그인 체크 (저장된 토큰 확인)
 */
export const checkAutoLogin = async (): Promise<ApiResponse<User>> => {
  try {
    const token = await AsyncStorage.getItem('authToken');

    if (!token) {
      return {
        success: false,
        error: '저장된 토큰이 없습니다.',
      };
    }

    // 토큰이 있으면 현재 사용자 정보 조회
    return await getCurrentUser();
  } catch (error) {
    console.error('Check auto login error:', error);
    return {
      success: false,
      error: '자동 로그인 확인 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  try {
    const headers = await getApiHeaders();

    // 백엔드에 로그아웃 요청
    await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
      headers,
    });

    // 로컬 스토리지에서 토큰 제거
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');

    console.log('User logged out');
  } catch (error) {
    console.error('Logout error:', error);
    // 에러가 발생해도 로컬 토큰은 삭제
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  }
};

/**
 * 인증 서비스 객체 Export
 */
export const authService = {
  login,
  register,
  socialLogin,
  getCurrentUser,
  checkAutoLogin,
  logout,
};
