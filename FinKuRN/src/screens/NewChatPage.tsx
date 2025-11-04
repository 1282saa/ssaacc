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
import { StatusBar } from '../components/common/StatusBar';
import { BackgroundGradient } from '../components/common/BackgroundGradient';
import { CHAT_GRADIENTS_LARGE } from '../constants/gradients';
import { theme } from '../constants/theme';
import type { AppNavigation } from '../types/navigation';

/**
 * NewChatPage Component
 *
 * Displays the new chat interface with suggested questions.
 * Users can start a conversation by selecting a suggested question or typing their own.
 *
 * Features:
 * - Welcome message and guidance
 * - Suggested question cards
 * - Input controls for custom questions
 * - Navigation to active chat conversation
 */
export const NewChatPage: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  const suggestedQuestions = [
    '청년 월세 지원금 받을 수 있을까?',
    '요즘 청년 금융지원제도 뭐 있어?',
    '신용점수는 어떻게 올라가는거야?',
    '이번 달 내 소비 괜찮을까?',
  ];

  const handleQuestionPress = (question: string) => {
    navigation.navigate('ChatConversation', { chatTitle: question });
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
        />
        <TouchableOpacity style={styles.micButton}>
          <Image
            source={{ uri: 'https://c.animaapp.com/d4bI3vUH/img/mic.svg' }}
            style={styles.micIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton}>
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
