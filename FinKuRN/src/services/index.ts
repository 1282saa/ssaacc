/**
 * 서비스 배럴 Export (Services Barrel Export)
 *
 * 이 파일은 모든 서비스 모듈을 중앙에서 export하는 진입점입니다.
 * 서비스 계층의 모든 기능을 한 곳에서 import할 수 있도록 합니다.
 *
 * @module services/index
 * @category Services
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // 여러 서비스를 한 번에 import
 * import { homeService, chatService, authService } from '@/services';
 *
 * // 데이터 가져오기
 * const homeData = await homeService.getHomeScreenData();
 * const chats = await chatService.getChatList();
 * const loginResult = await authService.login(email, password);
 *
 * // 더미 데이터도 import 가능 (테스트용)
 * import { DUMMY_HOME_DATA, DUMMY_CHAT_LIST } from '@/services';
 * ```
 *
 * @description
 * Export 목록:
 * - homeService: 홈 화면 데이터 관리
 * - chatService: 채팅 및 메시지 관리
 * - authService: 사용자 인증 관리
 * - DUMMY_*: 개발/테스트용 더미 데이터
 */

/**
 * 홈 서비스 Export (Home Service Export)
 *
 * 홈 화면 관련 서비스와 더미 데이터를 export합니다.
 */
export { homeService, DUMMY_HOME_DATA } from './homeService';

/**
 * 채팅 서비스 Export (Chat Service Export)
 *
 * 채팅 관련 서비스와 더미 데이터를 export합니다.
 */
export { chatService, DUMMY_CHAT_LIST, DUMMY_MESSAGES } from './chatService';

/**
 * 인증 서비스 Export (Auth Service Export)
 *
 * 인증 관련 서비스를 export합니다.
 * authService.ts에서 이미 export되어 있으므로 필요시 추가할 수 있습니다.
 *
 * @example
 * ```typescript
 * export { authService } from './authService';
 * ```
 */
