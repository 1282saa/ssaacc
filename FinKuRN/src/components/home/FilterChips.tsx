import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../../constants/theme';

/**
 * FilterChips Component
 *
 * Displays a horizontal scrollable list of filter chips.
 * Each chip can be toggled on/off for filtering content.
 *
 * @param filters - Array of filter option strings
 * @param selectedFilter - Currently selected filter (null if none)
 * @param onFilterPress - Callback when a filter is pressed
 * @param scrollable - Whether the chips should scroll horizontally (default: false)
 *
 * @example
 * ```tsx
 * <FilterChips
 *   filters={['전체', '내 집 마련 적금', '여름 여행', '비상금']}
 *   selectedFilter={selectedFilter}
 *   onFilterPress={setSelectedFilter}
 *   scrollable={true}
 * />
 * ```
 */
interface FilterChipsProps {
  filters: string[];
  selectedFilter: string | null;
  onFilterPress: (filter: string | null) => void;
  scrollable?: boolean;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  selectedFilter,
  onFilterPress,
  scrollable = false,
}) => {
  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable
    ? {
        horizontal: true,
        showsHorizontalScrollIndicator: false,
        style: styles.filterScrollView,
        contentContainerStyle: styles.filterContainer,
      }
    : { style: styles.filterContainer };

  return (
    <Container {...containerProps}>
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter;
        return (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, isSelected && styles.filterChipActive]}
            onPress={() => onFilterPress(isSelected ? null : filter)}
          >
            <Text style={isSelected ? styles.filterChipTextActive : styles.filterChipText}>
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Container>
  );
};

const styles = StyleSheet.create({
  filterScrollView: {
    marginTop: 18,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: 6,
    marginTop: 18,
  },
  filterChip: {
    paddingHorizontal: 28,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.full,
  },
  filterChipActive: {
    backgroundColor: theme.colors.black,
  },
  filterChipText: {
    ...theme.typography.button,
    color: theme.colors.textSecondary,
  },
  filterChipTextActive: {
    ...theme.typography.button,
    color: theme.colors.white,
  },
});
