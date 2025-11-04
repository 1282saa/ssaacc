/**
 * Chat Type Definitions
 *
 * Defines types related to chat functionality.
 */

/**
 * Message
 *
 * Represents a single message in a chat conversation.
 */
export interface Message {
  /**
   * Unique identifier for the message
   */
  id: number;

  /**
   * Text content of the message
   */
  text: string;

  /**
   * Whether the message was sent by the user (true) or the bot (false)
   */
  isUser: boolean;

  /**
   * Timestamp when the message was created (optional)
   */
  timestamp?: Date;
}

/**
 * Chat Item
 *
 * Represents a chat conversation in the list view.
 */
export interface ChatItem {
  /**
   * Unique identifier for the chat
   */
  id: string;

  /**
   * Title/summary of the chat conversation
   */
  title: string;

  /**
   * Timestamp of the last message (optional)
   */
  lastMessageTime?: Date;

  /**
   * Number of unread messages (optional)
   */
  unreadCount?: number;
}
