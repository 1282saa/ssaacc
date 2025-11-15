import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from '../../components/common/StatusBar';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { SavingsSection, SpendingSection } from '../../components/home';
import { HOME_GRADIENTS } from '../../constants/gradients';
import { theme } from '../../constants/theme';
import { ArrowIcon } from '../../components/ArrowIcon';
import type { AppNavigation } from '../../types/navigation';

/**
 * 홈 화면 (Home Screen)
 *
 * 사용자의 금융 현황과 상태를 표시하는 메인 대시보드 화면입니다.
 * 개인화된 인사말, 오늘의 할 일, 저축/소비 현황, 빠른 액션 기능을 제공합니다.
 *
 * @component
 * @category UI/Screens
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { HomeScreen } from './screens/HomeScreen';
 *
 * <HomeScreen />
 * ```
 *
 * @description
 * 주요 섹션:
 * - 개인화된 인사말 메시지 (Personalized Greeting Message)
 * - 알림 버튼 with 배지 (Notification Button with Badge)
 * - 펭귄 마스코트 이미지 (Penguin Mascot)
 * - Today 카드: 오늘의 금융 할 일 목록 (Today's Financial Tasks)
 *   - D-day 카운트다운 (D-day Countdown)
 *   - 공과금, 서류 제출, 자동이체, 적금, 구독료 등 (Bills, Documents, Auto-debit, Savings, Subscriptions)
 * - 정책 추천 카드 (Policy Recommendation Card)
 *   - 청년 월세 지원 정책 (Youth Rent Support Policy)
 * - 금융 퀴즈 카드 (Financial Quiz Card)
 *   - 예금과 적금의 차이 (Difference between Deposit and Savings)
 * - 저축 현황 섹션 (Savings Section) - {@link SavingsSection}
 * - 소비 분석 섹션 (Spending Section) - {@link SpendingSection}
 *
 * @state
 * - showAllTodayItems: Today 카드의 전체 항목 표시 여부
 *
 * @features
 * - 스크롤 가능한 레이아웃 (Scrollable Layout)
 * - 그라디언트 배경 (Gradient Background with HOME_GRADIENTS)
 * - 동적 항목 표시/숨김 (Dynamic Item Show/Hide)
 * - 카드 기반 UI 디자인 (Card-based UI Design)
 *
 * @see {@link TodayItem}
 * @see {@link SavingsSection}
 * @see {@link SpendingSection}
 */
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  const savingsFilters = ['전체', '내 집 마련 적금', '여름 여행', '비상금'];
  const spendingFilters = ['오늘', '이번 주', '이번 달'];

  return (
    <View style={styles.container}>
      <BackgroundGradient layers={HOME_GRADIENTS} />

      <StatusBar />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 상단 알림 버튼 */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={28} color={theme.colors.black} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 인사말 섹션 */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>좋은 아침이에요, 은별님</Text>
          <Text style={styles.greetingSubtitle}>
            오늘은 커피값만큼 절약 도전 어떨까요? 💙
          </Text>
        </View>

        {/* 펭귄 이미지 */}
        <Image
          source={{ uri: 'https://c.animaapp.com/FwW9Xg6K/img/--@2x.png' }}
          style={styles.penguinImage}
          resizeMode="contain"
        />

        {/* Today 카드 */}
        <View style={styles.todayCard}>
          <View style={styles.todayHeader}>
            <View style={styles.todayTitleRow}>
              <Text style={styles.todayTitle}>Today</Text>
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>2</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>전체 목록 보기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.todayItemContainer}>
            {/* 첫 번째 항목 */}
            <View style={styles.todayItem}>
              <View style={styles.todayItemHeader}>
                <View style={styles.todayItemTitleRow}>
                  <Text style={styles.todayItemTitle}>청년도약계좌 서류 제출 마감</Text>
                  <Text style={styles.todayItemDday}>D-2</Text>
                </View>
                <View style={styles.todayDivider} />
                <Text style={styles.todayItemDetail}>남은 서류 2개</Text>
              </View>
              <Text style={styles.todayItemDescription}>
                이번 주 안에 제출해야 정부 지원금 받을 수 있어요
              </Text>
            </View>

            {/* 두 번째 항목 */}
            <View style={styles.todayItem}>
              <View style={styles.todayItemHeader}>
                <View style={styles.todayItemTitleRow}>
                  <Text style={styles.todayItemTitle}>청년도약계좌 서류 제출 마감</Text>
                  <Text style={styles.todayItemDday}>D-2</Text>
                </View>
                <View style={styles.todayDivider} />
                <Text style={styles.todayItemDetail}>남은 서류 2개</Text>
              </View>
              <Text style={styles.todayItemDescription}>
                이번 주 안에 제출해야 정부 지원금 받을 수 있어요
              </Text>
            </View>
          </View>
        </View>

        {/* 정책 & 퀴즈 카드 */}
        <View style={styles.policyRow}>
          {/* 청년 월세 지원 정책 카드 */}
          <TouchableOpacity style={styles.policyCardBlack} activeOpacity={0.8}>
            <Text style={styles.policyCardTitleWhite}>청년 월세 지원 정책</Text>
            <Text style={styles.policyCardDescWhite}>
              은별님에게 해당되는{'\n'}지원만 가져왔어요
            </Text>
            <Image
              source={{ uri: 'https://c.animaapp.com/FwW9Xg6K/img/image-1@2x.png' }}
              style={styles.policyImage1}
              resizeMode="contain"
            />
            <View style={styles.arrowButtonWhite}>
              <ArrowIcon color={theme.colors.black} size={20} />
            </View>
          </TouchableOpacity>

          {/* 오늘의 금융 퀴즈 카드 */}
          <TouchableOpacity
            style={styles.policyCardWhite}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Quiz' as any)}
          >
            <Text style={styles.policyCardTitleBlack}>오늘의 금융 퀴즈</Text>
            <Text style={styles.policyCardDescBlack}>
              예금과 적금의 차이,{'\n'}함께 확인해보실래요?
            </Text>
            <Image
              source={{ uri: 'https://c.animaapp.com/FwW9Xg6K/img/image-2@2x.png' }}
              style={styles.policyImage2}
              resizeMode="contain"
            />
            <View style={styles.arrowButtonBlack}>
              <ArrowIcon color={theme.colors.white} size={20} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  topBar: {
    marginTop: theme.layout.statusBarHeight,
    paddingHorizontal: theme.spacing.lg,
    height: 56,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 9,
    fontWeight: '600',
  },
  greetingSection: {
    paddingHorizontal: 18,
    marginTop: theme.spacing.md,
  },
  greetingTitle: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    flexShrink: 0,
  },
  greetingSubtitle: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    maxWidth: 241,
  },
  penguinImage: {
    width: 240,
    height: 240,
    marginLeft: 57,
    marginTop: -4,
  },
  todayCard: {
    marginHorizontal: 16,
    marginTop: 21,
    backgroundColor: theme.colors.white,
    borderRadius: 32,
    padding: 20,
    height: 162,
    overflow: 'hidden',
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 23,
  },
  todayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  todayTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
  },
  todayBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayBadgeText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '600',
    fontSize: 9,
    color: theme.colors.white,
  },
  viewAllText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '400',
    color: '#767676',
  },
  todayItemContainer: {
    gap: 11,
  },
  todayItem: {
    gap: 4,
  },
  todayItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  todayItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todayItemTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.black,
  },
  todayItemDday: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  todayDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#e5e7eb',
  },
  todayItemDetail: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.black,
  },
  todayItemDescription: {
    fontFamily: 'Pretendard Variable',
    fontSize: 11,
    fontWeight: '400',
    color: '#767676',
  },
  normalText: {
    color: theme.colors.textPrimary,
    fontWeight: '400',
  },
  highlightText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  policyRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  policyCardBlack: {
    flex: 1,
    height: 152,
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.xxxl,
    padding: 20,
  },
  policyCardWhite: {
    flex: 1,
    height: 152,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxxl,
    padding: 20,
  },
  policyCardTitleWhite: {
    ...theme.typography.heading4,
    color: theme.colors.white,
  },
  policyCardTitleBlack: {
    ...theme.typography.heading4,
    color: theme.colors.textPrimary,
    paddingLeft: 3,
  },
  policyCardDescWhite: {
    ...theme.typography.body2,
    color: '#cbcbcb',
    marginTop: 7,
    marginLeft: -1,
    width: 119,
  },
  policyCardDescBlack: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: 7,
    width: 119,
  },
  policyImage1: {
    position: 'absolute',
    top: 60,
    left: -3,
    width: 108,
    height: 108,
  },
  policyImage2: {
    position: 'absolute',
    top: 81,
    left: 23,
    width: 62,
    height: 62,
  },
  arrowButtonWhite: {
    position: 'absolute',
    top: 92,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButtonBlack: {
    position: 'absolute',
    top: 92,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
