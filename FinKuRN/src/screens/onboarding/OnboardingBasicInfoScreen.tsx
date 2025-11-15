/**
 * 온보딩 기본 정보 입력 화면
 * Anima 디자인 (온보딩3)을 React Native로 픽셀-퍼펙트 변환
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { StatusBar } from '../../components/common/StatusBar';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';

const GENDER_OPTIONS = ['남성', '여성'];

const EMPLOYMENT_OPTIONS = [
  ['학생', '취업준비생'],
  ['정규직', '프리랜서'],
  ['자영업', '기타'],
];

const INCOME_OPTIONS = [
  '100만 원 이상 200만 원 미만',
  '200만 원 이상 300만 원 미만',
  '300만 원 이상 400만 원 미만',
  '400만 원 이상',
];

export const OnboardingBasicInfoScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();
  const [age, setAge] = useState<string>('24');
  const [gender, setGender] = useState<string | null>(null);
  const [employment, setEmployment] = useState<string | null>(null);
  const [income, setIncome] = useState<number | null>(null);

  const handleNext = () => {
    // 메인 화면으로 이동 (네비게이션 스택 리셋)
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' as any }],
    });
  };

  const handleSkip = () => {
    // 메인 화면으로 이동 (네비게이션 스택 리셋)
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' as any }],
    });
  };

  return (
    <View style={styles.container}>
      {/* 배경 그라디언트 4개 */}
      <BackgroundGradient
        layers={[
          {
            top: 12,
            left: 112,
            opacity: 1,
            colors: [
              'rgba(66, 0, 255, 0.2)',
              'rgba(223, 127, 127, 0.2)',
              'rgba(255, 229, 0, 0.2)',
            ],
          },
          {
            top: 349,
            left: -188,
            opacity: 1,
            colors: [
              'rgba(66, 0, 255, 0.2)',
              'rgba(223, 127, 127, 0.2)',
              'rgba(255, 229, 0, 0.2)',
            ],
          },
          {
            top: 704,
            left: 112,
            opacity: 1,
            colors: [
              'rgba(66, 0, 255, 0.2)',
              'rgba(223, 127, 127, 0.2)',
              'rgba(255, 229, 0, 0.2)',
            ],
          },
          {
            top: 972,
            left: -77,
            opacity: 1,
            colors: [
              'rgba(66, 0, 255, 0.2)',
              'rgba(223, 127, 127, 0.2)',
              'rgba(255, 229, 0, 0.2)',
            ],
          },
        ]}
        size={[330, 607]}
      />

      <StatusBar />

      {/* 상단 네비게이션 */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={{ uri: 'https://c.animaapp.com/5WZrwabW/img/icon-cheveron-left-1.svg' }}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 타이틀 */}
        <Text style={styles.title}>기본 정보를{'\n'}입력해주세요</Text>

        {/* 서브타이틀 */}
        <Text style={styles.subtitle}>
          맞춤형 금융 정보 제공을 위해 필요한 내용이에요! 정보는 추후 수정 가능해요
        </Text>

        {/* 연령 */}
        <Text style={styles.sectionLabel}>연령</Text>
        <View style={styles.ageInputContainer}>
          <TextInput
            style={styles.ageInput}
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        {/* 성별 */}
        <Text style={styles.sectionLabel2}>성별</Text>
        <View style={styles.genderRow}>
          {GENDER_OPTIONS.map((option) => {
            const isSelected = gender === option;
            return (
              <TouchableOpacity
                key={option}
                style={[styles.genderButton, isSelected && styles.selectedButton]}
                onPress={() => setGender(option)}
                activeOpacity={0.7}
              >
                <Text style={[styles.genderText, isSelected && styles.selectedText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 근로 형태 */}
        <Text style={styles.sectionLabel3}>근로 형태</Text>
        <View style={styles.employmentGrid}>
          {EMPLOYMENT_OPTIONS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.employmentRow}>
              {row.map((option) => {
                const isSelected = employment === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.employmentButton, isSelected && styles.selectedButton]}
                    onPress={() => setEmployment(option)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.employmentText, isSelected && styles.selectedText]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* 월 소득 */}
        <Text style={styles.sectionLabel4}>월 소득</Text>
        <View style={styles.incomeList}>
          {INCOME_OPTIONS.map((option, index) => {
            const isSelected = income === index;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.incomeButton, isSelected && styles.selectedButton]}
                onPress={() => setIncome(index)}
                activeOpacity={0.7}
              >
                <Text style={[styles.incomeText, isSelected && styles.selectedText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 프로그레스 바 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg} />
          <View style={styles.progressBarFill} />
        </View>
      </ScrollView>

      {/* 다음 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>핀큐 시작하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    marginTop: theme.layout.statusBarHeight,
    paddingHorizontal: 0,
    width: '100%',
  },
  backButton: {
    width: 32,
    height: 32,
    marginLeft: 16,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 32,
    height: 32,
  },
  skipText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    fontWeight: '600',
    color: '#A0A0A0',
    letterSpacing: -0.5,
    lineHeight: 26,
    marginRight: 16,
    marginTop: 15,
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.8,
    lineHeight: 44.8,
    marginLeft: 16,
    marginTop: 11,
    width: 246,
  },
  subtitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    fontWeight: '500',
    color: '#767676',
    letterSpacing: -0.5,
    lineHeight: 28,
    marginLeft: 16,
    marginTop: 8,
    width: 328,
  },
  sectionLabel: {
    fontFamily: 'Pretendard Variable-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    lineHeight: 16,
    marginLeft: 18,
    marginTop: 40,
  },
  ageInputContainer: {
    marginLeft: 16,
    marginTop: 11,
  },
  ageInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 50,
    width: 328,
    paddingLeft: 20,
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    fontWeight: '500',
    color: '#373737',
    letterSpacing: -0.4,
    lineHeight: 22.4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionLabel2: {
    fontFamily: 'Pretendard Variable-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    lineHeight: 16,
    marginLeft: 18,
    marginTop: 60,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 20,
    marginLeft: 17,
    marginTop: 11,
  },
  genderButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 50,
    width: 153,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  genderText: {
    fontFamily: 'Pretendard Variable-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#767676',
    letterSpacing: 0,
    lineHeight: 16,
  },
  sectionLabel3: {
    fontFamily: 'Pretendard Variable-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    lineHeight: 16,
    marginLeft: 18,
    marginTop: 60,
  },
  employmentGrid: {
    marginLeft: 17,
    marginTop: 11,
    gap: 16,
  },
  employmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 327,
  },
  employmentButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 50,
    width: 153,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  employmentText: {
    fontFamily: 'Pretendard Variable-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#767676',
    letterSpacing: 0,
    lineHeight: 16,
  },
  sectionLabel4: {
    fontFamily: 'Pretendard Variable-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    lineHeight: 16,
    marginLeft: 18,
    marginTop: 44,
  },
  incomeList: {
    marginLeft: 16,
    marginTop: 11,
    gap: 16,
    width: 328,
  },
  incomeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 50,
    width: 328,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  incomeText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    fontWeight: '500',
    color: '#373737',
    letterSpacing: -0.4,
    lineHeight: 22.4,
  },
  selectedButton: {
    backgroundColor: '#3060F1',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 78,
  },
  progressBarBg: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    height: 8,
    width: 196,
    position: 'absolute',
  },
  progressBarFill: {
    backgroundColor: '#3060F1',
    borderRadius: 100,
    height: 8,
    width: 49,
    position: 'absolute',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 17,
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  nextButton: {
    backgroundColor: '#3060F1',
    borderRadius: 20,
    height: 60,
    width: 326,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  nextButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.45,
    lineHeight: 26,
  },
});
