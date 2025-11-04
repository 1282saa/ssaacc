/**
 * 홈 화면 데이터 타입 정의 (Home Screen Data Types)
 *
 * 이 파일은 홈 화면에서 사용하는 모든 데이터 구조를 정의합니다.
 * 오늘의 할 일, 적금 정보, 지출 분석, 사용자 인사말 등의 인터페이스를 포함합니다.
 * 서비스 레이어와 컴포넌트에서 타입 안정성을 보장하기 위해 사용됩니다.
 *
 * @module types/home
 * @category Types
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * import { HomeScreenData, TodayItemData } from '@/types/home';
 *
 * const homeData: HomeScreenData = await homeService.getHomeData();
 * ```
 */

/**
 * 오늘의 할 일 아이템 데이터 인터페이스 (Today Task Item Data Interface)
 *
 * 홈 화면에 표시되는 개별 할 일/작업 아이템을 나타냅니다.
 * 금융 관련 마감일, 납부일, 만기일 등의 중요한 날짜 정보를 담고 있습니다.
 *
 * @interface TodayItemData
 * @property {string} id - 아이템의 고유 식별자 (Unique item identifier)
 * @property {string} title - 아이템 제목 (Item title)
 * @property {string} dday - D-Day 표시 문자열 (D-Day display string)
 * @property {string} detailText - 세부 설명 텍스트 (Detail description text)
 * @property {string} [detailAmount] - 금액 정보 (Amount information)
 * @property {string} description - 추가 설명 (Additional description)
 *
 * @example
 * ```typescript
 * const todayItem: TodayItemData = {
 *   id: 'item-001',
 *   title: '청년도약계좌 납입',
 *   dday: 'D-3',
 *   detailText: '이번 달 납입일',
 *   detailAmount: '70만원',
 *   description: '매월 15일까지 납입하세요'
 * };
 * ```
 */
export interface TodayItemData {
  /**
   * 아이템의 고유 식별자 (Unique item identifier)
   *
   * 각 할 일을 구분하기 위한 문자열 ID입니다.
   * 서버에서 제공하거나 클라이언트에서 생성한 고유 값을 사용합니다.
   */
  id: string;

  /**
   * 아이템 제목 (Item title)
   *
   * 할 일의 주요 내용을 나타내는 제목입니다.
   *
   * @example
   * "청년도약계좌 납입", "적금 만기일", "신용카드 결제일"
   */
  title: string;

  /**
   * D-Day 표시 문자열 (D-Day display string)
   *
   * 마감일까지 남은 일수를 나타냅니다.
   * "D-3", "D-Day", "D+2" 형식으로 표시됩니다.
   *
   * @example
   * "D-3" (3일 남음), "D-Day" (오늘), "D+2" (2일 지남)
   */
  dday: string;

  /**
   * 세부 설명 텍스트 (Detail description text)
   *
   * 할 일에 대한 부가적인 설명이나 세부 정보입니다.
   *
   * @example
   * "이번 달 납입일", "만기 처리 필요", "자동이체 설정됨"
   */
  detailText: string;

  /**
   * 금액 정보 (Amount information)
   *
   * 해당 할 일과 관련된 금액 정보입니다.
   * 납입액, 만기금액, 결제금액 등을 포함할 수 있습니다.
   *
   * @optional
   * @example
   * "70만원", "1,500,000원", "25만원"
   */
  detailAmount?: string;

  /**
   * 추가 설명 (Additional description)
   *
   * 할 일에 대한 더 자세한 설명이나 주의사항입니다.
   *
   * @example
   * "매월 15일까지 납입하세요", "만기일 이후 자동연장됩니다"
   */
  description: string;
}

/**
 * 사용자 인사말 데이터 인터페이스 (User Greeting Data Interface)
 *
 * 홈 화면 상단에 표시되는 사용자 맞춤 인사말 정보입니다.
 * 사용자 이름과 함께 개인화된 메시지를 제공합니다.
 *
 * @interface GreetingData
 * @property {string} userName - 사용자 이름 (User name)
 * @property {string} greetingMessage - 인사말 메시지 (Greeting message)
 * @property {string} motivationMessage - 동기부여 메시지 (Motivation message)
 *
 * @example
 * ```typescript
 * const greeting: GreetingData = {
 *   userName: '홍길동',
 *   greetingMessage: '안녕하세요, 홍길동님!',
 *   motivationMessage: '오늘도 알뜰하게 저축해봐요!'
 * };
 * ```
 */
export interface GreetingData {
  /**
   * 사용자 이름 (User name)
   *
   * 현재 로그인한 사용자의 이름입니다.
   * 인사말에 개인화된 메시지를 표시하는 데 사용됩니다.
   */
  userName: string;

  /**
   * 인사말 메시지 (Greeting message)
   *
   * 사용자에게 보여줄 주요 인사말입니다.
   * 시간대나 상황에 따라 다른 메시지를 표시할 수 있습니다.
   *
   * @example
   * "안녕하세요, 홍길동님!", "좋은 아침이에요!", "반가워요!"
   */
  greetingMessage: string;

  /**
   * 동기부여 메시지 (Motivation message)
   *
   * 사용자의 금융 활동을 격려하는 메시지입니다.
   * 저축, 지출 관리 등을 독려하는 내용을 담습니다.
   *
   * @example
   * "오늘도 알뜰하게 저축해봐요!", "작은 절약이 큰 부자를 만듭니다"
   */
  motivationMessage: string;
}

/**
 * 적금 데이터 인터페이스 (Savings Account Data Interface)
 *
 * 사용자의 적금 계좌 정보를 나타냅니다.
 * 적금 잔액, 목표 금액, 차트 데이터 등을 포함합니다.
 *
 * @interface SavingsData
 * @property {string} id - 적금 계좌 고유 식별자 (Unique savings account identifier)
 * @property {string} name - 적금 상품명 (Savings product name)
 * @property {string} startDate - 개설일 (Opening date)
 * @property {number} monthlyDeposit - 월 납입액 (Monthly deposit amount)
 * @property {number} currentAmount - 현재 잔액 (Current balance)
 * @property {number} targetAmount - 목표 금액 (Target amount)
 * @property {number[]} chartData - 차트 표시용 데이터 배열 (Chart data array)
 *
 * @example
 * ```typescript
 * const savings: SavingsData = {
 *   id: 'savings-001',
 *   name: '청년도약계좌',
 *   startDate: '2024-01-01',
 *   monthlyDeposit: 700000,
 *   currentAmount: 3500000,
 *   targetAmount: 8400000,
 *   chartData: [700000, 1400000, 2100000, 2800000, 3500000]
 * };
 * ```
 */
export interface SavingsData {
  /**
   * 적금 계좌 고유 식별자 (Unique savings account identifier)
   *
   * 각 적금 계좌를 구분하기 위한 문자열 ID입니다.
   */
  id: string;

  /**
   * 적금 상품명 (Savings product name)
   *
   * 적금 상품의 이름입니다.
   *
   * @example
   * "청년도약계좌", "자유적금", "정기적금"
   */
  name: string;

  /**
   * 개설일 (Opening date)
   *
   * 적금을 처음 시작한 날짜입니다.
   * ISO 8601 형식 또는 "YYYY-MM-DD" 형식의 문자열입니다.
   *
   * @example
   * "2024-01-01", "2023-12-15"
   */
  startDate: string;

  /**
   * 월 납입액 (Monthly deposit amount)
   *
   * 매월 납입해야 하는 금액(원 단위)입니다.
   *
   * @example
   * 700000 (70만원), 500000 (50만원)
   */
  monthlyDeposit: number;

  /**
   * 현재 잔액 (Current balance)
   *
   * 현재까지 모인 적금 총액(원 단위)입니다.
   *
   * @example
   * 3500000 (350만원), 2100000 (210만원)
   */
  currentAmount: number;

  /**
   * 목표 금액 (Target amount)
   *
   * 적금 만기 시 달성하려는 목표 금액(원 단위)입니다.
   *
   * @example
   * 8400000 (840만원), 6000000 (600만원)
   */
  targetAmount: number;

  /**
   * 차트 표시용 데이터 배열 (Chart data array)
   *
   * 적금 잔액 추이를 차트로 표시하기 위한 데이터 배열입니다.
   * 각 요소는 특정 시점의 누적 금액을 나타냅니다.
   *
   * @example
   * [700000, 1400000, 2100000, 2800000, 3500000]
   * // 1개월: 70만원, 2개월: 140만원, ...
   */
  chartData: number[];
}

/**
 * 지출 카테고리 데이터 인터페이스 (Spending Category Data Interface)
 *
 * 지출 분석에서 개별 카테고리의 정보를 나타냅니다.
 * 카테고리별 지출 금액, 비율, 색상 정보를 포함합니다.
 *
 * @interface SpendingCategoryData
 * @property {string} category - 카테고리 이름 (Category name)
 * @property {number} amount - 지출 금액 (Spending amount)
 * @property {number} percentage - 전체 지출 대비 비율 (Percentage of total spending)
 * @property {string} color - 차트 표시용 색상 코드 (Chart color code)
 *
 * @example
 * ```typescript
 * const category: SpendingCategoryData = {
 *   category: '식비',
 *   amount: 450000,
 *   percentage: 30,
 *   color: '#FF6B6B'
 * };
 * ```
 */
export interface SpendingCategoryData {
  /**
   * 카테고리 이름 (Category name)
   *
   * 지출 카테고리의 명칭입니다.
   *
   * @example
   * "식비", "교통비", "쇼핑", "문화생활", "기타"
   */
  category: string;

  /**
   * 지출 금액 (Spending amount)
   *
   * 해당 카테고리에서 지출한 총 금액(원 단위)입니다.
   *
   * @example
   * 450000 (45만원), 200000 (20만원)
   */
  amount: number;

  /**
   * 전체 지출 대비 비율 (Percentage of total spending)
   *
   * 전체 지출 금액 대비 해당 카테고리의 비율(%)입니다.
   * 0-100 사이의 값을 가집니다.
   *
   * @example
   * 30 (30%), 15 (15%)
   */
  percentage: number;

  /**
   * 차트 표시용 색상 코드 (Chart color code)
   *
   * 차트나 그래프에서 해당 카테고리를 표시할 때 사용하는 색상입니다.
   * HEX 색상 코드를 사용합니다.
   *
   * @example
   * "#FF6B6B", "#4ECDC4", "#45B7D1"
   */
  color: string;
}

/**
 * 지출 개요 데이터 인터페이스 (Spending Overview Data Interface)
 *
 * 사용자의 전체 지출 정보를 나타냅니다.
 * 총 지출액과 카테고리별 세부 내역을 포함합니다.
 *
 * @interface SpendingData
 * @property {number} totalAmount - 총 지출 금액 (Total spending amount)
 * @property {SpendingCategoryData[]} categories - 카테고리별 지출 내역 배열 (Array of spending by category)
 *
 * @example
 * ```typescript
 * const spending: SpendingData = {
 *   totalAmount: 1500000,
 *   categories: [
 *     { category: '식비', amount: 450000, percentage: 30, color: '#FF6B6B' },
 *     { category: '교통비', amount: 300000, percentage: 20, color: '#4ECDC4' },
 *     { category: '쇼핑', amount: 750000, percentage: 50, color: '#45B7D1' }
 *   ]
 * };
 * ```
 */
export interface SpendingData {
  /**
   * 총 지출 금액 (Total spending amount)
   *
   * 모든 카테고리의 지출을 합산한 총 금액(원 단위)입니다.
   *
   * @example
   * 1500000 (150만원), 2000000 (200만원)
   */
  totalAmount: number;

  /**
   * 카테고리별 지출 내역 배열 (Array of spending by category)
   *
   * 각 카테고리별로 분류된 지출 정보의 배열입니다.
   * 차트나 목록 형태로 표시하는 데 사용됩니다.
   */
  categories: SpendingCategoryData[];
}

/**
 * 홈 화면 전체 데이터 인터페이스 (Complete HomeScreen Data Interface)
 *
 * 홈 화면에서 필요한 모든 데이터를 포함하는 최상위 인터페이스입니다.
 * 인사말, 오늘의 할 일, 필터 옵션, 적금 정보, 지출 분석 등을 포함합니다.
 *
 * @interface HomeScreenData
 * @property {GreetingData} greeting - 사용자 인사말 데이터 (User greeting data)
 * @property {TodayItemData[]} todayItems - 오늘의 할 일 목록 (Today's task list)
 * @property {number} todayItemsCount - 오늘의 할 일 개수 (Count of today's tasks)
 * @property {string[]} savingsFilters - 적금 필터 옵션 배열 (Savings filter options)
 * @property {string[]} spendingFilters - 지출 필터 옵션 배열 (Spending filter options)
 * @property {SavingsData} savings - 적금 정보 (Savings information)
 * @property {SpendingData} spending - 지출 정보 (Spending information)
 *
 * @example
 * ```typescript
 * const homeData: HomeScreenData = {
 *   greeting: {
 *     userName: '홍길동',
 *     greetingMessage: '안녕하세요, 홍길동님!',
 *     motivationMessage: '오늘도 알뜰하게 저축해봐요!'
 *   },
 *   todayItems: [
 *     { id: '1', title: '청년도약계좌 납입', dday: 'D-3', ... }
 *   ],
 *   todayItemsCount: 3,
 *   savingsFilters: ['전체', '적금', '예금', '청년정책'],
 *   spendingFilters: ['이번 달', '지난 달', '최근 3개월'],
 *   savings: { id: '1', name: '청년도약계좌', ... },
 *   spending: { totalAmount: 1500000, categories: [...] }
 * };
 * ```
 */
export interface HomeScreenData {
  /**
   * 사용자 인사말 데이터 (User greeting data)
   *
   * 홈 화면 상단에 표시될 개인화된 인사말 정보입니다.
   */
  greeting: GreetingData;

  /**
   * 오늘의 할 일 목록 (Today's task list)
   *
   * 오늘 또는 가까운 시일 내에 처리해야 할 금융 관련 작업들의 배열입니다.
   */
  todayItems: TodayItemData[];

  /**
   * 오늘의 할 일 개수 (Count of today's tasks)
   *
   * todayItems 배열의 길이와 동일하거나, 서버에서 제공하는 총 개수입니다.
   */
  todayItemsCount: number;

  /**
   * 적금 필터 옵션 배열 (Savings filter options)
   *
   * 적금 섹션에서 사용할 수 있는 필터 옵션들의 배열입니다.
   *
   * @example
   * ["전체", "적금", "예금", "청년정책"]
   */
  savingsFilters: string[];

  /**
   * 지출 필터 옵션 배열 (Spending filter options)
   *
   * 지출 섹션에서 사용할 수 있는 기간 필터 옵션들의 배열입니다.
   *
   * @example
   * ["이번 달", "지난 달", "최근 3개월"]
   */
  spendingFilters: string[];

  /**
   * 적금 정보 (Savings information)
   *
   * 사용자의 주요 적금 계좌 정보입니다.
   */
  savings: SavingsData;

  /**
   * 지출 정보 (Spending information)
   *
   * 사용자의 지출 내역 및 분석 데이터입니다.
   */
  spending: SpendingData;
}
