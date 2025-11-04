import { GradientLayer } from '@/components/common';

/**
 * Gradient Layer Configurations
 *
 * Pre-configured gradient layer sets for different screens.
 * These configurations maintain consistent visual aesthetics across the app.
 *
 * Usage:
 * ```tsx
 * import { CHAT_GRADIENTS, HOME_GRADIENTS } from '@/constants/gradients';
 *
 * <BackgroundGradient layers={CHAT_GRADIENTS} />
 * ```
 */

/**
 * Chat Screen Gradients
 *
 * Used in: ChatbotScreenV2, NewChatPage, ChatConversationPage
 * Purple, pink, and yellow gradient mix with blur effect
 */
export const CHAT_GRADIENTS: GradientLayer[] = [
  {
    top: -50,
    left: -150,
    opacity: 0.35,
    colors: [
      'rgba(173, 144, 255, 0.5)',
      'rgba(223, 127, 127, 0.3)',
      'rgba(255, 229, 0, 0)',
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    top: 150,
    left: -50,
    opacity: 0.3,
    colors: [
      'rgba(255, 229, 0, 0.35)',
      'rgba(255, 192, 203, 0.3)',
      'rgba(173, 144, 255, 0.2)',
    ],
    start: { x: 1, y: 0 },
    end: { x: 0, y: 1 },
  },
  {
    top: 350,
    left: -200,
    opacity: 0.25,
    colors: [
      'rgba(223, 127, 127, 0.35)',
      'rgba(173, 144, 255, 0.25)',
      'rgba(255, 229, 0, 0)',
    ],
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 },
  },
  {
    top: 550,
    left: 50,
    opacity: 0.2,
    colors: [
      'rgba(173, 144, 255, 0.3)',
      'rgba(255, 192, 203, 0.2)',
      'rgba(255, 229, 0, 0.15)',
    ],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
];

/**
 * Chat Screen Gradients (Large)
 *
 * Same as CHAT_GRADIENTS but uses larger circle size (700px instead of 513px)
 * Used in screens that need more coverage
 */
export const CHAT_GRADIENTS_LARGE: GradientLayer[] = CHAT_GRADIENTS;

/**
 * Home Screen Gradients
 *
 * Used in: HomeScreen
 * Blue gradient mix for the home dashboard
 */
export const HOME_GRADIENTS: GradientLayer[] = [
  {
    top: -177,
    left: 89,
    opacity: 1,
    colors: [
      'rgba(48, 96, 241, 0.3)',
      'rgba(201, 213, 244, 0.3)',
      'rgba(4, 40, 135, 0.3)',
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    top: 288,
    left: -120,
    opacity: 1,
    colors: [
      'rgba(48, 96, 241, 0.3)',
      'rgba(201, 213, 244, 0.3)',
      'rgba(4, 40, 135, 0.3)',
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    top: 708,
    left: 71,
    opacity: 1,
    colors: [
      'rgba(48, 96, 241, 0.3)',
      'rgba(201, 213, 244, 0.3)',
      'rgba(4, 40, 135, 0.3)',
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    top: 933,
    left: -229,
    opacity: 1,
    colors: [
      'rgba(48, 96, 241, 0.3)',
      'rgba(201, 213, 244, 0.3)',
      'rgba(4, 40, 135, 0.3)',
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
];

/**
 * Explore Screen Gradients
 *
 * Used in: ExploreScreen
 * Same blue gradient as home screen but with different positioning
 */
export const EXPLORE_GRADIENTS: GradientLayer[] = [
  {
    top: -225,
    left: 232,
    opacity: 1,
    colors: [
      'rgba(48, 96, 241, 0.3)',
      'rgba(201, 213, 244, 0.3)',
      'rgba(4, 40, 135, 0.3)',
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    top: 330,
    left: -264,
    opacity: 1,
    colors: [
      'rgba(48, 96, 241, 0.3)',
      'rgba(201, 213, 244, 0.3)',
      'rgba(4, 40, 135, 0.3)',
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    top: 911,
    left: 23,
    opacity: 1,
    colors: [
      'rgba(48, 96, 241, 0.3)',
      'rgba(201, 213, 244, 0.3)',
      'rgba(4, 40, 135, 0.3)',
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    top: 1407,
    left: 18,
    opacity: 1,
    colors: [
      'rgba(48, 96, 241, 0.3)',
      'rgba(201, 213, 244, 0.3)',
      'rgba(4, 40, 135, 0.3)',
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
];

/**
 * Today List Screen Gradients
 *
 * Used in: TodayListScreen
 * Blue gradient for the today list page
 */
export const TODAY_GRADIENTS: GradientLayer[] = [
  {
    top: -177,
    left: 89,
    opacity: 1,
    colors: [
      'rgba(48, 96, 241, 0.3)',
      'rgba(201, 213, 244, 0.3)',
      'rgba(4, 40, 135, 0.3)',
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    top: 400,
    left: -120,
    opacity: 1,
    colors: [
      'rgba(48, 96, 241, 0.3)',
      'rgba(201, 213, 244, 0.3)',
      'rgba(4, 40, 135, 0.3)',
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
];
