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
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.mainCardTitle}>
                서울시 청년 월세 지원 제도
              </Text>
              <View style={styles.cardMeta}>
                <Text style={styles.metaText}>핀쿠 추천 제도</Text>
                <Image
                  source={{ uri: 'https://c.animaapp.com/FbLlYdc1/img/line-24.svg' }}
                  style={styles.divider}
                />
                <Text style={styles.metaText}>신청 기간  <Text style={styles.dDayText}>D-11</Text></Text>
              </View>
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>지원 금액</Text>
              <Text style={styles.value}>월 20만 원 (최대 12개월)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>신청</Text>
              <Text style={styles.value}>서울주거포털</Text>
              <Text style={styles.link}>바로가기</Text>
            </View>
          </View>

          <Text style={styles.statistics}>
            지난달 기준으로 20~30대 청년의 64%가{'\n'}
            이 혜택을 통해 월세 부담을 줄였어요.
          </Text>

          <Image
            source={{ uri: 'https://c.animaapp.com/FbLlYdc1/img/image-8@2x.png' }}
            style={styles.cardImage}
          />
          <View style={styles.imageShadow} />

          <TouchableOpacity style={styles.arrowButton}>
            <ArrowIcon color="#fff" size={20} />
          </TouchableOpacity>
        </View>

        {/* 페이지 인디케이터 */}
        <View style={styles.pageIndicator}>
          <View style={[styles.dot, styles.activeDot]} />
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
        </ScrollView>

        {/* 지금 핀쿠가 주목하는 금융 소식 */}
        <Text style={styles.sectionTitle}>
          지금 핀쿠가 주목하는 금융 소식
        </Text>

        <View style={styles.newsCard}>
          <View style={styles.newsContent}>
            <Text style={styles.newsTitle}>금융 소식 제목</Text>
            <Text style={styles.newsDescription}>금융 소식 설명</Text>
          </View>
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
    left: theme.spacing.lg,
    right: theme.spacing.lg,
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
    fontFamily: 'Pretendard_Variable-Medium',
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
    width: width - 32,
    height: 283,
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: 36,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  cardHeader: {
    marginBottom: theme.spacing.xl,
  },
  cardTitleContainer: {
    gap: theme.spacing.sm,
  },
  mainCardTitle: {
    ...theme.typography.heading2,
    color: theme.colors.textPrimary,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  metaText: {
    ...theme.typography.body1,
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
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  label: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    width: 60,
  },
  value: {
    ...theme.typography.body1,
    color: '#111',
  },
  link: {
    ...theme.typography.body3,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  statistics: {
    ...theme.typography.body3,
    color: theme.colors.textSecondary,
  },
  cardImage: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 103,
    height: 103,
  },
  imageShadow: {
    position: 'absolute',
    bottom: 6,
    left: 32,
    width: 51,
    height: 5,
    backgroundColor: theme.colors.textPlaceholder,
    borderRadius: 25.5,
  },
  arrowButton: {
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
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: theme.spacing.xxl,
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
    ...theme.typography.heading3,
    color: theme.colors.textPrimary,
    paddingHorizontal: 18,
    marginBottom: theme.spacing.lg,
  },
  quickAccessCard: {
    width: width - 32,
    height: 60,
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxxl,
  },
  quickAccessText: {
    ...theme.typography.heading3,
    color: theme.colors.textPrimary,
  },
  quickAccessLink: {
    ...theme.typography.body2,
    fontWeight: '400',
    color: theme.colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: theme.spacing.lg,
  },
  viewAll: {
    ...theme.typography.body3,
    fontWeight: '500',
    color: theme.colors.textTertiary,
  },
  horizontalScroll: {
    paddingLeft: theme.spacing.lg,
    marginBottom: theme.spacing.xxxl,
  },
  benefitCard: {
    width: 157,
    height: 152,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxxl,
    marginRight: theme.spacing.md,
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
  newsCard: {
    width: width - 32,
    height: 180,
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.xxxl,
  },
  newsContent: {
    padding: theme.spacing.xl,
  },
  newsTitle: {
    ...theme.typography.heading3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  newsDescription: {
    ...theme.typography.body2,
    fontWeight: '400',
    color: '#666',
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
