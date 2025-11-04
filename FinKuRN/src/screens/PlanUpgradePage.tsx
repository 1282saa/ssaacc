import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';
import type { AppNavigation } from '../types/navigation';

/**
 * PlanUpgradePage Component
 *
 * Displays the premium plan upgrade page where users can learn about
 * premium features and benefits.
 *
 * Features:
 * - Premium plan description and benefits
 * - Visual star icon for premium branding
 * - Back navigation button
 * - Clean, centered layout design
 *
 * @component
 * @example
 * ```tsx
 * <PlanUpgradePage />
 * ```
 */
export const PlanUpgradePage: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  return (
    <View style={styles.container}>
      <Ionicons name="star" size={100} color={theme.colors.primary} />
      <Text style={styles.title}>Premium 플랜</Text>
      <Text style={styles.description}>모든 기능을 무제한으로 사용하세요</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  description: {
    ...theme.typography.body1,
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 40,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 40,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
  },
  buttonText: {
    ...theme.typography.button,
    fontSize: 16,
    color: theme.colors.white,
  },
});
