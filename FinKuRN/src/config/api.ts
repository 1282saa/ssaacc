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
 * 환경에 따라 자동으로 설정됩니다:
 * - Web: http://localhost:8000
 * - iOS Simulator: http://localhost:8000
 * - Android Emulator: http://10.0.2.2:8000
 * - 실제 디바이스: 호스트 머신의 IP 주소 사용
 */
import { Platform } from 'react-native';

// 개발 환경에서 사용할 백엔드 API 주소
const getApiBaseUrl = (): string => {
  // 웹 브라우저에서 실행 중인 경우
  if (Platform.OS === 'web') {
    return 'http://localhost:8000';
  }

  // iOS 시뮬레이터
  if (Platform.OS === 'ios') {
    return 'http://localhost:8000';
  }

  // Android 에뮬레이터 (10.0.2.2는 호스트 머신을 가리킴)
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  // 기본값
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  CHAT_MESSAGES: (chatId: string) => `${API_BASE_URL}/api/chats/${chatId}/messages`,
  CHATS: `${API_BASE_URL}/api/chats`,
};

/**
 * API 요청 타임아웃 (밀리초)
 */
export const API_TIMEOUT = 30000; // 30초
