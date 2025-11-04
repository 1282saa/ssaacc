import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

/**
 * StatusBar Component
 *
 * Displays the iOS-style status bar with time and system icons.
 * This component is used consistently across all screens to maintain
 * a uniform top-level UI presentation.
 *
 * @component
 * @example
 * ```tsx
 * <StatusBar />
 * ```
 */
export const StatusBar: React.FC = () => {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.statusTime}>9:41</Text>
      <Image
        source={{ uri: 'https://c.animaapp.com/FbLlYdc1/img/right-side@2x.png' }}
        style={styles.statusIcons}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    zIndex: 100,
  },
  statusTime: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 15,
    color: '#000',
    width: 54,
    textAlign: 'center',
  },
  statusIcons: {
    width: 66.66,
    height: 11.34,
    marginTop: 4.3,
    marginRight: 2,
  },
});
