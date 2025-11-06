/**
 * Upcoming Item Card 컴포넌트
 *
 * @module Components/Plan/UpcomingItemCard
 * @category UI/Components/Plan
 * @since 1.0.0
 *
 * @description
 * 다가오는 일정 개별 항목을 표시하는 카드 컴포넌트입니다.
 * - 아이콘 (💳, 📄, 🏠, 💰)
 * - 제목 및 부제목
 * - D-day 표시
 *
 * @example
 * ```tsx
 * <UpcomingItemCard
 *   id="1"
 *   title="신용카드 결제일"
 *   subtitle="3일 후 자동 출금 예정"
 *   dDay={3}
 *   iconType="card"
 * />
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import type { UpcomingItem } from '../../types/plan';

/**
 * UpcomingItemCard Props 인터페이스
 *
 * @interface UpcomingItemCardProps
 * @extends {UpcomingItem}
 */
interface UpcomingItemCardProps extends UpcomingItem {}

/**
 * D-day 텍스트 포맷팅 함수
 *
 * @function formatDDay
 * @param {number} dDay - D-day 숫자
 * @returns {string} 포맷된 D-day 문자열
 */
const formatDDay = (dDay: number): string => {
  if (dDay === 0) return 'D-Day';
  return `D-${dDay}`;
};

/**
 * 아이콘 타입에 따른 이모지 반환 함수
 *
 * @function getIconEmoji
 * @param {string} iconType - 아이콘 타입 ('card' | 'document' | 'home' | 'bank')
 * @returns {string} 이모지 문자열
 */
const getIconEmoji = (iconType: string): string => {
  switch (iconType) {
    case 'card':
      return '💳';
    case 'document':
      return '📄';
    case 'home':
      return '🏠';
    case 'bank':
      return '💰';
    default:
      return '📌';
  }
};

/**
 * Upcoming Item Card 컴포넌트
 *
 * @component
 * @param {UpcomingItemCardProps} props - Upcoming Item 데이터
 * @returns {JSX.Element} Upcoming Item Card
 */
export const UpcomingItemCard: React.FC<UpcomingItemCardProps> = ({
  title,
  subtitle,
  dDay,
  iconType,
}) => {
  return (
    <View style={styles.item}>
      {/* 아이콘 */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getIconEmoji(iconType)}</Text>
      </View>

      {/* 내용 */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* D-day */}
      <Text style={styles.dDay}>{formatDDay(dDay)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  dDay: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});
