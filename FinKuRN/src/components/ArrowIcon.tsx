import React from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * 화살표 아이콘 Props (Arrow Icon Props)
 *
 * @interface ArrowIconProps
 * @property {string} [color='black'] - 아이콘 색상 (Icon Color)
 * @property {number} [size=20] - 아이콘 크기 (Icon Size in pixels)
 */
interface ArrowIconProps {
  color?: string;
  size?: number;
}

/**
 * 화살표 아이콘 컴포넌트 (Arrow Icon Component)
 *
 * 오른쪽 방향 화살표 SVG 아이콘을 렌더링합니다.
 * 카드, 버튼 등에서 네비게이션 또는 액션을 나타내는 데 사용됩니다.
 *
 * @component
 * @category UI/Components/Icons
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { ArrowIcon } from './components/ArrowIcon';
 *
 * // 기본 검은색 화살표
 * <ArrowIcon />
 *
 * // 흰색 화살표
 * <ArrowIcon color="#fff" size={24} />
 *
 * // 버튼 내부에서 사용
 * <TouchableOpacity style={styles.button}>
 *   <ArrowIcon color={theme.colors.white} size={20} />
 * </TouchableOpacity>
 * ```
 *
 * @description
 * 주요 용도:
 * - 정책 카드의 액션 버튼 (Policy Card Action Buttons)
 * - 금융 퀴즈 카드 (Finance Quiz Cards)
 * - 청년 지원 혜택 카드 (Youth Benefit Cards)
 * - 네비게이션 인디케이터 (Navigation Indicators)
 *
 * @param {ArrowIconProps} props - 컴포넌트 props
 * @param {string} [props.color='black'] - SVG path fill 색상
 * @param {number} [props.size=20] - 아이콘의 가로/세로 크기
 *
 * @features
 * - SVG 벡터 그래픽 (SVG Vector Graphics)
 * - 커스텀 색상 및 크기 (Customizable Color and Size)
 * - 반응형 스케일링 (Responsive Scaling)
 * - 오른쪽 화살표 디자인 (Right-pointing Arrow Design)
 *
 * @see {@link HomeScreen}
 * @see {@link ExploreScreen}
 */
export const ArrowIcon: React.FC<ArrowIconProps> = ({ color = 'black', size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2929 5.29289C10.6834 4.90237 11.3166 4.90237 11.7071 5.29289L15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071L11.7071 14.7071C11.3166 15.0976 10.6834 15.0976 10.2929 14.7071C9.90237 14.3166 9.90237 13.6834 10.2929 13.2929L12.5858 11L5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H12.5858L10.2929 6.70711C9.90237 6.31658 9.90237 5.68342 10.2929 5.29289Z"
        fill={color}
      />
    </Svg>
  );
};
