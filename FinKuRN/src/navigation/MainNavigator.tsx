/**
 * 메인 내비게이터 (Main Navigator)
 *
 * FinKuRN 애플리케이션의 메인 내비게이션 구조를 정의합니다.
 * Stack Navigator와 Bottom Tab Navigator를 결합하여 계층적 네비게이션을 제공합니다.
 *
 * @module Navigation
 * @category Navigation
 * @since 1.0.0
 *
 * @description
 * 네비게이션 구조:
 * - Stack Navigator (Root Level)
 *   - Login: 로그인 화면
 *   - Signup: 회원가입 화면
 *   - Main: 탭 네비게이터 (메인 애플리케이션)
 *   - PlanUpgrade: 플랜 업그레이드 화면
 *   - NewChat: 새 채팅 화면
 *   - ChatConversation: 채팅 대화 화면
 *   - TodayList: 오늘의 할 일 목록 화면
 *
 * - Tab Navigator (Main 내부)
 *   - HomeTab: 홈 대시보드
 *   - ChatTab: 챗봇 메인
 *   - Page3: 탐색/혜택 화면
 *   - Page4: 체크리스트 (추후 구현)
 *   - Page5: 프로필 (추후 구현)
 *
 * @features
 * - 하단 탭 네비게이션 (Bottom Tab Navigation)
 * - 그라디언트 활성 아이콘 (Gradient Active Icons)
 * - 반투명 탭 바 (Semi-transparent Tab Bar)
 * - 조건부 헤더 표시 (Conditional Header Display)
 * - 커스텀 아이콘 컴포넌트 (Custom Icon Components)
 *
 * @see {@link TabNavigator}
 * @see {@link HomeScreen}
 * @see {@link ChatbotScreenV2}
 * @see {@link ExploreScreen}
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
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

/**
 * 탭 내비게이터 (Tab Navigator)
 *
 * 하단 탭 네비게이션을 제공하는 컴포넌트입니다.
 * 5개의 주요 기능 화면으로 빠르게 이동할 수 있습니다.
 *
 * @component
 * @private
 *
 * @description
 * 탭 구성:
 * 1. HomeTab - 홈 대시보드 (Home Dashboard)
 * 2. ChatTab - 챗봇 메인 (Chatbot Main)
 * 3. Page3 - 탐색/혜택 (Explore/Benefits)
 * 4. Page4 - 체크리스트 (Checklist - Placeholder)
 * 5. Page5 - 프로필 (Profile - Placeholder)
 *
 * @features
 * - 커스텀 반투명 탭 바 (Custom Semi-transparent Tab Bar)
 *   - 배경색: rgba(0, 0, 0, 0.4)
 *   - borderRadius: 100 (완전한 둥근 모서리)
 *   - 하단에서 16px 떨어진 위치
 * - 활성 탭 그라디언트 아이콘 (Active Tab Gradient Icon)
 *   - LinearGradient: #3060F1 to #5078F2
 * - 비활성 탭 테두리 아이콘 (Inactive Tab Bordered Icon)
 *   - 투명도 60% 흰색
 *   - 테두리 색상: #A0A0A0
 *
 * @returns {JSX.Element} 탭 내비게이터 컴포넌트
 */
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 50,
          left: 30,
          right: 30,
          height: 65,
          borderRadius: 100,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingTop: 13,
          paddingBottom: 8,
          paddingLeft: 0,
          paddingRight: 0,
          elevation: 16,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
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
                  colors={['#001E6E', '#3060F1', '#E9E9E9']}
                  locations={[0, 0.51, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientCircle}
                >
                  <IconComponent color={theme.colors.white} size={26} />
                </LinearGradient>
              </View>
            );
          }

          return (
            <View style={styles.inactiveIconWithBorder}>
              <IconComponent color="#A0A0A0" size={26} />
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

/**
 * 메인 내비게이터 컴포넌트 (Main Navigator Component)
 *
 * 애플리케이션의 루트 내비게이터입니다.
 * Stack Navigator를 사용하여 인증 화면과 메인 애플리케이션 간 전환을 관리합니다.
 *
 * @component
 * @export
 *
 * @description
 * Stack 구조:
 * 1. Login (headerShown: false) - 로그인 화면
 * 2. Signup (headerShown: false) - 회원가입 화면
 * 3. Main (headerShown: false) - 탭 내비게이터 (메인 앱)
 * 4. PlanUpgrade (title: '플랜 업그레이드') - 플랜 업그레이드 화면
 * 5. NewChat (headerShown: false) - 새 채팅 화면
 * 6. ChatConversation (headerShown: false) - 채팅 대화 화면
 * 7. TodayList (title: '오늘의 할 일') - 할 일 목록 화면
 *
 * @features
 * - 조건부 헤더 표시 (Conditional Header Display)
 * - 커스텀 헤더 스타일링 (Custom Header Styling)
 *   - 배경색: theme.colors.primary
 *   - 텍스트 색상: theme.colors.white
 *   - 폰트 굵기: bold
 * - Stack 기반 네비게이션 (Stack-based Navigation)
 * - 인증 플로우 관리 (Authentication Flow Management)
 *
 * @navigation
 * - 로그인 성공 시: Login -> Main
 * - 회원가입: Login -> Signup
 * - 채팅 시작: Main/ChatTab -> NewChat -> ChatConversation
 * - 플랜 업그레이드: Main/ChatTab -> PlanUpgrade
 * - 오늘의 할 일: Main/HomeTab -> TodayList
 *
 * @returns {JSX.Element} 메인 내비게이터 컴포넌트
 *
 * @see {@link TabNavigator}
 * @see {@link LoginScreen}
 * @see {@link SignupScreen}
 */
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
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
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
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveIconWithBorder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
