import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

/**
 * 오늘의 할 일 아이템 Props (Today Item Props)
 *
 * @interface TodayItemProps
 * @property {string} title - 작업 제목 (Task Title) 예: "공과금 납부"
 * @property {string} dday - D-day 카운트다운 텍스트 (D-day Countdown) 예: "D-DAY", "D-2"
 * @property {React.ReactNode} detail - 추가 상세 정보 (Additional Details) - JSX 지원
 * @property {string} description - 도움말 설명 또는 결과 텍스트 (Helpful Description)
 */
interface TodayItemProps {
  title: string;
  dday: string;
  detail: React.ReactNode;
  description: string;
}

/**
 * 오늘의 할 일 아이템 컴포넌트 (Today Item Component)
 *
 * D-day 카운트다운과 세부 정보가 포함된 단일 "Today" 작업 항목을 표시합니다.
 * HomeScreen의 Today 섹션에서 금융 작업과 마감일을 표시하는 데 사용됩니다.
 *
 * @component
 * @category UI/Components/Home
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { TodayItem } from './components/home/TodayItem';
 *
 * <TodayItem
 *   title="공과금 납부"
 *   dday="D-DAY"
 *   detail={
 *     <>
 *       <Text style={styles.normalText}>이번 달 전기요금 </Text>
 *       <Text style={styles.highlightText}>43,200원</Text>
 *     </>
 *   }
 *   description="오늘 납부하지 않으면 연체료 2%가 부가돼요"
 * />
 * ```
 *
 * @description
 * 표시 내용:
 * - 작업 제목과 D-day 카운트다운 (Task Title and D-day Countdown)
 * - 구분선 (Divider)
 * - 상세 정보 (Detail Information) - 금액, 서류 등
 * - 설명 텍스트 (Description Text) - 도움말 또는 경고
 *
 * @features
 * - D-day 색상 강조 (D-day Color Highlighting with primary color)
 * - JSX 지원 상세 정보 (JSX-supported Detail Information)
 * - 반응형 레이아웃 (Responsive Layout)
 * - theme 기반 스타일링 (Theme-based Styling)
 *
 * @see {@link HomeScreen}
 * @see {@link TodayListScreen}
 */

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
