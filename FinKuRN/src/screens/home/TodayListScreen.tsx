/**
 * 오늘의 할 일 목록 화면 (Today List Screen)
 *
 * 오늘의 모든 금융 작업과 마감일을 포괄적으로 표시하는 화면입니다.
 * HomeScreen의 "Today" 섹션에 표시되는 항목들의 전체 보기입니다.
 *
 * @module Screens/TodayListScreen
 * @category UI/Screens
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * // HomeScreen에서 네비게이션
 * navigation.navigate('TodayList');
 * ```
 *
 * @description
 * 표시 내용:
 * - 헤더 (Header)
 *   - 제목: "오늘의 할 일" (Today's Tasks)
 *   - 부제: "총 5개의 항목이 있어요" (Total Item Count)
 * - 작업 항목 카드 목록 (Task Item Cards List)
 *   - D-DAY 카운트다운 (D-DAY Countdown for Each Task)
 *   - 금액 표시 (Financial Amount Displays for Payments)
 *   - 작업 설명 및 결과 (Task Descriptions and Consequences)
 *   - 긴급도별 분류 (Categorized by Urgency: D-DAY, D-2, D-3, etc.)
 *
 * @features
 * - 그라디언트 배경 (Gradient Background with TODAY_GRADIENTS)
 * - 스크롤 가능한 카드 목록 (Scrollable Card-based Layout)
 * - 일관된 카드 디자인 (Consistent Card Design)
 * - D-day 색상 강조 (D-day Color Highlighting with Primary Color)
 *
 * @taskTypes
 * 포함되는 작업 유형:
 * - 공과금 납부 (Bill Payments)
 * - 서류 제출 마감 (Document Submission Deadlines)
 * - 자동이체 알림 (Auto-debit Notifications)
 * - 적금 납입일 (Savings Deposit Dates)
 * - 구독료 갱신 (Subscription Renewals)
 *
 * @styling
 * - cardBorderRadius: 20px (xl)
 * - cardPadding: 20px (xl)
 * - gap: 12px (md)
 * - backgroundColor: white
 *
 * @see {@link HomeScreen}
 * @see {@link TodayItem}
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { TODAY_GRADIENTS } from '../../constants/gradients';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';

/**
 * 오늘의 할 일 목록 화면 컴포넌트 (Today List Screen Component)
 *
 * 오늘의 금융 작업 전체 목록을 카드 형태로 표시합니다.
 *
 * @component
 *
 * @returns {JSX.Element} 오늘의 할 일 목록 화면
 *
 * @example
 * ```tsx
 * <TodayListScreen />
 * ```
 *
 * @note
 * 실제 구현 시:
 * - 백엔드 API에서 작업 목록 조회
 * - 작업 완료 상태 관리
 * - 작업 우선순위 정렬
 * - 작업 알림 설정
 * 등의 기능이 추가되어야 합니다.
 */
export const TodayListScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  return (
    <View style={styles.container}>
      {/* Background gradient layers */}
      <BackgroundGradient layers={TODAY_GRADIENTS} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>오늘의 할 일</Text>
          <Text style={styles.headerSubtitle}>총 5개의 항목이 있어요</Text>
        </View>

        {/* Today 항목 리스트 */}
        <View style={styles.itemsContainer}>
          {/* 항목 1 - D-DAY */}
          <View style={styles.todayCard}>
            <View style={styles.todayItemRow}>
              <View style={styles.todayItemLeft}>
                <Text style={styles.todayItemTitle}>공과금 납부</Text>
                <Text style={styles.todayItemDday}>D-DAY</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.todayItemDetail}>
                <Text style={styles.normalText}>이번 달 전기요금 </Text>
                <Text style={styles.highlightText}>43,200원</Text>
              </Text>
            </View>
            <Text style={styles.todayItemDescription}>
              오늘 납부하지 않으면 연체료 2%가 부가돼요
            </Text>
          </View>

          {/* 항목 2 - D-2 */}
          <View style={styles.todayCard}>
            <View style={styles.todayItemRow}>
              <View style={styles.todayItemLeft}>
                <Text style={styles.todayItemTitle}>청년도약계좌 서류 제출 마감</Text>
                <Text style={styles.todayItemDday}>D-2</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.todayItemDetail}>남은 서류 2개</Text>
            </View>
            <Text style={styles.todayItemDescription}>
              이번 주 안에 제출해야 정부 지원금 받을 수 있어요
            </Text>
          </View>

          {/* 항목 3 - D-3 */}
          <View style={styles.todayCard}>
            <View style={styles.todayItemRow}>
              <View style={styles.todayItemLeft}>
                <Text style={styles.todayItemTitle}>통신비 자동이체</Text>
                <Text style={styles.todayItemDday}>D-3</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.todayItemDetail}>
                <Text style={styles.normalText}>SK텔레콤 </Text>
                <Text style={styles.highlightText}>55,000원</Text>
              </Text>
            </View>
            <Text style={styles.todayItemDescription}>
              3일 후 자동 출금 예정이에요
            </Text>
          </View>

          {/* 항목 4 - D-5 */}
          <View style={styles.todayCard}>
            <View style={styles.todayItemRow}>
              <View style={styles.todayItemLeft}>
                <Text style={styles.todayItemTitle}>적금 납입일</Text>
                <Text style={styles.todayItemDday}>D-5</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.todayItemDetail}>
                <Text style={styles.normalText}>내 집 마련 적금 </Text>
                <Text style={styles.highlightText}>500,000원</Text>
              </Text>
            </View>
            <Text style={styles.todayItemDescription}>
              5일 후 자동 납입 예정이에요
            </Text>
          </View>

          {/* 항목 5 - D-7 */}
          <View style={styles.todayCard}>
            <View style={styles.todayItemRow}>
              <View style={styles.todayItemLeft}>
                <Text style={styles.todayItemTitle}>구독료 결제</Text>
                <Text style={styles.todayItemDday}>D-7</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.todayItemDetail}>
                <Text style={styles.normalText}>넷플릭스 프리미엄 </Text>
                <Text style={styles.highlightText}>17,000원</Text>
              </Text>
            </View>
            <Text style={styles.todayItemDescription}>
              일주일 후 자동 결제 예정이에요
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
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
  header: {
    paddingHorizontal: 18,
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xxl,
  },
  headerTitle: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
  itemsContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  todayCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    gap: 4,
  },
  todayItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  todayItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todayItemTitle: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
  },
  todayItemDday: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 14,
    color: theme.colors.primary,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: theme.colors.background,
  },
  todayItemDetail: {
    ...theme.typography.body3,
  },
  normalText: {
    color: theme.colors.textPrimary,
    fontWeight: '400',
  },
  highlightText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  todayItemDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
