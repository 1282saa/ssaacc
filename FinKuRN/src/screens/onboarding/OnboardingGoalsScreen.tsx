/**
 * 온보딩 목표 선택 화면
 * Anima 디자인 (온보딩2)을 React Native로 픽셀-퍼펙트 변환
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { StatusBar } from '../../components/common/StatusBar';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';

interface GoalOption {
  emoji: string;
  title: string;
  description: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    emoji: '🏠',
    title: '주거지원 준비',
    description: '청년 월세·보증금 정책을 함께 찾아드릴게요',
  },
  {
    emoji: '🧾',
    title: '지원금·혜택 찾기',
    description: '나에게 맞는 정부 지원 혜택을 모아드릴게요',
  },
  {
    emoji: '📈',
    title: '자산 늘리기',
    description: '투자 전 기초부터 천천히 함께 시작해볼까요?',
  },
  {
    emoji: '✈',
    title: '여행·취미를 위한 저축',
    description: '가벼운 목표로 꾸준히 금융 습관을 만들어봐요',
  },
];

export const OnboardingGoalsScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);

  const handleToggleGoal = (index: number) => {
    if (selectedGoals.includes(index)) {
      setSelectedGoals(selectedGoals.filter((i) => i !== index));
    } else {
      if (selectedGoals.length >= 3) {
        return;
      }
      setSelectedGoals([...selectedGoals, index]);
    }
  };

  const handleNext = () => {
    navigation.navigate('OnboardingBasicInfo' as any);
  };

  const handleSkip = () => {
    navigation.navigate('OnboardingBasicInfo' as any);
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
            source={{ uri: 'https://c.animaapp.com/9f2kqMGW/img/icon-cheveron-left-1.svg' }}
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
      >
        {/* 타이틀 */}
        <Text style={styles.title}>어떤 목표를 가지고 계세요?</Text>

        {/* 서브타이틀 */}
        <Text style={styles.subtitle}>최대 3개까지 선택할 수 있어요</Text>

        {/* 목표 카드 리스트 */}
        <View style={styles.goalsList}>
          {GOAL_OPTIONS.map((option, index) => {
            const isSelected = selectedGoals.includes(index);
            return (
              <TouchableOpacity
                key={index}
                style={styles.goalCard}
                onPress={() => handleToggleGoal(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.goalTitle}>
                  {option.emoji} {option.title}
                </Text>
                <Text style={styles.goalDescription}>{option.description}</Text>
                <Image
                  source={{
                    uri: isSelected
                      ? 'https://c.animaapp.com/9f2kqMGW/img/group-1707481581-3@2x.png'
                      : 'https://c.animaapp.com/9f2kqMGW/img/group-1707481581-3@2x.png',
                  }}
                  style={[styles.checkIcon, isSelected && styles.checkIconSelected]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 선택 카운트 */}
        <Text style={styles.selectionCount}>{selectedGoals.length} / 3 선택됨</Text>
      </ScrollView>

      {/* 다음 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedGoals.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedGoals.length === 0}
        >
          <Text style={styles.nextButtonText}>다음</Text>
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
    paddingBottom: 120,
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
    marginTop: 98,
  },
  goalsList: {
    marginLeft: 16,
    marginTop: 40,
    gap: 20,
    width: 328,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 86,
    width: 328,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  goalTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#3060F1',
    letterSpacing: -0.4,
    lineHeight: 22.4,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  goalDescription: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    fontWeight: '500',
    color: '#767676',
    letterSpacing: -0.35,
    lineHeight: 19.6,
    position: 'absolute',
    top: 46,
    left: 20,
  },
  checkIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: 33,
    right: 20,
    opacity: 0.3,
  },
  checkIconSelected: {
    opacity: 1,
  },
  selectionCount: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    fontWeight: '500',
    color: '#767676',
    letterSpacing: -0.38,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 68,
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
  nextButtonDisabled: {
    backgroundColor: '#D0D0D0',
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
