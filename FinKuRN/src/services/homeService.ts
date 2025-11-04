/**
 * 홈 화면 데이터 서비스 (Home Screen Data Service)
 *
 * 이 파일은 홈 화면에서 필요한 모든 데이터를 제공하는 서비스 레이어입니다.
 * API 호출을 추상화하여 UI 컴포넌트와 백엔드 API 사이의 깔끔한 인터페이스를 제공합니다.
 *
 * 현재는 개발 및 테스트를 위해 더미 데이터를 반환하며,
 * 추후 실제 API 엔드포인트로 쉽게 교체할 수 있도록 설계되었습니다.
 *
 * @module services/homeService
 * @category Services
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * import { homeService } from '@/services/homeService';
 *
 * // 홈 화면 전체 데이터 가져오기
 * const homeData = await homeService.getHomeScreenData();
 *
 * // 오늘의 할 일만 가져오기
 * const todayItems = await homeService.getTodayItems();
 *
 * // 적금 데이터 가져오기 (필터 적용)
 * const savings = await homeService.getSavingsData('savings-1');
 * ```
 */

import type { HomeScreenData, TodayItemData } from '../types/home';

/**
 * 홈 화면 더미 데이터 상수 (HomeScreen Dummy Data Constant)
 *
 * 개발 및 테스트를 위한 샘플 데이터입니다.
 * 실제 API 연동 시 이 데이터는 서버 응답으로 대체됩니다.
 *
 * @constant
 * @type {HomeScreenData}
 *
 * @description
 * 포함된 데이터:
 * - 사용자 인사말 및 동기부여 메시지
 * - 오늘의 할 일 5개 (공과금, 청년도약계좌, 통신비, 적금, 구독료)
 * - 적금 필터 옵션 및 적금 상세 정보
 * - 지출 필터 옵션 및 카테고리별 지출 내역
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
 * 홈 서비스 클래스 (HomeScreen Service Class)
 *
 * 홈 화면 관련 모든 데이터 fetching 메서드를 제공하는 서비스 클래스입니다.
 * Singleton 패턴으로 구현되어 애플리케이션 전체에서 단일 인스턴스를 공유합니다.
 *
 * @class HomeService
 *
 * @description
 * 모든 메서드는 Promise를 반환하여 비동기 API 호출로의 쉬운 마이그레이션을 지원합니다.
 * 현재는 더미 데이터를 반환하지만, 주석으로 표시된 TODO 부분을 실제 API 호출로 교체하면 됩니다.
 *
 * @example
 * ```typescript
 * // 싱글톤 인스턴스 사용
 * import { homeService } from '@/services/homeService';
 *
 * // 컴포넌트에서 사용
 * useEffect(() => {
 *   const loadData = async () => {
 *     const data = await homeService.getHomeScreenData();
 *     setHomeData(data);
 *   };
 *   loadData();
 * }, []);
 * ```
 */
class HomeService {
  /**
   * 홈 화면 전체 데이터 가져오기 (Fetch complete HomeScreen data)
   *
   * 홈 화면에 필요한 모든 데이터를 한 번에 가져옵니다.
   * 인사말, 오늘의 할 일, 적금 정보, 지출 분석 등이 포함됩니다.
   *
   * @async
   * @returns {Promise<HomeScreenData>} 홈 화면 전체 데이터를 담은 Promise
   *
   * @example
   * ```typescript
   * const HomeScreen = () => {
   *   const [homeData, setHomeData] = useState<HomeScreenData | null>(null);
   *   const [loading, setLoading] = useState(true);
   *
   *   useEffect(() => {
   *     const fetchData = async () => {
   *       try {
   *         const data = await homeService.getHomeScreenData();
   *         setHomeData(data);
   *       } catch (error) {
   *         console.error('Failed to load home data:', error);
   *       } finally {
   *         setLoading(false);
   *       }
   *     };
   *     fetchData();
   *   }, []);
   * };
   * ```
   *
   * @todo 실제 API 엔드포인트로 교체 필요
   * @see {@link HomeScreenData} 반환 데이터 타입
   */
  async getHomeScreenData(): Promise<HomeScreenData> {
    // 네트워크 지연 시뮬레이션 (선택사항, 리얼한 동작을 위해)
    // await new Promise(resolve => setTimeout(resolve, 100));

    // 더미 데이터 반환
    // TODO: 실제 API 호출로 교체
    // const response = await fetch('/api/home');
    // return response.json();
    return Promise.resolve(DUMMY_HOME_DATA);
  }

  /**
   * 오늘의 할 일 목록만 가져오기 (Fetch only today items)
   *
   * 홈 화면에서 오늘의 할 일 섹션에 표시될 데이터만 가져옵니다.
   * 전체 데이터가 아닌 할 일 목록만 업데이트할 때 유용합니다.
   *
   * @async
   * @returns {Promise<TodayItemData[]>} 오늘의 할 일 배열을 담은 Promise
   *
   * @example
   * ```typescript
   * const TodaySection = () => {
   *   const [items, setItems] = useState<TodayItemData[]>([]);
   *
   *   useEffect(() => {
   *     const loadTodayItems = async () => {
   *       const data = await homeService.getTodayItems();
   *       setItems(data);
   *     };
   *     loadTodayItems();
   *   }, []);
   *
   *   return (
   *     <View>
   *       {items.map(item => (
   *         <TodayItem key={item.id} data={item} />
   *       ))}
   *     </View>
   *   );
   * };
   * ```
   *
   * @todo 실제 API 엔드포인트로 교체 필요
   * @see {@link TodayItemData} 반환 데이터 타입
   */
  async getTodayItems(): Promise<TodayItemData[]> {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch('/api/today-items');
    // return response.json();
    return Promise.resolve(DUMMY_HOME_DATA.todayItems);
  }

  /**
   * 적금 데이터 가져오기 (Fetch savings data)
   *
   * 사용자의 적금 정보를 가져옵니다.
   * 필터 ID를 전달하면 특정 적금 상품의 데이터만 가져올 수 있습니다.
   *
   * @async
   * @param {string} [filterId] - 필터링할 적금 ID (선택사항)
   * @returns {Promise<SavingsData>} 적금 데이터를 담은 Promise
   *
   * @example
   * ```typescript
   * const SavingsSection = () => {
   *   const [savings, setSavings] = useState(null);
   *   const [selectedFilter, setSelectedFilter] = useState('');
   *
   *   // 필터 변경 시 데이터 다시 로드
   *   useEffect(() => {
   *     const loadSavings = async () => {
   *       const data = await homeService.getSavingsData(selectedFilter);
   *       setSavings(data);
   *     };
   *     loadSavings();
   *   }, [selectedFilter]);
   *
   *   return (
   *     <View>
   *       <FilterChips
   *         options={['전체', '적금', '예금']}
   *         onSelect={setSelectedFilter}
   *       />
   *       <SavingsChart data={savings} />
   *     </View>
   *   );
   * };
   * ```
   *
   * @todo 실제 API 엔드포인트로 교체 필요
   * @see {@link SavingsData} 반환 데이터 타입
   */
  async getSavingsData(filterId?: string): Promise<typeof DUMMY_HOME_DATA.savings> {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch(`/api/savings${filterId ? `?filter=${filterId}` : ''}`);
    // return response.json();
    return Promise.resolve(DUMMY_HOME_DATA.savings);
  }

  /**
   * 지출 데이터 가져오기 (Fetch spending data)
   *
   * 사용자의 지출 분석 데이터를 가져옵니다.
   * 기간 필터를 전달하여 특정 기간의 지출 데이터를 조회할 수 있습니다.
   *
   * @async
   * @param {string} [period] - 기간 필터 ('오늘', '이번 주', '이번 달' 등)
   * @returns {Promise<SpendingData>} 지출 데이터를 담은 Promise
   *
   * @example
   * ```typescript
   * const SpendingSection = () => {
   *   const [spending, setSpending] = useState(null);
   *   const [period, setPeriod] = useState('이번 달');
   *
   *   // 기간 변경 시 데이터 다시 로드
   *   useEffect(() => {
   *     const loadSpending = async () => {
   *       const data = await homeService.getSpendingData(period);
   *       setSpending(data);
   *     };
   *     loadSpending();
   *   }, [period]);
   *
   *   return (
   *     <View>
   *       <FilterChips
   *         options={['오늘', '이번 주', '이번 달']}
   *         selected={period}
   *         onSelect={setPeriod}
   *       />
   *       <SpendingChart data={spending} />
   *       <CategoryList categories={spending?.categories} />
   *     </View>
   *   );
   * };
   * ```
   *
   * @todo 실제 API 엔드포인트로 교체 필요
   * @see {@link SpendingData} 반환 데이터 타입
   */
  async getSpendingData(period?: string): Promise<typeof DUMMY_HOME_DATA.spending> {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch(`/api/spending${period ? `?period=${period}` : ''}`);
    // return response.json();
    return Promise.resolve(DUMMY_HOME_DATA.spending);
  }
}

/**
 * 홈 서비스 싱글톤 인스턴스 (HomeService Singleton Instance)
 *
 * 애플리케이션 전체에서 공유되는 HomeService의 단일 인스턴스입니다.
 * 이 인스턴스를 import하여 홈 화면 관련 API를 호출하세요.
 *
 * @constant
 * @type {HomeService}
 *
 * @example
 * ```typescript
 * import { homeService } from '@/services/homeService';
 *
 * const data = await homeService.getHomeScreenData();
 * ```
 */
export const homeService = new HomeService();

/**
 * 더미 데이터 Export (Dummy Data Export)
 *
 * 테스트 및 개발 목적으로 더미 데이터를 export합니다.
 * 단위 테스트나 스토리북에서 mock 데이터로 사용할 수 있습니다.
 *
 * @constant
 * @type {HomeScreenData}
 */
export { DUMMY_HOME_DATA };
