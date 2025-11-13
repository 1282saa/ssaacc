/**
 * 온보딩 알림 및 동의 화면
 *
 * @module Screens/Onboarding/OnboardingConsentScreen
 * @category UI/Screens/Onboarding
 * @since 1.0.0
 *
 * @description
 * 온보딩 프로세스의 네 번째 화면입니다.
 * - 푸시 알림 동의
 * - 마케팅 알림 동의
 * - 리워드 프로그램 참여 동의
 * - 각 항목별 상세 설명 제공
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { HOME_GRADIENTS } from '../../constants/gradients';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';
import { onboardingService } from '../../services';

/**
 * 동의 항목 인터페이스
 *
 * @interface ConsentItem
 * @property {string} key - 동의 항목 키
 * @property {string} icon - 항목 아이콘
 * @property {string} title - 항목 제목
 * @property {string} description - 항목 설명
 * @property {boolean} required - 필수 여부
 */
interface ConsentItem {
  key: 'pushNotification' | 'marketingNotification' | 'rewardProgram';
  icon: string;
  title: string;
  description: string;
  required: boolean;
}

/**
 * 동의 항목 목록
 *
 * @constant CONSENT_ITEMS
 */
const CONSENT_ITEMS: ConsentItem[] = [
  {
    key: 'pushNotification',
    icon: '🔔',
    title: '푸시 알림',
    description: '마감일 알림과 맞춤형 금융 정보를 받아보세요',
    required: false,
  },
  {
    key: 'marketingNotification',
    icon: '📬',
    title: '마케팅 알림',
    description: '새로운 혜택과 이벤트 소식을 받아보세요',
    required: false,
  },
  {
    key: 'rewardProgram',
    icon: '🎁',
    title: '리워드 프로그램',
    description: '목표 달성 시 핀쿠 포인트를 받아보세요',
    required: false,
  },
];

/**
 * 온보딩 알림 및 동의 화면 컴포넌트
 *
 * @component
 * @returns {JSX.Element} 알림 및 동의 화면
 *
 * @example
 * ```tsx
 * <OnboardingConsentScreen />
 * ```
 *
 * @hooks
 * - useState: 동의 상태 관리
 * - useNavigation: 다음 화면으로 네비게이션
 *
 * @state
 * - consents: 각 항목별 동의 여부
 *
 * @features
 * - 개별 동의 항목 토글
 * - 전체 동의 버튼
 * - 상세 설명 제공
 * - 필수/선택 항목 구분 (현재는 모두 선택사항)
 */
export const OnboardingConsentScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  // ============================================
  // State Management
  // ============================================

  /**
   * 동의 항목 상태
   *
   * @state
   * @type {Record<string, boolean>}
   * @default { pushNotification: false, marketingNotification: false, rewardProgram: false }
   *
   * @description
   * 각 동의 항목의 체크 여부를 관리합니다.
   */
  const [consents, setConsents] = useState({
    pushNotification: false,
    marketingNotification: false,
    rewardProgram: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * 개별 동의 항목 토글 핸들러
   *
   * @function handleToggleConsent
   * @param {string} key - 토글할 동의 항목 키
   * @returns {void}
   *
   * @description
   * 특정 동의 항목의 체크 상태를 토글합니다.
   *
   * @example
   * ```tsx
   * <TouchableOpacity onPress={() => handleToggleConsent('pushNotification')}>
   * ```
   */
  const handleToggleConsent = (key: string) => {
    setConsents((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  /**
   * 전체 동의 핸들러
   *
   * @function handleAgreeAll
   * @returns {void}
   *
   * @description
   * 모든 동의 항목을 한 번에 체크합니다.
   */
  const handleAgreeAll = () => {
    setConsents({
      pushNotification: true,
      marketingNotification: true,
      rewardProgram: true,
    });
  };

  /**
   * 완료 버튼 클릭 핸들러
   *
   * @function handleComplete
   * @returns {void}
   *
   * @description
   * 동의 정보를 백엔드에 저장하고 온보딩을 완료한 후 완료 화면으로 이동합니다.
   */
  const handleComplete = async () => {
    if (loading) return;

    setLoading(true);
    
    try {
      // 동의 정보 저장
      const consentResponse = await onboardingService.saveConsent({
        pushNotification: consents.pushNotification,
        marketingNotification: consents.marketingNotification,
        rewardProgram: consents.rewardProgram,
      });
      
      if (!consentResponse.success) {
        Alert.alert('저장 실패', consentResponse.error || '동의 정보 저장에 실패했습니다.');
        return;
      }

      // 온보딩 완료 처리
      const completeResponse = await onboardingService.completeOnboarding();
      
      if (completeResponse && completeResponse.success) {
        console.log('온보딩 완료 성공:', consents);
        navigation.navigate('OnboardingComplete' as any);
      } else {
        Alert.alert('완료 실패', '온보딩 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('온보딩 완료 오류:', error);
      Alert.alert('오류', '온보딩 완료 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Computed Values
  // ============================================

  /**
   * 전체 동의 여부
   *
   * @computed
   * @description
   * 모든 항목이 동의되었는지 확인합니다.
   */
  const isAllAgreed =
    consents.pushNotification &&
    consents.marketingNotification &&
    consents.rewardProgram;

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
            <Text style={styles.title}>알림 설정을{'\n'}완료해주세요</Text>
            <Text style={styles.subtitle}>
              언제든지 설정에서 변경할 수 있어요
            </Text>
          </View>

          {/* 전체 동의 버튼 */}
          <TouchableOpacity
            style={[
              styles.agreeAllButton,
              isAllAgreed && styles.agreeAllButtonActive,
            ]}
            onPress={handleAgreeAll}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.agreeAllCheckbox,
                isAllAgreed && styles.agreeAllCheckboxChecked,
              ]}
            >
              {isAllAgreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text
              style={[
                styles.agreeAllText,
                isAllAgreed && styles.agreeAllTextActive,
              ]}
            >
              전체 동의
            </Text>
          </TouchableOpacity>

          {/* 동의 항목 목록 */}
          <View style={styles.consentList}>
            {CONSENT_ITEMS.map((item) => {
              const isChecked = consents[item.key];

              return (
                <TouchableOpacity
                  key={item.key}
                  style={styles.consentItem}
                  onPress={() => handleToggleConsent(item.key)}
                  activeOpacity={0.7}
                >
                  {/* 아이콘 */}
                  <Text style={styles.consentIcon}>{item.icon}</Text>

                  {/* 내용 */}
                  <View style={styles.consentContent}>
                    <View style={styles.consentHeader}>
                      <Text style={styles.consentTitle}>{item.title}</Text>
                      {item.required && (
                        <Text style={styles.requiredBadge}>필수</Text>
                      )}
                    </View>
                    <Text style={styles.consentDescription}>
                      {item.description}
                    </Text>
                  </View>

                  {/* 체크박스 */}
                  <View
                    style={[
                      styles.checkbox,
                      isChecked && styles.checkboxChecked,
                    ]}
                  >
                    {isChecked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 안내 문구 */}
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              💡 알림을 허용하면 마감일을 놓치지 않고{'\n'}
              핀쿠가 더 많은 도움을 드릴 수 있어요
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 영역 */}
      <View style={styles.footer}>
        {/* 완료 버튼 */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            loading && styles.completeButtonDisabled,
          ]}
          onPress={handleComplete}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.completeButtonText}>
            {loading ? '완료 처리 중...' : '완료'}
          </Text>
        </TouchableOpacity>

        {/* 진행 표시 */}
        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
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
   * Agree All Button: 전체 동의 버튼
   */
  agreeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  agreeAllButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#F0F6FF',
  },
  agreeAllCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  agreeAllCheckboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  agreeAllText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  agreeAllTextActive: {
    color: theme.colors.primary,
  },

  /**
   * Consent List: 동의 항목 목록
   */
  consentList: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },

  /**
   * Consent Item: 개별 동의 항목
   */
  consentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  consentIcon: {
    fontSize: 32,
  },
  consentContent: {
    flex: 1,
  },
  consentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  requiredBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  consentDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },

  /**
   * Checkbox: 체크박스
   */
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
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },

  /**
   * Notice: 안내 문구
   */
  notice: {
    backgroundColor: '#FFF9E6',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
  },
  noticeText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8B7500',
    lineHeight: 20,
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
   * Complete Button: 완료 버튼
   */
  completeButton: {
    width: '100%',
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  completeButtonDisabled: {
    backgroundColor: '#D0D0D0',
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.white,
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
