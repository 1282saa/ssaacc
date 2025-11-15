/**
 * 퀴즈 화면
 * Anima 디자인을 React Native로 픽셀-퍼펙트 변환
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from '../components/common/StatusBar';
import { theme } from '../constants/theme';
import type { AppNavigation } from '../types/navigation';

const QUIZ_LEVELS = [
  { id: 1, title: 'LV 1. 새싹 금융러', color: '#C9D5F4' },
  { id: 2, title: 'LV 2. 똑똑한 실전러', color: '#9AB4F9' },
  { id: 3, title: 'LV 3. 금융 천재 도전!', color: '#3060F1' },
];

export const QuizScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  const handleLevelSelect = (level: number) => {
    // TODO: 퀴즈 레벨별 화면으로 이동
    console.log('Selected quiz level:', level);
  };

  return (
    <LinearGradient
      colors={['#E8EAF6', '#F3F4FB', '#FFFFFF']}
      locations={[0, 0.3, 1]}
      style={styles.container}
    >
      <StatusBar />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* 상단 네비게이션 */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image
              source={{ uri: 'https://c.animaapp.com/AB8H0dqF/img/icon-cheveron-left-1.svg' }}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>오늘의 퀴즈</Text>
        </View>

        {/* 퀴즈 이미지 */}
        <Image
          source={{ uri: 'https://c.animaapp.com/AB8H0dqF/img/image-12@2x.png' }}
          style={styles.quizImage}
          resizeMode="cover"
        />

        {/* 설명 텍스트 */}
        <Text style={styles.description}>
          난이도를 고르면 핀쿠가 딱 맞는 문제를 준비해드려요{'\n'}매일 다른 문제로, 조금씩 성장해봐요
        </Text>

        {/* 레벨 선택 버튼들 */}
        <View style={styles.levelsContainer}>
          {QUIZ_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[styles.levelButton, { backgroundColor: level.color }]}
              onPress={() => handleLevelSelect(level.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.levelText}>{level.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    minHeight: 800,
    paddingBottom: 40,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    marginTop: theme.layout.statusBarHeight,
    paddingHorizontal: 0,
    width: '100%',
    gap: 95,
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
  title: {
    fontFamily: 'Pretendard Variable-Medium',
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    letterSpacing: 0,
    marginTop: 20,
  },
  quizImage: {
    aspectRatio: 1,
    width: 238,
    height: 238,
    position: 'absolute',
    top: 149,
    left: 61,
  },
  description: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    letterSpacing: -0.4,
    lineHeight: 26,
    position: 'absolute',
    top: 419,
    left: 21,
    textAlign: 'left',
  },
  levelsContainer: {
    position: 'absolute',
    top: 503,
    left: 16,
    width: 327,
    gap: 12,
  },
  levelButton: {
    borderRadius: 20,
    height: 60,
    width: 326,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.45,
    lineHeight: 26,
    textAlign: 'center',
  },
});
