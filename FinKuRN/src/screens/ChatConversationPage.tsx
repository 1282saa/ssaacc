import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "../components/common/StatusBar";
import { BackgroundGradient } from "../components/common/BackgroundGradient";
import { CHAT_GRADIENTS_LARGE } from "../constants/gradients";
import { theme } from "../constants/theme";
import type { Message } from "../types/chat";
import type { AppNavigation, RootStackParamList } from "../types/navigation";
import { websocketService } from "../services/websocketService";
import { API_ENDPOINTS } from "../config/api";
import { PolicyComparisonCard, PolicyCardData } from "../components/PolicyComparisonCard";
import Markdown from 'react-native-markdown-display';

/**
 * 채팅 대화 페이지 (Chat Conversation Page)
 *
 * 활성 채팅 대화 내역과 입력 컨트롤을 표시하는 화면입니다.
 * 사용자는 메시지를 보내고 챗봇으로부터 응답을 받을 수 있습니다.
 *
 * @component
 * @category UI/Screens
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { ChatConversationPage } from './screens/ChatConversationPage';
 *
 * // Navigation으로부터 chatTitle을 받아 사용
 * navigation.navigate('ChatConversation', { chatTitle: '청년 월세 지원금 비교' });
 * ```
 *
 * @description
 * Navigation Props:
 * - chatTitle: 대화의 제목/주제 (Conversation Title/Topic)
 *
 * 주요 기능:
 * - 메시지 히스토리 표시 (Message History Display)
 * - 실시간 메시지 전송 (Real-time Message Sending)
 * - 봇 응답 시뮬레이션 (Bot Response Simulation with 1s delay)
 * - 입력 컨트롤 (Input Controls)
 *   - 텍스트 입력 (Text Input)
 *   - 음성 입력 버튼 (Voice Input Button)
 *   - 첨부 파일 버튼 (Attachment Button)
 *   - 전송 버튼 (Send Button)
 *
 * @state
 * - messages: Message[] - 대화 메시지 배열
 * - inputText: string - 현재 입력 중인 텍스트
 *
 * @features
 * - 키보드 회피 레이아웃 (KeyboardAvoidingView)
 * - 스크롤 가능한 메시지 목록 (Scrollable Message List)
 * - 사용자/봇 메시지 구분 스타일 (Distinct User/Bot Message Styles)
 * - 그라디언트 배경 (Gradient Background with CHAT_GRADIENTS_LARGE)
 * - 뒤로가기 네비게이션 (Back Navigation)
 *
 * @see {@link Message}
 * @see {@link ChatbotScreenV2}
 * @see {@link NewChatPage}
 */
export const ChatConversationPage: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();
  const route = useRoute<{ params: RootStackParamList["ChatConversation"] }>();
  const { chatTitle } = route.params || { chatTitle: "대화" };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: chatTitle,
      isUser: true,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const streamingMessageId = useRef<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  /**
   * 추천 질문 파싱 및 제거 함수
   * 메시지에서 "1. 질문", "2. 질문", "3. 질문" 형식의 선택지를 추출하고
   * 원본 텍스트에서 해당 부분을 제거
   */
  const parseSuggestedQuestions = (text: string): string[] => {
    const questions: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const match = line.match(/^[1-3]\.\s*(.+)$/);
      if (match) {
        questions.push(match[1].trim());
      }
    }

    return questions.length === 3 ? questions : [];
  };

  /**
   * 메시지에서 추천 질문 부분 제거
   * 답변 끝에 있는 "1. 질문" 형식의 리스트만 제거
   */
  const removeQuestionsFromText = (text: string): string => {
    if (!text) return text;

    const lines = text.split('\n');
    const result: string[] = [];
    let foundQuestionStart = false;

    // 뒤에서부터 확인하여 연속된 "1.", "2.", "3." 패턴 찾기
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();

      // 빈 줄은 건너뛰기
      if (!line) continue;

      // 질문 패턴 (1., 2., 3.)
      const isQuestionLine = line.match(/^[1-3]\.\s*.+$/);

      if (isQuestionLine) {
        foundQuestionStart = true;
        continue; // 질문 라인은 제거
      } else if (foundQuestionStart) {
        // 질문 시작을 찾았는데 질문이 아닌 줄이 나오면 중단
        break;
      }
    }

    // 질문 부분을 제외한 나머지 반환
    const questionsToRemove = foundQuestionStart ? 3 : 0;
    const linesToKeep = lines.slice(0, -questionsToRemove).join('\n').trim();

    return linesToKeep || text;
  };

  /**
   * 정책 카드 파싱 함수
   * 메시지 텍스트에서 POLICY_CARD_START ... POLICY_CARD_END 블록을 찾아 파싱
   */
  const parsePolicyCard = (text: string): { hasCard: boolean; policyA?: PolicyCardData; policyB?: PolicyCardData; beforeCard: string; afterCard: string } => {
    // 백틱 포함/미포함 모두 매칭
    const cardStartRegex = /```?POLICY_CARD_START/;
    const cardEndRegex = /```?POLICY_CARD_END/;

    const cardStartMatch = text.match(cardStartRegex);
    const cardEndMatch = text.match(cardEndRegex);

    if (!cardStartMatch || !cardEndMatch) {
      return { hasCard: false, beforeCard: text, afterCard: '' };
    }

    const startIndex = cardStartMatch.index! + cardStartMatch[0].length;
    const endIndex = cardEndMatch.index!;

    const beforeCard = text.substring(0, cardStartMatch.index!).trim();
    const cardContent = text.substring(startIndex, endIndex).trim();
    const afterCard = text.substring(endIndex + cardEndMatch[0].length).trim();

    // 정책 A 파싱
    const policyAMatch = cardContent.match(/POLICY_A:\s*(.+)/);
    const targetAMatch = cardContent.match(/TARGET_A:\s*(.+)/);
    const incomeAMatch = cardContent.match(/INCOME_A:\s*(.+)/);
    const amountAMatch = cardContent.match(/AMOUNT_A:\s*(.+)/);
    const applicationAMatch = cardContent.match(/APPLICATION_A:\s*(.+)/);

    // 정책 B 파싱
    const policyBMatch = cardContent.match(/POLICY_B:\s*(.+)/);
    const targetBMatch = cardContent.match(/TARGET_B:\s*(.+)/);
    const incomeBMatch = cardContent.match(/INCOME_B:\s*(.+)/);
    const amountBMatch = cardContent.match(/AMOUNT_B:\s*(.+)/);
    const applicationBMatch = cardContent.match(/APPLICATION_B:\s*(.+)/);

    // 정책 A가 없으면 파싱 실패
    if (!policyAMatch || !targetAMatch || !incomeAMatch || !amountAMatch || !applicationAMatch) {
      // 카드 마커를 제거하고 일반 텍스트로 반환
      const cleanedText = text.replace(/```?POLICY_CARD_START/g, '')
                              .replace(/```?POLICY_CARD_END/g, '')
                              .trim();
      return { hasCard: false, beforeCard: cleanedText, afterCard: '' };
    }

    const policyA: PolicyCardData = {
      title: policyAMatch[1].trim(),
      target: targetAMatch[1].trim(),
      income: incomeAMatch[1].trim(),
      amount: amountAMatch[1].trim(),
      application: applicationAMatch[1].trim(),
    };

    // 정책 B가 없으면 정책 A만 사용 (단일 카드는 표시하지 않음)
    if (!policyBMatch || !targetBMatch || !incomeBMatch || !amountBMatch || !applicationBMatch) {
      // 카드 마커를 제거하고 일반 텍스트로 반환
      const cleanedText = text.replace(/```?POLICY_CARD_START/g, '')
                              .replace(/```?POLICY_CARD_END/g, '')
                              .trim();
      return { hasCard: false, beforeCard: cleanedText, afterCard: '' };
    }

    const policyB: PolicyCardData = {
      title: policyBMatch[1].trim(),
      target: targetBMatch[1].trim(),
      income: incomeBMatch[1].trim(),
      amount: amountBMatch[1].trim(),
      application: applicationBMatch[1].trim(),
    };

    return { hasCard: true, policyA, policyB, beforeCard, afterCard };
  };

  /**
   * WebSocket 연결 및 초기 질문 전송
   */
  useEffect(() => {
    const chatId = route.params?.chatId || "default-chat";

    // WebSocket 연결
    websocketService.connect(chatId, {
      onStart: (data) => {
        console.log('🚀 Streaming started:', data);
        setInitialLoading(false);
        setSending(false);

        // 새로운 AI 메시지 ID 생성
        streamingMessageId.current = Date.now();
        setStreamingMessage("");
      },

      onChunk: (chunk) => {
        // 청크를 받을 때마다 스트리밍 메시지 업데이트
        setStreamingMessage((prev) => prev + chunk);
      },

      onPolicy: (policies) => {
        console.log('📋 Retrieved policies:', policies);
      },

      onEnd: (fullResponse) => {
        console.log('✅ Streaming completed');
        console.log('📝 Full response:', fullResponse);

        // 추천 질문 파싱
        const questions = parseSuggestedQuestions(fullResponse);
        console.log('❓ Parsed questions:', questions);
        setSuggestedQuestions(questions);

        // 메시지에서 추천 질문 부분 제거
        const cleanedResponse = removeQuestionsFromText(fullResponse);
        console.log('🧹 Cleaned response:', cleanedResponse);

        // 완성된 AI 응답을 메시지 목록에 추가
        const aiMessage: Message = {
          id: streamingMessageId.current,
          text: cleanedResponse,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setStreamingMessage("");
        setSending(false);
      },

      onError: (error) => {
        console.error('❌ WebSocket error:', error);

        // 에러 메시지 표시
        const errorMessage: Message = {
          id: Date.now(),
          text: "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.",
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
        setStreamingMessage("");
        setInitialLoading(false);
        setSending(false);
      },

      onClose: () => {
        console.log('🔌 WebSocket closed');
      },
    });

    // 초기 질문 자동 전송
    if (chatTitle && chatTitle !== "대화") {
      setInitialLoading(true);

      // WebSocket이 연결될 때까지 대기
      const sendInitialMessage = setInterval(() => {
        if (websocketService.isConnected()) {
          // 초기 질문은 대화 기록이 없으므로 빈 배열 전달
          websocketService.sendMessage(chatTitle, {
            conversation_history: [],
          });
          clearInterval(sendInitialMessage);
        }
      }, 100);

      // 10초 후에도 연결 안 되면 타임아웃
      setTimeout(() => {
        clearInterval(sendInitialMessage);
        if (initialLoading) {
          setInitialLoading(false);
          const errorMessage: Message = {
            id: Date.now(),
            text: "서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      }, 10000);
    } else {
      setInitialLoading(false);
    }

    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
      websocketService.disconnect();
    };
  }, []);

  /**
   * 메시지 전송 핸들러 (WebSocket Streaming)
   *
   * WebSocket을 통해 메시지를 전송하고 스트리밍 응답을 받습니다.
   */
  const handleSend = (messageOverride?: string) => {
    const messageToSend = messageOverride || inputText;

    if (!messageToSend.trim() || sending) return;

    if (!websocketService.isConnected()) {
      console.error('WebSocket is not connected');
      return;
    }

    // 숫자 입력 감지 (1, 2, 3) - 버튼 클릭이 아닐 때만
    let actualMessage = messageToSend;
    if (!messageOverride && suggestedQuestions.length === 3) {
      const numberMatch = messageToSend.match(/^[1-3]$/);
      if (numberMatch) {
        const questionIndex = parseInt(numberMatch[0]) - 1;
        actualMessage = suggestedQuestions[questionIndex];
      }
    }

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now(),
      text: actualMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // 대화 기록 구성 (최근 10개 메시지만 전송)
    const conversationHistory = messages.slice(-10).map((msg) => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text,
    }));

    // WebSocket으로 메시지 전송 (대화 기록 포함)
    setSending(true);
    websocketService.sendMessage(actualMessage, {
      conversation_history: conversationHistory,
    });

    setInputText("");
    setSuggestedQuestions([]); // 질문 전송 후 선택지 초기화
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <BackgroundGradient layers={CHAT_GRADIENTS_LARGE} size={700} />

      <StatusBar />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={{
              uri: "https://c.animaapp.com/d4bI3vUH/img/icon-cheveron-left-1.svg",
            }}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FinKu</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Image
            source={{ uri: "https://c.animaapp.com/zZcdFnH1/img/-------1.svg" }}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => {
          // 사용자 메시지는 그대로 표시
          if (message.isUser) {
            return (
              <View
                key={message.id}
                style={[styles.messageBubble, styles.userMessage]}
              >
                <Text style={[styles.messageText, styles.userMessageText]}>
                  {message.text}
                </Text>
              </View>
            );
          }

          // AI 메시지는 정책 카드 파싱 시도
          const parsed = parsePolicyCard(message.text);

          return (
            <View key={message.id} style={styles.botMessageContainer}>
              {/* 카드 이전 텍스트 */}
              {parsed.beforeCard && parsed.beforeCard.trim() && (
                <View style={[styles.messageBubble, styles.botMessage]}>
                  <Markdown style={markdownStyles}>
                    {parsed.beforeCard}
                  </Markdown>
                </View>
              )}

              {/* 정책 비교 카드 */}
              {parsed.hasCard && parsed.policyA && parsed.policyB && (
                <PolicyComparisonCard
                  policyA={parsed.policyA}
                  policyB={parsed.policyB}
                />
              )}

              {/* 카드 이후 텍스트 */}
              {parsed.afterCard && parsed.afterCard.trim() && (
                <View style={[styles.messageBubble, styles.botMessage]}>
                  <Markdown style={markdownStyles}>
                    {parsed.afterCard}
                  </Markdown>
                </View>
              )}
            </View>
          );
        })}

        {/* 스트리밍 중인 메시지 표시 */}
        {useMemo(() => {
          if (!streamingMessage) return null;

          // 스트리밍 메시지에서 추천 질문 부분 제거
          const cleanedStreaming = removeQuestionsFromText(streamingMessage);
          const parsed = parsePolicyCard(cleanedStreaming);

          return (
            <View style={styles.botMessageContainer}>
              {/* 카드 이전 텍스트 */}
              {parsed.beforeCard && parsed.beforeCard.trim() && (
                <View style={[styles.messageBubble, styles.botMessage, styles.streamingMessage]}>
                  <Markdown style={markdownStyles}>
                    {parsed.beforeCard}
                  </Markdown>
                  {!parsed.hasCard && (
                    <View style={styles.streamingIndicator}>
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    </View>
                  )}
                </View>
              )}

              {/* 정책 비교 카드 (스트리밍 중에도 표시) */}
              {parsed.hasCard && parsed.policyA && parsed.policyB && (
                <PolicyComparisonCard
                  policyA={parsed.policyA}
                  policyB={parsed.policyB}
                />
              )}

              {/* 카드 이후 텍스트 */}
              {parsed.afterCard && parsed.afterCard.trim() && (
                <View style={[styles.messageBubble, styles.botMessage, styles.streamingMessage]}>
                  <Markdown style={markdownStyles}>
                    {parsed.afterCard}
                  </Markdown>
                  <View style={styles.streamingIndicator}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  </View>
                </View>
              )}
            </View>
          );
        }, [streamingMessage])}

        {initialLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>AI가 답변을 생성하고 있습니다...</Text>
          </View>
        )}

        {/* 추천 질문 버튼 */}
        {suggestedQuestions.length === 3 && !sending && (
          <View style={styles.suggestedQuestionsContainer}>
            <Text style={styles.suggestedQuestionsTitle}>다음 중 궁금한 내용을 선택해주세요:</Text>
            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.questionButton}
                onPress={() => handleSend(question)}
                activeOpacity={0.7}
              >
                <Text style={styles.questionNumber}>{index + 1}</Text>
                <Text style={styles.questionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: theme.spacing.xl }} />
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.plusButton}>
          <Image
            source={{
              uri: "https://c.animaapp.com/d4bI3vUH/img/icon-plus-1.svg",
            }}
            style={styles.plusIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="무엇이든 질문해주세요"
          placeholderTextColor={theme.colors.textPlaceholder}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.micButton}>
          <Image
            source={{ uri: "https://c.animaapp.com/d4bI3vUH/img/mic.svg" }}
            style={styles.micIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <Image
              source={{ uri: "https://c.animaapp.com/d4bI3vUH/img/-----.svg" }}
              style={styles.sendIcon}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    position: "absolute",
    top: theme.layout.headerTop,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 0,
    paddingBottom: theme.spacing.sm,
    height: theme.layout.headerHeight,
    zIndex: theme.zIndex.header,
    backgroundColor: "transparent",
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    ...theme.typography.heading3,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    width: 40,
    height: 40,
  },
  messagesContainer: {
    flex: 1,
    paddingTop: theme.layout.scrollViewPaddingTop,
  },
  messagesContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: 4,
    ...theme.shadows.small,
  },
  messageText: {
    ...theme.typography.body1,
  },
  userMessageText: {
    color: theme.colors.white,
    fontWeight: "500",
  },
  botMessageText: {
    color: theme.colors.black,
    fontWeight: "400",
  },
  inputContainer: {
    position: "absolute",
    bottom: 42,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  plusButton: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    ...theme.typography.body2,
    color: theme.colors.white,
  },
  micButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  micIcon: {
    width: 24,
    height: 24,
  },
  sendButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: {
    width: 36,
    height: 36,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    ...theme.shadows.small,
  },
  loadingText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  streamingMessage: {
    opacity: 1,
  },
  streamingIndicator: {
    position: 'absolute',
    bottom: 6,
    right: 6,
  },
  botMessageContainer: {
    width: '100%',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  suggestedQuestionsContainer: {
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  suggestedQuestionsTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  questionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.white,
    backgroundColor: theme.colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 10,
  },
  questionText: {
    flex: 1,
    fontSize: 11,
    color: theme.colors.textPrimary,
    lineHeight: 16,
  },
});

// 마크다운 스타일
const markdownStyles = StyleSheet.create({
  body: {
    color: theme.colors.black,
    fontSize: 11,
    lineHeight: 16,
  },
  heading1: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  heading2: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 6,
    marginBottom: 3,
  },
  heading3: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 4,
    marginBottom: 2,
  },
  strong: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  em: {
    fontStyle: 'italic',
  },
  text: {
    color: theme.colors.black,
    fontSize: 11,
    lineHeight: 16,
  },
  bullet_list: {
    marginTop: 2,
    marginBottom: 2,
  },
  ordered_list: {
    marginTop: 2,
    marginBottom: 2,
  },
  list_item: {
    marginTop: 1,
    marginBottom: 1,
  },
  paragraph: {
    marginTop: 2,
    marginBottom: 2,
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  code_inline: {
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fence: {
    backgroundColor: '#F5F5F7',
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
  },
  hr: {
    backgroundColor: '#E5E5E5',
    height: 1,
    marginVertical: 8,
  },
});
