/**
 * Task Item Card 컴포넌트
 *
 * @module Components/Plan/TaskItemCard
 * @category UI/Components/Plan
 * @since 1.0.0
 *
 * @description
 * 오늘의 할 일 개별 항목을 표시하는 카드 컴포넌트입니다.
 * - 체크박스로 완료 상태 토글
 * - D-day 표시
 * - 완료 시 응원 메시지 표시
 *
 * @example
 * ```tsx
 * <TaskItemCard
 *   id="1"
 *   title="전기요금 납부 (43,200원)"
 *   completed={false}
 *   dDay={0}
 *   encouragement="완료했어요!"
 *   onToggle={(id) => console.log('Toggle:', id)}
 * />
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';
import type { TaskItem } from '../../types/plan';

/**
 * TaskItemCard Props 인터페이스
 *
 * @interface TaskItemCardProps
 * @extends {TaskItem}
 * @property {(taskId: string) => void} onToggle - 완료 상태 토글 핸들러
 */
interface TaskItemCardProps extends TaskItem {
  /**
   * 완료 상태 토글 핸들러
   *
   * @param {string} taskId - Task ID
   */
  onToggle: (taskId: string) => void;
}

/**
 * D-day 텍스트 포맷팅 함수
 *
 * @function formatDDay
 * @param {number} dDay - D-day 숫자 (0이면 D-Day, 1이면 D-1)
 * @returns {string} 포맷된 D-day 문자열
 *
 * @example
 * formatDDay(0) // "D-Day"
 * formatDDay(1) // "D-1"
 * formatDDay(3) // "D-3"
 */
const formatDDay = (dDay: number): string => {
  if (dDay === 0) return 'D-Day';
  return `D-${dDay}`;
};

/**
 * Task Item Card 컴포넌트
 *
 * @component
 * @param {TaskItemCardProps} props - Task 데이터 및 핸들러
 * @returns {JSX.Element} Task Item Card
 */
export const TaskItemCard: React.FC<TaskItemCardProps> = ({
  id,
  title,
  completed,
  dDay,
  encouragement,
  onToggle,
}) => {
  return (
    <View>
      {/* Task 항목 */}
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() => onToggle(id)}
        activeOpacity={0.7}
      >
        {/* 체크박스 */}
        <View style={[styles.checkbox, completed && styles.checkboxChecked]}>
          {completed && <Text style={styles.checkmark}>✓</Text>}
        </View>

        {/* 작업 제목 */}
        <Text
          style={[styles.taskTitle, completed && styles.taskTitleCompleted]}
        >
          {title}
        </Text>

        {/* D-day */}
        <Text style={styles.taskDDay}>{formatDDay(dDay)}</Text>
      </TouchableOpacity>

      {/* 응원 메시지 (완료된 경우에만 표시) */}
      {completed && encouragement && (
        <View style={styles.encouragementContainer}>
          <Text style={styles.encouragementText}>💙 {encouragement}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
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
  taskTitle: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  taskDDay: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  encouragementContainer: {
    marginLeft: 40,
    marginTop: -8,
    marginBottom: theme.spacing.sm,
  },
  encouragementText: {
    fontSize: 14,
    color: '#5B8DEF',
    fontWeight: '500',
  },
});
