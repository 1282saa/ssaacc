import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../../constants/theme";
import { FilterChips } from "./FilterChips";

/**
 * SavingsSection Component
 *
 * Displays the savings overview section with filtering capabilities.
 * Shows savings card with chart visualization and filter chips.
 *
 * @param savingsFilters - Array of filter options for savings
 *
 * @example
 * ```tsx
 * <SavingsSection savingsFilters={['전체', '내 집 마련 적금', '여름 여행', '비상금']} />
 * ```
 */
interface SavingsSectionProps {
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
