/**
 * 채팅 타입 정의 (Chat Type Definitions)
 *
 * 이 파일은 채팅 기능과 관련된 모든 데이터 타입을 정의합니다.
 * AI 챗봇과의 대화, 메시지 구조, 채팅 목록 아이템 등의 인터페이스를 포함합니다.
 *
 * @module types/chat
 * @category Types
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * import { Message, ChatItem } from '@/types/chat';
 *
 * const newMessage: Message = {
 *   id: 1,
 *   text: '안녕하세요',
 *   isUser: true,
 *   timestamp: new Date()
 * };
 * ```
 */

/**
 * 메시지 인터페이스 (Message Interface)
 *
 * 채팅 대화에서 하나의 메시지를 나타냅니다.
 * 사용자와 AI 챗봇 간의 주고받는 메시지 데이터 구조를 정의합니다.
 *
 * @interface Message
 * @property {number} id - 메시지의 고유 식별자 (Unique message identifier)
 * @property {string} text - 메시지 텍스트 내용 (Message text content)
 * @property {boolean} isUser - 사용자가 보낸 메시지 여부 (true: 사용자, false: AI 봇)
 * @property {Date} [timestamp] - 메시지 생성 시각 (Message creation timestamp)
 *
 * @example
 * ```typescript
 * // 사용자 메시지 예시
 * const userMessage: Message = {
 *   id: 1,
 *   text: '청년 정책 알려줘',
 *   isUser: true,
 *   timestamp: new Date()
 * };
 *
 * // AI 봇 응답 예시
 * const botResponse: Message = {
 *   id: 2,
 *   text: '청년 정책에는 청년 내일채움공제, 청년도약계좌 등이 있습니다.',
 *   isUser: false,
 *   timestamp: new Date()
 * };
 * ```
 */
export interface Message {
  /**
   * 메시지의 고유 식별자 (Unique message identifier)
   *
   * 각 메시지를 구분하기 위한 숫자 ID입니다.
   * 새 메시지가 추가될 때마다 증가하는 값을 사용합니다.
   */
  id: number;

  /**
   * 메시지 텍스트 내용 (Message text content)
   *
   * 사용자가 입력한 질문 또는 AI 봇이 생성한 응답 텍스트입니다.
   * 마크다운 형식을 지원할 수 있습니다.
   */
  text: string;

  /**
   * 사용자가 보낸 메시지 여부 (Whether message is from user)
   *
   * true: 사용자가 보낸 메시지
   * false: AI 챗봇이 보낸 응답
   *
   * UI에서 메시지 버블의 정렬 방향과 스타일을 결정하는 데 사용됩니다.
   */
  isUser: boolean;

  /**
   * 메시지 생성 시각 (Message creation timestamp)
   *
   * 메시지가 생성된 날짜와 시간입니다.
   * 채팅 기록 정렬 및 시간 표시에 사용됩니다.
   *
   * @optional
   */
  timestamp?: Date;
}

/**
 * 채팅 아이템 인터페이스 (Chat Item Interface)
 *
 * 채팅 목록 화면에 표시되는 개별 채팅 대화를 나타냅니다.
 * 사용자의 과거 채팅 기록을 목록으로 보여줄 때 사용하는 데이터 구조입니다.
 *
 * @interface ChatItem
 * @property {string} id - 채팅의 고유 식별자 (Unique chat identifier)
 * @property {string} title - 채팅 대화의 제목/요약 (Chat conversation title/summary)
 * @property {Date} [lastMessageTime] - 마지막 메시지 시각 (Last message timestamp)
 * @property {number} [unreadCount] - 읽지 않은 메시지 수 (Unread message count)
 *
 * @example
 * ```typescript
 * // 채팅 목록 아이템 예시
 * const chatItem: ChatItem = {
 *   id: 'chat-001',
 *   title: '청년 정책 문의',
 *   lastMessageTime: new Date('2024-01-15T10:30:00'),
 *   unreadCount: 2
 * };
 *
 * // 읽은 채팅 예시
 * const readChat: ChatItem = {
 *   id: 'chat-002',
 *   title: '적금 추천받기',
 *   lastMessageTime: new Date('2024-01-14T15:20:00'),
 *   unreadCount: 0
 * };
 * ```
 */
export interface ChatItem {
  /**
   * 채팅의 고유 식별자 (Unique chat identifier)
   *
   * 각 채팅 대화를 구분하기 위한 문자열 ID입니다.
   * UUID 또는 서버에서 생성한 고유 값을 사용합니다.
   */
  id: string;

  /**
   * 채팅 대화의 제목/요약 (Chat conversation title/summary)
   *
   * 채팅의 첫 질문 또는 AI가 생성한 요약 제목입니다.
   * 채팅 목록에서 대화 내용을 빠르게 파악할 수 있도록 합니다.
   *
   * @example
   * "청년 정책 문의", "적금 추천받기", "대출 상담"
   */
  title: string;

  /**
   * 마지막 메시지 시각 (Last message timestamp)
   *
   * 해당 채팅에서 가장 최근 메시지가 전송된 시각입니다.
   * 채팅 목록 정렬 및 시간 표시에 사용됩니다.
   *
   * @optional
   */
  lastMessageTime?: Date;

  /**
   * 읽지 않은 메시지 수 (Unread message count)
   *
   * 사용자가 아직 읽지 않은 새 메시지의 개수입니다.
   * 0 또는 undefined면 모든 메시지를 읽은 상태입니다.
   *
   * @optional
   */
  unreadCount?: number;
}
