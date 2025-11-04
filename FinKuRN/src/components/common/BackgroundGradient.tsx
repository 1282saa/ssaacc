import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * 그라디언트 레이어 설정 (Gradient Layer Configuration)
 *
 * 단일 그라디언트 레이어의 위치와 투명도를 정의합니다.
 *
 * @interface GradientLayer
 * @property {number} top - 상단 위치 (Top Position in pixels)
 * @property {number} left - 좌측 위치 (Left Position in pixels)
 * @property {number} opacity - 투명도 0-1 (Opacity 0-1)
 * @property {string[]} colors - 그라디언트 색상 배열 (Array of RGBA colors)
 * @property {{x: number, y: number}} [start] - 그라디언트 시작점 (Gradient Start Point)
 * @property {{x: number, y: number}} [end] - 그라디언트 끝점 (Gradient End Point)
 */
export interface GradientLayer {
  top: number;
  left: number;
  opacity: number;
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

/**
 * 배경 그라디언트 컴포넌트 Props (BackgroundGradient Component Props)
 *
 * @interface BackgroundGradientProps
 * @property {GradientLayer[]} layers - 그라디언트 레이어 배열 (Array of Gradient Layers)
 * @property {number} [size=513] - 각 레이어의 크기 (Size of each layer in pixels)
 */
interface BackgroundGradientProps {
  layers: GradientLayer[];
  size?: number;
}

/**
 * 배경 그라디언트 컴포넌트 (Background Gradient Component)
 *
 * 여러 개의 블러 처리된 그라디언트 레이어를 렌더링하여 부드러운 주변 배경 효과를 생성합니다.
 * 각 레이어는 사용자 정의 위치, 투명도, 색상 그라디언트를 가질 수 있습니다.
 *
 * @component
 * @category UI/Components/Common
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { BackgroundGradient } from './components/common/BackgroundGradient';
 * import { HOME_GRADIENTS } from './constants/gradients';
 *
 * <BackgroundGradient layers={HOME_GRADIENTS} />
 *
 * // 사용자 정의 크기 지정
 * <BackgroundGradient layers={CHAT_GRADIENTS_LARGE} size={700} />
 * ```
 *
 * @description
 * 이 컴포넌트는 애플리케이션 전체에서 일관된 시각적 미학을 유지하기 위해
 * 여러 화면에서 사용됩니다.
 *
 * @features
 * - 다중 레이어 지원 (Multiple Layer Support)
 * - 커스텀 위치와 투명도 (Custom Positioning and Opacity)
 * - 블러 효과 (Blur Effect) - filter: blur(100px)
 * - LinearGradient 사용 (Using expo-linear-gradient)
 * - 절대 위치 지정 (Absolute Positioning)
 *
 * @param {BackgroundGradientProps} props - 컴포넌트 props
 * @param {GradientLayer[]} props.layers - 렌더링할 그라디언트 레이어 배열
 * @param {number} [props.size=513] - 각 레이어의 가로/세로 크기 (기본값: 513px)
 *
 * @see {@link HOME_GRADIENTS}
 * @see {@link EXPLORE_GRADIENTS}
 * @see {@link CHAT_GRADIENTS_LARGE}
 */
export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  layers,
  size = 513
}) => {
  const radius = size / 2;

  return (
    <>
      {layers.map((layer, index) => {
        const layerStyle: ViewStyle = {
          top: layer.top,
          left: layer.left,
          opacity: layer.opacity,
        };

        return (
          <View key={index} style={[styles.backgroundGradient, { width: size, height: size, borderRadius: radius }, layerStyle]}>
            <LinearGradient
              colors={layer.colors}
              start={layer.start || { x: 0, y: 0 }}
              end={layer.end || { x: 1, y: 1 }}
              style={styles.gradient}
            />
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: {
    position: 'absolute',
    overflow: 'hidden',
    // @ts-ignore - Web-specific blur effect
    filter: 'blur(100px)',
  },
  gradient: {
    flex: 1,
  },
});
