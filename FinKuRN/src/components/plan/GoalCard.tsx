/**
 * Goal Card 컴포넌트
 *
 * @module Components/Plan/GoalCard
 * @category UI/Components/Plan
 * @since 1.0.0
 *
 * @description
 * 목표별 실천 현황을 표시하는 카드 컴포넌트입니다.
 * - 목표 제목 및 완료 현황 (2/3 완료)
 * - 진행률 바
 * - 체크리스트 항목들 (완료/미완료)
 *
 * @example
 * ```tsx
 * <GoalCard
 *   id="goal-1"
 *   title="🏠 내 집 마련 적금"
 *   category="저축"
 *   completed={2}
 *   total={3}
 *   percentage={67}
 *   checklists={[...]}
 * />
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import type { GoalProgress } from '../../types/plan';

/**
 * GoalCard Props 인터페이스
 *
 * @interface GoalCardProps
 * @extends {GoalProgress}
 */
interface GoalCardProps extends GoalProgress {}

/**
 * Goal Card 컴포넌트
 *
 * @component
 * @param {GoalCardProps} props - Goal 데이터
 * @returns {JSX.Element} Goal Card
 */
export const GoalCard: React.FC<GoalCardProps> = ({
  title,
  completed,
  total,
  percentage,
  checklists,
}) => {
  return (
    <View style={styles.card}>
      {/* 헤더 (제목 + 진행 상태) */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.progress}>
          {completed}/{total} 완료
        </Text>
      </View>

      {/* 진행률 바 */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>

      {/* 체크리스트 항목들 */}
      <View style={styles.checklistContainer}>
        {checklists.map((item) => (
          <View key={item.id} style={styles.checklistItem}>
            {/* 체크박스 */}
            <View
              style={[styles.checkbox, item.completed && styles.checkboxChecked]}
            >
              {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>

            {/* 체크리스트 텍스트 */}
            <Text
              style={[
                styles.checklistText,
                !item.completed && styles.checklistTextPending,
              ]}
            >
              {item.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxxl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  progress: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  checklistContainer: {
    gap: theme.spacing.md,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#8DB4F7',
    borderColor: '#8DB4F7',
  },
  checkmark: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  checklistText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.textPrimary,
  },
  checklistTextPending: {
    color: theme.colors.textSecondary,
  },
});
