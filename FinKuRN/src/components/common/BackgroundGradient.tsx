import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Gradient Layer Configuration
 *
 * Defines the position and opacity for a single gradient layer.
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
 * BackgroundGradient Component Props
 */
interface BackgroundGradientProps {
  layers: GradientLayer[];
  size?: number;
}

/**
 * BackgroundGradient Component
 *
 * Renders multiple blurred gradient layers to create a soft, ambient background effect.
 * Each layer can have custom positioning, opacity, and color gradients.
 *
 * This component is used across multiple screens to maintain consistent
 * visual aesthetics throughout the application.
 *
 * @component
 * @example
 * ```tsx
 * <BackgroundGradient
 *   layers={[
 *     {
 *       top: -50,
 *       left: -150,
 *       opacity: 0.35,
 *       colors: ['rgba(173, 144, 255, 0.5)', 'rgba(223, 127, 127, 0.3)', 'rgba(255, 229, 0, 0)'],
 *       start: { x: 0, y: 0 },
 *       end: { x: 1, y: 1 }
 *     }
 *   ]}
 * />
 * ```
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
