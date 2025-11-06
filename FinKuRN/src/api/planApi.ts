/**
 * Plan API - 백엔드 연동을 위한 API 함수들
 *
 * @module API/PlanAPI
 * @category API
 * @since 1.0.0
 *
 * @description
 * Plan 화면에서 사용하는 모든 데이터를 백엔드에서 가져오는 API 함수들입니다.
 * 현재는 Mock Data를 반환하며, 실제 백엔드 구축 시 fetch 로직으로 교체하면 됩니다.
 *
 * @example
 * ```typescript
 * import { fetchPlanData } from '@/api/planApi';
 *
 * const data = await fetchPlanData('user123');
 * ```
 */

import type { PlanScreenData, TaskItem, UpcomingItem, GoalProgress } from '../types/plan';

/**
 * API 응답 타입 정의
 *
 * @interface ApiResponse
 * @template T - 응답 데이터 타입
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * Mock Data: Plan 화면 전체 데이터
 *
 * @description
 * 백엔드 API 구축 전까지 사용할 Mock 데이터입니다.
 * 실제 백엔드 구축 시 이 구조를 참고하여 API를 설계하세요.
 *
 * @example
 * API Endpoint: GET /api/v1/plan/:userId
 * Response Body:
 * ```json
 * {
 *   "success": true,
 *   "data": { ... },
 *   "timestamp": "2025-01-06T12:00:00Z"
 * }
 * ```
 */
const MOCK_PLAN_DATA: PlanScreenData = {
  progress: {
    completed: 2,
    total: 3,
    percentage: 67,
    nextDueTitle: '청년도약계좌 서류 제출',
    nextDueDDay: 2,
  },
  todayTasks: [
    {
      id: '1',
      title: '전기요금 납부 (43,200원)',
      completed: true,
      dDay: 0,
      encouragement: '완료했어요! 연체료 걱정 없이 한 달을 시작하세요',
    },
    {
      id: '2',
      title: '청년도약계좌 소득증명서 제출',
      completed: false,
      dDay: 1,
    },
    {
      id: '3',
      title: '이번 달 예산 검토하기',
      completed: false,
      dDay: 2,
    },
  ],
  upcomingSchedule: [
    {
      id: '1',
      title: '신용카드 결제일',
      subtitle: '3일 후 자동 출금 예정',
      dDay: 3,
      iconType: 'card',
    },
    {
      id: '2',
      title: '청년 월세 지원 신청 마감',
      subtitle: '5일 후 마감',
      dDay: 5,
      iconType: 'home',
    },
    {
      id: '3',
      title: '내 집 마련 적금 납입일',
      subtitle: '7일 후 자동 납입 예정',
      dDay: 7,
      iconType: 'bank',
    },
  ],
  savingsProgress: {
    isActive: true,
    currentAmount: 870000,
    targetAmount: 1200000,
    percentage: 72,
  },
  goals: [
    {
      id: 'goal-1',
      title: '🏠 내 집 마련 적금',
      category: '저축',
      completed: 2,
      total: 3,
      percentage: 67,
      checklists: [
        { id: 'check-1-1', text: '적금 상품 비교 및 가입', completed: true },
        { id: 'check-1-2', text: '월 50만원 자동이체 설정', completed: true },
        { id: 'check-1-3', text: '청년 우대 금리 신청하기', completed: false },
      ],
    },
    {
      id: 'goal-2',
      title: '💵 청년도약계좌',
      category: '학자금',
      completed: 1,
      total: 3,
      percentage: 33,
      checklists: [
        { id: 'check-2-1', text: '소득 요건 확인', completed: true },
        { id: 'check-2-2', text: '소득증명서 제출 (D-1)', completed: false },
        { id: 'check-2-3', text: '계좌 개설 및 첫 납입', completed: false },
      ],
    },
    {
      id: 'goal-3',
      title: '🏠 청년 월세 지원 신청',
      category: '정부지원',
      completed: 0,
      total: 4,
      percentage: 0,
      checklists: [
        { id: 'check-3-1', text: '자격 요건 확인', completed: false },
        { id: 'check-3-2', text: '임대차 계약서 준비', completed: false },
        { id: 'check-3-3', text: '서울주거포털 신청 (D-5)', completed: false },
        { id: 'check-3-4', text: '심사 결과 확인', completed: false },
      ],
    },
  ],
};

/**
 * Plan 데이터 조회 API
 *
 * @async
 * @function fetchPlanData
 * @param {string} userId - 사용자 ID
 * @returns {Promise<PlanScreenData>} Plan 화면 데이터
 *
 * @description
 * 사용자의 Plan 데이터를 가져옵니다.
 * 현재는 Mock 데이터를 반환하며, 실제 구현 시 아래와 같이 작성하세요:
 *
 * @example
 * ```typescript
 * // 실제 구현 예시
 * export const fetchPlanData = async (userId: string): Promise<PlanScreenData> => {
 *   const response = await fetch(`${API_BASE_URL}/plan/${userId}`, {
 *     method: 'GET',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${getAuthToken()}`,
 *     },
 *   });
 *
 *   if (!response.ok) {
 *     throw new Error('Failed to fetch plan data');
 *   }
 *
 *   const result: ApiResponse<PlanScreenData> = await response.json();
 *   return result.data;
 * };
 * ```
 *
 * @throws {Error} API 요청 실패 시
 */
export const fetchPlanData = async (userId: string): Promise<PlanScreenData> => {
  // Mock: 네트워크 지연 시뮬레이션 (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));

  // TODO: 실제 백엔드 API 호출로 교체
  // const response = await fetch(`${API_BASE_URL}/api/v1/plan/${userId}`);
  // const result = await response.json();
  // return result.data;

  return MOCK_PLAN_DATA;
};

/**
 * Task 완료 상태 업데이트 API
 *
 * @async
 * @function updateTaskCompletion
 * @param {string} userId - 사용자 ID
 * @param {string} taskId - Task ID
 * @param {boolean} completed - 완료 여부
 * @returns {Promise<TaskItem>} 업데이트된 Task
 *
 * @description
 * 특정 Task의 완료 상태를 토글합니다.
 *
 * @example
 * ```typescript
 * // 실제 구현 예시
 * export const updateTaskCompletion = async (
 *   userId: string,
 *   taskId: string,
 *   completed: boolean
 * ): Promise<TaskItem> => {
 *   const response = await fetch(`${API_BASE_URL}/plan/${userId}/tasks/${taskId}`, {
 *     method: 'PATCH',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${getAuthToken()}`,
 *     },
 *     body: JSON.stringify({ completed }),
 *   });
 *
 *   if (!response.ok) {
 *     throw new Error('Failed to update task');
 *   }
 *
 *   const result: ApiResponse<TaskItem> = await response.json();
 *   return result.data;
 * };
 * ```
 */
export const updateTaskCompletion = async (
  userId: string,
  taskId: string,
  completed: boolean
): Promise<TaskItem> => {
  // Mock: 네트워크 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 200));

  // TODO: 실제 백엔드 API 호출로 교체

  const task = MOCK_PLAN_DATA.todayTasks.find((t) => t.id === taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  return { ...task, completed };
};

/**
 * Goal Checklist 항목 업데이트 API
 *
 * @async
 * @function updateGoalChecklistItem
 * @param {string} userId - 사용자 ID
 * @param {string} goalId - Goal ID
 * @param {string} checklistId - Checklist Item ID
 * @param {boolean} completed - 완료 여부
 * @returns {Promise<GoalProgress>} 업데이트된 Goal
 *
 * @description
 * 목표별 체크리스트 항목의 완료 상태를 업데이트합니다.
 *
 * @example
 * API Endpoint: PATCH /api/v1/plan/:userId/goals/:goalId/checklist/:checklistId
 * Request Body:
 * ```json
 * {
 *   "completed": true
 * }
 * ```
 */
export const updateGoalChecklistItem = async (
  userId: string,
  goalId: string,
  checklistId: string,
  completed: boolean
): Promise<GoalProgress> => {
  // Mock: 네트워크 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 200));

  // TODO: 실제 백엔드 API 호출로 교체

  const goal = MOCK_PLAN_DATA.goals?.find((g) => g.id === goalId);
  if (!goal) {
    throw new Error('Goal not found');
  }

  return goal;
};
