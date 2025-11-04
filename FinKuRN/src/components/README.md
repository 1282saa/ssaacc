# Components Documentation

This document provides detailed guidance on the component architecture for FinKuRN, optimized for AI-assisted development and team collaboration.

## Overview

Components in FinKuRN follow a strict hierarchy and Single Responsibility Principle (SRP). Each component has ONE clear purpose and is organized by scope of use.

## Directory Structure

```
components/
├── common/              # Components used by 2+ screens
│   ├── StatusBar.tsx           # iOS-style status bar (used by all screens)
│   ├── BackgroundGradient.tsx  # Gradient background wrapper (used by all screens)
│   ├── ChatItem.tsx            # Chat message bubble (used by chat screens)
│   └── index.ts                # Barrel export
│
├── home/                # Components specific to HomeScreen
│   ├── TodayItem.tsx           # Today task item with D-day
│   ├── FilterChips.tsx         # Filter chip list
│   ├── SavingsSection.tsx      # Savings overview section
│   ├── SpendingSection.tsx     # Spending overview section
│   └── index.ts                # Barrel export
│
├── ArrowIcon.tsx        # Arrow icon (standalone)
└── NavIcons.tsx         # Bottom navigation icons (standalone)
```

## Component Organization Principles

### 1. Component Placement Rules

**common/** - Place component here if:
- Used by 2 or more screens
- Provides core UI functionality (StatusBar, BackgroundGradient)
- Represents shared data structures (ChatItem)

**[screen-name]/** - Place component here if:
- Used exclusively by one screen
- Implements screen-specific business logic
- Manages screen-specific state

**Root components/** - Place component here if:
- Standalone utility component
- Icon components
- Not clearly tied to a specific screen or common pattern

### 2. When to Create a New Component

Create a new component when ANY of these conditions are met:

1. **Code Duplication (DRY Principle)**
   - Same UI structure repeated 3+ times
   - Example: TodayItem eliminated 5 identical structures in HomeScreen

2. **Single Responsibility Violation**
   - Component exceeds 400 lines
   - Component manages multiple independent concerns
   - Example: HomeScreen was 818 lines with 5 responsibilities

3. **State Management Complexity**
   - Section has its own independent state (visibility, filtering, etc.)
   - Example: SavingsSection manages savingsVisible and selectedSavingsFilter

4. **Logical Self-Containment**
   - UI element has clear boundaries and purpose
   - Can be described in one sentence
   - Example: FilterChips renders a list of selectable filter buttons

### 3. Component Naming Conventions

- **PascalCase** for all component files: `TodayItem.tsx`, `FilterChips.tsx`
- **Descriptive names** that indicate purpose: `SavingsSection` not `Section1`
- **Avoid generic names**: Use `TodayItem` not `Item`
- **Barrel exports**: Always use `index.ts` in component folders

## Common Components

### StatusBar

**Purpose**: Displays iOS-style status bar with time and system icons.

**Location**: `components/common/StatusBar.tsx`

**Usage**:
```tsx
import { StatusBar } from '../components/common';

<StatusBar />
```

**Key Features**:
- No props required
- Absolutely positioned at top
- Always displays current time and system icons
- Used by all screens

**When to use**: At the top of every screen that needs iOS-style status bar.

---

### BackgroundGradient

**Purpose**: Renders multiple blurred gradient layers for ambient background effects.

**Location**: `components/common/BackgroundGradient.tsx`

**Usage**:
```tsx
import { BackgroundGradient } from '../components/common';
import { HOME_GRADIENTS } from '../constants/gradients';

<BackgroundGradient layers={HOME_GRADIENTS} />
```

**Props**:
- `layers`: Array of gradient layer definitions (from gradients.ts)
- `size?`: Optional size override (default: 600)

**Key Features**:
- Absolutely positioned behind content
- Uses predefined gradients from `constants/gradients.ts`
- Supports multiple overlapping gradient layers
- BlurView integration for ambient effect

**When to use**: As the first child in a screen's View to create background ambiance.

---

### ChatItem

**Purpose**: Chat message bubble component for displaying user/AI messages.

**Location**: `components/common/ChatItem.tsx`

**Usage**:
```tsx
import { ChatItem } from '../components/common';

<ChatItem sender="user" text="Hello!" timestamp="10:30 AM" />
<ChatItem sender="ai" text="Hi there!" timestamp="10:31 AM" />
```

**Props**:
- `sender`: 'user' | 'ai'
- `text`: Message content
- `timestamp`: Time string

**Key Features**:
- Different styles for user vs AI messages
- Right-aligned for user, left-aligned for AI
- Includes timestamp
- Used by ChatbotScreenV2 and ChatConversationPage

**When to use**: Whenever displaying chat messages in conversation views.

## Home Components

These components were created during the HomeScreen refactoring (2025-11) to break down an 818-line component into focused, reusable pieces.

### TodayItem

**Purpose**: Displays a single today task with D-day countdown and details.

**Location**: `components/home/TodayItem.tsx`

**Usage**:
```tsx
import { TodayItem } from '../components/home';

<TodayItem
  title="공과금 납부"
  dday="D-DAY"
  detail={
    <>
      <Text style={styles.normalText}>이번 달 전기요금 </Text>
      <Text style={styles.highlightText}>43,200원</Text>
    </>
  }
  description="오늘 납부하지 않으면 연체료 2%가 부가돼요"
/>
```

**Props**:
- `title`: Task title
- `dday`: D-day string (e.g., "D-DAY", "D-2")
- `detail`: React.ReactNode for detail content (allows styled text)
- `description`: Helper description text

**Key Features**:
- Consistent layout for all today items
- Supports inline styled text in detail prop
- Eliminated 5 duplicate structures in HomeScreen
- Reduced code from 200+ lines to single reusable component

**When to use**: For displaying any today task item in HomeScreen or TodayListScreen.

---

### FilterChips

**Purpose**: Renders filter chip list with selection state (scrollable or fixed layout).

**Location**: `components/home/FilterChips.tsx`

**Usage**:
```tsx
import { FilterChips } from '../components/home';

const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

<FilterChips
  filters={['전체', '내 집 마련 적금', '여름 여행', '비상금']}
  selectedFilter={selectedFilter}
  onFilterPress={setSelectedFilter}
  scrollable={false}
/>
```

**Props**:
- `filters`: Array of filter option strings
- `selectedFilter`: Currently selected filter (null for none)
- `onFilterPress`: Callback when filter is pressed (receives filter string or null)
- `scrollable?`: Whether to use ScrollView (default: false)

**Key Features**:
- Dynamic container (ScrollView vs View) based on scrollable prop
- Active/inactive visual states
- Deselects filter when clicking active filter again
- Reused by both SavingsSection and SpendingSection

**When to use**: Whenever you need a horizontal filter chip list with selection behavior.

---

### SavingsSection

**Purpose**: Complete savings overview section with state management, filtering, and chart visualization.

**Location**: `components/home/SavingsSection.tsx`

**Usage**:
```tsx
import { SavingsSection } from '../components/home';

<SavingsSection savingsFilters={['전체', '내 집 마련 적금', '여름 여행', '비상금']} />
```

**Props**:
- `savingsFilters`: Array of filter options

**Internal State**:
- `savingsVisible`: Toggle visibility of section
- `selectedSavingsFilter`: Currently selected filter

**Key Features**:
- Manages own state (visibility, filtering)
- Includes FilterChips component
- Chart visualization with bar graph
- Show/hide toggle
- Complete self-contained section

**When to use**: Only in HomeScreen for savings overview. Do not reuse elsewhere.

---

### SpendingSection

**Purpose**: Complete spending overview section with state management, filtering, and category breakdown.

**Location**: `components/home/SpendingSection.tsx`

**Usage**:
```tsx
import { SpendingSection } from '../components/home';

<SpendingSection spendingFilters={['오늘', '이번 주', '이번 달']} />
```

**Props**:
- `spendingFilters`: Array of filter options

**Internal State**:
- `spendingVisible`: Toggle visibility of section
- `selectedSpendingFilter`: Currently selected filter

**Key Features**:
- Manages own state (visibility, filtering)
- Includes FilterChips component
- Category breakdown with percentages
- Show/hide toggle
- Complete self-contained section

**When to use**: Only in HomeScreen for spending overview. Do not reuse elsewhere.

## Component Creation Workflow

When creating a new component, follow this checklist:

### 1. Planning Phase

- [ ] Identify clear single responsibility
- [ ] Determine component location (common/ vs screen-specific/)
- [ ] Define props interface
- [ ] Check if similar component already exists
- [ ] Verify component is needed (not premature abstraction)

### 2. Implementation Phase

- [ ] Create component file in appropriate location
- [ ] Write comprehensive JSDoc comment
- [ ] Define props interface with TypeScript
- [ ] Implement component function
- [ ] Create StyleSheet using theme tokens
- [ ] Add to barrel export (index.ts)

### 3. Integration Phase

- [ ] Import in parent component
- [ ] Replace duplicated code with new component
- [ ] Test component in all usage contexts
- [ ] Verify TypeScript compilation (`npx tsc --noEmit`)
- [ ] Update component README if architectural change

## Component Template

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

/**
 * ComponentName Component
 *
 * Brief description of what this component does and why it exists.
 * Include context about Single Responsibility and usage scope.
 *
 * @param propName - Description of what this prop controls
 * @param anotherProp - Description of what this prop controls
 *
 * @example
 * ```tsx
 * <ComponentName propName="value" anotherProp={123} />
 * ```
 */
interface ComponentNameProps {
  propName: string;
  anotherProp: number;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  propName,
  anotherProp,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{propName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
  },
  text: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
  },
});
```

## Styling Best Practices

### Always Use Theme Tokens

```tsx
// GOOD
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
  },
});

// BAD - Never hardcode values
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
});
```

### Component-Specific Overrides

Only hardcode values when theme doesn't have appropriate token:

```tsx
// Acceptable - specific offset not in theme
policyImage1: {
  position: 'absolute',
  top: 60,
  left: -3,
  width: 108,
  height: 108,
}

// But prefer theme when possible
todayBadge: {
  width: 16,
  height: 16,
  borderRadius: 8,  // Half of width/height
  backgroundColor: theme.colors.primary,
}
```

## Refactoring Guidelines

### When to Break Down a Component

Break down a component when:

1. **File exceeds 400 lines**
   - Extract logical sections into separate components
   - Example: HomeScreen was 818 lines, broken into 4 components

2. **Multiple useState hooks for independent concerns**
   - Each state group should have its own component
   - Example: SavingsSection manages savingsVisible and selectedSavingsFilter

3. **Duplicated JSX structures**
   - 3+ identical structures = create reusable component
   - Example: 5 TodayItem structures → TodayItem component

4. **Difficult to describe component purpose in one sentence**
   - Component likely has multiple responsibilities
   - Split into focused components

### Refactoring Process

1. **Identify responsibilities** in large component
2. **Create new component files** in appropriate location
3. **Move code** (JSX + styles + state) to new components
4. **Add barrel exports** to index.ts
5. **Update parent component** to use new components
6. **Test thoroughly** in all usage scenarios
7. **Clear Metro bundler cache** if issues occur
8. **Update documentation** (this README, src/README.md)

## AI Collaboration Best Practices

When working with AI assistants (like Claude Code):

### 1. Read Component Documentation First

Before modifying or creating components:
- Read this README
- Read component JSDoc comments
- Check existing components for similar functionality

### 2. Follow Established Patterns

- Use same import order as other components
- Follow same file structure (imports, types, component, styles)
- Use theme tokens consistently
- Match existing naming conventions

### 3. Document Your Changes

When creating new components:
- Write comprehensive JSDoc comments
- Add usage examples
- Update this README if adding new patterns
- Add to barrel exports

### 4. Communicate Component Purpose

In JSDoc, clearly state:
- What the component does (single responsibility)
- Why it exists (problem it solves)
- Where it's used (scope)
- How to use it (example)

### 5. Maintain Type Safety

- No `any` types
- Define all prop interfaces
- Use proper React.FC typing
- Import types separately from values

## Common Pitfalls to Avoid

### 1. Premature Abstraction

Don't create reusable components too early:
- Wait until code is duplicated 3+ times
- Ensure abstraction actually simplifies code
- Avoid over-engineering simple components

### 2. Wrong Component Location

```
WRONG: Put HomeScreen-specific component in common/
RIGHT: Create components/home/ folder for screen-specific components

WRONG: Duplicate StatusBar in each screen folder
RIGHT: Keep in common/ since used by all screens
```

### 3. Hardcoding Values

```tsx
// WRONG
backgroundColor: '#3060F1'
fontSize: 16
padding: 12

// RIGHT
backgroundColor: theme.colors.primary
...theme.typography.body1
padding: theme.spacing.md
```

### 4. Missing Barrel Exports

Always update `index.ts` when creating new components:

```tsx
// components/home/index.ts
export { TodayItem } from './TodayItem';
export { FilterChips } from './FilterChips';
export { SavingsSection } from './SavingsSection';
export { SpendingSection } from './SpendingSection';
```

### 5. Inline Styles

```tsx
// WRONG - Inline styles are harder to maintain
<View style={{ padding: 16, backgroundColor: '#FFF' }}>

// RIGHT - Use StyleSheet.create
<View style={styles.container}>

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
});
```

## Testing Checklist

Before committing new components:

- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Component appears correctly in all usage contexts
- [ ] Theme tokens used instead of hardcoded values
- [ ] JSDoc comment is comprehensive
- [ ] Props interface is well-defined
- [ ] Component added to barrel export
- [ ] Metro bundler cache cleared if needed
- [ ] No console errors or warnings
- [ ] Component follows Single Responsibility Principle
- [ ] Documentation updated (if needed)

## Questions or Issues?

When encountering component-related questions:

1. Check this README first
2. Check component JSDoc comments
3. Look for similar components as examples
4. Review `src/README.md` for broader context
5. Check `REFACTORING_SUMMARY.md` for recent changes

For architectural questions, refer to `src/README.md`.
