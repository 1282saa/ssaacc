/**
 * 플랜 업그레이드 페이지 (Plan Upgrade Page)
 *
 * 프리미엄 플랜 업그레이드 페이지로, 사용자가 프리미엄 기능과 혜택에 대해 알아볼 수 있습니다.
 *
 * @module Screens/PlanUpgradePage
 * @category UI/Screens
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * // ChatbotScreenV2에서 네비게이션
 * navigation.navigate('PlanUpgrade');
 * ```
 *
 * @description
 * 표시 내용:
 * - 별 아이콘 (Star Icon) - 프리미엄 브랜딩
 * - Premium 플랜 타이틀 (Premium Plan Title)
 * - 설명 문구 (Description) - "모든 기능을 무제한으로 사용하세요"
 * - 돌아가기 버튼 (Back Button)
 *
 * @features
 * - 중앙 정렬 레이아웃 (Centered Layout Design)
 * - Ionicons 별 아이콘 (Ionicons Star Icon) - 100px
 * - 뒤로가기 네비게이션 (Back Navigation)
 * - 흰색 배경 (White Background)
 *
 * @styling
 * - flex: 1
 * - justifyContent: 'center'
 * - alignItems: 'center'
 * - fontSize: 28 (title), 16 (description)
 * - color: theme.colors.primary
 *
 * @navigation
 * - goBack(): 이전 화면으로 돌아가기
 *
 * @see {@link ChatbotScreenV2}
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';
import type { AppNavigation } from '../types/navigation';

/**
 * 플랜 업그레이드 페이지 컴포넌트 (Plan Upgrade Page Component)
 *
 * 프리미엄 플랜에 대한 정보를 표시하고 사용자가 업그레이드할 수 있도록 안내합니다.
 *
 * @component
 *
 * @returns {JSX.Element} 플랜 업그레이드 화면
 *
 * @example
 * ```tsx
 * <PlanUpgradePage />
 * ```
 *
 * @note
 * 현재는 플레이스홀더 화면입니다. 실제 구현 시:
 * - 플랜별 가격 표시
 * - 기능 비교표
 * - 결제 연동
 * - 구독 관리 기능
 * 등이 추가되어야 합니다.
 */
export const PlanUpgradePage: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  return (
    <View style={styles.container}>
      <Ionicons name="star" size={100} color={theme.colors.primary} />
      <Text style={styles.title}>Premium 플랜</Text>
      <Text style={styles.description}>모든 기능을 무제한으로 사용하세요</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  description: {
    ...theme.typography.body1,
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 40,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 40,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
  },
  buttonText: {
    ...theme.typography.button,
    fontSize: 16,
    color: theme.colors.white,
  },
});
