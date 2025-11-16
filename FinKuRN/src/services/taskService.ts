/**
 * 할 일 서비스 (Task Service)
 *
 * 할 일 관리 관련 모든 API 호출을 담당합니다.
 * - 오늘의 할 일 조회
 * - 할 일 목록 조회
 * - 할 일 생성, 수정, 삭제
 *
 * @module services/taskService
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
 * 할 일 인터페이스
 */
export interface Task {
  id: string;
  user_id: string;
  user_policy_id?: string | null;
  title: string;
  description?: string | null;
  category: string;
  due_date: string; // ISO date string (YYYY-MM-DD)
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: number; // 1-5 (1이 가장 높음)
  reminder_enabled: boolean;
  completed_at?: string | null;
  created_at: string;
  updated_at?: string | null;

  // 계산된 필드들
  days_until_due: number;
  is_overdue: boolean;
  is_due_soon: boolean;
}

/**
 * 오늘의 할 일 응답
 */
export interface TodayTasksResponse {
  date: string; // ISO date string
  overdue_count: number;
  due_today_count: number;
  due_soon_count: number;
  tasks: Task[];
}

/**
 * 할 일 목록 응답
 */
export interface TaskListResponse {
  total: number;
  tasks: Task[];
}

/**
 * 할 일 생성 요청
 */
export interface TaskCreateRequest {
  title: string;
  description?: string;
  category?: string;
  due_date: string; // ISO date string (YYYY-MM-DD)
  priority?: number;
  reminder_enabled?: boolean;
  user_policy_id?: string;
}

/**
 * 할 일 수정 요청
 */
export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  category?: string;
  due_date?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: number;
  reminder_enabled?: boolean;
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
 * 오늘의 할 일 조회
 */
export const getTodayTasks = async (): Promise<ApiResponse<TodayTasksResponse>> => {
  try {
    const headers = await getApiHeaders();

    const response = await fetch(API_ENDPOINTS.TASKS.TODAY, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '오늘의 할 일을 가져오는데 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get today tasks error:', error);
    return {
      success: false,
      error: '오늘의 할 일 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 할 일 목록 조회
 */
export const getAllTasks = async (params?: {
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<TaskListResponse>> => {
  try {
    const headers = await getApiHeaders();

    // URL 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status_filter', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `${API_ENDPOINTS.TASKS.BASE}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '할 일 목록을 가져오는데 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get all tasks error:', error);
    return {
      success: false,
      error: '할 일 목록 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 특정 할 일 조회
 */
export const getTask = async (taskId: string): Promise<ApiResponse<Task>> => {
  try {
    const headers = await getApiHeaders();

    const response = await fetch(`${API_ENDPOINTS.TASKS.BASE}/${taskId}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '할 일을 가져오는데 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get task error:', error);
    return {
      success: false,
      error: '할 일 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 할 일 생성
 */
export const createTask = async (
  task: TaskCreateRequest
): Promise<ApiResponse<Task>> => {
  try {
    const headers = await getApiHeaders();

    const response = await fetch(API_ENDPOINTS.TASKS.BASE, {
      method: 'POST',
      headers,
      body: JSON.stringify(task),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '할 일 생성에 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Create task error:', error);
    return {
      success: false,
      error: '할 일 생성 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 할 일 수정
 */
export const updateTask = async (
  taskId: string,
  updates: TaskUpdateRequest
): Promise<ApiResponse<Task>> => {
  try {
    const headers = await getApiHeaders();

    const response = await fetch(`${API_ENDPOINTS.TASKS.BASE}/${taskId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || '할 일 수정에 실패했습니다.',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Update task error:', error);
    return {
      success: false,
      error: '할 일 수정 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 할 일 삭제
 */
export const deleteTask = async (taskId: string): Promise<ApiResponse<void>> => {
  try {
    const headers = await getApiHeaders();

    const response = await fetch(`${API_ENDPOINTS.TASKS.BASE}/${taskId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: data.detail || data.error || '할 일 삭제에 실패했습니다.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Delete task error:', error);
    return {
      success: false,
      error: '할 일 삭제 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 할 일 서비스 객체 Export
 */
export const taskService = {
  getTodayTasks,
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
