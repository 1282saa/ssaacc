/**
 * 온보딩 완료 화면
 *
 * @module Screens/Onboarding/OnboardingCompleteScreen
 * @category UI/Screens/Onboarding
 * @since 1.0.0
 *
 * @description
 * 온보딩 프로세스의 마지막 화면입니다.
 * - 온보딩 완료 축하 메시지
 * - 핀쿠와 함께 시작하기 버튼
 * - 메인 홈 화면으로 진입
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { HOME_GRADIENTS } from '../../constants/gradients';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';

/**
 * 온보딩 완료 화면 컴포넌트
 *
 * @component
 * @returns {JSX.Element} 온보딩 완료 화면
 *
 * @example
 * ```tsx
 * <OnboardingCompleteScreen />
 * ```
 *
 * @hooks
 * - useNavigation: 메인 홈 화면으로 네비게이션
 *
 * @features
 * - 완료 축하 애니메이션 (TODO: Lottie 또는 애니메이션 추가)
 * - 핀쿠 캐릭터와 축하 메시지
 * - 시작하기 버튼으로 메인 앱 진입
 * - 온보딩 완료 상태 저장
 */
export const OnboardingCompleteScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * 시작하기 버튼 클릭 핸들러
   *
   * @function handleStart
   * @returns {void}
   *
   * @description
   * 온보딩 완료 상태를 저장하고 메인 홈 화면으로 이동합니다.
   *
   * @todo
   * - AsyncStorage에 온보딩 완료 플래그 저장
   * - 백엔드 API에 온보딩 완료 시간 전송
   * - 첫 로그인 보너스 포인트 지급 (선택사항)
   *
   * @example
   * ```tsx
   * <TouchableOpacity onPress={handleStart}>
   * ```
   */
  const handleStart = async () => {
    try {
      // TODO: AsyncStorage에 온보딩 완료 저장
      // await AsyncStorage.setItem('onboarding_completed', 'true');
      // await AsyncStorage.setItem('onboarding_completed_at', new Date().toISOString());

      // TODO: 백엔드 API 호출
      // await completeOnboarding(userId);

      // 메인 화면으로 이동 (네비게이션 스택 리셋)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' as any }],
      });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      // TODO: 에러 처리 (Toast 메시지 등)
    }
  };

  // ============================================
  // Main Render
  // ============================================

  return (
    <View style={styles.container}>
      <BackgroundGradient layers={HOME_GRADIENTS} />

      <View style={styles.content}>
        {/* 상단 여백 */}
        <View style={styles.topSpacer} />

        {/* 축하 섹션 */}
        <View style={styles.celebrationSection}>
          {/* 펭귄 캐릭터 */}
          <View style={styles.characterContainer}>
            <Image
              source={{ uri: 'https://c.animaapp.com/FwW9Xg6K/img/--@2x.png' }}
              style={styles.penguinImage}
              resizeMode="contain"
            />
          </View>

          {/* 완료 메시지 */}
          <Text style={styles.title}>모든 준비가{'\n'}완료되었어요!</Text>

          <Text style={styles.subtitle}>
            이제 핀쿠와 함께{'\n'}
            똑똑한 금융 생활을 시작해보세요
          </Text>
        </View>

        {/* 하이라이트 기능 안내 */}
        <View style={styles.featuresSection}>
          <FeatureItem
            title="맞춤형 금융 정보"
            description="선택한 목표에 맞는 정보를 추천해드려요"
          />
          <FeatureItem
            title="실천 가능한 체크리스트"
            description="복잡한 절차를 단계별로 안내해드려요"
          />
          <FeatureItem
            title="목표 달성 리워드"
            description="핀쿠 포인트를 모아 혜택을 받으세요"
          />
        </View>

        {/* 하단 여백 */}
        <View style={styles.bottomSpacer} />
      </View>

      {/* 하단 버튼 영역 */}
      <View style={styles.footer}>
        {/* 시작하기 버튼 */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>핀쿠와 함께 시작하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================
// Sub Components
// ============================================

/**
 * Feature Item 컴포넌트
 *
 * @component
 * @param {object} props - Feature Item Props
 * @param {string} props.title - 기능 제목
 * @param {string} props.description - 기능 설명
 * @returns {JSX.Element} Feature Item
 *
 * @description
 * 하이라이트 기능을 표시하는 컴포넌트입니다.
 */
const FeatureItem: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureBullet} />
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
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
   * Content: 메인 콘텐츠 영역
   */
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'space-between',
  },

  /**
   * Spacers: 상하 여백
   */
  topSpacer: {
    height: theme.spacing.xxxl * 2,
  },
  bottomSpacer: {
    height: theme.spacing.xl,
  },

  /**
   * Celebration Section: 축하 섹션
   */
  celebrationSection: {
    alignItems: 'center',
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  penguinImage: {
    width: 180,
    height: 180,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: -0.2,
  },

  /**
   * Features Section: 기능 안내 섹션
   */
  featuresSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxxl,
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginTop: 6,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.2,
  },
  featureDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.textSecondary,
    lineHeight: 18,
    letterSpacing: -0.2,
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
   * Start Button: 시작하기 버튼
   */
  startButton: {
    width: '100%',
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.white,
  },
});
