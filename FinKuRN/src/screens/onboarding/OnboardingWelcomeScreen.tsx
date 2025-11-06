/**
 * 온보딩 환영 화면
 *
 * @module Screens/Onboarding/OnboardingWelcomeScreen
 * @category UI/Screens/Onboarding
 * @since 1.0.0
 *
 * @description
 * 온보딩 프로세스의 첫 번째 화면입니다.
 * - 핀쿠(FinKu) 인사
 * - 서비스 소개
 * - 시작하기 버튼
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { HOME_GRADIENTS } from '../../constants/gradients';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';

export const OnboardingWelcomeScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  const handleStart = () => {
    navigation.navigate('OnboardingGoals' as any);
  };

  return (
    <View style={styles.container}>
      <BackgroundGradient layers={HOME_GRADIENTS} />

      <View style={styles.content}>
        {/* 펭귄 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://c.animaapp.com/FwW9Xg6K/img/--@2x.png' }}
            style={styles.penguinImage}
            resizeMode="contain"
          />
        </View>

        {/* 인사말 */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>안녕하세요!{'\n'}핀쿠입니다</Text>

          <Text style={styles.subtitle}>
            Financial Knowledge & Resource Navigator
          </Text>
        </View>

        {/* 서비스 소개 */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureBullet} />
            <Text style={styles.featureText}>맞춤형 금융 정보</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureBullet} />
            <Text style={styles.featureText}>실천 가능한 체크리스트</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureBullet} />
            <Text style={styles.featureText}>목표 달성 리워드</Text>
          </View>
        </View>

        {/* 시작하기 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>

        {/* 진행 표시 */}
        <View style={styles.progressDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl + 40,
    paddingBottom: theme.spacing.xxxl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  penguinImage: {
    width: 200,
    height: 200,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  features: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxxl,
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
    letterSpacing: -0.3,
  },
  progressDots: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dotActive: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
});
