/**
 * API Configuration
 *
 * 백엔드 API 주소 및 설정을 중앙에서 관리합니다.
 *
 * @module config/api
 */

/**
 * 백엔드 API Base URL
 *
 * 현재 설정: 프로덕션 EC2 백엔드 (http://3.239.115.86:8000)
 *
 * 로컬 개발 환경으로 전환하려면:
 * - getApiBaseUrl() 함수 내부의 주석을 해제하고
 * - return EC2_API_URL 라인을 주석 처리하세요
 *
 * 로컬 환경별 주소:
 * - Web: http://localhost:8001
 * - iOS Simulator: http://localhost:8001
 * - Android Emulator: http://10.0.2.2:8001
 */
import { Platform } from 'react-native';

// 배포된 EC2 백엔드 API 주소 (프로덕션)
const EC2_API_URL = 'http://3.239.115.86:8000';

// 개발 환경에서 사용할 백엔드 API 주소
const getApiBaseUrl = (): string => {
  // 프로덕션 EC2 백엔드 사용
  // 모든 플랫폼에서 동일한 EC2 주소 사용
  return EC2_API_URL;

  // 로컬 개발 시 아래 주석 해제
  /*
  // 웹 브라우저에서 실행 중인 경우
  if (Platform.OS === 'web') {
    return 'http://localhost:8001';
  }

  // iOS 시뮬레이터
  if (Platform.OS === 'ios') {
    return 'http://localhost:8001';
  }

  // Android 에뮬레이터 (10.0.2.2는 호스트 머신을 가리킴)
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8001';
  }

  // 기본값
  return 'http://localhost:8001';
  */
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Health Check
  HEALTH: `${API_BASE_URL}/health`,
  
  // Chat Endpoints
  CHAT_MESSAGES: (chatId: string) => `${API_BASE_URL}/api/chats/${chatId}/messages`,
  CHATS: `${API_BASE_URL}/api/chats`,
  
  // Authentication Endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
    LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
    GOOGLE: `${API_BASE_URL}/api/v1/auth/google`,
    REFRESH: `${API_BASE_URL}/api/v1/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/api/v1/auth/logout`,
  },
  
  // User Management Endpoints
  USERS: {
    ME: `${API_BASE_URL}/api/v1/users/me`,
  },
  
  // Onboarding Endpoints
  ONBOARDING: {
    GOALS: `${API_BASE_URL}/api/v1/onboarding/goals`,
    PROFILE: `${API_BASE_URL}/api/v1/onboarding/profile`,
    CONSENT: `${API_BASE_URL}/api/v1/onboarding/consent`,
    STATUS: `${API_BASE_URL}/api/v1/onboarding/status`,
  },
};

/**
 * API 요청 타임아웃 (밀리초)
 */
export const API_TIMEOUT = 30000; // 30초
