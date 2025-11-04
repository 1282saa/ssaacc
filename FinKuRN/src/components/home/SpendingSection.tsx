import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../../constants/theme";
import { FilterChips } from "./FilterChips";

/**
 * SpendingSection Component
 *
 * Displays the spending overview section with filtering capabilities.
 * Shows spending card with category breakdown and filter chips.
 *
 * @param spendingFilters - Array of filter options for spending
 *
 * @example
 * ```tsx
 * <SpendingSection spendingFilters={['전체', '고정 지출', '변동 지출']} />
 * ```
 */
interface SpendingSectionProps {
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
