import React, { useState } from "react";
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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "../components/common/StatusBar";
import { BackgroundGradient } from "../components/common/BackgroundGradient";
import { CHAT_GRADIENTS_LARGE } from "../constants/gradients";
import { theme } from "../constants/theme";
import type { Message } from "../types/chat";
import type { AppNavigation, RootStackParamList } from "../types/navigation";

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
    {
      id: 2,
      text: "안녕하세요! 해당 질문에 대해 도움을 드리겠습니다. 구체적으로 어떤 정보가 필요하신가요?",
      isUser: false,
    },
  ]);

  const [inputText, setInputText] = useState("");

  /**
   * 메시지 전송 핸들러 (Message Send Handler)
   *
   * 사용자가 입력한 메시지를 전송하고 봇 응답을 시뮬레이션합니다.
   *
   * @function handleSend
   *
   * @description
   * 처리 과정:
   * 1. 입력 텍스트 검증 (빈 값 제외)
   * 2. 사용자 메시지를 messages 배열에 추가
   * 3. 입력 필드 초기화
   * 4. 1초 후 봇 응답 메시지 자동 추가
   *
   * @note
   * 현재는 고정된 봇 응답 메시지를 반환합니다.
   * 실제 구현 시 API 호출로 대체되어야 합니다.
   */
  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputText,
        isUser: true,
      };
      setMessages([...messages, newMessage]);
      setInputText("");

      // Bot response simulation
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: "네, 좋은 질문이에요. 관련 정보를 찾아보고 있습니다...",
          isUser: false,
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
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
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.botMessageText,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}
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
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Image
            source={{ uri: "https://c.animaapp.com/d4bI3vUH/img/-----.svg" }}
            style={styles.sendIcon}
            resizeMode="contain"
          />
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
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
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
});
