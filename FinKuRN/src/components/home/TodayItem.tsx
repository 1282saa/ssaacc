import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

/**
 * TodayItem Component
 *
 * Displays a single "Today" task item with D-day countdown and details.
 * Used in the HomeScreen's Today section to show financial tasks and deadlines.
 *
 * @param title - The task title (e.g., "공과금 납부")
 * @param dday - D-day countdown text (e.g., "D-DAY", "D-2")
 * @param detail - Additional detail text
 * @param description - Helpful description or consequence text
 *
 * @example
 * ```tsx
 * <TodayItem
 *   title="공과금 납부"
 *   dday="D-DAY"
 *   detail={<><Text style={styles.normalText}>이번 달 전기요금 </Text><Text style={styles.highlightText}>43,200원</Text></>}
 *   description="오늘 납부하지 않으면 연체료 2%가 부가돼요"
 * />
 * ```
 */
interface TodayItemProps {
  title: string;
  dday: string;
  detail: React.ReactNode;
  description: string;
}

export const TodayItem: React.FC<TodayItemProps> = ({
  title,
  dday,
  detail,
  description,
}) => {
  return (
    <View style={styles.todayItem}>
      <View style={styles.todayItemRow}>
        <View style={styles.todayItemLeft}>
          <Text style={styles.todayItemTitle}>{title}</Text>
          <Text style={styles.todayItemDday}>{dday}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.todayItemDetail}>{detail}</View>
      </View>
      <Text style={styles.todayItemDescription}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  todayItem: {
    gap: theme.spacing.xs,
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
    ...theme.typography.heading4,
    color: theme.colors.primary,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: theme.colors.divider,
  },
  todayItemDetail: {
    flex: 1,
  },
  todayItemDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
