/**
 * Navigation Type Definitions
 *
 * Defines the navigation structure and parameter types for the entire app.
 * This ensures type-safe navigation throughout the application.
 *
 * Usage:
 * ```tsx
 * import { useNavigation } from '@react-navigation/native';
 * import type { AppNavigation } from '@/types/navigation';
 *
 * const navigation = useNavigation<AppNavigation>();
 * navigation.navigate('ChatConversation', { chatTitle: 'Example' });
 * ```
 */

import type { NavigationProp } from '@react-navigation/native';

/**
 * Root Stack Parameter List
 *
 * Defines all available routes and their parameters in the main navigation stack.
 */
export type RootStackParamList = {
  /**
   * Login Screen
   * User authentication with email/password and social login
   */
  Login: undefined;

  /**
   * Signup Screen
   * User registration with name, email, and password
   */
  Signup: undefined;

  /**
   * Main Tab Navigator
   * Contains: Home, ChatbotV2, Explore
   */
  MainTabs: undefined;

  /**
   * Home Screen
   * Main dashboard showing today's items, savings, and spending
   */
  Home: undefined;

  /**
   * Chatbot Screen V2
   * Main chatbot interface with recent conversations
   */
  ChatbotV2: undefined;

  /**
   * Explore Screen
   * Browse financial benefits and policies
   */
  Explore: undefined;

  /**
   * New Chat Page
   * Start a new conversation with suggested questions
   */
  NewChat: undefined;

  /**
   * Chat Conversation Page
   * Active chat conversation interface
   *
   * @param chatTitle - The title/topic of the chat conversation
   */
  ChatConversation: {
    chatTitle: string;
  };

  /**
   * Plan Upgrade Page
   * Premium plan upgrade information and purchase
   */
  PlanUpgrade: undefined;

  /**
   * Today List Screen
   * Full list view of today's financial tasks
   */
  TodayList: undefined;
};

/**
 * Navigation Prop Type
 *
 * Type-safe navigation prop for use in functional components.
 */
export type AppNavigation = NavigationProp<RootStackParamList>;

/**
 * Screen Props Helper Types
 *
 * Helper types to extract props for specific screens.
 */
export type ChatConversationProps = {
  route: {
    params: RootStackParamList['ChatConversation'];
  };
  navigation: AppNavigation;
};
