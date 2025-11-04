/**
 * Theme Constants
 *
 * Centralized theme configuration for consistent styling across the application.
 * This file contains all design tokens including colors, typography, spacing, and dimensions.
 *
 * Usage:
 * ```tsx
 * import { theme } from '@/constants/theme';
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: theme.colors.background,
 *     padding: theme.spacing.md,
 *   },
 *   title: {
 *     ...theme.typography.heading1,
 *     color: theme.colors.textPrimary,
 *   },
 * });
 * ```
 */

export const theme = {
  /**
   * Color Palette
   *
   * Defines all colors used throughout the application.
   * Colors are organized by usage context for better maintainability.
   */
  colors: {
    // Primary brand colors
    primary: '#3060F1',
    primaryDark: '#001E6E',

    // Background colors
    background: '#E9E9E9',
    backgroundLight: '#F5F5FF',
    surface: '#FFFFFF',

    // Text colors
    textPrimary: '#000000',
    textSecondary: '#767676',
    textTertiary: '#A0A0A0',
    textPlaceholder: '#D9D9D9',

    // UI colors
    white: '#FFFFFF',
    black: '#000000',
    divider: '#E9E9E9',

    // Status colors
    success: '#3060F1',
    warning: '#FFE500',
    error: '#DF7F7F',

    // Gradient colors (for chat screens)
    chatGradient1: 'rgba(173, 144, 255, 0.5)',
    chatGradient2: 'rgba(223, 127, 127, 0.3)',
    chatGradient3: 'rgba(255, 229, 0, 0)',
    chatGradient4: 'rgba(255, 192, 203, 0.3)',
    chatGradient5: 'rgba(173, 144, 255, 0.2)',
    chatGradient6: 'rgba(173, 144, 255, 0.25)',

    // Gradient colors (for home/explore screens)
    homeGradient1: 'rgba(48, 96, 241, 0.3)',
    homeGradient2: 'rgba(201, 213, 244, 0.3)',
    homeGradient3: 'rgba(4, 40, 135, 0.3)',

    // Card colors
    cardLight: '#A9BFF3',
    cardYellow: '#FFFEF0',

    // Input colors
    inputBackground: 'rgba(0, 0, 0, 0.4)',
  },

  /**
   * Typography
   *
   * Defines text styles used throughout the application.
   * Each style includes font family, size, weight, and line height.
   */
  typography: {
    heading1: {
      fontFamily: 'System',
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 33.6,
    },
    heading2: {
      fontFamily: 'System',
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    heading3: {
      fontFamily: 'System',
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22.4,
    },
    heading4: {
      fontFamily: 'System',
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 19.6,
    },
    body1: {
      fontFamily: 'System',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    body2: {
      fontFamily: 'System',
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 18.2,
    },
    body3: {
      fontFamily: 'System',
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16.8,
    },
    caption: {
      fontFamily: 'System',
      fontSize: 11,
      fontWeight: '400' as const,
      lineHeight: 15.4,
    },
    button: {
      fontFamily: 'System',
      fontSize: 13,
      fontWeight: '600' as const,
    },
  },

  /**
   * Spacing
   *
   * Standardized spacing values for consistent layout.
   * Follow the 4px grid system.
   */
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  /**
   * Border Radius
   *
   * Standardized border radius values for consistent rounded corners.
   */
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28,
    xxxl: 32,
    full: 100,
  },

  /**
   * Layout Dimensions
   *
   * Common layout dimensions used across screens.
   */
  layout: {
    statusBarHeight: 44,
    headerHeight: 48,
    headerTop: 56,
    scrollViewPaddingTop: 112,
    bottomTabHeight: 80,
  },

  /**
   * Shadows
   *
   * Standardized shadow configurations for elevation effects.
   */
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
  },

  /**
   * Z-Index Layers
   *
   * Defines the stacking order of UI elements.
   * Higher values appear on top of lower values.
   */
  zIndex: {
    background: 0,
    content: 1,
    header: 99,
    statusBar: 100,
    modal: 1000,
    tooltip: 1100,
  },
} as const;

/**
 * Type exports for TypeScript autocomplete
 */
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeTypography = typeof theme.typography;
export type ThemeSpacing = typeof theme.spacing;
