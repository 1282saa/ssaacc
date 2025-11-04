/**
 * 저축 현황 섹션 컴포넌트 (Savings Section Component)
 *
 * 필터링 기능과 함께 저축 현황 개요를 표시하는 섹션입니다.
 * 차트 시각화와 필터 칩이 포함된 저축 카드를 보여줍니다.
 *
 * @module Components/Home/SavingsSection
 * @category UI/Components/Home
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { SavingsSection } from './components/home/SavingsSection';
 *
 * <SavingsSection savingsFilters={['전체', '내 집 마련 적금', '여름 여행', '비상금']} />
 * ```
 *
 * @description
 * 주요 기능:
 * - 저축 현황 토글 (Savings Status Toggle) - 섹션 표시/숨김
 * - 필터 칩 통합 (Filter Chips Integration)
 * - 막대 차트 시각화 (Bar Chart Visualization)
 *   - 내 집 마련 적금: 24% (12,340,000원)
 *   - 비상금: 63% (630,000원)
 *   - 여름 여행 적금: 100% (2,000,000원)
 * - 월 저축 금액 표시 (Monthly Savings Amount Display)
 * - 목표 달성률 표시 (Goal Achievement Rate Display)
 *
 * @state
 * - savingsVisible: boolean - 저축 현황 표시 여부
 * - selectedSavingsFilter: string | null - 선택된 필터 (기본값: "전체")
 *
 * @features
 * - 카드 기반 레이아웃 (Card-based Layout)
 * - 3개 막대 차트 (3-bar Chart) - 각기 다른 높이와 색상
 * - Pretendard Variable 폰트 (Pretendard Variable Font)
 * - 파란색 배경 카드 (#a9bff3)
 *
 * @styling
 * - cardHeight: 311px
 * - borderRadius: 32px
 * - gap: 18px
 *
 * @see {@link FilterChips}
 * @see {@link HomeScreen}
 */
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../../constants/theme";
import { FilterChips } from "./FilterChips";

/**
 * 저축 섹션 컴포넌트 Props (Savings Section Component Props)
 *
 * @interface SavingsSectionProps
 * @property {string[]} savingsFilters - 저축 필터 옵션 배열 (Array of Filter Options for Savings)
 */
interface SavingsSectionProps {
  /**
   * 저축 필터 옵션 배열 (Array of Filter Options for Savings)
   *
   * @example ['전체', '내 집 마련 적금', '여름 여행', '비상금']
   */
  savingsFilters: string[];
}

export const SavingsSection: React.FC<SavingsSectionProps> = ({
  savingsFilters,
}) => {
  const [savingsVisible, setSavingsVisible] = useState(true);
  const [selectedSavingsFilter, setSelectedSavingsFilter] = useState<
    string | null
  >("전체");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>나의 저축 현황</Text>
        <TouchableOpacity
          onPress={() => setSavingsVisible(!savingsVisible)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>
            저축 현황 숨기기
          </Text>
        </TouchableOpacity>
      </View>

      {savingsVisible && (
        <>
          <FilterChips
            filters={savingsFilters}
            selectedFilter={selectedSavingsFilter}
            onFilterPress={setSelectedSavingsFilter}
            scrollable={false}
          />

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.cardTitle}>좋아요 은별님!</Text>
                <Text style={styles.cardSubtitle}>이번 달 목표치의 72% 달성했어요</Text>
                <View style={styles.savingsInfo}>
                  <Text style={styles.savingsInfoLabel}>이번 달 저축 금액은</Text>
                  <Text style={styles.savingsInfoAmount}>870,000원</Text>
                  <Text style={styles.savingsInfoLabel}>이에요</Text>
                </View>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <View style={styles.savingsBar}>
                <Text style={styles.percentageText}>24%</Text>
                <View style={[styles.bar, { height: 40, backgroundColor: '#ffffffcc' }]} />
                <Text style={styles.amountText}>12,340,000원</Text>
                <Text style={styles.labelText}>내 집 마련 적금</Text>
              </View>
              <View style={styles.savingsBar}>
                <Text style={styles.percentageText}>63%</Text>
                <View style={[styles.bar, { height: 60, backgroundColor: '#ffffffcc' }]} />
                <Text style={styles.amountText}>630,000원</Text>
                <Text style={styles.labelText}>비상금</Text>
              </View>
              <View style={styles.savingsBar}>
                <Text style={[styles.percentageText, { color: '#3060f1' }]}>100%</Text>
                <View style={[styles.bar, { height: 98, backgroundColor: '#3060f1' }]} />
                <Text style={styles.amountText}>2,000,000원</Text>
                <Text style={styles.labelText}>여름 여행 적금</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 18,
    marginTop: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  headerText: {
    ...theme.typography.heading3,
    color: theme.colors.textPrimary,
  },
  toggleButton: {
    position: "absolute",
    right: 18,
  },
  toggleText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  card: {
    backgroundColor: '#a9bff3',
    borderRadius: 32,
    padding: 20,
    marginHorizontal: 16,
    height: 311,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardHeaderLeft: {
    gap: 16,
  },
  cardTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.white,
  },
  cardSubtitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.white,
  },
  savingsInfo: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  savingsInfoLabel: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.white,
  },
  savingsInfoAmount: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 37,
    gap: 24,
    marginTop: 20,
  },
  savingsBar: {
    alignItems: "center",
    gap: 8,
  },
  percentageText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.white,
  },
  bar: {
    width: 60,
    borderRadius: 16,
  },
  amountText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.white,
  },
  labelText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 10,
    fontWeight: '400',
    color: theme.colors.white,
    textAlign: "center",
  },
});
