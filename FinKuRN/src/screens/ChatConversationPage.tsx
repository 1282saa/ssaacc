import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from '../components/common/StatusBar';
import { BackgroundGradient } from '../components/common/BackgroundGradient';
import { CHAT_GRADIENTS_LARGE } from '../constants/gradients';
import { theme } from '../constants/theme';
import type { Message } from '../types/chat';
import type { AppNavigation, RootStackParamList } from '../types/navigation';

/**
 * ChatConversationPage Component
 *
 * Displays an active chat conversation with message history and input controls.
 * Users can send messages and receive responses from the chatbot.
 *
 * Props received from navigation:
 * - chatTitle: The title/topic of the conversation
 *
 * Features:
 * - Message history display
 * - Real-time message sending
 * - Bot response simulation
 * - Input controls (text, voice, attachments)
 */
export const ChatConversationPage: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();
  const route = useRoute<{ params: RootStackParamList['ChatConversation'] }>();
  const { chatTitle } = route.params || { chatTitle: '대화' };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: chatTitle,
      isUser: true,
    },
    {
      id: 2,
      text: '안녕하세요! 해당 질문에 대해 도움을 드리겠습니다. 구체적으로 어떤 정보가 필요하신가요?',
      isUser: false,
    },
  ]);

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputText,
        isUser: true,
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      // Bot response simulation
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: '네, 좋은 질문이에요. 관련 정보를 찾아보고 있습니다...',
          isUser: false,
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <BackgroundGradient layers={CHAT_GRADIENTS_LARGE} size={700} />

      <StatusBar />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image
            source={{ uri: 'https://c.animaapp.com/d4bI3vUH/img/icon-cheveron-left-1.svg' }}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FinKu</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Image
            source={{ uri: 'https://c.animaapp.com/zZcdFnH1/img/-------1.svg' }}
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
            source={{ uri: 'https://c.animaapp.com/d4bI3vUH/img/icon-plus-1.svg' }}
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
            source={{ uri: 'https://c.animaapp.com/d4bI3vUH/img/mic.svg' }}
            style={styles.micIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Image
            source={{ uri: 'https://c.animaapp.com/d4bI3vUH/img/-----.svg' }}
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
    position: 'absolute',
    top: theme.layout.headerTop,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 0,
    paddingBottom: theme.spacing.sm,
    height: theme.layout.headerHeight,
    zIndex: theme.zIndex.header,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
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
    maxWidth: '80%',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: 4,
    ...theme.shadows.small,
  },
  messageText: {
    ...theme.typography.body1,
  },
  userMessageText: {
    color: theme.colors.white,
    fontWeight: '500',
  },
  botMessageText: {
    color: theme.colors.black,
    fontWeight: '400',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 42,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  plusButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    width: 24,
    height: 24,
  },
  sendButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 36,
    height: 36,
  },
});
