import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';
import { FilterChips } from './FilterChips';

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

export const SavingsSection: React.FC<SavingsSectionProps> = ({ savingsFilters }) => {
  const [savingsVisible, setSavingsVisible] = useState(true);
  const [selectedSavingsFilter, setSelectedSavingsFilter] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>저축</Text>
        <TouchableOpacity onPress={() => setSavingsVisible(!savingsVisible)}>
          <Text style={styles.toggleText}>{savingsVisible ? '숨기기' : '보기'}</Text>
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
                <Text style={styles.cardTitle}>내 집 마련 적금</Text>
                <Text style={styles.cardDate}>2024.02 ~</Text>
              </View>
              <View style={styles.cardHeaderRight}>
                <Text style={styles.cardAmount}>300,000원</Text>
                <Text style={styles.cardFrequency}>월 납입</Text>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <View style={styles.chartWrapper}>
                <View style={styles.chartBarsContainer}>
                  <View style={styles.chartBar}>
                    <View style={[styles.chartBarFill, { height: '20%' }]} />
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.chartBarFill, { height: '50%' }]} />
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.chartBarFill, { height: '10%' }]} />
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.chartBarFill, { height: '80%' }]} />
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.chartBarFill, { height: '60%' }]} />
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.chartBarFill, { height: '20%' }]} />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>현재</Text>
                <Text style={styles.footerValue}>
                  <Text style={styles.footerHighlight}>3,500,000</Text>원
                </Text>
              </View>
              <View style={styles.footerDivider} />
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>목표</Text>
                <Text style={styles.footerValue}>
                  <Text style={styles.footerHighlight}>30,000,000</Text>원
                </Text>
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
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    gap: 4,
  },
  cardTitle: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  cardDate: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  cardAmount: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  cardFrequency: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  chartContainer: {
    paddingVertical: theme.spacing.md,
  },
  chartWrapper: {
    height: 120,
    justifyContent: 'center',
  },
  chartBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: theme.spacing.md,
  },
  chartBar: {
    flex: 1,
    height: '100%',
    marginHorizontal: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
  },
  footerItem: {
    alignItems: 'center',
    gap: 4,
  },
  footerLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  footerValue: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
  },
  footerHighlight: {
    fontWeight: '600',
  },
  footerDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.divider,
  },
});
