import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ArrowIcon } from '../components/ArrowIcon';
import { StatusBar } from '../components/common/StatusBar';
import { BackgroundGradient } from '../components/common/BackgroundGradient';
import { EXPLORE_GRADIENTS } from '../constants/gradients';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

/**
 * ExploreScreen Component
 *
 * The main explore/discover screen that displays various government benefits,
 * support programs, and financial policies available to users.
 *
 * Features:
 * - Search bar for finding policies and support programs
 * - Featured policy card with recommendations (Seoul Youth Rent Support)
 * - Quick access shortcuts to personalized benefits
 * - Youth support benefits section with horizontal scroll
 * - Financial benefits section
 * - Latest financial news from FinKu
 * - Page indicators for featured content carousel
 *
 * This screen uses the EXPLORE_GRADIENTS for consistent background styling
 * and the StatusBar component for the top system UI.
 *
 * @component
 * @example
 * ```tsx
 * <ExploreScreen />
 * ```
 */
export const ExploreScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Background gradient layers */}
      <BackgroundGradient layers={EXPLORE_GRADIENTS} />

      {/* Status bar */}
      <StatusBar />

      {/* 검색바와 햄버거 메뉴 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image
            source={{ uri: 'https://c.animaapp.com/FbLlYdc1/img/search.svg' }}
            style={styles.searchIcon}
            resizeMode="contain"
          />
          <Text style={styles.searchPlaceholder}>
            정책, 지원금 제도 검색하기
          </Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Image
            source={{ uri: 'https://c.animaapp.com/FbLlYdc1/img/------.svg' }}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 메인 카드 - 서울시 청년 월세 지원 제도 */}
        <View style={styles.mainCard}>
          <View style={styles.cardInfoContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.mainCardTitle}>
                서울시 청년 월세 지원 제도
              </Text>
              <View style={styles.cardMeta}>
                <Text style={styles.metaText}>핀쿠 추천 제도</Text>
                <Image
                  source={{ uri: 'https://c.animaapp.com/tLwWBHTg/img/line-24.svg' }}
                  style={styles.divider}
                />
                <Text style={styles.metaText}>
                  신청 기간  <Text style={styles.dDayText}>D-11</Text>
                </Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>지원 금액</Text>
                <Text style={styles.value}>월 20만 원 (최대 12개월)</Text>
              </View>
              <View style={[styles.infoRow, { gap: 8 }]}>
                <View style={styles.applicationRow}>
                  <Text style={styles.label}>신청</Text>
                  <Text style={styles.value}>서울주거포털</Text>
                </View>
                <Text style={styles.link}>바로가기</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardImageContainer}>
            <View style={styles.imageShadow} />
            <Image
              source={{ uri: 'https://c.animaapp.com/tLwWBHTg/img/image-8@2x.png' }}
              style={styles.cardImage}
            />
          </View>

          <Text style={styles.statistics}>
            지난달 기준으로 20~30대 청년의 64%가{'\n'}
            이 혜택을 통해 월세 부담을 줄였어요.
          </Text>

          <TouchableOpacity style={styles.arrowButton}>
            <ArrowIcon color="#fff" size={20} />
          </TouchableOpacity>
        </View>

        {/* 페이지 인디케이터 */}
        <View style={styles.pageIndicator}>
          <View style={styles.activeDot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* 내 조건에 딱 맞는 지원 섹션 */}
        <Text style={styles.sectionTitle}>내 조건에 딱 맞는 지원</Text>

        <View style={styles.quickAccessCard}>
          <Text style={styles.quickAccessText}>🏠  청년 월세 지원</Text>
          <Text style={styles.quickAccessLink}>자세히 보기</Text>
        </View>

        <View style={styles.quickAccessCard}>
          <Text style={styles.quickAccessText}>💵  청년도약계좌</Text>
          <Text style={styles.quickAccessLink}>자세히 보기</Text>
        </View>

        <View style={styles.quickAccessCard}>
          <Text style={styles.quickAccessText}>📱 통신비 절감 지원</Text>
          <Text style={styles.quickAccessLink}>자세히 보기</Text>
        </View>

        {/* 청년 지원 혜택 섹션 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>청년 지원 혜택</Text>
          <Text style={styles.viewAll}>전체 보기</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          <View style={styles.benefitCard}>
            <TouchableOpacity style={styles.benefitArrowButton}>
              <ArrowIcon color="#fff" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.benefitCard}>
            <TouchableOpacity style={styles.benefitArrowButton}>
              <ArrowIcon color="#fff" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.benefitCard}>
            <TouchableOpacity style={styles.benefitArrowButton}>
              <ArrowIcon color="#fff" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.benefitCard}>
            <TouchableOpacity style={styles.benefitArrowButton}>
              <ArrowIcon color="#fff" size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 금융 혜택 섹션 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>금융 혜택</Text>
          <Text style={styles.viewAll}>전체 보기</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          <View style={styles.benefitCard}>
            <TouchableOpacity style={styles.benefitArrowButton}>
              <ArrowIcon color="#fff" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.benefitCard}>
            <TouchableOpacity style={styles.benefitArrowButton}>
              <ArrowIcon color="#fff" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.benefitCard}>
            <TouchableOpacity style={styles.benefitArrowButton}>
              <ArrowIcon color="#fff" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.benefitCard}>
            <TouchableOpacity style={styles.benefitArrowButton}>
              <ArrowIcon color="#fff" size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 지금 핀쿠가 주목하는 금융 소식 */}
        <Text style={styles.sectionTitle}>
          지금 핀쿠가 주목하는 금융 소식
        </Text>

        {/* 뉴스 기사 1 */}
        <View style={styles.newsArticle}>
          <View style={styles.newsContent}>
            <Text style={styles.newsDate}>2025년 10월 19일 금요일</Text>
            <Text style={styles.newsTitle}>
              예금 금리 인하, 왜 다시 시작됐을까?
            </Text>
            <Text style={styles.newsDescription}>
              최근 기준금리 인하로 시중은행의 예금 금리가 3% 이하로 떨어졌어요. 고금리 적금을 유지 중이라면 자동 만기 이후 재가입 시 금리가 더 낮아질 수 있어요.
            </Text>
            <View style={styles.newsStats}>
              <View style={styles.statItem}>
                <Image
                  source={{ uri: 'https://c.animaapp.com/tLwWBHTg/img/icon-eye-3.svg' }}
                  style={styles.statIcon}
                />
                <Text style={styles.statText}>12,908</Text>
              </View>
              <View style={styles.statItem}>
                <Image
                  source={{ uri: 'https://c.animaapp.com/tLwWBHTg/img/icon-emoji-happy-3.svg' }}
                  style={styles.statIcon}
                />
                <Text style={[styles.statText, styles.statLabel]}>유용해요</Text>
                <Text style={styles.statText}>362</Text>
              </View>
            </View>
          </View>
          <View style={styles.newsImagePlaceholder} />
        </View>

        <View style={styles.newsSeparator} />

        {/* 뉴스 기사 2 */}
        <View style={styles.newsArticle}>
          <View style={styles.newsContent}>
            <Text style={styles.newsDate}>2025년 10월 19일 금요일</Text>
            <Text style={styles.newsTitle}>
              예금 금리 인하, 왜 다시 시작됐을까?
            </Text>
            <Text style={styles.newsDescription}>
              최근 기준금리 인하로 시중은행의 예금 금리가 3% 이하로 떨어졌어요. 고금리 적금을 유지 중이라면 자동 만기 이후 재가입 시 금리가 더 낮아질 수 있어요.
            </Text>
            <View style={styles.newsStats}>
              <View style={styles.statItem}>
                <Image
                  source={{ uri: 'https://c.animaapp.com/tLwWBHTg/img/icon-eye-3.svg' }}
                  style={styles.statIcon}
                />
                <Text style={styles.statText}>12,908</Text>
              </View>
              <View style={styles.statItem}>
                <Image
                  source={{ uri: 'https://c.animaapp.com/tLwWBHTg/img/icon-emoji-happy-3.svg' }}
                  style={styles.statIcon}
                />
                <Text style={[styles.statText, styles.statLabel]}>유용해요</Text>
                <Text style={styles.statText}>362</Text>
              </View>
            </View>
          </View>
          <View style={styles.newsImagePlaceholder} />
        </View>

        <View style={styles.newsSeparator} />

        {/* 뉴스 기사 3 */}
        <View style={styles.newsArticle}>
          <View style={styles.newsContent}>
            <Text style={styles.newsDate}>2025년 10월 19일 금요일</Text>
            <Text style={styles.newsTitle}>
              예금 금리 인하, 왜 다시 시작됐을까?
            </Text>
            <Text style={styles.newsDescription}>
              최근 기준금리 인하로 시중은행의 예금 금리가 3% 이하로 떨어졌어요. 고금리 적금을 유지 중이라면 자동 만기 이후 재가입 시 금리가 더 낮아질 수 있어요.
            </Text>
            <View style={styles.newsStats}>
              <View style={styles.statItem}>
                <Image
                  source={{ uri: 'https://c.animaapp.com/tLwWBHTg/img/icon-eye-3.svg' }}
                  style={styles.statIcon}
                />
                <Text style={styles.statText}>12,908</Text>
              </View>
              <View style={styles.statItem}>
                <Image
                  source={{ uri: 'https://c.animaapp.com/tLwWBHTg/img/icon-emoji-happy-3.svg' }}
                  style={styles.statIcon}
                />
                <Text style={[styles.statText, styles.statLabel]}>유용해요</Text>
                <Text style={styles.statText}>362</Text>
              </View>
            </View>
          </View>
          <View style={styles.newsImagePlaceholder} />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* 하단 네비게이션 인디케이터 */}
      <View style={styles.bottomIndicator}>
        <View style={styles.indicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    position: 'absolute',
    top: 64,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    zIndex: theme.zIndex.header,
  },
  searchBar: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  searchIcon: {
    width: 28,
    height: 28,
  },
  searchPlaceholder: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '500',
    fontSize: 13,
    color: theme.colors.textPlaceholder,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  menuIcon: {
    width: 40,
    height: 40,
  },
  scrollView: {
    flex: 1,
    marginTop: 124,
  },
  mainCard: {
    height: 283,
    marginHorizontal: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 36,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  cardInfoContainer: {
    position: 'absolute',
    top: 32,
    left: 33,
    width: 210,
    flexDirection: 'column',
    gap: 21,
  },
  cardHeader: {
    flexDirection: 'column',
    gap: 8,
  },
  mainCardTitle: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '600',
    fontSize: 20,
    color: theme.colors.textPrimary,
    marginBottom: 8,
    marginTop: -1,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  metaText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '500',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  dDayText: {
    color: theme.colors.primary,
  },
  divider: {
    width: 1,
    height: 14,
  },
  cardContent: {
    flexDirection: 'column',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  applicationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 143,
  },
  label: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '500',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  value: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '500',
    fontSize: 14,
    color: '#111111',
  },
  link: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '400',
    fontSize: 12,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  statistics: {
    position: 'absolute',
    top: 169,
    left: 98,
    width: 198,
    fontFamily: 'Pretendard Variable',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.8,
    color: theme.colors.textSecondary,
  },
  cardImageContainer: {
    position: 'absolute',
    top: 164,
    left: 6,
    width: 103,
    height: 103,
  },
  imageShadow: {
    position: 'absolute',
    top: 95,
    left: 26,
    width: 51,
    height: 5,
    backgroundColor: '#d9d9d9',
    borderRadius: 25.5,
    opacity: 0.5,
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 103,
    height: 103,
  },
  arrowButton: {
    position: 'absolute',
    top: 219,
    left: 264,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 26,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textTertiary,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  sectionTitle: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.textPrimary,
    paddingHorizontal: 18,
    marginBottom: theme.spacing.lg,
  },
  quickAccessCard: {
    height: 60,
    marginHorizontal: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: 16,
  },
  quickAccessText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  quickAccessLink: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '400',
    fontSize: 13,
    color: theme.colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: theme.spacing.lg,
    marginTop: 40,
  },
  viewAll: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '500',
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  horizontalScroll: {
    paddingLeft: 16,
    marginBottom: 40,
  },
  benefitCard: {
    width: 157,
    height: 152,
    backgroundColor: theme.colors.white,
    borderRadius: 32,
    marginRight: 12,
    overflow: 'hidden',
  },
  benefitArrowButton: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsArticle: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  newsContent: {
    flex: 1,
    width: 202,
    gap: 8,
  },
  newsDate: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '400',
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  newsTitle: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '500',
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  newsDescription: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '300',
    fontSize: 10,
    lineHeight: 14,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  newsStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 23,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    width: 14,
    height: 14,
  },
  statText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '400',
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  statLabel: {
    fontWeight: '600',
  },
  newsImagePlaceholder: {
    width: 110,
    height: 110,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
  },
  newsSeparator: {
    height: 1,
    marginHorizontal: 16,
    backgroundColor: '#E9E9E9',
    marginBottom: 16,
  },
  bottomIndicator: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    left: 0,
    right: 0,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 134,
    height: 5,
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.full,
  },
});
