/**
 * 타입 정의 인덱스 (Type Definitions Index)
 *
 * 이 파일은 애플리케이션 전체에서 사용하는 모든 TypeScript 타입 정의를 중앙에서 관리합니다.
 * 각 도메인별 타입 파일(navigation, chat, home)에서 타입을 가져와 재export합니다.
 *
 * @module types/index
 * @category Types
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // 한 곳에서 모든 타입 import
 * import { Message, ChatItem, HomeScreenData, AppNavigation } from '@/types';
 *
 * // 또는 특정 도메인에서 직접 import
 * import { Message } from '@/types/chat';
 * ```
 */

/**
 * 네비게이션 관련 타입 export (Navigation-related type exports)
 *
 * 애플리케이션의 화면 간 이동과 관련된 모든 타입을 제공합니다.
 */
export type {
  /** 루트 스택 파라미터 리스트 - 모든 화면과 그 파라미터를 정의 */
  RootStackParamList,
  /** 앱 네비게이션 타입 - useNavigation 훅에서 사용 */
  AppNavigation,
  /** 채팅 대화 화면 Props - route와 navigation을 포함 */
  ChatConversationProps,
} from './navigation';

/**
 * 채팅 관련 타입 export (Chat-related type exports)
 *
 * AI 챗봇과의 대화 기능에 필요한 모든 타입을 제공합니다.
 */
export type {
  /** 메시지 인터페이스 - 개별 채팅 메시지 구조 */
  Message,
  /** 채팅 아이템 인터페이스 - 채팅 목록의 각 항목 구조 */
  ChatItem,
} from './chat';

/**
 * 홈 화면 관련 타입 export (Home screen-related type exports)
 *
 * 홈 화면에 표시되는 데이터 구조를 정의하는 모든 타입을 제공합니다.
 * 아직 export되지 않았지만, 필요시 아래와 같이 추가할 수 있습니다:
 *
 * export type {
 *   HomeScreenData,
 *   TodayItemData,
 *   GreetingData,
 *   SavingsData,
 *   SpendingData,
 *   SpendingCategoryData,
 * } from './home';
 */
