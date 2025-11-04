/**
 * Home Screen Data Service
 *
 * Handles data fetching for HomeScreen.
 * Currently returns dummy data via Promise.resolve().
 * Can be easily replaced with actual API calls later.
 *
 * @example
 * ```tsx
 * import { homeService } from '../services/homeService';
 *
 * const data = await homeService.getHomeScreenData();
 * ```
 */

import type { HomeScreenData, TodayItemData } from '../types/home';

/**
 * Dummy data for HomeScreen
 * This will be replaced with actual API responses
 */
const DUMMY_HOME_DATA: HomeScreenData = {
  greeting: {
    userName: '은별',
    greetingMessage: '좋은 아침이에요, 은별님',
    motivationMessage: '오늘은 커피값만큼 절약 도전 어떨까요? 💙',
  },

  todayItemsCount: 5,

  todayItems: [
    {
      id: '1',
      title: '공과금 납부',
      dday: 'D-DAY',
      detailText: '이번 달 전기요금 ',
      detailAmount: '43,200원',
      description: '오늘 납부하지 않으면 연체료 2%가 부가돼요',
    },
    {
      id: '2',
      title: '청년도약계좌 서류 제출 마감',
      dday: 'D-2',
      detailText: '남은 서류 2개',
      description: '이번 주 안에 제출해야 정부 지원금 받을 수 있어요',
    },
    {
      id: '3',
      title: '통신비 자동이체',
      dday: 'D-3',
      detailText: 'SK텔레콤 ',
      detailAmount: '55,000원',
      description: '3일 후 자동 출금 예정이에요',
    },
    {
      id: '4',
      title: '적금 납입일',
      dday: 'D-5',
      detailText: '내 집 마련 적금 ',
      detailAmount: '500,000원',
      description: '5일 후 자동 납입 예정이에요',
    },
    {
      id: '5',
      title: '구독료 결제',
      dday: 'D-7',
      detailText: '넷플릭스 프리미엄 ',
      detailAmount: '17,000원',
      description: '일주일 후 자동 결제 예정이에요',
    },
  ],

  savingsFilters: ['전체', '내 집 마련 적금', '여름 여행', '비상금'],

  savings: {
    id: 'savings-1',
    name: '내 집 마련 적금',
    startDate: '2024.02',
    monthlyDeposit: 300000,
    currentAmount: 3500000,
    targetAmount: 30000000,
    chartData: [20, 50, 10, 80, 60, 20],
  },

  spendingFilters: ['오늘', '이번 주', '이번 달'],

  spending: {
    totalAmount: 1234567,
    categories: [
      {
        category: '식비',
        amount: 450000,
        percentage: 36,
        color: '#FF6B6B',
      },
      {
        category: '교통비',
        amount: 200000,
        percentage: 16,
        color: '#4ECDC4',
      },
      {
        category: '문화생활',
        amount: 184567,
        percentage: 15,
        color: '#45B7D1',
      },
      {
        category: '쇼핑',
        amount: 250000,
        percentage: 20,
        color: '#FFA07A',
      },
      {
        category: '기타',
        amount: 150000,
        percentage: 13,
        color: '#98D8C8',
      },
    ],
  },
};

/**
 * HomeScreen Service
 *
 * Provides data fetching methods for HomeScreen.
 * All methods return Promises for easy migration to async API calls.
 */
class HomeService {
  /**
   * Fetch complete HomeScreen data
   *
   * @returns Promise resolving to HomeScreenData
   *
   * @example
   * ```tsx
   * const data = await homeService.getHomeScreenData();
   * setHomeData(data);
   * ```
   */
  async getHomeScreenData(): Promise<HomeScreenData> {
    // Simulate network delay (optional, for realistic behavior)
    // await new Promise(resolve => setTimeout(resolve, 100));

    // Return dummy data
    // TODO: Replace with actual API call
    // const response = await fetch('/api/home');
    // return response.json();
    return Promise.resolve(DUMMY_HOME_DATA);
  }

  /**
   * Fetch only today items
   *
   * @returns Promise resolving to array of TodayItemData
   *
   * @example
   * ```tsx
   * const items = await homeService.getTodayItems();
   * setTodayItems(items);
   * ```
   */
  async getTodayItems(): Promise<TodayItemData[]> {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/today-items');
    // return response.json();
    return Promise.resolve(DUMMY_HOME_DATA.todayItems);
  }

  /**
   * Fetch savings data
   *
   * @param filterId - Optional filter ID
   * @returns Promise resolving to SavingsData
   *
   * @example
   * ```tsx
   * const savings = await homeService.getSavingsData('savings-1');
   * setSavings(savings);
   * ```
   */
  async getSavingsData(filterId?: string): Promise<typeof DUMMY_HOME_DATA.savings> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/savings${filterId ? `?filter=${filterId}` : ''}`);
    // return response.json();
    return Promise.resolve(DUMMY_HOME_DATA.savings);
  }

  /**
   * Fetch spending data
   *
   * @param period - Time period filter ('오늘', '이번 주', '이번 달')
   * @returns Promise resolving to SpendingData
   *
   * @example
   * ```tsx
   * const spending = await homeService.getSpendingData('이번 달');
   * setSpending(spending);
   * ```
   */
  async getSpendingData(period?: string): Promise<typeof DUMMY_HOME_DATA.spending> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/spending${period ? `?period=${period}` : ''}`);
    // return response.json();
    return Promise.resolve(DUMMY_HOME_DATA.spending);
  }
}

// Export singleton instance
export const homeService = new HomeService();

// Export dummy data for testing purposes
export { DUMMY_HOME_DATA };
