import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from '../../components/common/StatusBar';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { ChatItem } from '../../components/ChatItem';
import { CHAT_GRADIENTS_LARGE } from '../../constants/gradients';
import { theme } from '../../constants/theme';
import { ArrowIcon } from '../../components/ArrowIcon';
import type { AppNavigation } from '../../types/navigation';

/**
 * 챗봇 메인 화면 V2 (Chatbot Main Screen V2)
 *
 * 프리미엄 기능, 빠른 액션 카드, 최근 대화 목록을 표시하는 메인 챗봇 화면입니다.
 * FinKu 챗봇과 상호작용하기 위한 주요 진입점입니다.
 *
 * @component
 * @category UI/Screens
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { ChatbotScreenV2 } from './screens/ChatbotScreenV2';
 *
 * <ChatbotScreenV2 />
 * ```
 *
 * @description
 * 주요 섹션:
 * - 헤더: FinKu 로고와 메뉴 버튼 (Header with Logo and Menu)
 * - 프리미엄 카드 (Premium Card)
 *   - Premium 배지 (Premium Badge)
 *   - 플랜 업그레이드 버튼 (Plan Upgrade Button)
 *   - 펭귄 마스코트 이미지 (Penguin Mascot Image)
 * - 빠른 액션 카드 (Quick Action Cards)
 *   - 새로운 금융 대화 시작하기 (Start New Financial Chat)
 *   - 나의 금융 루틴 확인하기 (Check Finance Routine - Premium)
 * - 최근 대화 목록 (Recent Conversations List)
 *   - 청년 월세 지원금 비교 (Youth Rent Support Comparison)
 *   - 신용카드 혜택 비교 (Credit Card Benefits Comparison)
 *   - 청년도약계좌 요약 (Youth Leap Account Summary)
 *
 * @features
 * - 대형 그라디언트 배경 (Large Gradient Background with CHAT_GRADIENTS_LARGE)
 * - 스크롤 가능한 레이아웃 (Scrollable Layout)
 * - 네비게이션 통합 (Navigation Integration)
 *   - NewChat 페이지로 이동 (Navigate to NewChat)
 *   - PlanUpgrade 페이지로 이동 (Navigate to PlanUpgrade)
 *   - ChatConversation 페이지로 이동 (Navigate to ChatConversation)
 *
 * @navigation
 * - NewChat: 새로운 대화 시작
 * - PlanUpgrade: 프리미엄 플랜 업그레이드
 * - ChatConversation: 기존 대화 이어가기
 *
 * @see {@link ChatItem}
 * @see {@link ArrowIcon}
 * @see {@link NewChatPage}
 * @see {@link PlanUpgradePage}
 * @see {@link ChatConversationPage}
 */
export const ChatbotScreenV2: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  const chatItems = [
    '청년 월세 지원금 비교',
    '신용카드 혜택 비교',
    '청년도약계좌 요약',
    '청년도약계좌 요약',
  ];

  return (
    <View style={styles.container}>
      <BackgroundGradient layers={CHAT_GRADIENTS_LARGE} size={700} />

      <StatusBar />

      {/* 상단 헤더 - 고정 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Image
            source={{ uri: 'https://c.animaapp.com/zZcdFnH1/img/------.svg' }}
            style={styles.headerIcon}
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
        {/* Premium 카드 */}
        <View style={styles.premiumCard}>
          <Text style={styles.premiumBadge}>Premium</Text>
          <Text style={styles.premiumDescription}>
            소비도, 저축도, 정책도  모두 핀쿠로 관리해요
          </Text>
          <Text style={styles.premiumDescription}>
            핀쿠가 매주 금융 루틴을 정리해드릴게요
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => navigation.navigate('PlanUpgrade')}
            activeOpacity={0.8}
          >
            <Text style={styles.upgradeButtonText}>플랜 업그레이드하기</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://c.animaapp.com/zZcdFnH1/img/--@2x.png' }}
            style={styles.penguinImage}
            resizeMode="contain"
          />
        </View>

        {/* 두 개의 카드 */}
        <View style={styles.cardsRow}>
          {/* 새로운 금융 대화 시작하기 */}
          <TouchableOpacity
            style={styles.blackCard}
            onPress={() => navigation.navigate('NewChat')}
            activeOpacity={0.8}
          >
            <Text style={styles.blackCardTitle}>
              새로운 금융 대화{'\n'}시작하기
            </Text>
            <Image
              source={{ uri: 'https://c.animaapp.com/zZcdFnH1/img/3d---------@2x.png' }}
              style={styles.chatImage}
              resizeMode="contain"
            />
            <View style={styles.arrowButtonWhite}>
              <ArrowIcon color="#000" size={20} />
            </View>
          </TouchableOpacity>

          {/* 나의 금융 루틴 확인하기 */}
          <View style={styles.whiteCard}>
            <View style={styles.routineHeader}>
              <Image
                source={{ uri: 'https://c.animaapp.com/zZcdFnH1/img/icon-sparkles-1.svg' }}
                style={styles.sparkleIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.whiteCardTitle}>
              나의 금융 루틴{'\n'}확인하기
            </Text>
            <Text style={styles.routinePremium}>Premium</Text>
            <TouchableOpacity style={styles.arrowButtonBlack} activeOpacity={0.8}>
              <ArrowIcon color="#fff" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 최근 대화 헤더 */}
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>최근 대화</Text>
          <Text style={styles.viewAll}>전체 보기</Text>
        </View>

        {/* 최근 대화 리스트 */}
        <View style={styles.chatList}>
          {chatItems.map((item, index) => (
            <ChatItem
              key={index}
              title={item}
              onPress={() =>
                navigation.navigate('ChatConversation', { chatTitle: item })
              }
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
    paddingTop: theme.layout.scrollViewPaddingTop,
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
  headerTitle: {
    ...theme.typography.heading3,
  },
  premiumCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    height: 144,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxxl,
    padding: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  premiumBadge: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 5,
  },
  premiumDescription: {
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  upgradeButton: {
    position: 'absolute',
    top: 84,
    left: theme.spacing.xl,
    height: 40,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 12,
    color: theme.colors.white,
  },
  penguinImage: {
    position: 'absolute',
    top: 40,
    left: 212,
    width: 104,
    height: 104,
  },
  cardsRow: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  blackCard: {
    width: 159,
    height: 152,
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl,
  },
  blackCardTitle: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 14,
    color: theme.colors.white,
    lineHeight: 19.6,
  },
  chatImage: {
    position: 'absolute',
    top: 55,
    left: 6,
    width: 93,
    height: 93,
  },
  arrowButtonWhite: {
    position: 'absolute',
    top: 92,
    right: theme.spacing.xl,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteCard: {
    width: 157,
    height: 152,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  routineHeader: {
    position: 'absolute',
    top: theme.spacing.xl,
    left: theme.spacing.xl,
  },
  sparkleIcon: {
    width: 20,
    height: 20,
  },
  whiteCardTitle: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 14,
    color: theme.colors.black,
    lineHeight: 19.6,
    marginLeft: 26,
  },
  routinePremium: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.xl,
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.primary,
  },
  arrowButtonBlack: {
    position: 'absolute',
    top: 92,
    right: theme.spacing.xl,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 40,
    marginBottom: theme.spacing.xl,
  },
  recentTitle: {
    ...theme.typography.heading3,
  },
  viewAll: {
    fontFamily: 'System',
    fontWeight: '500',
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  chatList: {
    marginHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
});
