/**
 * Plan 화면 타입 정의 (Plan Screen Type Definitions)
 *
 * AI 투두리스트 / 실천 관리 화면에서 사용하는 모든 타입을 정의합니다.
 *
 * @module types/plan
 * @category Types
 * @since 1.0.0
 *
 * @description
 * Plan 화면의 주요 기능:
 * - 목표별 분류: 저축 / 학자금 / 신용 / 투자기초
 * - 진행 단계: 준비 → 신청 → 완료
 * - 자동 체크리스트 생성
 * - 리마인드 설정 (스마트 알림)
 * - 완료 시 핀쿠 포인트 지급
 * - 진행률 시각화
 */

/**
 * 목표 카테고리 타입
 *
 * @description
 * 사용자가 설정할 수 있는 금융 목표의 카테고리를 정의합니다.
 */
export type GoalCategory = '저축' | '학자금' | '신용' | '투자기초';

/**
 * 진행 단계 타입
 *
 * @description
 * 각 목표의 진행 단계를 정의합니다.
 * - 준비: 정보 수집 및 서류 준비 단계
 * - 신청: 실제 신청 진행 단계
 * - 완료: 모든 절차 완료 단계
 */
export type ProgressStage = '준비' | '신청' | '완료';

/**
 * Task 아이템 인터페이스
 *
 * @description
 * Today's Tasks 섹션에 표시되는 개별 작업 항목의 구조를 정의합니다.
 *
 * @property {string} id - 작업 고유 ID
 * @property {string} title - 작업 제목
 * @property {boolean} completed - 완료 여부
 * @property {number} dDay - D-day 카운트 (0이면 D-DAY, 1이면 D-1)
 * @property {string} [encouragement] - 완료 시 표시될 응원 메시지 (선택적)
 */
export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  dDay: number;
  encouragement?: string;
}

/**
 * Upcoming 아이템 인터페이스
 *
 * @description
 * Upcoming Schedule 섹션에 표시되는 예정된 작업 항목의 구조를 정의합니다.
 *
 * @property {string} id - 작업 고유 ID
 * @property {string} title - 작업 제목
 * @property {string} subtitle - 작업 부제목 (예: "Due in 3 days")
 * @property {number} dDay - D-day 카운트
 * @property {string} iconType - 아이콘 타입 ('card' | 'document' | 'home' 등)
 */
export interface UpcomingItem {
  id: string;
  title: string;
  subtitle: string;
  dDay: number;
  iconType: 'card' | 'document' | 'home' | 'bank';
}

/**
 * 진행률 데이터 인터페이스
 *
 * @description
 * 주간 목표 달성 진행률을 나타내는 데이터 구조입니다.
 *
 * @property {number} completed - 완료한 작업 수
 * @property {number} total - 전체 작업 수
 * @property {number} percentage - 완료율 (0-100)
 * @property {string} nextDueTitle - 다음 마감 작업 제목
 * @property {number} nextDueDDay - 다음 마감 작업의 D-day
 */
export interface ProgressData {
  completed: number;
  total: number;
  percentage: number;
  nextDueTitle: string;
  nextDueDDay: number;
}

/**
 * 저축 진행 상태 인터페이스
 *
 * @description
 * My Savings Progress 섹션의 데이터 구조를 정의합니다.
 *
 * @property {boolean} isActive - 저축 트래커 활성화 여부
 * @property {number} [currentAmount] - 현재 저축 금액 (활성화 시)
 * @property {number} [targetAmount] - 목표 저축 금액 (활성화 시)
 * @property {number} [percentage] - 저축 달성률 (활성화 시)
 */
export interface SavingsProgress {
  isActive: boolean;
  currentAmount?: number;
  targetAmount?: number;
  percentage?: number;
}

/**
 * 핀쿠 포인트 데이터 인터페이스
 *
 * @description
 * 작업 완료 시 지급되는 핀쿠 포인트 정보입니다.
 *
 * @property {number} points - 보유 포인트
 * @property {number} earnedToday - 오늘 획득한 포인트
 */
export interface PinkuPoints {
  points: number;
  earnedToday: number;
}

/**
 * Checklist 항목 인터페이스
 *
 * @description
 * 목표별 체크리스트의 개별 항목 구조를 정의합니다.
 *
 * @property {string} id - 체크리스트 항목 고유 ID
 * @property {string} text - 체크리스트 항목 텍스트
 * @property {boolean} completed - 완료 여부
 */
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * Goal Progress 인터페이스
 *
 * @description
 * 목표별 실천 현황 데이터 구조를 정의합니다.
 *
 * @property {string} id - 목표 고유 ID
 * @property {string} title - 목표 제목 (이모지 포함)
 * @property {GoalCategory} category - 목표 카테고리
 * @property {number} completed - 완료한 체크리스트 항목 수
 * @property {number} total - 전체 체크리스트 항목 수
 * @property {number} percentage - 완료율 (0-100)
 * @property {ChecklistItem[]} checklists - 체크리스트 항목 배열
 */
export interface GoalProgress {
  id: string;
  title: string;
  category: GoalCategory;
  completed: number;
  total: number;
  percentage: number;
  checklists: ChecklistItem[];
}

/**
 * Plan Screen 데이터 인터페이스
 *
 * @description
 * Plan 화면에 표시되는 전체 데이터 구조를 정의합니다.
 *
 * @property {ProgressData} progress - 진행률 데이터
 * @property {TaskItem[]} todayTasks - 오늘의 작업 목록
 * @property {UpcomingItem[]} upcomingSchedule - 예정된 작업 목록
 * @property {SavingsProgress} savingsProgress - 저축 진행 상태
 * @property {GoalProgress[]} [goals] - 목표별 실천 현황 (선택적)
 * @property {PinkuPoints} [pinkuPoints] - 핀쿠 포인트 (선택적)
 */
export interface PlanScreenData {
  progress: ProgressData;
  todayTasks: TaskItem[];
  upcomingSchedule: UpcomingItem[];
  savingsProgress: SavingsProgress;
  goals?: GoalProgress[];
  pinkuPoints?: PinkuPoints;
}
