import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';
import { FilterChips } from './FilterChips';

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

export const SpendingSection: React.FC<SpendingSectionProps> = ({ spendingFilters }) => {
  const [spendingVisible, setSpendingVisible] = useState(true);
  const [selectedSpendingFilter, setSelectedSpendingFilter] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>소비</Text>
        <TouchableOpacity onPress={() => setSpendingVisible(!spendingVisible)}>
          <Text style={styles.toggleText}>{spendingVisible ? '숨기기' : '보기'}</Text>
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
            <View style={styles.cardHeader}>
              <Text style={styles.cardMonth}>4월</Text>
              <Text style={styles.cardTotal}>
                <Text style={styles.cardTotalAmount}>1,450,000</Text>원
              </Text>
            </View>

            <View style={styles.categoryList}>
              <View style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: '#3060F1' }]} />
                  <Text style={styles.categoryName}>식비</Text>
                </View>
                <Text style={styles.categoryAmount}>450,000원</Text>
              </View>

              <View style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: '#60A5FA' }]} />
                  <Text style={styles.categoryName}>교통비</Text>
                </View>
                <Text style={styles.categoryAmount}>120,000원</Text>
              </View>

              <View style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: '#93C5FD' }]} />
                  <Text style={styles.categoryName}>쇼핑</Text>
                </View>
                <Text style={styles.categoryAmount}>380,000원</Text>
              </View>

              <View style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: '#DBEAFE' }]} />
                  <Text style={styles.categoryName}>문화생활</Text>
                </View>
                <Text style={styles.categoryAmount}>200,000원</Text>
              </View>

              <View style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: '#E5E7EB' }]} />
                  <Text style={styles.categoryName}>기타</Text>
                </View>
                <Text style={styles.categoryAmount}>300,000원</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  headerText: {
    ...theme.typography.heading3,
    color: theme.colors.textPrimary,
  },
  toggleText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMonth: {
    ...theme.typography.heading3,
    color: theme.colors.textPrimary,
  },
  cardTotal: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
  },
  cardTotalAmount: {
    fontWeight: '600',
  },
  categoryList: {
    gap: theme.spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryName: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
  },
  categoryAmount: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
});
