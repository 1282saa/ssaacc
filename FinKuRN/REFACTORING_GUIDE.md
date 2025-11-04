# Refactoring Guide

This guide explains how to refactor the remaining screens to use the new shared components and theme system.

## Refactoring Status

- [x] ChatConversationPage.tsx - COMPLETED
- [x] NewChatPage.tsx - COMPLETED
- [x] ChatbotScreenV2.tsx - COMPLETED
- [x] HomeScreen.tsx - COMPLETED
- [x] ExploreScreen.tsx - COMPLETED
- [x] TodayListScreen.tsx - COMPLETED
- [x] PlanUpgradePage.tsx - COMPLETED

All 7 screens have been successfully refactored with 100% coverage!

## Step-by-Step Refactoring Process

### 1. Update Imports

Replace hardcoded imports with theme and common components:

**Before:**
```tsx
import { LinearGradient } from 'expo-linear-gradient';
```

**After:**
```tsx
import { StatusBar } from '../components/common/StatusBar';
import { BackgroundGradient } from '../components/common/BackgroundGradient';
import { CHAT_GRADIENTS_LARGE } from '../constants/gradients';
import { theme } from '../constants/theme';
import type { AppNavigation } from '../types/navigation';
```

### 2. Replace Status Bar

**Before:**
```tsx
<View style={styles.statusBar}>
  <Text style={styles.statusTime}>9:41</Text>
  <Image
    source={{ uri: 'https://c.animaapp.com/FbLlYdc1/img/right-side@2x.png' }}
    style={styles.statusIcons}
    resizeMode="contain"
  />
</View>
```

**After:**
```tsx
<StatusBar />
```

**Remove from styles:**
```tsx
// DELETE THESE
statusBar: { ... },
statusTime: { ... },
statusIcons: { ... },
```

### 3. Replace Background Gradients

**Before:**
```tsx
<View style={[styles.backgroundGradient, { top: -50, left: -150, opacity: 0.35 }]}>
  <LinearGradient
    colors={['rgba(173, 144, 255, 0.5)', ...]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.gradient}
  />
</View>
// ... repeat for each gradient layer
```

**After:**
```tsx
// For chat screens
<BackgroundGradient layers={CHAT_GRADIENTS_LARGE} size={700} />

// For home/explore screens
<BackgroundGradient layers={HOME_GRADIENTS} />
// or
<BackgroundGradient layers={EXPLORE_GRADIENTS} />
```

**Remove from styles:**
```tsx
// DELETE THESE
backgroundGradient: { ... },
gradient: { ... },
```

### 4. Use Theme Constants

Replace hardcoded values with theme constants:

**Before:**
```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5ff',
  },
  header: {
    top: 56,
    height: 48,
    paddingHorizontal: 16,
    zIndex: 99,
  },
  title: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  card: {
    borderRadius: 32,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
});
```

**After:**
```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    top: theme.layout.headerTop,
    height: theme.layout.headerHeight,
    paddingHorizontal: theme.spacing.lg,
    zIndex: theme.zIndex.header,
  },
  title: {
    ...theme.typography.heading3,
  },
  card: {
    borderRadius: theme.borderRadius.xxxl,
    padding: theme.spacing.xl,
    ...theme.shadows.small,
  },
});
```

### 5. Add TypeScript Types

**Before:**
```tsx
export const NewChatPage: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
```

**After:**
```tsx
import type { AppNavigation } from '../types/navigation';

export const NewChatPage: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();
  const route = useRoute<{ params: RootStackParamList['NewChat'] }>();
```

### 6. Add JSDoc Comments

Add comprehensive JSDoc comments at the top of each component:

```tsx
/**
 * NewChatPage Component
 *
 * Brief description of what this page does.
 *
 * Features:
 * - Feature 1
 * - Feature 2
 * - Feature 3
 */
export const NewChatPage: React.FC = () => {
```

## Theme Reference Quick Guide

### Colors

```tsx
// Backgrounds
theme.colors.background        // #E9E9E9
theme.colors.backgroundLight   // #F5F5FF
theme.colors.surface           // #FFFFFF

// Text
theme.colors.textPrimary       // #000000
theme.colors.textSecondary     // #767676
theme.colors.textTertiary      // #A0A0A0
theme.colors.textPlaceholder   // #D9D9D9

// Brand
theme.colors.primary           // #3060F1
theme.colors.white             // #FFFFFF
theme.colors.black             // #000000
```

### Typography

```tsx
...theme.typography.heading1   // 24px, bold
...theme.typography.heading2   // 20px, bold
...theme.typography.heading3   // 16px, bold
...theme.typography.heading4   // 14px, bold
...theme.typography.body1      // 14px, regular
...theme.typography.body2      // 13px, medium
...theme.typography.body3      // 12px, regular
...theme.typography.caption    // 11px, regular
...theme.typography.button     // 13px, bold
```

### Spacing

```tsx
theme.spacing.xs    // 4
theme.spacing.sm    // 8
theme.spacing.md    // 12
theme.spacing.lg    // 16
theme.spacing.xl    // 20
theme.spacing.xxl   // 24
theme.spacing.xxxl  // 32
```

### Border Radius

```tsx
theme.borderRadius.sm    // 8
theme.borderRadius.md    // 16
theme.borderRadius.lg    // 20
theme.borderRadius.xl    // 24
theme.borderRadius.xxl   // 28
theme.borderRadius.xxxl  // 32
theme.borderRadius.full  // 100
```

### Layout

```tsx
theme.layout.statusBarHeight       // 44
theme.layout.headerHeight          // 48
theme.layout.headerTop             // 56
theme.layout.scrollViewPaddingTop  // 112
```

### Shadows

```tsx
...theme.shadows.small   // Light shadow for cards
...theme.shadows.medium  // Medium shadow for elevated elements
```

### Z-Index

```tsx
theme.zIndex.background  // 0
theme.zIndex.content     // 1
theme.zIndex.header      // 99
theme.zIndex.statusBar   // 100
theme.zIndex.modal       // 1000
```

## Testing After Refactoring

After refactoring each screen, verify:

1. Visual appearance matches original design
2. All interactive elements work correctly
3. Navigation functions properly
4. No TypeScript errors
5. No console warnings

## Common Issues and Solutions

### Issue: Gradient layers not visible

**Solution**: Ensure you're using the correct gradient set:
- Chat screens: `CHAT_GRADIENTS_LARGE`
- Home screen: `HOME_GRADIENTS`
- Explore screen: `EXPLORE_GRADIENTS`

### Issue: Layout shifts after refactoring

**Solution**: Check that `paddingTop` on ScrollView matches `theme.layout.scrollViewPaddingTop`

### Issue: TypeScript errors on navigation

**Solution**: Update `src/types/navigation.ts` with the correct route parameters

## Example: Complete Refactored Component

See `src/screens/ChatConversationPage.tsx` for a complete example of a refactored component.

## Questions?

If you encounter issues during refactoring, refer to:
- `src/README.md` - Project structure and conventions
- `src/constants/theme.ts` - Complete theme reference
- `src/constants/gradients.ts` - Gradient configurations
- `src/screens/ChatConversationPage.tsx` - Reference implementation
