# FinKuRN Frontend Source Code

This directory contains all source code for the FinKuRN React Native application.

## Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components used across screens
│   │   ├── StatusBar.tsx          # iOS-style status bar
│   │   ├── BackgroundGradient.tsx # Blurred gradient backgrounds
│   │   ├── ChatItem.tsx           # Chat message bubble
│   │   └── index.ts              # Common components export
│   ├── home/            # HomeScreen-specific components
│   │   ├── TodayItem.tsx          # Today task item with D-day
│   │   ├── FilterChips.tsx        # Filter chip list (scrollable/fixed)
│   │   ├── SavingsSection.tsx     # Savings overview section
│   │   ├── SpendingSection.tsx    # Spending overview section
│   │   └── index.ts              # Home components export
│   ├── ArrowIcon.tsx    # Arrow icon component
│   └── NavIcons.tsx     # Bottom navigation icons
│
├── constants/           # Application constants
│   ├── theme.ts         # Design system theme (colors, typography, spacing, etc.)
│   └── gradients.ts     # Pre-configured gradient layer sets
│
├── navigation/          # Navigation configuration
│   └── MainNavigator.tsx # Main app navigation structure
│
├── screens/            # Application screens/pages
│   ├── HomeScreen.tsx            # Main dashboard (384 lines, REFACTORED)
│   ├── ExploreScreen.tsx         # Browse financial benefits and policies
│   ├── ChatbotScreenV2.tsx       # Chatbot main interface
│   ├── NewChatPage.tsx           # New conversation page
│   ├── ChatConversationPage.tsx  # Active chat conversation
│   ├── PlanUpgradePage.tsx       # Premium plan upgrade
│   └── TodayListScreen.tsx       # Full today items list
│
└── types/              # TypeScript type definitions
    ├── navigation.ts    # Navigation types
    ├── chat.ts         # Chat-related types
    └── index.ts        # Type exports
```

## Component Organization

### Common Components (`components/common/`)

Reusable components that maintain consistent behavior and appearance across the app.

#### StatusBar
Displays the iOS-style status bar with time and system icons.

```tsx
import { StatusBar } from '../components/common';

<StatusBar />
```

#### BackgroundGradient
Renders multiple blurred gradient layers for ambient background effects.

```tsx
import { BackgroundGradient } from '../components/common';
import { CHAT_GRADIENTS } from '../constants/gradients';

<BackgroundGradient layers={CHAT_GRADIENTS} size={700} />
```

#### ChatItem
Chat message bubble component for displaying user/AI messages.

```tsx
import { ChatItem } from '../components/common';

<ChatItem sender="user" text="Hello!" timestamp="10:30 AM" />
<ChatItem sender="ai" text="Hi there!" timestamp="10:31 AM" />
```

### Home Components (`components/home/`)

Screen-specific components for HomeScreen, following Single Responsibility Principle.

#### TodayItem
Displays a single today task with D-day countdown and details.

```tsx
import { TodayItem } from '../components/home';

<TodayItem
  title="공과금 납부"
  dday="D-DAY"
  detail={<Text>이번 달 전기요금 <Text style={styles.highlight}>43,200원</Text></Text>}
  description="오늘 납부하지 않으면 연체료 2%가 부가돼요"
/>
```

#### FilterChips
Renders filter chip list with selection state (scrollable or fixed layout).

```tsx
import { FilterChips } from '../components/home';

const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

<FilterChips
  filters={['전체', '내 집 마련 적금', '여름 여행']}
  selectedFilter={selectedFilter}
  onFilterPress={setSelectedFilter}
  scrollable={false}
/>
```

#### SavingsSection
Complete savings overview section with state management, filtering, and chart visualization.

```tsx
import { SavingsSection } from '../components/home';

<SavingsSection savingsFilters={['전체', '내 집 마련 적금', '여름 여행']} />
```

#### SpendingSection
Complete spending overview section with state management, filtering, and category breakdown.

```tsx
import { SpendingSection } from '../components/home';

<SpendingSection spendingFilters={['오늘', '이번 주', '이번 달']} />
```

### Screen Components (`screens/`)

Each screen follows the Single Responsibility Principle:
- One screen = one primary user task
- Clear separation of concerns
- Comprehensive JSDoc comments
- Type-safe navigation
- Components should NOT exceed 400 lines (extract to smaller components if needed)

## Design System

### Theme (`constants/theme.ts`)

Centralized design tokens for consistent styling.

```tsx
import { theme } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
  },
});
```

#### Available Theme Tokens

- **Colors**: `theme.colors.*`
  - Primary: `primary`, `primaryDark`
  - Background: `background`, `backgroundLight`, `surface`
  - Text: `textPrimary`, `textSecondary`, `textTertiary`, `textPlaceholder`
  - UI: `white`, `black`, `divider`

- **Typography**: `theme.typography.*`
  - Headings: `heading1`, `heading2`, `heading3`, `heading4`
  - Body: `body1`, `body2`, `body3`
  - Other: `caption`, `button`

- **Spacing**: `theme.spacing.*`
  - `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`

- **Border Radius**: `theme.borderRadius.*`
  - `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`, `full`

- **Layout**: `theme.layout.*`
  - `statusBarHeight`, `headerHeight`, `headerTop`, `scrollViewPaddingTop`

- **Shadows**: `theme.shadows.*`
  - `small`, `medium`

- **Z-Index**: `theme.zIndex.*`
  - `background`, `content`, `header`, `statusBar`, `modal`, `tooltip`

### Gradients (`constants/gradients.ts`)

Pre-configured gradient layer sets for different screens.

- `CHAT_GRADIENTS` - Used in chat screens (purple, pink, yellow mix)
- `CHAT_GRADIENTS_LARGE` - Same as CHAT_GRADIENTS, 700px size
- `HOME_GRADIENTS` - Used in HomeScreen (blue gradient)
- `TODAY_GRADIENTS` - Used in TodayListScreen (blue gradient)
- `EXPLORE_GRADIENTS` - Used in ExploreScreen (blue gradient)

## Type Safety

### Navigation Types (`types/navigation.ts`)

Type-safe navigation throughout the app.

```tsx
import { useNavigation } from '@react-navigation/native';
import type { AppNavigation } from '@/types';

const navigation = useNavigation<AppNavigation>();
navigation.navigate('ChatConversation', { chatTitle: 'Example' });
```

### Chat Types (`types/chat.ts`)

- `Message` - Single chat message
- `ChatItem` - Chat conversation in list view

## Coding Standards

### Import Organization

1. React and React Native imports
2. Third-party library imports
3. Local component imports (using `@/` alias)
4. Type imports

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from '@/components/common';
import { theme } from '@/constants/theme';
import type { AppNavigation } from '@/types';
```

### Component Structure

1. Imports
2. Type definitions (if any)
3. JSDoc comment
4. Component function
5. Styles (using StyleSheet.create)

### JSDoc Comments

All components and functions must have JSDoc comments:

```tsx
/**
 * ComponentName
 *
 * Brief description of what this component does.
 *
 * @param prop1 - Description of prop1
 * @param prop2 - Description of prop2
 *
 * @example
 * ```tsx
 * <ComponentName prop1="value" />
 * ```
 */
```

### File Naming

- Components: PascalCase (e.g., `ChatConversationPage.tsx`)
- Constants: camelCase (e.g., `theme.ts`, `gradients.ts`)
- Types: camelCase (e.g., `navigation.ts`, `chat.ts`)

## Path Aliases

The following path aliases are configured in `tsconfig.json`:

- `@/*` - Maps to `src/*`
- `@/components/*` - Maps to `src/components/*`
- `@/screens/*` - Maps to `src/screens/*`
- `@/constants/*` - Maps to `src/constants/*`
- `@/types/*` - Maps to `src/types/*`
- `@/navigation/*` - Maps to `src/navigation/*`

## Refactoring Status

### Latest Refactoring (2025-11)

**HomeScreen Component Breakdown**

Problem: HomeScreen.tsx was 818 lines, violating Single Responsibility Principle with 5 responsibilities:
1. Today items (5 duplicated structures)
2. Savings section with state
3. Spending section with state
4. Policy cards
5. Greeting section

Solution: Created specialized components in `src/components/home/`:
- **TodayItem.tsx** (95 lines) - Reusable today task item component
- **FilterChips.tsx** (97 lines) - Reusable filter chip list with scrollable option
- **SavingsSection.tsx** (200 lines) - Complete savings overview with state management
- **SpendingSection.tsx** (145 lines) - Complete spending overview with state management

Result: HomeScreen reduced from 818 to 384 lines (53% reduction), each component with single clear responsibility.

Code duplication eliminated:
- Before: 5 identical Today item structures (200+ lines)
- After: Single TodayItem component reused 5 times

### All Screens Completed
- ChatConversationPage.tsx - Uses theme, common components, proper types, CHAT_GRADIENTS_LARGE
- NewChatPage.tsx - Fully refactored with CHAT_GRADIENTS_LARGE
- ChatbotScreenV2.tsx - Fully refactored with ChatItem component, CHAT_GRADIENTS_LARGE
- HomeScreen.tsx - Component breakdown complete with HOME_GRADIENTS (384 lines)
- ExploreScreen.tsx - Fully refactored with EXPLORE_GRADIENTS
- TodayListScreen.tsx - Fully refactored with TODAY_GRADIENTS
- PlanUpgradePage.tsx - Fully refactored with theme system

All 7 screens now follow consistent patterns and use the centralized theme system with zero hardcoded values.

## Collaboration Notes for Backend Developers

When integrating with backend APIs:

1. **Type Definitions**: Add new types to `src/types/`
2. **Navigation**: Update `src/types/navigation.ts` for new routes
3. **API Responses**: Create types for all API responses
4. **Error Handling**: Use consistent error types

Example API integration:

```tsx
// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatResponse {
  messageId: number;
  text: string;
  timestamp: string;
}

// In component
const sendMessage = async (text: string): Promise<ApiResponse<ChatResponse>> => {
  // API call implementation
};
```

## Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **DRY (Don't Repeat Yourself)**: Extract common logic into reusable functions/components
3. **Type Safety**: Always use TypeScript types, avoid `any`
4. **Accessibility**: Add accessibility labels where appropriate
5. **Performance**: Use `React.memo` for expensive components, avoid inline functions in render
6. **Documentation**: Keep JSDoc comments up to date

## Questions?

For questions about the frontend architecture, please contact the frontend team lead or refer to this documentation.
