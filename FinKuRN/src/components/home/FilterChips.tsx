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
    // No marginTop - controlled by parent
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 6,
    // No marginTop - controlled by parent
  },
  filterChip: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
    borderRadius: 100,
  },
  filterChipActive: {
    backgroundColor: theme.colors.black,
  },
  filterChipText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  filterChipTextActive: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.white,
    textAlign: 'center',
  },
});
