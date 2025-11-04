/**
 * 채팅 아이템 컴포넌트 (Chat Item Component)
 *
 * 최근 채팅 목록에서 단일 대화를 표시하는 컴포넌트입니다.
 * 대화 제목과 추가 작업을 위한 메뉴 버튼을 보여줍니다.
 *
 * @module Components/ChatItem
 * @category UI/Components/Chat
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { ChatItem } from './components/ChatItem';
 *
 * <ChatItem
 *   title="청년 월세 지원금 비교"
 *   onPress={() => navigation.navigate('ChatConversation', { chatTitle: title })}
 * />
 * ```
 *
 * @description
 * 표시 내용:
 * - 대화 제목/요약 (Conversation Title/Summary)
 * - 메뉴 아이콘 (Menu Icon) - 추가 작업용
 *
 * @features
 * - 터치 가능한 카드 레이아웃 (Touchable Card Layout)
 * - 그림자 효과 (Shadow Effect)
 * - 활성 불투명도 (Active Opacity: 0.7)
 * - Ionicons 통합 (Ionicons Integration)
 *
 * @styling
 * - height: 52px
 * - borderRadius: 16px (md)
 * - backgroundColor: white
 * - paddingHorizontal: 18px
 * - shadow: small
 *
 * @see {@link ChatbotScreenV2}
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

/**
 * 채팅 아이템 컴포넌트 Props (Chat Item Component Props)
 *
 * @interface ChatItemProps
 * @property {string} title - 대화의 제목/요약 (Conversation Title/Summary)
 * @property {() => void} onPress - 아이템 클릭 시 호출되는 콜백 함수 (Callback when item is pressed)
 */
interface ChatItemProps {
  /**
   * 대화의 제목/요약 (Title/Summary of the Chat Conversation)
   *
   * @example "청년 월세 지원금 비교"
   */
  title: string;

  /**
   * 아이템 클릭 시 호출되는 콜백 함수 (Callback Function when the Chat Item is Pressed)
   *
   * @example () => navigation.navigate('ChatConversation', { chatTitle })
   */
  onPress: () => void;
}

/**
 * 채팅 아이템 컴포넌트 (Chat Item Component)
 *
 * 최근 대화 목록에서 개별 채팅 항목을 렌더링합니다.
 * 대화 제목과 추가 옵션 메뉴 버튼을 표시합니다.
 *
 * @component
 * @param {ChatItemProps} props - 컴포넌트 props
 * @param {string} props.title - 대화 제목/요약
 * @param {() => void} props.onPress - 클릭 핸들러 함수
 *
 * @returns {JSX.Element} 채팅 아이템 카드
 *
 * @example
 * ```tsx
 * // 챗봇 화면의 최근 대화 목록에서 사용
 * const chatItems = ['청년 월세 지원금 비교', '신용카드 혜택 비교'];
 *
 * {chatItems.map((item, index) => (
 *   <ChatItem
 *     key={index}
 *     title={item}
 *     onPress={() => navigation.navigate('ChatConversation', { chatTitle: item })}
 *   />
 * ))}
 * ```
 */
export const ChatItem: React.FC<ChatItemProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.chatItemText}>{title}</Text>
      <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.textTertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    height: 52,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    ...theme.shadows.small,
  },
  chatItemText: {
    ...theme.typography.body2,
    color: '#1b1d1f',
  },
});
