import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from '../../components/common/StatusBar';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';

/**
 * 챗봇 접속 화면 (Chat Screen)
 * Anima 디자인을 React Native로 픽셀-퍼펙트 변환
 */
export const ChatScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();
  const [showPassModal, setShowPassModal] = useState(false);

  return (
    <View style={styles.container}>
      {/* 배경 그라디언트 */}
      <BackgroundGradient
        layers={[
          {
            top: 73,
            left: -14,
            opacity: 1,
            colors: [
              'rgba(66, 0, 255, 0.2)',
              'rgba(223, 127, 127, 0.2)',
              'rgba(255, 229, 0, 0.2)',
            ],
          },
        ]}
        size={595}
      />

      <StatusBar />

      {/* 타이틀 바 (view-2) */}
      <View style={styles.titleBar}>
        <Image
          source={{ uri: 'https://c.animaapp.com/3xV80UqJ/img/------.svg' }}
          style={styles.titleImage1}
          resizeMode="contain"
        />
        <Text style={styles.titleText}>FinKu</Text>
        <Image
          source={{ uri: 'https://c.animaapp.com/3xV80UqJ/img/-------1.svg' }}
          style={styles.titleImage2}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FinQ PASS 카드 (view-3) */}
        <View style={styles.passCard}>
          <Image
            source={{ uri: 'https://c.animaapp.com/3xV80UqJ/img/--@2x.png' }}
            style={styles.passImage}
            resizeMode="cover"
          />
          <Text style={styles.passTitle}>FinQ PASS</Text>
          <Text style={styles.passDescription}>
            FinQ PASS에 가입하시면 핀쿠가 제도 자격을 진단해주고, 신청 일정까지
            관리해드려요
          </Text>
          <TouchableOpacity
            style={styles.passButton}
            onPress={() => setShowPassModal(true)}
          >
            <Text style={styles.passButtonText}>핀큐패스 가입하기</Text>
          </TouchableOpacity>
        </View>

        {/* 새로운 금융 대화 시작하기 카드 (view-4) */}
        <TouchableOpacity
          style={styles.chatCard}
          onPress={() => navigation.navigate('NewChat')}
          activeOpacity={0.9}
        >
          <Text style={styles.chatTitle}>새로운 금융 대화 시작하기</Text>
          <Image
            source={{ uri: 'https://c.animaapp.com/3xV80UqJ/img/3d---------@2x.png' }}
            style={styles.chatImage}
            resizeMode="cover"
          />
          <Text style={styles.chatDescription}>
            금융에 관한 모든 질문은 핀쿠에게 맡기세요! 핀쿠가 자세히 알려드릴게요
          </Text>
          <View style={styles.chatButton}>
            <Image
              source={{ uri: 'https://c.animaapp.com/3xV80UqJ/img/arrow-sm-right-2.svg' }}
              style={styles.chatArrowIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        {/* 최근 대화 섹션 */}
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>최근 대화</Text>
          <Text style={styles.recentViewAll}>전체 보기</Text>
        </View>

        {/* 최근 대화 리스트 (view-5) */}
        <View style={styles.recentList}>
          <TouchableOpacity style={styles.recentItem}>
            <Text style={styles.recentItemText}>청년 월세 지원금 비교</Text>
            <Image
              source={{ uri: 'https://c.animaapp.com/3xV80UqJ/img/more-horiz.svg' }}
              style={styles.recentItemIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.recentItem}>
            <Text style={styles.recentItemText}>신용카드 혜택 비교</Text>
            <Image
              source={{ uri: 'https://c.animaapp.com/3xV80UqJ/img/more-horiz-1.svg' }}
              style={styles.recentItemIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.recentItem}>
            <Text style={styles.recentItemText}>청년도약계좌 요약</Text>
            <Image
              source={{ uri: 'https://c.animaapp.com/3xV80UqJ/img/more-horiz-2.svg' }}
              style={styles.recentItemIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.recentItem}>
            <Text style={styles.recentItemText}>청년도약계좌 요약</Text>
            <Image
              source={{ uri: 'https://c.animaapp.com/3xV80UqJ/img/more-horiz-3.svg' }}
              style={styles.recentItemIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* 하단 여백 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FinQ PASS 팝업 모달 */}
      <Modal
        visible={showPassModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPassModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {/* 닫기 버튼 */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPassModal(false)}
            >
              <Image
                source={{ uri: 'https://c.animaapp.com/lUtVK29m/img/close.svg' }}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* 배경 이미지 */}
            <Image
              source={{ uri: 'https://c.animaapp.com/lUtVK29m/img/image-10@2x.png' }}
              style={styles.modalBackgroundImage}
              resizeMode="cover"
            />

            {/* FinQ PASS 타이틀 */}
            <Text style={styles.modalTitle}>FinQ PASS</Text>

            {/* 설명 텍스트 */}
            <Text style={styles.modalDescription}>
              FinQ PASS 가입하시면 핀쿠가 내 자격을 진단하고, 지원 일정까지
              챙겨드릴게요 🩵
            </Text>

            <Text style={styles.modalSubDescription}>
              커피 한 잔 보다 저렴하게, AI 코칭 받으세요
            </Text>

            {/* 혜택 리스트 */}
            <View style={styles.benefitList}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>AI 자격 진단</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>정책, 제도 신청 일정 리마인드</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>정책 뉴스 및 공고 자동 요약</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>내 상황 맞춤형 지원금 리포트</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>매달 3,900원!</Text>
              </View>
            </View>

            {/* 하단 버튼 */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalJoinButton}>
                <Text style={styles.modalJoinButtonText}>핀큐패스 가입하기</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowPassModal(false)}>
                <Text style={styles.modalLaterText}>다음에 하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 100,
  },

  // 타이틀 바 (view-2) - top: 44px, height: 56px
  titleBar: {
    flexDirection: 'row',
    height: 56,
    width: '100%',
    alignItems: 'center',
    marginTop: theme.layout.statusBarHeight,
  },
  titleImage1: {
    height: 40,
    width: 40,
    marginLeft: 16,
    marginTop: 8,
  },
  titleText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    height: 19,
    letterSpacing: 0,
    marginLeft: 103,
    marginTop: 19,
    width: 41,
  },
  titleImage2: {
    height: 40,
    width: 40,
    marginLeft: 104,
    marginTop: 8,
  },

  // FinQ PASS 카드 (view-3) - left: 16px, top: 112px, width: 328px, height: 144px
  passCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    height: 144,
    marginLeft: 16,
    marginTop: 12,
    width: 328,
    overflow: 'hidden',
  },
  passImage: {
    aspectRatio: 1,
    height: 104,
    width: 104,
    position: 'absolute',
    left: 212,
    top: 40,
  },
  passTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#3060F1',
    letterSpacing: 0,
    position: 'absolute',
    left: 23,
    top: 20,
  },
  passDescription: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '400',
    color: '#878787',
    letterSpacing: 0,
    lineHeight: 14.4,
    position: 'absolute',
    left: 23,
    top: 45,
    width: 207,
  },
  passButton: {
    backgroundColor: '#3060F1',
    borderRadius: 100,
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'absolute',
    left: 20,
    top: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passButtonText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0,
  },

  // 새로운 금융 대화 시작하기 카드 (view-4) - left: 16px, top: 276px, width: 328px, height: 152px
  chatCard: {
    backgroundColor: '#000000',
    borderRadius: 32,
    height: 152,
    marginLeft: 16,
    marginTop: 20,
    width: 328,
    overflow: 'hidden',
  },
  chatTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0,
    lineHeight: 22.4,
    position: 'absolute',
    left: 20,
    top: 20,
  },
  chatImage: {
    aspectRatio: 1,
    height: 128,
    width: 128,
    position: 'absolute',
    left: 154,
    top: 20,
  },
  chatDescription: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '400',
    color: '#B6B6B6',
    letterSpacing: 0,
    lineHeight: 14.4,
    position: 'absolute',
    left: 20,
    top: 51,
    width: 143,
  },
  chatButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    height: 40,
    width: 40,
    position: 'absolute',
    left: 268,
    top: 92,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chatArrowIcon: {
    height: 20,
    width: 20,
  },

  // 최근 대화 헤더 - top: 468px
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 18,
    marginRight: 18,
    marginTop: 40,
  },
  recentTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
  },
  recentViewAll: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '500',
    color: '#9E9E9E',
    letterSpacing: 0,
  },

  // 최근 대화 리스트 (view-5) - left: 16px, top: 505px, width: 328px
  recentList: {
    marginLeft: 16,
    marginTop: 37,
    width: 328,
    gap: 8,
  },
  recentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 52,
    width: '100%',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  recentItemText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#1B1D1F',
    letterSpacing: 0,
  },
  recentItemIcon: {
    aspectRatio: 1,
    height: 24,
    width: 24,
  },

  // 모달 스타일
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 286,
    height: 405,
    overflow: 'hidden',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    left: 242,
    top: 20,
    width: 24,
    height: 24,
    zIndex: 10,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  modalBackgroundImage: {
    aspectRatio: 1.13,
    height: 275,
    width: 286,
    position: 'absolute',
    left: 0,
    top: 40,
  },
  modalTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 20,
    fontWeight: '600',
    color: '#3060F1',
    letterSpacing: 0,
    position: 'absolute',
    left: 94,
    top: 44,
  },
  modalDescription: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#707070',
    letterSpacing: 0,
    lineHeight: 13,
    position: 'absolute',
    left: 23.5,
    top: 95,
    width: 239,
    textAlign: 'center',
  },
  modalSubDescription: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#707070',
    letterSpacing: 0,
    lineHeight: 13,
    position: 'absolute',
    left: 35,
    top: 277,
  },
  benefitList: {
    position: 'absolute',
    left: 52,
    top: 146,
    width: 181,
    gap: 6,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitDot: {
    aspectRatio: 1,
    backgroundColor: '#3060F1',
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  benefitText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    letterSpacing: 0,
    lineHeight: 16.8,
  },
  modalActions: {
    position: 'absolute',
    left: 65.5,
    top: 312,
    width: 155,
    alignItems: 'center',
    gap: 10,
  },
  modalJoinButton: {
    backgroundColor: '#3060F1',
    borderRadius: 100,
    height: 40,
    width: 155,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalJoinButtonText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0,
  },
  modalLaterText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    color: '#767676',
    letterSpacing: 0,
    textAlign: 'center',
  },
});
