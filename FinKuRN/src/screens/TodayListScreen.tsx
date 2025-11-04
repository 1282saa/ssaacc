import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackgroundGradient } from '../components/common/BackgroundGradient';
import { TODAY_GRADIENTS } from '../constants/gradients';
import { theme } from '../constants/theme';
import type { AppNavigation } from '../types/navigation';

/**
 * TodayListScreen Component
 *
 * Displays a comprehensive list of all today's financial tasks and deadlines.
 * This is a full-page view of items that appear in the HomeScreen's "Today" section.
 *
 * Features:
 * - Header with total item count
 * - D-DAY countdown for each task
 * - Financial amount displays for payments
 * - Task descriptions and consequences
 * - Categorized by urgency (D-DAY, D-2, D-3, etc.)
 * - Clean card-based layout for each task
 *
 * Task types include:
 * - Bill payments
 * - Document submission deadlines
 * - Auto-debit notifications
 * - Savings deposit dates
 * - Subscription renewals
 *
 * @component
 * @example
 * ```tsx
 * <TodayListScreen />
 * ```
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
