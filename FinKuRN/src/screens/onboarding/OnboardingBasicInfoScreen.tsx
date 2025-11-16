/**
 * 온보딩 기본 정보 입력 화면
 *
 * @module Screens/Onboarding/OnboardingBasicInfoScreen
 * @category UI/Screens/Onboarding
 * @since 1.0.0
 *
 * @description
 * 온보딩 프로세스의 세 번째 화면입니다.
 * - 사용자의 기본 정보를 수집합니다
 * - 연령, 직업, 소득, 거주 지역 정보 입력
 * - 맞춤형 금융 정보 제공을 위한 필수 정보
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { HOME_GRADIENTS } from '../../constants/gradients';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';
import type { JobCategory, IncomeRange } from '../../types/onboarding';
import { onboardingService } from '../../services';

/**
 * 직업 카테고리 옵션 목록
 *
 * @constant JOB_CATEGORIES
 */
const JOB_CATEGORIES: { value: JobCategory; label: string }[] = [
  { value: '학생', label: '학생' },
  { value: '취업준비생', label: '취업준비생' },
  { value: '직장인', label: '직장인' },
  { value: '프리랜서', label: '프리랜서' },
  { value: '자영업', label: '자영업' },
  { value: '기타', label: '기타' },
];

/**
 * 소득 구간 옵션 목록
 *
 * @constant INCOME_RANGES
 */
const INCOME_RANGES: { value: IncomeRange; label: string }[] = [
  { value: '100만원 미만', label: '100만원 미만' },
  { value: '100-200만원', label: '100~200만원' },
  { value: '200-300만원', label: '200~300만원' },
  { value: '300-400만원', label: '300~400만원' },
  { value: '400만원 이상', label: '400만원 이상' },
];

/**
 * 온보딩 기본 정보 입력 화면 컴포넌트
 *
 * @component
 * @returns {JSX.Element} 기본 정보 입력 화면
 *
 * @example
 * ```tsx
 * <OnboardingBasicInfoScreen />
 * ```
 *
 * @hooks
 * - useState: 입력된 정보 상태 관리
 * - useNavigation: 다음 화면으로 네비게이션
 *
 * @state
 * - age: 사용자 연령
 * - jobCategory: 직업 카테고리
 * - incomeRange: 소득 구간
 * - region: 거주 지역
 *
 * @features
 * - 연령 입력 (숫자만 입력 가능)
 * - 직업 선택 (단일 선택)
 * - 소득 구간 선택 (단일 선택)
 * - 지역 입력 (텍스트 입력)
 * - 모든 필드 입력 시 다음 버튼 활성화
 */
export const OnboardingBasicInfoScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  // ============================================
  // State Management
  // ============================================

  /**
   * 사용자 연령 상태
   *
   * @state
   * @type {string}
   * @default ''
   */
  const [age, setAge] = useState<string>('');

  /**
   * 직업 카테고리 상태
   *
   * @state
   * @type {JobCategory | null}
   * @default null
   */
  const [jobCategory, setJobCategory] = useState<JobCategory | null>(null);

  /**
   * 소득 구간 상태
   *
   * @state
   * @type {IncomeRange | null}
   * @default null
   */
  const [incomeRange, setIncomeRange] = useState<IncomeRange | null>(null);

  /**
   * 거주 지역 상태
   *
   * @state
   * @type {string}
   * @default ''
   */
  const [region, setRegion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * 연령 입력 핸들러
   *
   * @function handleAgeChange
   * @param {string} value - 입력된 값
   * @returns {void}
   *
   * @description
   * 숫자만 입력되도록 필터링합니다.
   */
  const handleAgeChange = (value: string) => {
    // 숫자만 허용
    const numericValue = value.replace(/[^0-9]/g, '');
    setAge(numericValue);
  };

  /**
   * 다음 버튼 클릭 핸들러
   *
   * @function handleNext
   * @returns {void}
   *
   * @description
   * 입력된 기본 정보를 백엔드에 저장하고 다음 화면(알림 동의)으로 이동합니다.
   */
  const handleNext = async () => {
    if (loading) return;

    setLoading(true);
    
    try {
      const basicInfo = {
        age: parseInt(age, 10),
        jobCategory: jobCategory!,
        incomeRange: incomeRange!,
        region: region.trim(),
      };

      const response = await onboardingService.saveProfile(basicInfo);
      
      if (response.success) {
        console.log('기본 정보 저장 성공:', basicInfo);

        // 온보딩 완료 처리
        const completeResponse = await onboardingService.completeOnboarding();
        if (completeResponse) {
          console.log('온보딩 완료 처리 성공');
        }

        // 메인 화면으로 이동
        navigation.navigate('Main' as any);
      } else {
        Alert.alert('저장 실패', response.error || '기본 정보 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('기본 정보 저장 오류:', error);
      Alert.alert('오류', '기본 정보 저장 중 문제가 발생했습니다.');
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
   * 모든 필드가 입력되었는지 확인합니다.
   */
  const isNextButtonEnabled =
    age.length > 0 &&
    jobCategory !== null &&
    incomeRange !== null &&
    region.trim().length > 0 &&
    !loading;

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
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* 헤더 섹션 */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>기본 정보를{'\n'}입력해주세요</Text>
            <Text style={styles.subtitle}>
              맞춤형 금융 정보 제공을 위해 필요해요
            </Text>
          </View>

          {/* 입력 폼 */}
          <View style={styles.form}>
            {/* 연령 입력 */}
            <View style={styles.field}>
              <Text style={styles.label}>연령</Text>
              <TextInput
                style={styles.textInput}
                placeholder="만 나이를 입력해주세요"
                placeholderTextColor="#999999"
                value={age}
                onChangeText={handleAgeChange}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>

            {/* 직업 선택 */}
            <View style={styles.field}>
              <Text style={styles.label}>직업</Text>
              <View style={styles.optionsGrid}>
                {JOB_CATEGORIES.map((option) => {
                  const isSelected = jobCategory === option.value;

                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        isSelected && styles.optionButtonSelected,
                      ]}
                      onPress={() => setJobCategory(option.value)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 소득 구간 선택 */}
            <View style={styles.field}>
              <Text style={styles.label}>월 소득</Text>
              <View style={styles.optionsColumn}>
                {INCOME_RANGES.map((option) => {
                  const isSelected = incomeRange === option.value;

                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButtonFull,
                        isSelected && styles.optionButtonSelected,
                      ]}
                      onPress={() => setIncomeRange(option.value)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 지역 입력 */}
            <View style={styles.field}>
              <Text style={styles.label}>거주 지역</Text>
              <TextInput
                style={styles.textInput}
                placeholder="예: 서울특별시 강남구"
                placeholderTextColor="#999999"
                value={region}
                onChangeText={setRegion}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
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
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
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
   * Form: 입력 폼
   */
  form: {
    gap: theme.spacing.xxl,
  },

  /**
   * Field: 개별 입력 필드
   */
  field: {
    gap: theme.spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },

  /**
   * Text Input: 텍스트 입력 필드
   */
  textInput: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    fontSize: 16,
    fontWeight: '400',
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  /**
   * Options Grid: 옵션 그리드 레이아웃 (2열)
   */
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },

  /**
   * Options Column: 옵션 세로 레이아웃 (1열)
   */
  optionsColumn: {
    gap: theme.spacing.sm,
  },

  /**
   * Option Button: 옵션 버튼 (그리드용)
   */
  optionButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },

  /**
   * Option Button Full: 옵션 버튼 (전체 너비)
   */
  optionButtonFull: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },

  /**
   * Option Button Selected: 선택된 옵션 버튼
   */
  optionButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#F0F6FF',
  },

  /**
   * Option Text: 옵션 텍스트
   */
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
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
