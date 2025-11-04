import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

/**
 * ChatItem Component Props
 */
interface ChatItemProps {
  /**
   * Title/summary of the chat conversation
   */
  title: string;

  /**
   * Callback function when the chat item is pressed
   */
  onPress: () => void;
}

/**
 * ChatItem Component
 *
 * Displays a single chat conversation item in the recent chats list.
 * Shows the conversation title and a menu button for additional actions.
 *
 * @param title - The title/summary of the conversation
 * @param onPress - Function to call when the item is pressed
 *
 * @example
 * ```tsx
 * <ChatItem
 *   title="청년 월세 지원금 비교"
 *   onPress={() => navigation.navigate('ChatConversation', { chatTitle: title })}
 * />
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
