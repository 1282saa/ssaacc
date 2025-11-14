/**
 * 채팅 서비스 (Chat Service)
 *
 * 이 파일은 채팅 관련 모든 기능을 제공하는 서비스 레이어입니다.
 * AI 챗봇과의 대화 관리, 메시지 송수신, 채팅 목록 관리 등을 담당합니다.
 *
 * 현재는 개발 및 테스트를 위해 더미 데이터를 사용하며,
 * 실제 AI 백엔드 및 WebSocket 연결로 쉽게 교체할 수 있도록 설계되었습니다.
 *
 * @module services/chatService
 * @category Services
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * import { chatService } from '@/services/chatService';
 *
 * // 채팅 목록 가져오기
 * const chats = await chatService.getChatList();
 *
 * // 특정 채팅의 메시지 가져오기
 * const messages = await chatService.getChatMessages('chat-1');
 *
 * // 메시지 전송 및 AI 응답 받기
 * const [userMsg, aiResponse] = await chatService.sendMessage('chat-1', '안녕하세요');
 * ```
 */

import type { Message, ChatItem } from '../types/chat';
import { API_ENDPOINTS } from '../config/api';

/**
 * 더미 채팅 목록 데이터 (Dummy Chat List Data)
 *
 * 개발 및 테스트를 위한 샘플 채팅 대화 목록입니다.
 * 실제 API 연동 시 서버에서 반환하는 데이터로 대체됩니다.
 *
 * @constant
 * @type {ChatItem[]}
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
 * 더미 메시지 데이터 (Dummy Messages Data)
 *
 * 각 채팅 대화별 메시지 내역을 담은 샘플 데이터입니다.
 * chatId를 키로 사용하여 해당 채팅의 메시지 배열을 조회할 수 있습니다.
 *
 * @constant
 * @type {Record<string, Message[]>}
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
 * 새 채팅 기본 메시지 (Default Welcome Messages)
 *
 * 새로운 채팅을 시작할 때 표시되는 기본 환영 메시지입니다.
 * AI 챗봇이 사용자에게 첫 인사를 건네는 메시지를 포함합니다.
 *
 * @constant
 * @type {Message[]}
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
 * 채팅 서비스 클래스 (Chat Service Class)
 *
 * 채팅 관련 모든 데이터 fetching 및 처리 메서드를 제공하는 서비스 클래스입니다.
 * Singleton 패턴으로 구현되어 애플리케이션 전체에서 단일 인스턴스를 공유합니다.
 *
 * @class ChatService
 *
 * @description
 * 모든 메서드는 Promise를 반환하여 비동기 API 호출 및 WebSocket 통신으로의
 * 쉬운 마이그레이션을 지원합니다. 현재는 더미 데이터를 반환하지만,
 * TODO로 표시된 부분을 실제 API/WebSocket 코드로 교체하면 됩니다.
 *
 * @example
 * ```typescript
 * import { chatService } from '@/services/chatService';
 *
 * // 컴포넌트에서 사용
 * const ChatScreen = () => {
 *   const [messages, setMessages] = useState<Message[]>([]);
 *
 *   useEffect(() => {
 *     const loadMessages = async () => {
 *       const data = await chatService.getChatMessages('chat-1');
 *       setMessages(data);
 *     };
 *     loadMessages();
 *   }, []);
 * };
 * ```
 */
class ChatService {
  /**
   * 채팅 목록 가져오기 (Fetch list of chat conversations)
   *
   * 사용자의 모든 채팅 대화 목록을 가져옵니다.
   * 채팅 목록 화면에 표시될 데이터를 제공합니다.
   *
   * @async
   * @returns {Promise<ChatItem[]>} 채팅 아이템 배열을 담은 Promise
   *
   * @example
   * ```typescript
   * const ChatListScreen = () => {
   *   const [chats, setChats] = useState<ChatItem[]>([]);
   *   const [loading, setLoading] = useState(true);
   *
   *   useEffect(() => {
   *     const fetchChats = async () => {
   *       try {
   *         const chatList = await chatService.getChatList();
   *         setChats(chatList);
   *       } catch (error) {
   *         console.error('Failed to load chats:', error);
   *       } finally {
   *         setLoading(false);
   *       }
   *     };
   *     fetchChats();
   *   }, []);
   *
   *   return (
   *     <FlatList
   *       data={chats}
   *       renderItem={({ item }) => <ChatItem data={item} />}
   *     />
   *   );
   * };
   * ```
   *
   * @todo 실제 API 엔드포인트로 교체 필요
   * @see {@link ChatItem} 반환 데이터 타입
   */
  async getChatList(): Promise<ChatItem[]> {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch('/api/chats');
    // return response.json();
    return Promise.resolve(DUMMY_CHAT_LIST);
  }

  /**
   * 특정 채팅의 메시지 가져오기 (Fetch messages for a specific chat)
   *
   * 주어진 chatId에 해당하는 채팅 대화의 모든 메시지를 가져옵니다.
   * 채팅 대화 화면에서 메시지 히스토리를 로드할 때 사용합니다.
   *
   * @async
   * @param {string} chatId - 채팅 대화의 고유 식별자
   * @returns {Promise<Message[]>} 메시지 배열을 담은 Promise
   *
   * @example
   * ```typescript
   * const ChatConversationScreen = ({ route }) => {
   *   const { chatId } = route.params;
   *   const [messages, setMessages] = useState<Message[]>([]);
   *
   *   useEffect(() => {
   *     const loadMessages = async () => {
   *       const data = await chatService.getChatMessages(chatId);
   *       setMessages(data);
   *     };
   *     loadMessages();
   *   }, [chatId]);
   *
   *   return (
   *     <ScrollView>
   *       {messages.map(msg => (
   *         <MessageBubble key={msg.id} message={msg} />
   *       ))}
   *     </ScrollView>
   *   );
   * };
   * ```
   *
   * @todo 실제 API 엔드포인트로 교체 필요
   * @see {@link Message} 반환 데이터 타입
   */
  async getChatMessages(chatId: string): Promise<Message[]> {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch(`/api/chats/${chatId}/messages`);
    // return response.json();

    // chatId에 해당하는 메시지가 없으면 환영 메시지 반환
    const messages = DUMMY_MESSAGES[chatId] || DEFAULT_WELCOME_MESSAGES;
    return Promise.resolve(messages);
  }

  /**
   * 메시지 전송 및 AI 응답 받기 (Send a message and get AI response)
   *
   * 사용자 메시지를 전송하고 AI 챗봇의 응답을 받아옵니다.
   * 사용자 메시지와 AI 응답을 함께 반환하여 UI 업데이트를 간편하게 합니다.
   *
   * @async
   * @param {string} chatId - 채팅 대화의 고유 식별자
   * @param {string} messageText - 전송할 메시지 텍스트
   * @param {object} context - 사용자 컨텍스트 (나이, 지역 등)
   * @returns {Promise<[Message, Message]>} [사용자 메시지, AI 응답] 튜플을 담은 Promise
   *
   * @example
   * ```typescript
   * const ChatConversationScreen = () => {
   *   const [messages, setMessages] = useState<Message[]>([]);
   *   const [inputText, setInputText] = useState('');
   *   const [sending, setSending] = useState(false);
   *
   *   const handleSend = async () => {
   *     if (!inputText.trim()) return;
   *
   *     setSending(true);
   *     try {
   *       const [userMsg, aiResponse] = await chatService.sendMessage(
   *         chatId,
   *         inputText,
   *         { age: 25, region: '서울' }
   *       );
   *
   *       // 사용자 메시지와 AI 응답을 한 번에 추가
   *       setMessages([...messages, userMsg, aiResponse]);
   *       setInputText('');
   *     } catch (error) {
   *       console.error('Failed to send message:', error);
   *     } finally {
   *       setSending(false);
   *     }
   *   };
   *
   *   return (
   *     <View>
   *       <MessageList messages={messages} />
   *       <InputBar
   *         value={inputText}
   *         onChangeText={setInputText}
   *         onSend={handleSend}
   *         disabled={sending}
   *       />
   *     </View>
   *   );
   * };
   * ```
   *
   * @see {@link Message} 반환 데이터 타입
   */
  async sendMessage(
    chatId: string,
    messageText: string,
    context: Record<string, any> = {}
  ): Promise<[Message, Message]> {
    // 사용자 메시지 생성
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    try {
      console.log('🚀 Sending message to backend:', {
        url: API_ENDPOINTS.CHAT_MESSAGES(chatId),
        message: messageText,
      });

      // AWS Bedrock 백엔드 API 호출
      const response = await fetch(API_ENDPOINTS.CHAT_MESSAGES(chatId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          context: context,
        }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Received AI response:', data);

      // AI 응답 메시지 생성
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: data.content || data.response || '응답을 받지 못했습니다.',
        isUser: false,
        timestamp: new Date(),
      };

      return [userMessage, aiResponse];
    } catch (error) {
      console.error('❌ Failed to send message to backend:', error);

      // 에러 발생 시 더미 응답 반환 (fallback)
      const fallbackResponse: Message = {
        id: Date.now() + 1,
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        isUser: false,
        timestamp: new Date(),
      };

      return [userMessage, fallbackResponse];
    }
  }

  /**
   * 새 채팅 대화 생성 (Create a new chat conversation)
   *
   * 새로운 채팅 대화를 생성합니다.
   * 첫 메시지를 함께 전달하면 해당 메시지로 대화를 시작합니다.
   *
   * @async
   * @param {string} [initialMessage] - 첫 메시지 (선택사항)
   * @returns {Promise<ChatItem>} 생성된 채팅 아이템을 담은 Promise
   *
   * @example
   * ```typescript
   * const NewChatScreen = () => {
   *   const navigation = useNavigation();
   *   const [selectedQuestion, setSelectedQuestion] = useState('');
   *
   *   const handleStartChat = async () => {
   *     try {
   *       // 미리 정의된 질문으로 새 채팅 시작
   *       const newChat = await chatService.createChat(
   *         '청년도약계좌에 대해 알려주세요'
   *       );
   *
   *       // 생성된 채팅으로 이동
   *       navigation.navigate('ChatConversation', {
   *         chatId: newChat.id,
   *         chatTitle: newChat.title
   *       });
   *     } catch (error) {
   *       console.error('Failed to create chat:', error);
   *     }
   *   };
   *
   *   return (
   *     <View>
   *       <Text>무엇을 도와드릴까요?</Text>
   *       <Button title="채팅 시작하기" onPress={handleStartChat} />
   *     </View>
   *   );
   * };
   * ```
   *
   * @todo 실제 API 엔드포인트로 교체 필요
   * @see {@link ChatItem} 반환 데이터 타입
   */
  async createChat(initialMessage?: string): Promise<ChatItem> {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch('/api/chats', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ initialMessage }),
    // });
    // return response.json();

    // 새 채팅 아이템 생성
    const newChat: ChatItem = {
      id: `chat-${Date.now()}`,
      title: initialMessage ? initialMessage.substring(0, 30) : '새 대화',
      lastMessageTime: new Date(),
      unreadCount: 0,
    };

    return Promise.resolve(newChat);
  }

  /**
   * 채팅 대화 삭제 (Delete a chat conversation)
   *
   * 지정된 채팅 대화를 삭제합니다.
   * 채팅 기록과 메시지가 모두 삭제되며, 이 작업은 되돌릴 수 없습니다.
   *
   * @async
   * @param {string} chatId - 삭제할 채팅의 고유 식별자
   * @returns {Promise<boolean>} 삭제 성공 여부를 담은 Promise
   *
   * @example
   * ```typescript
   * const ChatListScreen = () => {
   *   const [chats, setChats] = useState<ChatItem[]>([]);
   *
   *   const handleDelete = async (chatId: string) => {
   *     // 삭제 확인 다이얼로그
   *     Alert.alert(
   *       '채팅 삭제',
   *       '이 채팅을 삭제하시겠습니까?',
   *       [
   *         { text: '취소', style: 'cancel' },
   *         {
   *           text: '삭제',
   *           style: 'destructive',
   *           onPress: async () => {
   *             const success = await chatService.deleteChat(chatId);
   *             if (success) {
   *               // 목록에서 제거
   *               setChats(chats.filter(chat => chat.id !== chatId));
   *               Toast.show('채팅이 삭제되었습니다');
   *             }
   *           }
   *         }
   *       ]
   *     );
   *   };
   *
   *   return (
   *     <SwipeableList
   *       data={chats}
   *       renderItem={({ item }) => <ChatItem data={item} />}
   *       onDelete={handleDelete}
   *     />
   *   );
   * };
   * ```
   *
   * @todo 실제 API 엔드포인트로 교체 필요
   */
  async deleteChat(chatId: string): Promise<boolean> {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch(`/api/chats/${chatId}`, {
    //   method: 'DELETE',
    // });
    // return response.ok;

    return Promise.resolve(true);
  }

  /**
   * 더미 AI 응답 생성 (테스트 전용) (Generate dummy AI response - for testing only)
   *
   * 개발 및 테스트를 위해 간단한 키워드 기반 응답을 생성합니다.
   * 실제 AI 백엔드 연동 시 이 메서드는 제거됩니다.
   *
   * @private
   * @param {string} userMessage - 사용자가 입력한 메시지
   * @returns {string} 생성된 AI 응답 텍스트
   *
   * @description
   * 키워드 매칭 로직:
   * - '적금', '저축' -> 적금 상품 추천 안내
   * - '대출', '전월세' -> 전월세 대출 안내
   * - '정책', '지원' -> 청년 지원 정책 안내
   * - 기타 -> 랜덤 일반 응답
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

/**
 * 채팅 서비스 싱글톤 인스턴스 (ChatService Singleton Instance)
 *
 * 애플리케이션 전체에서 공유되는 ChatService의 단일 인스턴스입니다.
 * 이 인스턴스를 import하여 채팅 관련 모든 기능을 사용하세요.
 *
 * @constant
 * @type {ChatService}
 *
 * @example
 * ```typescript
 * import { chatService } from '@/services/chatService';
 *
 * // 채팅 목록 조회
 * const chats = await chatService.getChatList();
 *
 * // 메시지 전송
 * const [userMsg, aiMsg] = await chatService.sendMessage('chat-1', 'Hello');
 * ```
 */
export const chatService = new ChatService();

/**
 * 더미 데이터 Export (Dummy Data Exports)
 *
 * 테스트 및 개발 목적으로 더미 데이터를 export합니다.
 * 단위 테스트, 스토리북, 또는 개발 중 mock 데이터로 사용할 수 있습니다.
 *
 * @constant
 * @type {ChatItem[]} DUMMY_CHAT_LIST - 샘플 채팅 목록
 * @type {Record<string, Message[]>} DUMMY_MESSAGES - 샘플 메시지 데이터
 * @type {Message[]} DEFAULT_WELCOME_MESSAGES - 기본 환영 메시지
 */
export { DUMMY_CHAT_LIST, DUMMY_MESSAGES, DEFAULT_WELCOME_MESSAGES };
