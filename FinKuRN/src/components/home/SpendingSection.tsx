/**
 * 소비 현황 섹션 컴포넌트 (Spending Section Component)
 *
 * 필터링 기능과 함께 소비 현황 개요를 표시하는 섹션입니다.
 * 카테고리별 분석과 필터 칩이 포함된 소비 카드를 보여줍니다.
 *
 * @module Components/Home/SpendingSection
 * @category UI/Components/Home
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { SpendingSection } from './components/home/SpendingSection';
 *
 * <SpendingSection spendingFilters={['오늘', '이번 주', '이번 달']} />
 * ```
 *
 * @description
 * 주요 기능:
 * - 소비 현황 토글 (Spending Status Toggle) - 섹션 표시/숨김
 * - 필터 칩 통합 (Filter Chips Integration)
 * - 소비 정보 표시 (Spending Information Display)
 *   - 오늘 소비량 (Today's Spending Amount)
 *   - 가장 많이 쓴 항목 (Top Spending Category)
 * - 소비 패턴 분석 (Spending Pattern Analysis)
 *
 * @state
 * - spendingVisible: boolean - 소비 현황 표시 여부
 * - selectedSpendingFilter: string | null - 선택된 필터 (기본값: "오늘")
 *
 * @features
 * - 카드 기반 레이아웃 (Card-based Layout)
 * - 정보 행 구조 (Info Row Structure) - 레이블 | 구분선 | 값
 * - Pretendard Variable 폰트 (Pretendard Variable Font)
 * - 흰색 배경 카드 (White Background Card)
 * - 이모지 지원 (Emoji Support) - 카테고리 표시용
 *
 * @styling
 * - cardHeight: 138px
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
 * 소비 섹션 컴포넌트 Props (Spending Section Component Props)
 *
 * @interface SpendingSectionProps
 * @property {string[]} spendingFilters - 소비 필터 옵션 배열 (Array of Filter Options for Spending)
 */
interface SpendingSectionProps {
  /**
   * 소비 필터 옵션 배열 (Array of Filter Options for Spending)
   *
   * @example ['오늘', '이번 주', '이번 달']
   */
  spendingFilters: string[];
}

export const SpendingSection: React.FC<SpendingSectionProps> = ({
  spendingFilters,
}) => {
  const [spendingVisible, setSpendingVisible] = useState(true);
  const [selectedSpendingFilter, setSelectedSpendingFilter] = useState<
    string | null
  >("오늘");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>나의 소비 현황</Text>
        <TouchableOpacity
          onPress={() => setSpendingVisible(!spendingVisible)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>
            소비 현황 숨기기
          </Text>
        </TouchableOpacity>
      </View>

      {spendingVisible && (
        <>
          <FilterChips
            filters={spendingFilters}
            selectedFilter={selectedSpendingFilter}
            onFilterPress={setSelectedSpendingFilter}
            scrollable={false}
          />

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Text style={styles.infoLabel}>오늘 소비량</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.infoValue}>33,000원</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Text style={styles.infoLabel}>가장 많이 쓴 항목</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.infoValue}>식비  🍱</Text>
            </View>

            <Text style={styles.description}>
              최근 3일 중 오늘 오전 소비가 가장 활발했어요
            </Text>
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
    backgroundColor: theme.colors.white,
    borderRadius: 32,
    padding: 20,
    marginHorizontal: 16,
    height: 138,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 11,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#e5e7eb',
  },
  infoLabel: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.textPrimary,
  },
  infoValue: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  description: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.textSecondary,
    marginTop: 30,
  },
});
