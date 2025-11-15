/**
 * 온보딩 환영 화면
 * Anima 디자인 (온보딩1)을 React Native로 픽셀-퍼펙트 변환
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { StatusBar } from '../../components/common/StatusBar';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';

export const OnboardingWelcomeScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  const handleStart = () => {
    navigation.navigate('OnboardingGoals' as any);
  };

  return (
    <View style={styles.container}>
      {/* 배경 그라디언트 2개 */}
      <BackgroundGradient
        layers={[
          {
            top: 70,
            left: 18,
            opacity: 1,
            colors: [
              'rgba(66, 0, 255, 0.2)',
              'rgba(223, 127, 127, 0.2)',
              'rgba(255, 229, 0, 0.2)',
            ],
          },
          {
            top: 159,
            left: -231,
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

      <View style={styles.content}>
        {/* 펭귄 이미지 */}
        <Image
          source={{ uri: 'https://c.animaapp.com/nsD5OMDL/img/------@2x.png' }}
          style={styles.penguinImage}
          resizeMode="cover"
        />

        {/* 인사말 */}
        <Text style={styles.title}>만나서 반가워요!{'\n'}저는 핀쿠예요</Text>

        {/* 서비스 소개 카드 */}
        <View style={styles.featureCard}>
          <Text style={styles.cardTitle}>
            AI 금융 코치 핀쿠와 함께{'\n'}정책을 찾고, 계획하고, 실천하세요.
          </Text>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>AI 금융 챗봇 핀쿠</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>맞춤형 정책 큐레이션</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>실천을 돕는 투두리스트</Text>
            </View>
          </View>
        </View>

        {/* 시작하기 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>시작하기</Text>
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
  content: {
    flex: 1,
    marginTop: theme.layout.statusBarHeight,
    alignItems: 'center',
  },
  penguinImage: {
    aspectRatio: 1,
    height: 220,
    width: 220,
    marginTop: 74,
  },
  title: {
    fontFamily: 'Pretendard Variable',
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.8,
    lineHeight: 44.8,
    textAlign: 'center',
    marginTop: 40,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    width: 328,
    height: 164,
    marginTop: 40,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#3060F1',
    letterSpacing: -0.4,
    lineHeight: 22.4,
    textAlign: 'center',
    marginLeft: 57,
    marginTop: 20,
    width: 214,
    height: 44,
  },
  features: {
    alignSelf: 'center',
    marginLeft: -104,
    width: 160,
    height: 68,
    gap: 4,
    marginTop: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureBullet: {
    backgroundColor: '#A9BFF3',
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  featureText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    letterSpacing: -0.35,
    lineHeight: 19.6,
  },
  button: {
    backgroundColor: '#3060F1',
    borderRadius: 20,
    width: 326,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
  buttonText: {
    fontFamily: 'Pretendard',
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.45,
    lineHeight: 26,
  },
});
