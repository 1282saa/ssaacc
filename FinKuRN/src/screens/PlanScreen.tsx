import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from '../components/common/StatusBar';
import { BackgroundGradient } from '../components/common/BackgroundGradient';
import { theme } from '../constants/theme';
import type { AppNavigation } from '../types/navigation';

/**
 * Plan 화면 (할일 관리)
 * Anima 디자인을 React Native로 픽셀-퍼펙트 변환
 */
export const PlanScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

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
          {
            top: 687,
            left: -226,
            opacity: 1,
            colors: [
              'rgba(66, 0, 255, 0.2)',
              'rgba(223, 127, 127, 0.2)',
              'rgba(255, 229, 0, 0.2)',
            ],
          },
          {
            top: 1198,
            left: -285,
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

      {/* 타이틀 바 (view-6) */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>할 일</Text>
        <Image
          source={{ uri: 'https://c.animaapp.com/7tTmI81R/img/------.svg' }}
          style={styles.titleImage}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 진행률 카드 (Frame) - top: 112px */}
        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            이번주 할 일 5개 중 2개를 완료했어요
          </Text>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBar} />
          </View>
          <Text style={styles.progressSubText}>
            이번주 진행률 40%{'\n'}오늘 처리 가능한 일정이 3건 남았어요
          </Text>
        </View>

        {/* 오늘의 할 일 제목 - top: 287px */}
        <Text style={styles.sectionTitle1}>오늘의 할 일</Text>

        {/* 청년 월세 지원 카드 (FrameWrapper) - top: 318px */}
        <View style={styles.taskCard1}>
          <Text style={styles.taskTitle}>청년 월세 지원  D-3</Text>
          <TouchableOpacity style={styles.portalLinkWrapper}>
            <Text style={styles.portalLink}>포털 바로가기</Text>
          </TouchableOpacity>
          <Text style={styles.taskDescription1}>
            소득증빙서류와 임대차계약서를 제출해야 해요
          </Text>
          <Text style={styles.deadline1}>마감일  11월 18일 금요일</Text>

          {/* 체크리스트 */}
          <View style={styles.checklistContainer1}>
            <View style={styles.checklistItem}>
              <Text style={styles.checklistText}>
                주민등록등본 (최근 1개월 이내 발급)
              </Text>
              <Image
                source={{
                  uri: 'https://c.animaapp.com/7tTmI81R/img/group-1707481581@2x.png',
                }}
                style={styles.checkIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.checklistText}>임대차계약서 사본</Text>
              <Image
                source={{
                  uri: 'https://c.animaapp.com/7tTmI81R/img/group-1707481581-4@2x.png',
                }}
                style={styles.checkIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.checklistText}>
                급여명세서 또는 소득금액증명원
              </Text>
              <Image
                source={{
                  uri: 'https://c.animaapp.com/7tTmI81R/img/group-1707481581-4@2x.png',
                }}
                style={styles.checkIcon}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* 청년도약계좌 카드 (DivWrapper) - top: 564px */}
        <View style={styles.taskCard2}>
          <Text style={styles.taskTitle}>청년도약계좌  D-4</Text>
          <TouchableOpacity style={styles.portalLinkWrapper}>
            <Text style={styles.portalLink}>포털 바로가기</Text>
          </TouchableOpacity>
          <Text style={styles.taskDescription2}>
            신청서 초안 확인 및 은행 방문을 예약해야 해요{'\n'}
            아래 준비물을 챙겨가세요
          </Text>
          <Text style={styles.deadline2}>마감일  11월 18일 금요일</Text>

          {/* 체크리스트 */}
          <View style={styles.checklistContainer2}>
            <View style={styles.checklistItem}>
              <Text style={styles.checklistText}>신분증</Text>
              <Image
                source={{
                  uri: 'https://c.animaapp.com/7tTmI81R/img/group-1707481581-4@2x.png',
                }}
                style={styles.checkIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.checklistText}>본인 명의 통장</Text>
              <Image
                source={{
                  uri: 'https://c.animaapp.com/7tTmI81R/img/group-1707481581-4@2x.png',
                }}
                style={styles.checkIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.checklistText}>
                최근 급여 입금 내역 (3개월)
              </Text>
              <Image
                source={{
                  uri: 'https://c.animaapp.com/7tTmI81R/img/group-1707481581-4@2x.png',
                }}
                style={styles.checkIcon}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* 다가오는 일정 제목 - top: 846px */}
        <Text style={styles.sectionTitle2}>다가오는 일정</Text>

        {/* 다가오는 일정 리스트 (Div) - top: 877px */}
        <View style={styles.scheduleContainer}>
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleLeft}>
              <View style={styles.scheduleIconWrapper}>
                <View style={styles.scheduleIcon} />
                <Text style={styles.scheduleCategory}>근로장려금</Text>
              </View>
              <Text style={styles.scheduleTask}>홈택스 서류 제출</Text>
            </View>
            <Text style={styles.scheduleDday}>D-17</Text>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleLeft}>
              <View style={styles.scheduleIconWrapper}>
                <View style={styles.scheduleIcon} />
                <Text style={styles.scheduleCategory}>취업성공패키지</Text>
              </View>
              <Text style={styles.scheduleTask}>상담 예약</Text>
            </View>
            <Text style={styles.scheduleDday}>D-21</Text>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleLeft}>
              <View style={styles.scheduleIconWrapper}>
                <View style={styles.scheduleIcon} />
                <Text style={styles.scheduleCategory}>취업성공패키지</Text>
              </View>
              <Text style={styles.scheduleTask}>상담 예약</Text>
            </View>
            <Text style={styles.scheduleDday}>D-21</Text>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleLeft}>
              <View style={styles.scheduleIconWrapper}>
                <View style={styles.scheduleIcon} />
                <Text style={styles.scheduleCategory}>취업성공패키지</Text>
              </View>
              <Text style={styles.scheduleTask}>상담 예약</Text>
            </View>
            <Text style={styles.scheduleDday}>D-21</Text>
          </View>
        </View>

        {/* 정책별 진행 현황 제목 - top: 1055px */}
        <Text style={styles.sectionTitle3}>정책별 진행 현황 확인하기</Text>

        {/* 정책 카드 그리드 (View) - top: 1094px */}
        <View style={styles.policyGrid}>
          {/* Row 1 */}
          <TouchableOpacity style={styles.policyCard}>
            <Text style={styles.policyTitle}>청년내일로 교통패스</Text>
            <View style={styles.policyStatus}>
              <View style={styles.statusDotYellow} />
              <Text style={styles.statusText}>진행 중 (2/3 완료)</Text>
            </View>
            <View style={styles.arrowButton}>
              <Image
                source={{
                  uri: 'https://c.animaapp.com/7tTmI81R/img/arrow-sm-right-4.svg',
                }}
                style={styles.arrowIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.policyDday}>D-1</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.policyCard, styles.policyCard2]}>
            <Text style={styles.policyTitle2}>청년전세보증금 반환보증 지원</Text>
            <View style={styles.policyStatus2}>
              <View style={styles.statusDotYellow} />
              <Text style={styles.statusText}>진행 중 (3/4 완료)</Text>
            </View>
            <View style={styles.arrowButton}>
              <Image
                source={{
                  uri: 'https://c.animaapp.com/7tTmI81R/img/arrow-sm-right-4.svg',
                }}
                style={styles.arrowIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.policyDday}>D-2</Text>
          </TouchableOpacity>

          {/* Row 2 */}
          <TouchableOpacity style={styles.policyCard}>
            <Text style={styles.policyTitle}>서울청년수당</Text>
            <View style={styles.policyStatus}>
              <View style={styles.statusDotBlue} />
              <Text style={styles.statusText}>지원 완료</Text>
            </View>
            <View style={styles.arrowButton}>
              <Image
                source={{
                  uri: 'https://c.animaapp.com/7tTmI81R/img/arrow-sm-right-4.svg',
                }}
                style={styles.arrowIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.policyDday}>결과 발표 대기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.policyCard, styles.policyCard2]}>
            <Text style={styles.policyTitle2}>국민취업지원제도</Text>
            <View style={styles.policyStatus2}>
              <View style={styles.statusDotBlue} />
              <Text style={styles.statusText}>지원 완료</Text>
            </View>
            <View style={styles.arrowButton}>
              <Image
                source={{
                  uri: 'https://c.animaapp.com/7tTmI81R/img/arrow-sm-right-4.svg',
                }}
                style={styles.arrowIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.policyDday}>심사 중</Text>
          </TouchableOpacity>
        </View>

        {/* 하단 여백 */}
        <View style={{ height: 100 }} />
      </ScrollView>
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

  // 타이틀 바 (view-6) - height: 56px
  titleBar: {
    flexDirection: 'row',
    gap: 108,
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.layout.statusBarHeight,
  },
  titleText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    height: 19,
    letterSpacing: 0,
    marginLeft: 164,
    marginTop: 18,
    width: 32,
  },
  titleImage: {
    height: 40,
    width: 40,
    marginTop: 8,
  },

  // 진행률 카드 (Frame) - left: 16px, width: 328px, height: 135px
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    height: 135,
    marginLeft: 16,
    marginTop: 12,
    width: 328,
    overflow: 'hidden',
    paddingLeft: 20,
    paddingTop: 20,
  },
  progressText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    height: 19,
    letterSpacing: 0,
    width: 236,
  },
  progressBarWrapper: {
    backgroundColor: '#F1F3F5',
    borderRadius: 100,
    marginTop: 20,
    width: 288,
    overflow: 'hidden',
  },
  progressBar: {
    backgroundColor: '#3060F1',
    borderRadius: 100,
    height: 12,
    width: 115,
  },
  progressSubText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    color: '#767676',
    height: 34,
    letterSpacing: 0,
    marginTop: 10,
    width: 208,
  },

  // 섹션 타이틀 1 - top: 287px
  sectionTitle1: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    marginLeft: 18,
    marginTop: 40,
  },

  // 할일 카드 1 (FrameWrapper) - left: 16px, top: 318px, width: 328px, height: 226px
  taskCard1: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 226,
    marginLeft: 16,
    marginTop: 31,
    width: 328,
  },
  taskTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 20,
    fontWeight: '600',
    color: '#3060F1',
    letterSpacing: 0,
    marginLeft: 20,
    marginTop: 20,
  },
  portalLinkWrapper: {
    position: 'absolute',
    left: 237,
    top: 20,
  },
  portalLink: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '400',
    color: '#3060F1',
    letterSpacing: 0,
  },
  taskDescription1: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#767676',
    letterSpacing: 0,
    marginLeft: 20,
    marginTop: 10,
  },
  deadline1: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#A0A0A0',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    top: 190,
  },
  checklistContainer1: {
    position: 'absolute',
    left: 20,
    top: 86,
    width: 288,
    gap: 12,
  },

  // 할일 카드 2 (DivWrapper) - left: 16px, top: 564px, width: 328px, height: 242px
  taskCard2: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 242,
    marginLeft: 16,
    marginTop: 20,
    width: 328,
  },
  taskDescription2: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#767676',
    letterSpacing: 0,
    marginLeft: 20,
    marginTop: 10,
  },
  deadline2: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#A0A0A0',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    top: 206,
  },
  checklistContainer2: {
    position: 'absolute',
    left: 20,
    top: 102,
    width: 288,
    gap: 12,
  },

  // 체크리스트 공통
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  checklistText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    flex: 1,
  },
  checkIcon: {
    width: 20,
    height: 20,
  },

  // 섹션 타이틀 2 - top: 846px
  sectionTitle2: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    marginLeft: 18,
    marginTop: 40,
  },

  // 다가오는 일정 (Div) - left: 16px, top: 877px, width: 326px
  scheduleContainer: {
    marginLeft: 16,
    marginTop: 31,
    width: 326,
    gap: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  scheduleLeft: {
    flexDirection: 'column',
    flex: 1,
  },
  scheduleIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  scheduleIcon: {
    backgroundColor: '#A9BFF3',
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  scheduleCategory: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#3060F1',
    letterSpacing: 0,
    lineHeight: 22.4,
  },
  scheduleTask: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    color: '#767676',
    letterSpacing: 0,
    lineHeight: 19.6,
    marginTop: 8,
  },
  scheduleDday: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    color: '#A0A0A0',
    letterSpacing: 0,
    lineHeight: 19.6,
  },

  // 섹션 타이틀 3 - top: 1055px
  sectionTitle3: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    marginLeft: 18,
    marginTop: 100,
  },

  // 정책 카드 그리드 (View) - left: 16px, top: 1094px, width: 328px
  policyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 16,
    marginTop: 39,
    width: 328,
    gap: 12,
    rowGap: 11,
  },
  policyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 124,
    width: 159,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  policyCard2: {
    width: 157,
  },
  policyTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    top: 20,
  },
  policyTitle2: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    top: 20,
    width: 119,
  },
  policyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    left: 20,
    top: 51,
  },
  policyStatus2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    left: 20,
    top: 58,
  },
  statusDotYellow: {
    backgroundColor: '#FFE812',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusDotBlue: {
    backgroundColor: '#3060F1',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: '#767676',
    letterSpacing: 0,
  },
  arrowButton: {
    backgroundColor: '#000000',
    borderRadius: 100,
    height: 32,
    width: 32,
    position: 'absolute',
    left: 115,
    top: 80,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  arrowIcon: {
    height: 20,
    width: 20,
  },
  policyDday: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: '#A0A0A0',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    top: 88,
  },
});
