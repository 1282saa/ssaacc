/**
 * API Client
 *
 * Axios 기반 API 클라이언트로 모든 HTTP 요청을 중앙에서 관리합니다.
 * JWT 토큰을 자동으로 헤더에 포함하며, 에러 처리를 통일합니다.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

/**
 * Axios 인스턴스 생성
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * 모든 요청에 JWT 토큰을 자동으로 추가
 */
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 에러 응답을 통일된 형식으로 처리
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 자동 로그아웃
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      console.warn('Authentication expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

/**
 * API Client 객체
 */
export const apiClient = {
  /**
   * GET 요청
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.get<T>(url, config);
  },

  /**
   * POST 요청
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, data, config);
  },

  /**
   * PUT 요청
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.put<T>(url, data, config);
  },

  /**
   * PATCH 요청
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.patch<T>(url, data, config);
  },

  /**
   * DELETE 요청
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.delete<T>(url, config);
  },
};
