/**
 * 네비게이션 아이콘 컴포넌트 (Navigation Icon Components)
 *
 * 하단 탭 네비게이션에서 사용되는 SVG 기반 아이콘 컴포넌트 모음입니다.
 * 각 아이콘은 활성/비활성 상태에 따라 색상과 크기를 커스터마이징할 수 있습니다.
 *
 * @module Components/NavIcons
 * @category UI/Components/Navigation
 * @since 1.0.0
 *
 * @description
 * 포함된 아이콘:
 * - HomeIcon: 홈 대시보드 아이콘 (Home Dashboard Icon)
 * - ChatIcon: 챗봇 메인 아이콘 (Chatbot Main Icon)
 * - ManageSearchIcon: 탐색/혜택 검색 아이콘 (Explore/Search Icon)
 * - LibraryAddCheckIcon: 체크리스트 아이콘 (Checklist Icon)
 * - PersonIcon: 프로필 아이콘 (Profile Icon)
 *
 * @example
 * ```tsx
 * import { HomeIcon, ChatIcon } from './components/NavIcons';
 *
 * // 활성 상태 (흰색, 24px)
 * <HomeIcon color="#fff" size={24} />
 *
 * // 비활성 상태 (회색, 24px)
 * <ChatIcon color="#CCCCCC" size={24} />
 * ```
 *
 * @see {@link MainNavigator}
 */
import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';

/**
 * 아이콘 공통 Props (Common Icon Props)
 *
 * @interface IconProps
 * @property {string} [color] - SVG path의 fill/stroke 색상 (Icon Color)
 * @property {number} [size] - 아이콘의 가로/세로 크기 (Icon Size in pixels)
 */
interface IconProps {
  /** SVG 색상 (Icon color - fill or stroke depending on icon) */
  color?: string;
  /** 아이콘 크기 (Icon size in pixels) */
  size?: number;
}

/**
 * 홈 아이콘 컴포넌트 (Home Icon Component)
 *
 * 하단 탭 네비게이션의 홈 탭을 나타내는 집 모양 아이콘입니다.
 *
 * @component
 * @param {IconProps} props - 아이콘 props
 * @param {string} [props.color='white'] - 아이콘 색상 (기본값: 흰색)
 * @param {number} [props.size=24] - 아이콘 크기 (기본값: 24px)
 * @returns {JSX.Element} SVG 홈 아이콘
 *
 * @example
 * ```tsx
 * // 활성 상태 (흰색)
 * <HomeIcon color="#fff" size={24} />
 * ```
 */
export const HomeIcon: React.FC<IconProps> = ({ color = 'white', size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11.5 1.5L1.49998 10.9004H3.49998V20.4004H10.5V14.4004H12.5V20.4004H19.5V10.9004L21.5 11L11.5 1.5ZM11.5 3L15.5 6.5L18.5 9.5V14.4004V19.4004H16.5H13.5V15.9004V13.4004H9.49998V19.4004L4.49998 19.5V9.5L11.5 3Z"
        fill={color}
      />
    </Svg>
  );
};

/**
 * 채팅 아이콘 컴포넌트 (Chat Icon Component)
 *
 * 하단 탭 네비게이션의 채팅 탭을 나타내는 말풍선 아이콘입니다.
 *
 * @component
 * @param {IconProps} props - 아이콘 props
 * @param {string} [props.color='#CCCCCC'] - 아이콘 색상 (기본값: 회색)
 * @param {number} [props.size=24] - 아이콘 크기 (기본값: 24px)
 * @returns {JSX.Element} SVG 채팅 아이콘
 *
 * @example
 * ```tsx
 * // 비활성 상태 (회색)
 * <ChatIcon color="#CCCCCC" size={24} />
 * ```
 */
export const ChatIcon: React.FC<IconProps> = ({ color = '#CCCCCC', size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3.5H12.5H21V11V17.5H5.5L3 20V11V3.5ZM4 2.5C2.9 2.5 2.01 3.4 2.01 4.5L2 22.5L6 18.5H20C21.1 18.5 22 17.6 22 16.5V4.5C22 3.4 21.1 2.5 20 2.5H4ZM6 13H10H14V14H10H6V13ZM6 10H12H18V11H12H6V10ZM6 7H12H18V8H12H6V7Z"
        fill={color}
      />
    </Svg>
  );
};

/**
 * 탐색 검색 아이콘 컴포넌트 (Manage Search Icon Component)
 *
 * 하단 탭 네비게이션의 탐색/혜택 탭을 나타내는 검색 아이콘입니다.
 *
 * @component
 * @param {IconProps} props - 아이콘 props
 * @param {string} [props.color='#CCCCCC'] - 아이콘 색상 (기본값: 회색)
 * @param {number} [props.size=24] - 아이콘 크기 (기본값: 24px)
 * @returns {JSX.Element} SVG 탐색 검색 아이콘
 *
 * @example
 * ```tsx
 * // 활성 상태 (흰색)
 * <ManageSearchIcon color="#fff" size={24} />
 * ```
 */
export const ManageSearchIcon: React.FC<IconProps> = ({ color = '#CCCCCC', size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 17.5V16.5H7H11.875V17.5H7H2ZM2 12.5V11.438H4.5H7V12.5H4.5H2ZM2 7.5V6.462H4.5H7V7.5H4.5H2ZM20.6 18L16.75 14.15C16.35 14.4333 15.9127 14.6457 15.438 14.787C14.9627 14.929 14.4833 15 14 15C12.6167 15 11.4377 14.5123 10.463 13.537C9.48767 12.5623 9 11.3833 9 10C9 8.61667 9.48767 7.43733 10.463 6.462C11.4377 5.48733 12.6167 5 14 5C15.3833 5 16.5627 5.48733 17.538 6.462C18.5127 7.43733 19 8.61667 19 10C19 10.4833 18.9293 10.9627 18.788 11.438C18.646 11.9127 18.4333 12.35 18.15 12.75L22 16.6L20.6 18ZM14 13C14.8333 13 15.5417 12.7083 16.125 12.125C16.7083 11.5417 17 10.8333 17 10C17 9.16667 16.7083 8.45833 16.125 7.875C15.5417 7.29167 14.8333 7 14 7C13.1667 7 12.4583 7.29167 11.875 7.875C11.2917 8.45833 11 9.16667 11 10C11 10.8333 11.2917 11.5417 11.875 12.125C12.4583 12.7083 13.1667 13 14 13Z"
        fill={color}
      />
    </Svg>
  );
};

/**
 * 체크리스트 아이콘 컴포넌트 (Library Add Check Icon Component)
 *
 * 하단 탭 네비게이션의 체크리스트 탭을 나타내는 아이콘입니다.
 *
 * @component
 * @param {IconProps} props - 아이콘 props
 * @param {string} [props.color='#CCCCCC'] - 아이콘 색상 (기본값: 회색)
 * @param {number} [props.size=24] - 아이콘 크기 (기본값: 24px)
 * @returns {JSX.Element} SVG 체크리스트 아이콘
 *
 * @example
 * ```tsx
 * // 플레이스홀더 화면용 대형 아이콘
 * <LibraryAddCheckIcon size={100} color={theme.colors.primary} />
 * ```
 */
export const LibraryAddCheckIcon: React.FC<IconProps> = ({ color = '#CCCCCC', size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_6_114)">
        <Path
          d="M21 3.5V10.5V17H13.5H6.99999V10V3.5H14H21ZM20 2.5H14H7.99999C6.89999 2.5 5.99999 2.9 5.99999 4V16C5.99999 17.1 6.89999 18 7.99999 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2.5 20 2.5ZM12.47 14L8.99999 10.5L10.4 9.09L12.47 11.17L17.6 6L19 7.41L12.47 14ZM2.99999 6H1.99999V20C1.99999 21.1 2.89999 22 3.99999 22H18V21H10.5H2.99999V13V6Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_6_114">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

/**
 * 프로필 아이콘 컴포넌트 (Person Icon Component)
 *
 * 하단 탭 네비게이션의 프로필 탭을 나타내는 사람 아이콘입니다.
 *
 * @component
 * @param {IconProps} props - 아이콘 props
 * @param {string} [props.color='#CCCCCC'] - 아이콘 테두리 색상 (기본값: 회색)
 * @param {number} [props.size=24] - 아이콘 크기 (기본값: 24px)
 * @returns {JSX.Element} SVG 프로필 아이콘
 *
 * @note
 * 이 아이콘은 다른 아이콘들과 달리 fill이 아닌 stroke를 사용합니다.
 *
 * @example
 * ```tsx
 * // 활성 상태 (흰색 테두리)
 * <PersonIcon color="#fff" size={24} />
 * ```
 */
export const PersonIcon: React.FC<IconProps> = ({ color = '#CCCCCC', size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.18945 14.5H16.8105C18.7173 14.5 20.3595 15.8461 20.7334 17.7158L21.3906 21H2.60938L3.2666 17.7158C3.64054 15.8461 5.28273 14.5 7.18945 14.5ZM12 2.5C14.4853 2.5 16.5 4.51472 16.5 7C16.5 9.48528 14.4853 11.5 12 11.5C9.51472 11.5 7.5 9.48528 7.5 7C7.5 4.51472 9.51472 2.5 12 2.5Z"
        stroke={color}
        fill="none"
      />
    </Svg>
  );
};
