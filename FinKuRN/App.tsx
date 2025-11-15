import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigator } from './src/navigation/MainNavigator';
import { Platform, StyleSheet, View } from 'react-native';

export default function App() {
  // Web에서 전체 화면 사용
  if (Platform.OS === 'web') {
    // @ts-ignore
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        html, body, #root {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
    }
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <MainNavigator />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
