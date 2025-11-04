import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { ChatbotScreenV2 } from '../screens/ChatbotScreenV2';
import { ExploreScreen } from '../screens/ExploreScreen';
import { PlanUpgradePage } from '../screens/PlanUpgradePage';
import { NewChatPage } from '../screens/NewChatPage';
import { ChatConversationPage } from '../screens/ChatConversationPage';
import { TodayListScreen } from '../screens/TodayListScreen';
import { theme } from '../constants/theme';
import {
  HomeIcon,
  ChatIcon,
  ManageSearchIcon,
  LibraryAddCheckIcon,
  PersonIcon
} from '../components/NavIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 하단 네비게이션 바
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 30,
          right: 30,
          height: 60,
          borderRadius: 100,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderTopWidth: 0,
          paddingTop: 10,
          paddingBottom: 2,
          paddingLeft: 0,
          paddingRight: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          flex: 1,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let IconComponent: React.FC<{ color: string; size: number }>;

          if (route.name === 'HomeTab') {
            IconComponent = HomeIcon;
          } else if (route.name === 'ChatTab') {
            IconComponent = ChatIcon;
          } else if (route.name === 'Page3') {
            IconComponent = ManageSearchIcon;
          } else if (route.name === 'Page4') {
            IconComponent = LibraryAddCheckIcon;
          } else {
            IconComponent = PersonIcon;
          }

          if (focused) {
            return (
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#3060F1', '#5078F2']}
                  start={{ x: 0.05, y: 0.43 }}
                  end={{ x: 1.19, y: 0.62 }}
                  style={styles.gradientCircle}
                >
                  <IconComponent color={theme.colors.white} size={24} />
                </LinearGradient>
              </View>
            );
          }

          return (
            <View style={styles.inactiveIconWithBorder}>
              <IconComponent color="rgba(255, 255, 255, 0.6)" size={24} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="ChatTab" component={ChatbotScreenV2} />
      <Tab.Screen name="Page3" component={ExploreScreen} />
      <Tab.Screen
        name="Page4"
        component={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LibraryAddCheckIcon size={100} color={theme.colors.primary} />
          </View>
        )}
      />
      <Tab.Screen
        name="Page5"
        component={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <PersonIcon size={100} color={theme.colors.primary} />
          </View>
        )}
      />
    </Tab.Navigator>
  );
};

// 메인 네비게이터 (Stack + Tabs)
export const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlanUpgrade"
        component={PlanUpgradePage}
        options={{ title: '플랜 업그레이드' }}
      />
      <Stack.Screen
        name="NewChat"
        component={NewChatPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatConversation"
        component={ChatConversationPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TodayList"
        component={TodayListScreen}
        options={{ title: '오늘의 할 일' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveIconWithBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A0A0A0',
  },
});
