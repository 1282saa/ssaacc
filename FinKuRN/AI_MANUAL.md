# AI Developer Manual - FinKuRN Project

> **Purpose**: This document provides AI assistants with a comprehensive understanding of the FinKuRN project structure, architecture, and development patterns for efficient code generation and maintenance.

**Last Updated**: 2025-01-04
**Project Version**: 1.0.0
**Framework**: React Native + Expo + TypeScript

---

## 📚 Table of Contents

1. [Quick Start for AI](#quick-start-for-ai)
2. [Project Overview](#project-overview)
3. [Architecture Deep Dive](#architecture-deep-dive)
4. [File Structure & Locations](#file-structure--locations)
5. [Design System & Styling Rules](#design-system--styling-rules)
6. [Component Patterns](#component-patterns)
7. [Data Flow & State Management](#data-flow--state-management)
8. [TypeScript Conventions](#typescript-conventions)
9. [Common Tasks & Code Examples](#common-tasks--code-examples)
10. [Integration Points](#integration-points)
11. [Known Issues & Workarounds](#known-issues--workarounds)
12. [AI Development Rules](#ai-development-rules)

---

## Quick Start for AI

### 3-Minute Understanding Path

```
1. Read this section (3 min)
2. Check "Project Overview" (2 min)
3. Review "Component Patterns" (5 min)
4. Reference "Design System" when coding (ongoing)
```

### Key Facts You Must Know

- **Language**: TypeScript (strict mode, zero `any` allowed)
- **UI Framework**: React Native 0.81.5 with Expo 54
- **Navigation**: React Navigation v7 (type-safe)
- **State**: React Hooks (no Redux/MobX)
- **Styling**: StyleSheet.create() with centralized theme
- **Backend**: Not yet implemented - using service layer with dummy data

### Project Status (January 2025)

✅ **Completed**:
- 7 screens fully implemented and refactored
- Complete theme system (colors, typography, spacing)
- Service layer ready for backend integration
- Type definitions for all data structures
- Comprehensive JSDoc documentation
- ExploreScreen refined to pixel-perfect design match

🔄 **In Progress**:
- Backend API integration (service layer ready, waiting for endpoints)

❌ **Not Started**:
- User authentication
- Real-time data synchronization
- Push notifications

---

## Project Overview

### What is FinKuRN?

FinKuRN (Financial Knowledge & Resource Navigator) is a mobile financial assistant app that helps Korean users:

1. **Track financial tasks**: Bill payments, deadlines, savings goals
2. **Explore government programs**: Youth housing support, subsidies, etc.
3. **Manage finances**: Track savings and spending habits
4. **AI chatbot assistance**: Financial guidance and Q&A
5. **Personalized recommendations**: Based on user profile and goals

### Target Audience

- **Primary**: Korean youth (20-30s) seeking financial literacy
- **Platform**: iOS, Android, Web (via Expo)
- **Language**: Korean (UI text), English (code/comments)

### Tech Stack Summary

```typescript
// Core
React Native: 0.81.5
Expo: ~54.0.20
TypeScript: ~5.9.2
React: 19.1.0

// Navigation
@react-navigation/native: ^7.1.19
@react-navigation/bottom-tabs: ^7.7.3
@react-navigation/native-stack: ^7.6.2

// UI/Styling
expo-linear-gradient: ~15.0.7
react-native-svg: ^15.14.0
lottie-react-native: ^7.3.4
react-native-chart-kit: ^6.12.0

// Utilities
react-native-safe-area-context: ^5.6.2
expo-blur: ~15.0.7
```

---

## Architecture Deep Dive

### Layered Architecture

```
┌─────────────────────────────────────────┐
│  UI Layer (Screens + Components)       │
│  - screens/*.tsx                        │
│  - components/**/*.tsx                  │
└──────────────┬──────────────────────────┘
               │ Uses
┌──────────────▼──────────────────────────┐
│  Service Layer (Data Abstraction)       │
│  - services/homeService.ts              │
│  - services/chatService.ts              │
└──────────────┬──────────────────────────┘
               │ Calls (future)
┌──────────────▼──────────────────────────┐
│  Backend API (To Be Implemented)        │
│  - REST API endpoints                   │
│  - Authentication                       │
└─────────────────────────────────────────┘
```

### Separation of Concerns

#### 1. UI Layer (Presentation)

**Responsibility**: Display data, handle user interaction

**Rules**:
- NEVER fetch data directly
- ALWAYS use services for data
- ONLY handle UI state (loading, errors, etc.)
- Use theme system for all styling

**Example**:
```typescript
// ✅ CORRECT
const HomeScreen = () => {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    homeService.getHomeData()
      .then(setData)
      .catch(console.error);
  }, []);

  return <View>{/* Render data */}</View>;
};

// ❌ WRONG - Don't fetch directly
const HomeScreen = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/home')  // ❌ Direct fetch
      .then(res => res.json())
      .then(setData);
  }, []);
};
```

#### 2. Service Layer (Data Access)

**Responsibility**: Abstract data fetching, provide clean API to UI

**Rules**:
- Return typed Promise objects
- Handle errors gracefully
- Currently returns dummy data (switch to real API later)
- One service per domain (home, chat, etc.)

**Example**:
```typescript
// src/services/homeService.ts
export const homeService = {
  async getHomeData(): Promise<HomeData> {
    // Currently: return dummy data
    return Promise.resolve(DUMMY_HOME_DATA);

    // Future: call real API
    // const response = await fetch('https://api.example.com/home');
    // return response.json();
  },
};
```

#### 3. Type Layer (Contracts)

**Responsibility**: Define all data structures

**Rules**:
- Every API response has a type
- No `any` types
- Export from `src/types/index.ts`
- Document with JSDoc

**Example**:
```typescript
// src/types/home.ts
/**
 * Home screen data structure
 */
export interface HomeData {
  greeting: GreetingData;
  todayItems: TodayItem[];
  savings: SavingsData;
  spending: SpendingData;
}
```

---

## File Structure & Locations

### Complete Directory Tree

```
FinKuRN/
├── App.tsx                          # Entry point
├── index.ts                         # Expo entry
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── app.json                         # Expo config
│
├── 📁 src/
│   ├── 📁 components/               # Reusable components
│   │   ├── 📁 common/               # Shared across app
│   │   │   ├── BackgroundGradient.tsx  # Gradient backgrounds
│   │   │   ├── StatusBar.tsx           # Custom status bar
│   │   │   └── index.ts                # Barrel export
│   │   │
│   │   ├── 📁 home/                 # HomeScreen specific
│   │   │   ├── FilterChips.tsx         # Filter chip row
│   │   │   ├── SavingsSection.tsx      # Savings display
│   │   │   ├── SpendingSection.tsx     # Spending display
│   │   │   ├── TodayItem.tsx           # Single today item
│   │   │   └── index.ts                # Barrel export
│   │   │
│   │   ├── ArrowIcon.tsx            # Arrow icon component
│   │   ├── ChatItem.tsx             # Chat list item
│   │   └── NavIcons.tsx             # Bottom tab icons
│   │
│   ├── 📁 constants/                # Theme & design tokens
│   │   ├── theme.ts                    # Colors, typography, spacing
│   │   └── gradients.ts                # Gradient configurations
│   │
│   ├── 📁 navigation/               # Navigation setup
│   │   └── MainNavigator.tsx           # Tab + Stack navigation
│   │
│   ├── 📁 screens/                  # Main app screens
│   │   ├── HomeScreen.tsx              # 1️⃣ Dashboard
│   │   ├── ExploreScreen.tsx           # 2️⃣ Policy explorer
│   │   ├── ChatbotScreenV2.tsx         # 3️⃣ Chat list
│   │   ├── ChatConversationPage.tsx    # 4️⃣ Chat conversation
│   │   ├── NewChatPage.tsx             # 5️⃣ New chat creation
│   │   ├── TodayListScreen.tsx         # 6️⃣ Today's tasks
│   │   └── PlanUpgradePage.tsx         # 7️⃣ Plan upgrade
│   │
│   ├── 📁 services/                 # Data access layer
│   │   ├── homeService.ts              # Home data fetching
│   │   ├── chatService.ts              # Chat data fetching
│   │   └── index.ts                    # Barrel export
│   │
│   └── 📁 types/                    # TypeScript types
│       ├── home.ts                     # Home screen types
│       ├── chat.ts                     # Chat types
│       ├── navigation.ts               # Navigation types
│       └── index.ts                    # Barrel export
│
└── 📄 Documentation/
    ├── README.md                    # Quick start guide
    ├── AI_MANUAL.md                 # This file
    ├── PROJECT_OVERVIEW.md          # Detailed project guide
    ├── API_SPECIFICATION.md         # Backend API specs
    └── BACKEND_INTEGRATION_GUIDE.md # Backend integration
```

### File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Screens | PascalCase + `Screen` or `Page` | `HomeScreen.tsx` |
| Components | PascalCase | `FilterChips.tsx` |
| Services | camelCase + `Service` | `homeService.ts` |
| Types | camelCase (file), PascalCase (interface) | `home.ts` → `HomeData` |
| Constants | camelCase | `theme.ts`, `gradients.ts` |

---

## Design System & Styling Rules

### Theme System (src/constants/theme.ts)

**CRITICAL**: Never hardcode colors, spacing, or typography. Always use theme.

#### Colors

```typescript
import { theme } from '../constants/theme';

// Available colors
theme.colors.primary        // #3060f1 (blue)
theme.colors.background     // #f3f6fb (light blue-gray)
theme.colors.surface        // #ffffff (white)
theme.colors.black          // #000000
theme.colors.white          // #ffffff

// Text colors
theme.colors.textPrimary    // #111111 (dark)
theme.colors.textSecondary  // #767676 (gray)
theme.colors.textTertiary   // #cbcbcb (light gray)
theme.colors.textPlaceholder // #a3a3a3

// Semantic colors
theme.colors.success        // #34c759 (green)
theme.colors.warning        // #ffcc00 (yellow)
theme.colors.error          // #ff3b30 (red)
theme.colors.info           // #007aff (blue)

// UI colors
theme.colors.border         // #e5e7eb
theme.colors.inputBackground // rgba(0,0,0,0.05)
theme.colors.cardBackground // #ffffff
```

#### Typography

```typescript
// Headings
theme.typography.heading1  // 24px, 700
theme.typography.heading2  // 22px, 700
theme.typography.heading3  // 18px, 600
theme.typography.heading4  // 16px, 600

// Body text
theme.typography.body1     // 16px, 400
theme.typography.body2     // 14px, 400
theme.typography.body3     // 12px, 500
theme.typography.caption   // 11px, 400

// Usage example
const styles = StyleSheet.create({
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
  },
});
```

#### Spacing

```typescript
theme.spacing.xs    // 4px
theme.spacing.sm    // 8px
theme.spacing.md    // 16px
theme.spacing.lg    // 18px
theme.spacing.xl    // 24px
theme.spacing.xxl   // 32px
theme.spacing.xxxl  // 40px

// Layout specific
theme.layout.statusBarHeight  // 64px
theme.layout.tabBarHeight     // 83px
```

#### Border Radius

```typescript
theme.borderRadius.sm    // 8px
theme.borderRadius.md    // 12px
theme.borderRadius.lg    // 16px
theme.borderRadius.xl    // 20px
theme.borderRadius.xxl   // 24px
theme.borderRadius.xxxl  // 32px
theme.borderRadius.full  // 9999px
```

### Styling Patterns

#### ✅ CORRECT Styling

```typescript
import { StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
});
```

#### ❌ WRONG Styling

```typescript
// ❌ Don't hardcode colors
backgroundColor: '#f3f6fb',

// ❌ Don't hardcode spacing
padding: 16,
marginBottom: 8,

// ❌ Don't hardcode typography
fontSize: 24,
fontWeight: '700',

// ✅ ALWAYS use theme
backgroundColor: theme.colors.background,
padding: theme.spacing.md,
...theme.typography.heading1,
```

### Font Family

```typescript
// ALWAYS use 'Pretendard Variable' for Korean text
fontFamily: 'Pretendard Variable',

// Example
const styles = StyleSheet.create({
  koreanText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '400',
  },
});
```

---

## Component Patterns

### Component Structure Template

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

/**
 * ComponentName Component
 *
 * Brief description of what this component does.
 *
 * @param prop1 - Description of prop1
 * @param prop2 - Description of prop2
 *
 * @example
 * ```tsx
 * <ComponentName prop1="value" prop2={42} />
 * ```
 */
interface ComponentNameProps {
  prop1: string;
  prop2: number;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{prop1}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  text: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
  },
});
```

### Common Component Types

#### 1. Presentational Component (No State)

```typescript
// components/home/TodayItem.tsx
interface TodayItemProps {
  title: string;
  dday: string;
  detail: React.ReactNode;
  description: string;
}

export const TodayItem: React.FC<TodayItemProps> = ({
  title,
  dday,
  detail,
  description,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.dday}>{dday}</Text>
      {detail}
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};
```

#### 2. Container Component (With State)

```typescript
// screens/HomeScreen.tsx
export const HomeScreen: React.FC = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    homeService.getHomeData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <ErrorView />;

  return (
    <View style={styles.container}>
      {/* Render with data */}
    </View>
  );
};
```

#### 3. Reusable Component with Customization

```typescript
// components/home/FilterChips.tsx
interface FilterChipsProps {
  filters: string[];
  selectedFilter: string | null;
  onFilterPress: (filter: string | null) => void;
  scrollable?: boolean;  // Optional customization
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  selectedFilter,
  onFilterPress,
  scrollable = false,
}) => {
  const Container = scrollable ? ScrollView : View;

  return (
    <Container {...containerProps}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          onPress={() => onFilterPress(filter)}
        >
          <Text>{filter}</Text>
        </TouchableOpacity>
      ))}
    </Container>
  );
};
```

### Component Size Guidelines

- **Single component**: < 400 lines (including styles)
- **If > 400 lines**: Break into smaller components
- **Extract logic**: Use custom hooks if state logic is complex

---

## Data Flow & State Management

### Data Fetching Pattern

```typescript
// 1. Define types (src/types/home.ts)
export interface HomeData {
  greeting: GreetingData;
  todayItems: TodayItem[];
}

// 2. Create service (src/services/homeService.ts)
export const homeService = {
  async getHomeData(): Promise<HomeData> {
    // Return dummy data for now
    return Promise.resolve(DUMMY_HOME_DATA);
  },
};

// 3. Use in component (src/screens/HomeScreen.tsx)
export const HomeScreen = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    homeService.getHomeData()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;
  if (!data) return <Text>No data</Text>;

  return <View>{/* Render data */}</View>;
};
```

### State Management Rules

1. **Local State**: Use `useState` for component-specific state
2. **Shared State**: Pass props down (no global state library yet)
3. **Forms**: Use controlled components with `useState`
4. **Loading/Error**: Always handle in UI layer

### Example: Loading States

```typescript
const [loading, setLoading] = useState(true);
const [data, setData] = useState<Data | null>(null);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  setLoading(true);
  service.getData()
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);

// Render
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
return <DataView data={data} />;
```

---

## TypeScript Conventions

### Type Definitions

```typescript
// ✅ Use interfaces for object shapes
interface UserData {
  id: string;
  name: string;
  email: string;
}

// ✅ Use type aliases for unions
type Status = 'pending' | 'success' | 'error';

// ✅ Use generics for reusable types
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// ❌ Never use 'any'
const badFunction = (data: any) => { };  // ❌

// ✅ Use specific types
const goodFunction = (data: UserData) => { };  // ✅
```

### Component Props

```typescript
// ✅ Define interface for props
interface MyComponentProps {
  title: string;
  count: number;
  onPress?: () => void;  // Optional prop
  children?: React.ReactNode;  // For nested content
}

// ✅ Use React.FC with props
export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  count,
  onPress,
  children,
}) => {
  return <View>{/* ... */}</View>;
};
```

### Service Return Types

```typescript
// ✅ Always type service returns
export const homeService = {
  // Explicitly type return
  async getHomeData(): Promise<HomeData> {
    return Promise.resolve(DUMMY_HOME_DATA);
  },

  // For functions that might fail
  async deleteItem(id: string): Promise<void> {
    // Returns nothing on success
  },
};
```

---

## Common Tasks & Code Examples

### Task 1: Create a New Screen

```typescript
// 1. Create file: src/screens/MyNewScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { BackgroundGradient } from '../components/common/BackgroundGradient';
import { StatusBar } from '../components/common/StatusBar';

/**
 * MyNewScreen Component
 *
 * Description of what this screen does.
 */
export const MyNewScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <BackgroundGradient layers={[/* gradient config */]} />
      <StatusBar />

      <Text style={styles.title}>My New Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
    padding: theme.spacing.md,
  },
});

// 2. Add to navigation: src/navigation/MainNavigator.tsx
import { MyNewScreen } from '../screens/MyNewScreen';

// Add to stack navigator
<Stack.Screen name="MyNew" component={MyNewScreen} />

// 3. Add to navigation types: src/types/navigation.ts
export type RootStackParamList = {
  // ... existing screens
  MyNew: undefined;  // undefined if no params
};
```

### Task 2: Create a Reusable Component

```typescript
// 1. Create file: src/components/common/MyComponent.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';

/**
 * MyComponent Component
 *
 * Brief description.
 *
 * @param title - The title to display
 * @param onPress - Callback when pressed
 *
 * @example
 * ```tsx
 * <MyComponent title="Hello" onPress={() => console.log('pressed')} />
 * ```
 */
interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  title: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
  },
});

// 2. Export from barrel: src/components/common/index.ts
export { MyComponent } from './MyComponent';

// 3. Use in screen
import { MyComponent } from '../components/common';

<MyComponent title="Click me" onPress={() => alert('Clicked!')} />
```

### Task 3: Add a New Service

```typescript
// 1. Define types: src/types/myFeature.ts
export interface MyFeatureData {
  id: string;
  name: string;
  value: number;
}

// 2. Export from barrel: src/types/index.ts
export * from './myFeature';

// 3. Create service: src/services/myFeatureService.ts
import { MyFeatureData } from '../types';

const DUMMY_DATA: MyFeatureData[] = [
  { id: '1', name: 'Item 1', value: 100 },
  { id: '2', name: 'Item 2', value: 200 },
];

export const myFeatureService = {
  /**
   * Get all feature data
   */
  async getFeatureData(): Promise<MyFeatureData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve(DUMMY_DATA);
  },

  /**
   * Get single item by ID
   */
  async getFeatureItem(id: string): Promise<MyFeatureData | null> {
    const item = DUMMY_DATA.find(d => d.id === id);
    return Promise.resolve(item || null);
  },
};

// 4. Export from barrel: src/services/index.ts
export { myFeatureService } from './myFeatureService';

// 5. Use in component
import { myFeatureService } from '../services';

const [data, setData] = useState<MyFeatureData[]>([]);

useEffect(() => {
  myFeatureService.getFeatureData()
    .then(setData)
    .catch(console.error);
}, []);
```

### Task 4: Style an Existing Component

```typescript
// ❌ WRONG - Don't modify inline
<View style={{ backgroundColor: '#f3f6fb', padding: 16 }}>

// ✅ CORRECT - Use StyleSheet and theme
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
});

<View style={styles.container}>

// ✅ CORRECT - Override with multiple styles
<View style={[styles.container, styles.highlighted]}>

// ✅ CORRECT - Conditional styling
<View style={[styles.container, isActive && styles.active]}>
```

---

## Integration Points

### Backend Integration Checklist

When backend APIs are ready, follow these steps:

#### 1. Update Service Layer

```typescript
// src/services/homeService.ts

// BEFORE (dummy data)
export const homeService = {
  async getHomeData(): Promise<HomeData> {
    return Promise.resolve(DUMMY_HOME_DATA);
  },
};

// AFTER (real API)
const API_BASE_URL = 'https://api.finkurn.com';

export const homeService = {
  async getHomeData(): Promise<HomeData> {
    const response = await fetch(`${API_BASE_URL}/api/home`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
```

#### 2. Add Error Handling

```typescript
// UI layer should handle errors from service
useEffect(() => {
  homeService.getHomeData()
    .then(setData)
    .catch(error => {
      console.error('Failed to fetch home data:', error);
      setError(error.message);
    })
    .finally(() => setLoading(false));
}, []);
```

#### 3. Environment Configuration

```typescript
// Create src/config/api.ts
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:3000'  // Development
    : 'https://api.finkurn.com',  // Production
};

// Use in services
import { API_CONFIG } from '../config/api';

const response = await fetch(`${API_CONFIG.BASE_URL}/api/home`);
```

### Navigation Integration

```typescript
// Type-safe navigation
import { useNavigation } from '@react-navigation/native';
import type { AppNavigation } from '../types/navigation';

const MyComponent = () => {
  const navigation = useNavigation<AppNavigation>();

  const handlePress = () => {
    // Navigate to ChatConversation with params
    navigation.navigate('ChatConversation', {
      chatId: '123',
      chatTitle: 'My Chat',
    });
  };

  return <Button onPress={handlePress} title="Go to Chat" />;
};
```

---

## Known Issues & Workarounds

### TypeScript Errors (Non-Blocking)

The following TypeScript errors exist but don't affect runtime:

1. **`@expo/vector-icons` type errors**
   - **Issue**: Missing type declarations
   - **Impact**: None (works at runtime)
   - **Workaround**: Ignore or add `// @ts-ignore` if needed

2. **LinearGradient type mismatch**
   - **File**: `src/components/common/BackgroundGradient.tsx:71`
   - **Issue**: Color array type not matching required tuple
   - **Impact**: None (works at runtime)
   - **Fix**: Cast to required type if needed

3. **Route type constraint error**
   - **File**: `src/screens/ChatConversationPage.tsx:38`
   - **Issue**: Route params type not matching
   - **Impact**: None (works at runtime)
   - **Fix**: Use proper React Navigation route types

### Platform-Specific Issues

- **Web**: Some native features may not work (camera, notifications)
- **iOS**: Requires Apple Developer account for testing on device
- **Android**: Requires Android Studio and emulator setup

### Performance Considerations

- **Large lists**: Use `FlatList` instead of `ScrollView` for performance
- **Images**: Use `resizeMode` and optimize image sizes
- **Animations**: Use `react-native-reanimated` for better performance (not yet integrated)

---

## AI Development Rules

### MUST Follow

1. ✅ **Single Responsibility Principle**
   - Each component/function does ONE thing
   - Break large components into smaller ones

2. ✅ **DRY (Don't Repeat Yourself)**
   - Extract repeated code into reusable components
   - Use theme system instead of repeating values

3. ✅ **Type Safety**
   - ZERO `any` types
   - All props, state, and function returns must be typed
   - Use strict TypeScript

4. ✅ **Theme System**
   - NEVER hardcode colors, spacing, or typography
   - ALWAYS use `theme.colors.*`, `theme.spacing.*`, etc.

5. ✅ **Documentation**
   - Add JSDoc comments to all components and functions
   - Include `@param`, `@returns`, and `@example`

6. ✅ **Component Size**
   - Keep components under 400 lines (including styles)
   - Split large components

7. ✅ **Naming Conventions**
   - Components: PascalCase (`MyComponent.tsx`)
   - Services: camelCase + Service (`myService.ts`)
   - Types: PascalCase (`MyType`)
   - Files: Match component name

### NEVER Do

1. ❌ **Never use emojis in code**
   - OK in markdown docs
   - NOT OK in TypeScript/JSX

2. ❌ **Never hardcode values**
   ```typescript
   // ❌ WRONG
   backgroundColor: '#f3f6fb'
   padding: 16
   fontSize: 24

   // ✅ CORRECT
   backgroundColor: theme.colors.background
   padding: theme.spacing.md
   ...theme.typography.heading1
   ```

3. ❌ **Never use `any` type**
   ```typescript
   // ❌ WRONG
   const myFunction = (data: any) => { }

   // ✅ CORRECT
   const myFunction = (data: MyDataType) => { }
   ```

4. ❌ **Never fetch data directly in components**
   ```typescript
   // ❌ WRONG
   fetch('https://api.example.com/data')

   // ✅ CORRECT
   myService.getData()
   ```

5. ❌ **Never skip error handling**
   ```typescript
   // ❌ WRONG
   useEffect(() => {
     service.getData().then(setData);
   }, []);

   // ✅ CORRECT
   useEffect(() => {
     service.getData()
       .then(setData)
       .catch(setError)
       .finally(() => setLoading(false));
   }, []);
   ```

### Best Practices

1. **Always handle loading states**
   ```typescript
   if (loading) return <ActivityIndicator />;
   if (error) return <ErrorView error={error} />;
   if (!data) return <EmptyState />;
   return <DataView data={data} />;
   ```

2. **Always use barrel exports**
   ```typescript
   // components/common/index.ts
   export { StatusBar } from './StatusBar';
   export { BackgroundGradient } from './BackgroundGradient';

   // Usage
   import { StatusBar, BackgroundGradient } from '../components/common';
   ```

3. **Always clean up effects**
   ```typescript
   useEffect(() => {
     let isMounted = true;

     fetchData().then(data => {
       if (isMounted) setData(data);
     });

     return () => {
       isMounted = false;
     };
   }, []);
   ```

---

## Quick Reference

### Import Paths

```typescript
// Theme
import { theme } from '../constants/theme';

// Services
import { homeService, chatService } from '../services';

// Types
import type { HomeData, ChatMessage } from '../types';

// Components
import { StatusBar, BackgroundGradient } from '../components/common';
import { FilterChips, TodayItem } from '../components/home';

// Navigation
import { useNavigation } from '@react-navigation/native';
import type { AppNavigation } from '../types/navigation';
```

### Code Snippets

#### Basic Component
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  title: string;
}

export const MyComponent: React.FC<Props> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
  },
});
```

#### Data Fetching
```typescript
const [data, setData] = useState<DataType | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  myService.getData()
    .then(setData)
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
}, []);
```

---

## Summary for AI

**This project is**:
- React Native + Expo + TypeScript
- Well-structured with clear separation of concerns
- Fully typed (no `any`)
- Theme-based (no hardcoded values)
- Service layer ready for backend
- Comprehensively documented

**When coding**:
1. Read component JSDoc first
2. Use theme system for all styling
3. Follow existing patterns
4. Add JSDoc to new code
5. Keep components small (<400 lines)
6. Never use `any` or hardcode values

**Quick checks**:
- ✅ Used `theme.*` for all styling?
- ✅ Added TypeScript types?
- ✅ Wrote JSDoc comments?
- ✅ Followed naming conventions?
- ✅ Kept component under 400 lines?
- ✅ Handled loading/error states?

---

**Last Updated**: 2025-01-04
**For Questions**: Check README.md, PROJECT_OVERVIEW.md, or specific file JSDoc comments
