/**
 * Plan 화면 (Plan Screen)
 *
 * AI 투두리스트 및 실천 관리를 위한 화면입니다.
 * 정책과 루틴을 실제 행동으로 이어주는 핵심 화면입니다.
 *
 * @module Screens/PlanScreen
 * @category UI/Screens
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * // 네비게이션에서 사용
 * navigation.navigate('Plan');
 * ```
 *
 * @description
 * 화면 구성:
 * - 헤더: "나의 할 일" 제목과 펭귄 아이콘, 서류가방 아이콘
 * - 진행률 카드: 주간 완료 현황 및 다음 마감일 표시
 * - Today's Tasks: 오늘의 할 일 목록 (체크박스, D-day 표시, 완료 시 응원 메시지)
 * - Upcoming Schedule: 예정된 일정 (아이콘, 제목, D-day)
 * - 목표별 실천 현황: 목표 달성을 위한 체크리스트
 *
 * @features
 * - 목표별 분류: 저축 / 학자금 / 신용 / 투자기초
 * - 진행 단계: 준비 → 신청 → 완료
 * - 자동 체크리스트 생성
 * - 리마인드 설정 (스마트 알림: 마감 -3 / -1 / 당일)
 * - 완료 시 핀쿠 포인트 지급
 * - 진행률 시각화 및 핀쿠 응원 메시지
 *
 * @architecture
 * - 단일 책임 원칙: 각 기능을 독립적인 컴포넌트로 분리
 * - API 레이어 분리: src/api/planApi.ts에서 데이터 fetch
 * - 타입 안전성: TypeScript strict mode + 상세한 타입 정의
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackgroundGradient } from '../components/common/BackgroundGradient';
import {
  ProgressCard,
  TaskItemCard,
  UpcomingItemCard,
  GoalCard,
} from '../components/plan';
import { theme } from '../constants/theme';
import { fetchPlanData, updateTaskCompletion } from '../api/planApi';
import type { AppNavigation } from '../types/navigation';
import type { PlanScreenData } from '../types/plan';

/**
 * Plan 화면 컴포넌트
 *
 * @component
 * @returns {JSX.Element} Plan 화면
 *
 * @example
 * ```tsx
 * <PlanScreen />
 * ```
 *
 * @hooks
 * - useState: 컴포넌트 상태 관리 (planData)
 * - useEffect: 컴포넌트 마운트 시 데이터 로드
 * - useNavigation: React Navigation 네비게이션 훅
 *
 * @state
 * - planData: Plan 화면 전체 데이터 (PlanScreenData 타입)
 *
 * @apiIntegration
 * - fetchPlanData(): Plan 데이터 조회 (GET /api/v1/plan/:userId)
 * - updateTaskCompletion(): Task 완료 상태 업데이트 (PATCH /api/v1/plan/:userId/tasks/:taskId)
 */
export const PlanScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  // ============================================
  // State Management
  // ============================================

  /**
   * Plan 화면 데이터 상태
   *
   * @state
   * @type {PlanScreenData | null}
   * @default null
   *
   * @description
   * 초기값은 null이며, useEffect에서 API를 통해 데이터를 가져옵니다.
   * 로딩 상태 또는 에러 상태를 추가하려면 별도의 state를 추가하세요.
   */
  const [planData, setPlanData] = useState<PlanScreenData | null>(null);

  // ============================================
  // Effects
  // ============================================

  /**
   * 컴포넌트 마운트 시 Plan 데이터 로드
   *
   * @effect
   * @dependencies [] - 빈 배열이므로 컴포넌트 마운트 시 1회만 실행
   *
   * @description
   * fetchPlanData()를 호출하여 사용자의 Plan 데이터를 가져옵니다.
   * 실제 구현 시 userId는 인증 시스템에서 가져와야 합니다.
   *
   * @todo
   * - 로딩 상태 추가 (isLoading)
   * - 에러 핸들링 추가 (error state)
   * - 인증 시스템과 연동하여 실제 userId 사용
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        // TODO: 실제 userId는 인증 컨텍스트에서 가져와야 함
        const userId = 'user123';
        const data = await fetchPlanData(userId);
        setPlanData(data);
      } catch (error) {
        console.error('Failed to load plan data:', error);
        // TODO: 에러 상태 처리 (에러 메시지 표시 등)
      }
    };

    loadData();
  }, []);

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * Task 완료/미완료 토글 핸들러
   *
   * @async
   * @function handleToggleTask
   * @param {string} taskId - Toggle할 Task의 ID
   * @returns {Promise<void>}
   *
   * @description
   * 특정 Task의 완료 상태를 토글합니다.
   * 1. 로컬 상태를 낙관적 업데이트 (Optimistic Update)
   * 2. API 호출하여 서버에 변경사항 반영
   * 3. 전체 진행률 재계산
   *
   * @example
   * ```tsx
   * <TaskItemCard onToggle={handleToggleTask} />
   * ```
   *
   * @todo
   * - API 호출 실패 시 rollback 로직 추가
   * - 낙관적 업데이트 에러 처리
   */
  const handleToggleTask = async (taskId: string) => {
    if (!planData) return;

    // 1. 로컬 상태 업데이트 (Optimistic Update)
    const updatedTasks = planData.todayTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    // 2. 진행률 재계산
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const totalCount = updatedTasks.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    // 3. 상태 업데이트
    setPlanData({
      ...planData,
      todayTasks: updatedTasks,
      progress: {
        ...planData.progress,
        completed: completedCount,
        total: totalCount,
        percentage,
      },
    });

    // 4. API 호출 (백엔드 동기화)
    try {
      // TODO: 실제 userId 사용
      const userId = 'user123';
      const task = updatedTasks.find((t) => t.id === taskId);
      if (task) {
        await updateTaskCompletion(userId, taskId, task.completed);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      // TODO: 에러 발생 시 이전 상태로 rollback
    }
  };

  // ============================================
  // Render Guards
  // ============================================

  /**
   * 데이터 로딩 중 표시
   *
   * @description
   * planData가 null인 경우 로딩 인디케이터를 표시합니다.
   * 실제 구현 시 더 나은 로딩 UI를 추가하세요.
   */
  if (!planData) {
    return (
      <View style={styles.container}>
        <BackgroundGradient
          layers={[
            {
              colors: ['#F8F8F8', '#FAFAFA', '#FFFFFF'],
              locations: [0, 0.5, 1],
              start: { x: 0, y: 0 },
              end: { x: 1, y: 1 },
            },
          ]}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </View>
    );
  }

  // ============================================
  // Main Render
  // ============================================

  return (
    <View style={styles.container}>
      {/* 배경 그라디언트 - 연한 베이지/크림색 톤 */}
      <BackgroundGradient
        layers={[
          {
            colors: ['#F8F8F8', '#FAFAFA', '#FFFFFF'],
            locations: [0, 0.5, 1],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 },
          },
        ]}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* ==================== 헤더 ==================== */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.penguinIcon}>🐧</Text>
          </View>
          <Text style={styles.headerTitle}>나의 할 일 💼</Text>
          <View style={styles.headerRight} />
        </View>

        {/* ==================== 진행률 카드 ==================== */}
        <ProgressCard {...planData.progress} />

        {/* ==================== 오늘의 할 일 ==================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 할 일</Text>
          {planData.todayTasks.map((task) => (
            <TaskItemCard key={task.id} {...task} onToggle={handleToggleTask} />
          ))}
        </View>

        {/* ==================== 다가오는 일정 ==================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>다가오는 일정</Text>
          {planData.upcomingSchedule.map((item) => (
            <UpcomingItemCard key={item.id} {...item} />
          ))}
        </View>

        {/* ==================== 목표별 실천 현황 ==================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>목표별 실천 현황</Text>
          {planData.goals?.map((goal) => (
            <GoalCard key={goal.id} {...goal} />
          ))}
        </View>

        {/* 하단 여백 */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
  /**
   * Container: 전체 화면 컨테이너
   */
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  /**
   * ScrollView: 스크롤 가능한 컨텐츠 영역
   */
  scrollView: {
    flex: 1,
  },

  /**
   * Loading Container: 로딩 중 표시 컨테이너
   */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Loading Text: 로딩 메시지 텍스트
   */
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },

  /**
   * Header: 화면 상단 헤더
   * - 펭귄 아이콘 (왼쪽)
   * - "나의 할 일 💼" 제목 (중앙)
   * - 빈 공간 (오른쪽, 레이아웃 균형용)
   */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl + 10,
    paddingBottom: theme.spacing.lg,
  },
  headerLeft: {
    width: 40,
  },
  penguinIcon: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },

  /**
   * Section: 각 섹션 컨테이너
   * - "오늘의 할 일", "다가오는 일정", "목표별 실천 현황"
   */
  section: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },

  /**
   * Section Title: 섹션 제목
   */
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
});
