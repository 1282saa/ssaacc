/**
 * Chat Service
 *
 * Handles data fetching for chat-related screens.
 * Currently returns dummy data via Promise.resolve().
 * Can be easily replaced with actual API calls later.
 *
 * @example
 * ```tsx
 * import { chatService } from '../services/chatService';
 *
 * const chats = await chatService.getChatList();
 * const messages = await chatService.getChatMessages('chat-1');
 * ```
 */

import type { Message, ChatItem } from '../types/chat';

/**
 * Dummy chat list data
 */
const DUMMY_CHAT_LIST: ChatItem[] = [
  {
    id: 'chat-1',
    title: '청년도약계좌 관련 문의',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    unreadCount: 2,
  },
  {
    id: 'chat-2',
    title: '적금 추천 받기',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    unreadCount: 0,
  },
  {
    id: 'chat-3',
    title: '전월세 지원 정책',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    unreadCount: 0,
  },
];

/**
 * Dummy messages for different chats
 */
const DUMMY_MESSAGES: Record<string, Message[]> = {
  'chat-1': [
    {
      id: 1,
      text: '청년도약계좌에 대해 알려주세요',
      isUser: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: 2,
      text: '청년도약계좌는 만 19~34세 청년을 위한 정책금융상품입니다. 5년간 납입하면 정부지원금과 이자를 받을 수 있어요.',
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 59),
    },
    {
      id: 3,
      text: '가입 조건이 어떻게 되나요?',
      isUser: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 4,
      text: '개인소득 7,500만원 이하, 가구소득 중위 250% 이하면 가입 가능합니다. 더 자세한 내용을 알려드릴까요?',
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 29),
    },
  ],
  'chat-2': [
    {
      id: 1,
      text: '목돈 마련을 위한 적금을 추천해주세요',
      isUser: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 2,
      text: '목표 금액과 기간을 알려주시면 맞춤 적금 상품을 추천해드릴게요. 어떤 목적으로 저축하시나요?',
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 30),
    },
  ],
  'chat-3': [
    {
      id: 1,
      text: '전월세 지원 정책이 있나요?',
      isUser: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: 2,
      text: '네, 청년 전월세 보증금 대출과 월세 지원 정책이 있습니다. 어떤 정보가 필요하신가요?',
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60),
    },
  ],
};

/**
 * Default messages for new chats
 */
const DEFAULT_WELCOME_MESSAGES: Message[] = [
  {
    id: 1,
    text: '안녕하세요! 금융 도우미입니다. 무엇을 도와드릴까요?',
    isUser: false,
    timestamp: new Date(),
  },
];

/**
 * Chat Service
 *
 * Provides data fetching methods for chat functionality.
 * All methods return Promises for easy migration to async API calls.
 */
class ChatService {
  /**
   * Fetch list of chat conversations
   *
   * @returns Promise resolving to array of ChatItem
   *
   * @example
   * ```tsx
   * const chats = await chatService.getChatList();
   * setChatList(chats);
   * ```
   */
  async getChatList(): Promise<ChatItem[]> {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/chats');
    // return response.json();
    return Promise.resolve(DUMMY_CHAT_LIST);
  }

  /**
   * Fetch messages for a specific chat
   *
   * @param chatId - ID of the chat conversation
   * @returns Promise resolving to array of Message
   *
   * @example
   * ```tsx
   * const messages = await chatService.getChatMessages('chat-1');
   * setMessages(messages);
   * ```
   */
  async getChatMessages(chatId: string): Promise<Message[]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/chats/${chatId}/messages`);
    // return response.json();

    const messages = DUMMY_MESSAGES[chatId] || DEFAULT_WELCOME_MESSAGES;
    return Promise.resolve(messages);
  }

  /**
   * Send a message and get AI response
   *
   * @param chatId - ID of the chat conversation
   * @param messageText - Text of the message to send
   * @returns Promise resolving to array containing user message and AI response
   *
   * @example
   * ```tsx
   * const [userMessage, aiResponse] = await chatService.sendMessage('chat-1', '안녕하세요');
   * setMessages([...messages, userMessage, aiResponse]);
   * ```
   */
  async sendMessage(chatId: string, messageText: string): Promise<[Message, Message]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/chats/${chatId}/messages`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text: messageText }),
    // });
    // return response.json();

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    const aiResponse: Message = {
      id: Date.now() + 1,
      text: this.generateDummyResponse(messageText),
      isUser: false,
      timestamp: new Date(Date.now() + 1000),
    };

    return Promise.resolve([userMessage, aiResponse]);
  }

  /**
   * Create a new chat conversation
   *
   * @param initialMessage - Optional initial message
   * @returns Promise resolving to new ChatItem
   *
   * @example
   * ```tsx
   * const newChat = await chatService.createChat('적금 추천해주세요');
   * navigation.navigate('ChatConversation', { chatId: newChat.id });
   * ```
   */
  async createChat(initialMessage?: string): Promise<ChatItem> {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/chats', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ initialMessage }),
    // });
    // return response.json();

    const newChat: ChatItem = {
      id: `chat-${Date.now()}`,
      title: initialMessage ? initialMessage.substring(0, 30) : '새 대화',
      lastMessageTime: new Date(),
      unreadCount: 0,
    };

    return Promise.resolve(newChat);
  }

  /**
   * Delete a chat conversation
   *
   * @param chatId - ID of the chat to delete
   * @returns Promise resolving to boolean indicating success
   *
   * @example
   * ```tsx
   * const success = await chatService.deleteChat('chat-1');
   * if (success) {
   *   // Remove from list
   * }
   * ```
   */
  async deleteChat(chatId: string): Promise<boolean> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/chats/${chatId}`, {
    //   method: 'DELETE',
    // });
    // return response.ok;

    return Promise.resolve(true);
  }

  /**
   * Generate dummy AI response (for testing only)
   * This will be removed when connected to real AI backend
   */
  private generateDummyResponse(userMessage: string): string {
    const responses = [
      '네, 도움을 드리겠습니다. 더 자세한 정보를 알려주시겠어요?',
      '좋은 질문이세요! 관련 정보를 찾아보고 있습니다.',
      '이해했습니다. 맞춤 정보를 제공해드리겠습니다.',
      '추가로 필요한 정보가 있으시면 언제든 물어보세요!',
    ];

    // Simple keyword-based responses
    if (userMessage.includes('적금') || userMessage.includes('저축')) {
      return '적금 상품 추천을 도와드리겠습니다. 월 예상 납입액과 목표 기간을 알려주시면 더 정확한 상품을 추천해드릴 수 있어요.';
    }

    if (userMessage.includes('대출') || userMessage.includes('전월세')) {
      return '전월세 대출 상품에 대해 안내해드리겠습니다. 현재 계약하실 주거 형태와 보증금 규모를 알려주시면 맞춤 정보를 제공해드릴게요.';
    }

    if (userMessage.includes('정책') || userMessage.includes('지원')) {
      return '청년 지원 정책에는 청년도약계좌, 청년내일채움공제, 전월세 지원 등이 있습니다. 어떤 정책이 궁금하신가요?';
    }

    // Default response
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Export singleton instance
export const chatService = new ChatService();

// Export dummy data for testing purposes
export { DUMMY_CHAT_LIST, DUMMY_MESSAGES, DEFAULT_WELCOME_MESSAGES };
