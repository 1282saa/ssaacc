import React from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from '../../components/common/StatusBar';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { CHAT_GRADIENTS_LARGE } from '../../constants/gradients';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';

/**
 * 새 채팅 페이지 (New Chat Page)
 *
 * 추천 질문과 함께 새로운 채팅 인터페이스를 표시하는 화면입니다.
 * 사용자는 추천 질문을 선택하거나 직접 질문을 입력하여 대화를 시작할 수 있습니다.
 *
 * @component
 * @category UI/Screens
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { NewChatPage } from './screens/NewChatPage';
 *
 * <NewChatPage />
 * ```
 *
 * @description
 * 주요 섹션:
 * - 환영 메시지와 안내 (Welcome Message and Guidance)
 * - 추천 질문 카드 (Suggested Question Cards)
 *   - "청년 월세 지원금 받을 수 있을까?"
 *   - "요즘 청년 금융지원제도 뭐 있어?"
 *   - "신용점수는 어떻게 올라가는거야?"
 *   - "이번 달 내 소비 괜찮을까?" (Premium 아이콘 포함)
 * - 입력 컨트롤 (Input Controls)
 *   - 텍스트 입력 (Text Input)
 *   - 음성 입력 버튼 (Voice Input)
 *   - 첨부 파일 버튼 (Attachment)
 *   - 전송 버튼 (Send Button)
 *
 * @features
 * - 키보드 회피 레이아웃 (KeyboardAvoidingView)
 * - 그라디언트 배경 (Gradient Background with CHAT_GRADIENTS_LARGE)
 * - 스크롤 가능한 질문 카드 목록 (Scrollable Question Cards)
 * - 질문 카드 클릭 시 ChatConversation으로 네비게이션
 * - 2열 그리드 레이아웃 (Two-column Grid Layout)
 *
 * @navigation
 * - ChatConversation: 선택된 질문으로 대화 시작
 *
 * @see {@link ChatConversationPage}
 * @see {@link ChatbotScreenV2}
 */
export const NewChatPage: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();
  const [inputText, setInputText] = React.useState('');

  const suggestedQuestions = [
    '청년 월세 지원금 받을 수 있을까?',
    '요즘 청년 금융지원제도 뭐 있어?',
    '신용점수는 어떻게 올라가는거야?',
    '이번 달 내 소비 괜찮을까?',
  ];

  /**
   * 추천 질문 선택 핸들러 (Question Selection Handler)
   *
   * 사용자가 추천 질문 카드를 클릭하면 해당 질문으로 대화를 시작합니다.
   *
   * @function handleQuestionPress
   * @param {string} question - 선택된 질문 텍스트
   *
   * @description
   * ChatConversation 페이지로 네비게이션하며 질문 텍스트를 chatTitle로 전달합니다.
   *
   * @example
   * ```tsx
   * handleQuestionPress('청년 월세 지원금 받을 수 있을까?');
   * ```
   */
  const handleQuestionPress = (question: string) => {
    navigation.navigate('ChatConversation', { chatTitle: question });
  };

  /**
   * 메시지 전송 핸들러 (Message Send Handler)
   *
   * 입력창에 입력한 텍스트로 새 대화를 시작합니다.
   *
   * @function handleSend
   *
   * @description
   * 입력 텍스트를 ChatConversation 페이지로 전달하여 대화를 시작합니다.
   */
  const handleSend = () => {
    if (inputText.trim()) {
      navigation.navigate('ChatConversation', { chatTitle: inputText.trim() });
      setInputText('');
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            어떤 금융 이야기가 궁금하신가요?{'\n'}
            <Text style={styles.welcomeSubtext}>요즘 이런 질문들이 많아요 💡</Text>
          </Text>
        </View>

        <View style={styles.questionsContainer}>
          {suggestedQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.questionCard,
                index % 2 === 0 ? styles.questionCardLeft : styles.questionCardRight
              ]}
              onPress={() => handleQuestionPress(question)}
              activeOpacity={0.7}
            >
              {index === 3 && (
                <Image
                  source={{ uri: 'https://c.animaapp.com/d4bI3vUH/img/icon-sparkles-1.svg' }}
                  style={styles.sparkleIcon}
                  resizeMode="contain"
                />
              )}
              <Text style={[styles.questionText, index === 3 && styles.questionTextWithIcon]}>
                {question}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
  scrollView: {
    flex: 1,
    paddingTop: theme.layout.scrollViewPaddingTop,
  },
  welcomeCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: 28,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.cardYellow,
    borderRadius: theme.borderRadius.xxl,
  },
  welcomeText: {
    ...theme.typography.body3,
    color: theme.colors.black,
    lineHeight: 12,
  },
  welcomeSubtext: {
    lineHeight: 16.8,
  },
  questionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: theme.spacing.lg,
    marginTop: 392,
    gap: theme.spacing.md,
  },
  questionCard: {
    height: 80,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.small,
  },
  questionCardLeft: {
    width: 159,
  },
  questionCardRight: {
    width: 157,
  },
  questionText: {
    ...theme.typography.body2,
    color: theme.colors.black,
    width: 119,
  },
  questionTextWithIcon: {
    paddingLeft: 30,
  },
  sparkleIcon: {
    position: 'absolute',
    top: 18,
    left: 14,
    width: 20,
    height: 20,
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
