/**
 * 온보딩 목표 선택 화면
 *
 * @module Screens/Onboarding/OnboardingGoalsScreen
 * @category UI/Screens/Onboarding
 * @since 1.0.0
 *
 * @description
 * 온보딩 프로세스의 두 번째 화면입니다.
 * - 사용자가 관심있는 금융 목표를 선택합니다 (최대 3개)
 * - 저축, 학자금, 신용관리, 투자기초 중 선택
 * - 선택된 목표에 따라 맞춤형 콘텐츠가 제공됩니다
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { HOME_GRADIENTS } from '../../constants/gradients';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';
import type { UserGoal } from '../../types/onboarding';
import { onboardingService } from '../../services';

/**
 * 목표 옵션 인터페이스
 *
 * @interface GoalOption
 * @property {UserGoal} value - 목표 값
 * @property {string} icon - 목표 아이콘
 * @property {string} title - 목표 제목
 * @property {string} description - 목표 설명
 */
interface GoalOption {
  value: UserGoal;
  icon: string;
  title: string;
  description: string;
}

/**
 * 목표 옵션 목록
 *
 * @constant GOAL_OPTIONS
 * @description
 * 사용자가 선택할 수 있는 4가지 금융 목표를 정의합니다.
 */
const GOAL_OPTIONS: GoalOption[] = [
  {
    value: '지원금',
    icon: '',
    title: '지원금(자산 형성·금융안정)',
    description: '#금리혜택 #대출 #보조금',
  },
  {
    value: '주거·임대 지원',
    icon: '',
    title: '주거·임대 지원',
    description: '#주거지원 #공공임대주택 #청년가장',
  },
  {
    value: '취업·경력 개발',
    icon: '',
    title: '취업·경력 개발',
    description: '#인턴 #벤처 #해외진출',
  },
  {
    value: '가족·생활 지원',
    icon: '',
    title: '가족·생활 지원',
    description: '#출산 #육아 #교육지원',
  },
];

/**
 * 온보딩 목표 선택 화면 컴포넌트
 *
 * @component
 * @returns {JSX.Element} 목표 선택 화면
 *
 * @example
 * ```tsx
 * <OnboardingGoalsScreen />
 * ```
 *
 * @hooks
 * - useState: 선택된 목표 상태 관리
 * - useNavigation: 다음 화면으로 네비게이션
 *
 * @state
 * - selectedGoals: 선택된 목표 배열 (최대 3개)
 *
 * @features
 * - 최대 3개까지 선택 가능
 * - 선택된 목표는 파란색으로 하이라이트
 * - 최소 1개 이상 선택 시 다음 버튼 활성화
 * - 3개 선택 시 추가 선택 불가 (토스트 메시지)
 */
export const OnboardingGoalsScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  // ============================================
  // State Management
  // ============================================

  /**
   * 선택된 목표 상태
   *
   * @state
   * @type {UserGoal[]}
   * @default []
   *
   * @description
   * 사용자가 선택한 목표 목록을 관리합니다.
   * 최대 3개까지 선택할 수 있습니다.
   */
  const [selectedGoals, setSelectedGoals] = useState<UserGoal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * 목표 선택/해제 핸들러
   *
   * @function handleToggleGoal
   * @param {UserGoal} goal - 선택/해제할 목표
   * @returns {void}
   *
   * @description
   * 목표를 선택하거나 선택 해제합니다.
   * - 이미 선택된 목표를 누르면 선택 해제
   * - 선택되지 않은 목표를 누르면 선택 (최대 3개)
   * - 3개가 이미 선택된 경우 추가 선택 불가
   *
   * @example
   * ```tsx
   * <TouchableOpacity onPress={() => handleToggleGoal('저축')}>
   * ```
   */
  const handleToggleGoal = (goal: UserGoal) => {
    if (selectedGoals.includes(goal)) {
      // 이미 선택된 목표 → 선택 해제
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      // 선택되지 않은 목표 → 선택 (최대 2개)
      if (selectedGoals.length >= 2) {
        // TODO: 토스트 메시지 표시 ("최대 2개까지 선택할 수 있어요")
        return;
      }
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  /**
   * 다음 버튼 클릭 핸들러
   *
   * @function handleNext
   * @returns {void}
   *
   * @description
   * 선택된 목표를 저장하고 다음 화면(기본 정보 입력)으로 이동합니다.
   *
   * @todo
   * - 선택된 목표를 Context 또는 AsyncStorage에 저장
   * - 백엔드 API 연동 시 임시 저장 엔드포인트 호출
   *
   * @example
   * ```tsx
   * <TouchableOpacity onPress={handleNext}>
   * ```
   */
  const handleNext = async () => {
    if (loading) return;

    setLoading(true);
    
    try {
      const response = await onboardingService.saveGoals(selectedGoals);
      
      if (response.success) {
        console.log('목표 저장 성공:', selectedGoals);
        navigation.navigate('OnboardingBasicInfo' as any);
      } else {
        Alert.alert('저장 실패', response.error || '목표 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('목표 저장 오류:', error);
      Alert.alert('오류', '목표 저장 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Computed Values
  // ============================================

  /**
   * 다음 버튼 활성화 여부
   *
   * @computed
   * @description
   * 최소 1개 이상의 목표가 선택되었는지 확인합니다.
   */
  const isNextButtonEnabled = selectedGoals.length > 0 && !loading;

  // ============================================
  // Main Render
  // ============================================

  return (
    <View style={styles.container}>
      <BackgroundGradient layers={HOME_GRADIENTS} />

      {/* 뒤로가기 버튼 */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* 헤더 섹션 */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>어떤 목표를 가지고{'\n'}계신가요?</Text>
            <Text style={styles.subtitle}>
              최대 2개까지 선택할 수 있어요
            </Text>
          </View>

          {/* 목표 선택 그리드 */}
          <View style={styles.goalsGrid}>
            {GOAL_OPTIONS.map((option) => {
              const isSelected = selectedGoals.includes(option.value);

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                  onPress={() => handleToggleGoal(option.value)}
                  activeOpacity={0.7}
                >
                  {/* 제목 */}
                  <Text
                    style={[
                      styles.goalTitle,
                      isSelected && styles.goalTitleSelected,
                    ]}
                  >
                    {option.title}
                  </Text>

                  {/* 설명 */}
                  <Text
                    style={[
                      styles.goalDescription,
                      isSelected && styles.goalDescriptionSelected,
                    ]}
                  >
                    {option.description}
                  </Text>

                  {/* 선택 표시 */}
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 선택된 개수 표시 */}
          <Text style={styles.selectionCount}>
            {selectedGoals.length}/2 선택됨
          </Text>
        </View>
      </ScrollView>

      {/* 하단 버튼 영역 */}
      <View style={styles.footer}>
        {/* 다음 버튼 */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            !isNextButtonEnabled && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!isNextButtonEnabled}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.nextButtonText,
              !isNextButtonEnabled && styles.nextButtonTextDisabled,
            ]}
          >
            {loading ? '저장 중...' : '다음'}
          </Text>
        </TouchableOpacity>

        {/* 진행 표시 */}
        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
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
   * Back Button: 뒤로가기 버튼
   */
  backButton: {
    position: 'absolute',
    top: theme.spacing.xxxl + 10,
    left: theme.spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /**
   * ScrollView: 스크롤 가능한 영역
   */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  /**
   * Content: 메인 콘텐츠 영역
   */
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl * 2,
  },

  /**
   * Header Section: 제목 및 설명 섹션
   */
  headerSection: {
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: theme.colors.textSecondary,
  },

  /**
   * Goals Grid: 목표 선택 그리드
   */
  goalsGrid: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },

  /**
   * Goal Card: 개별 목표 카드
   */
  goalCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxxl,
    padding: theme.spacing.xl,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    position: 'relative',
  },
  goalCardSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },

  /**
   * Goal Title: 목표 제목
   */
  goalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.3,
  },
  goalTitleSelected: {
    color: theme.colors.primary,
  },

  /**
   * Goal Description: 목표 설명
   */
  goalDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.textSecondary,
    letterSpacing: -0.2,
  },
  goalDescriptionSelected: {
    color: theme.colors.textSecondary,
  },

  /**
   * Selected Badge: 선택 표시 배지
   */
  selectedBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  /**
   * Selection Count: 선택된 개수 표시
   */
  selectionCount: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  /**
   * Footer: 하단 고정 영역
   */
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },

  /**
   * Next Button: 다음 버튼
   */
  nextButton: {
    width: '100%',
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  nextButtonDisabled: {
    backgroundColor: '#D0D0D0',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.white,
  },
  nextButtonTextDisabled: {
    color: '#909090',
  },

  /**
   * Progress Dots: 진행 표시 점
   */
  progressDots: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
  },
  dotActive: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
});
