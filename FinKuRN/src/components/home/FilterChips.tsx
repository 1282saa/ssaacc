/**
 * 필터 칩 컴포넌트 (Filter Chips Component)
 *
 * 수평으로 스크롤 가능한 필터 칩 목록을 표시하는 컴포넌트입니다.
 * 각 칩을 클릭하여 토글할 수 있으며, 콘텐츠를 필터링하는 데 사용됩니다.
 *
 * @module Components/Home/FilterChips
 * @category UI/Components/Home
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { FilterChips } from './components/home/FilterChips';
 *
 * // 저축 필터
 * <FilterChips
 *   filters={['전체', '내 집 마련 적금', '여름 여행', '비상금']}
 *   selectedFilter={selectedFilter}
 *   onFilterPress={setSelectedFilter}
 *   scrollable={false}
 * />
 *
 * // 소비 필터
 * <FilterChips
 *   filters={['오늘', '이번 주', '이번 달']}
 *   selectedFilter={selectedFilter}
 *   onFilterPress={setSelectedFilter}
 *   scrollable={true}
 * />
 * ```
 *
 * @description
 * 주요 기능:
 * - 수평 스크롤 지원 (Horizontal Scroll Support) - scrollable prop으로 제어
 * - 토글 가능한 칩 (Toggleable Chips) - 클릭하여 선택/해제
 * - 활성/비활성 스타일 (Active/Inactive Styles)
 *   - 활성: 검은색 배경, 흰색 텍스트 (Active: Black BG, White Text)
 *   - 비활성: 흰색 배경, 회색 텍스트 (Inactive: White BG, Gray Text)
 *
 * @features
 * - 동적 컨테이너 (Dynamic Container) - ScrollView 또는 View
 * - Pretendard Variable 폰트 (Pretendard Variable Font)
 * - 둥근 칩 디자인 (Rounded Chip Design) - borderRadius: 100
 * - 단일 선택 모드 (Single Selection Mode)
 *
 * @styling
 * - paddingHorizontal: 28px
 * - paddingVertical: 12px
 * - fontSize: 13px
 * - fontWeight: 600
 * - gap: 6px
 *
 * @see {@link SavingsSection}
 * @see {@link SpendingSection}
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../../constants/theme';

/**
 * 필터 칩 컴포넌트 Props (Filter Chips Component Props)
 *
 * @interface FilterChipsProps
 * @property {string[]} filters - 필터 옵션 문자열 배열 (Array of Filter Option Strings)
 * @property {string | null} selectedFilter - 현재 선택된 필터 (Currently Selected Filter, null if none)
 * @property {(filter: string | null) => void} onFilterPress - 필터 클릭 시 호출되는 콜백 (Callback when Filter is Pressed)
 * @property {boolean} [scrollable=false] - 수평 스크롤 활성화 여부 (Whether Chips Should Scroll Horizontally)
 */
interface FilterChipsProps {
  /**
   * 필터 옵션 문자열 배열 (Array of Filter Option Strings)
   *
   * @example ['전체', '내 집 마련 적금', '여름 여행', '비상금']
   */
  filters: string[];

  /**
   * 현재 선택된 필터 (Currently Selected Filter)
   *
   * null인 경우 선택된 필터 없음 (null if no filter is selected)
   *
   * @example "전체"
   */
  selectedFilter: string | null;

  /**
   * 필터 클릭 시 호출되는 콜백 함수 (Callback Function when a Filter is Pressed)
   *
   * 이미 선택된 필터를 다시 클릭하면 null을 전달하여 선택 해제합니다.
   *
   * @param {string | null} filter - 선택된 필터 또는 null (해제 시)
   *
   * @example (filter) => setSelectedFilter(filter)
   */
  onFilterPress: (filter: string | null) => void;

  /**
   * 수평 스크롤 활성화 여부 (Whether the Chips Should Scroll Horizontally)
   *
   * true: ScrollView 사용 (많은 칩이 있을 때)
   * false: View 사용 (기본값, 적은 수의 칩)
   *
   * @default false
   */
  scrollable?: boolean;
}

/**
 * 필터 칩 컴포넌트 (Filter Chips Component)
 *
 * 필터 옵션을 수평 칩 형태로 렌더링합니다.
 * 단일 선택 모드로 동작하며, 선택된 칩을 다시 클릭하면 선택이 해제됩니다.
 *
 * @component
 * @param {FilterChipsProps} props - 컴포넌트 props
 * @param {string[]} props.filters - 필터 옵션 배열
 * @param {string | null} props.selectedFilter - 현재 선택된 필터
 * @param {(filter: string | null) => void} props.onFilterPress - 필터 클릭 핸들러
 * @param {boolean} [props.scrollable=false] - 수평 스크롤 활성화 여부
 *
 * @returns {JSX.Element} 필터 칩 목록
 *
 * @example
 * ```tsx
 * // HomeScreen의 저축 섹션에서 사용
 * const [selectedFilter, setSelectedFilter] = useState<string | null>('전체');
 *
 * <FilterChips
 *   filters={['전체', '내 집 마련 적금', '여름 여행', '비상금']}
 *   selectedFilter={selectedFilter}
 *   onFilterPress={setSelectedFilter}
 *   scrollable={false}
 * />
 * ```
 */
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
