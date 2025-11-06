/**
 * Progress Card 컴포넌트
 *
 * @module Components/Plan/ProgressCard
 * @category UI/Components/Plan
 * @since 1.0.0
 *
 * @description
 * 주간 목표 달성 진행률을 표시하는 카드 컴포넌트입니다.
 * - 완료한 작업 수 / 전체 작업 수
 * - 진행률 바 (퍼센티지 기반)
 * - 다음 마감 작업 정보
 *
 * @example
 * ```tsx
 * <ProgressCard
 *   completed={2}
 *   total={3}
 *   percentage={67}
 *   nextDueTitle="청년도약계좌 서류 제출"
 *   nextDueDDay={2}
 * />
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import type { ProgressData } from '../../types/plan';

/**
 * ProgressCard Props 인터페이스
 *
 * @interface ProgressCardProps
 * @extends {ProgressData}
 */
interface ProgressCardProps extends ProgressData {}

/**
 * Progress Card 컴포넌트
 *
 * @component
 * @param {ProgressCardProps} props - 진행률 데이터
 * @returns {JSX.Element} Progress Card
 */
export const ProgressCard: React.FC<ProgressCardProps> = ({
  completed,
  total,
  percentage,
  nextDueTitle,
  nextDueDDay,
}) => {
  return (
    <View style={styles.card}>
      {/* 진행률 텍스트 */}
      <Text style={styles.text}>
        이번 주{' '}
        <Text style={styles.highlight}>
          {total}개 중 {completed}개
        </Text>
        를 완료했어요 👏
      </Text>

      {/* 진행률 바 */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>

      {/* 다음 마감 정보 */}
      <Text style={styles.nextDueText}>
        다음 마감: {nextDueTitle} D-{nextDueDDay}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  highlight: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5B8DEF',
    borderRadius: 6,
  },
  nextDueText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
