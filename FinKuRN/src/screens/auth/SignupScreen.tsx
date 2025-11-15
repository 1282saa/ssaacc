import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '../../components/common/StatusBar';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { HOME_GRADIENTS } from '../../constants/gradients';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';

/**
 * 회원가입 화면 (Signup Screen) - Anima Design
 *
 * 이메일 기반 회원가입 화면입니다.
 *
 * @component
 * @category UI/Screens
 * @since 2.0.0
 */
export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // TODO: Implement signup logic
    console.log('Signup:', { name, email, password });
  };

  return (
    <View style={styles.container}>
      <BackgroundGradient layers={HOME_GRADIENTS} />
      <StatusBar />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color={theme.colors.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>회원가입</Text>
          </View>

          {/* White Card Container */}
          <View style={styles.cardContainer}>
            {/* FinQ Logo */}
            <Text style={styles.logo}>FinQ</Text>

            {/* Input Fields Container */}
            <View style={styles.inputContainer}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>이름</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="이름을 입력해 주세요"
                    placeholderTextColor="#B0B5BF"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>이메일</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="이메일을 입력해 주세요"
                    placeholderTextColor="#B0B5BF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>비밀번호</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="비밀번호를 입력해 주세요"
                    placeholderTextColor="#B0B5BF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>회원가입</Text>
            </TouchableOpacity>

            {/* Social Login Icons */}
            <View style={styles.socialIconsContainer}>
              {/* Kakao */}
              <TouchableOpacity style={styles.socialIconButton} activeOpacity={0.8}>
                <View style={[styles.socialIcon, styles.kakaoIcon]} />
              </TouchableOpacity>

              {/* Google */}
              <TouchableOpacity style={styles.socialIconButton} activeOpacity={0.8}>
                <View style={[styles.socialIcon, styles.googleIcon]} />
              </TouchableOpacity>

              {/* Apple */}
              <TouchableOpacity style={styles.socialIconButton} activeOpacity={0.8}>
                <View style={[styles.socialIcon, styles.appleIcon]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Home Indicator */}
          <View style={styles.homeIndicatorWrapper}>
            <View style={styles.homeIndicator} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    marginTop: theme.layout.statusBarHeight,
    paddingHorizontal: 16,
    gap: 90,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.black,
  },
  cardContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 40,
    marginTop: 27,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 40,
    flex: 1,
  },
  logo: {
    fontFamily: 'Almarai',
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    gap: 20,
  },
  inputGroup: {
    height: 90,
  },
  label: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '400',
    color: '#45474C',
    marginBottom: 8,
    paddingLeft: 8,
  },
  inputWrapper: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.black,
    letterSpacing: -0.35,
  },
  signupButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  signupButtonText: {
    fontFamily: 'Pretendard',
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.white,
    letterSpacing: -0.45,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
  },
  socialIconButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
  },
  kakaoIcon: {
    backgroundColor: '#FEE500',
  },
  googleIcon: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
  },
  appleIcon: {
    backgroundColor: '#000000',
  },
  homeIndicatorWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 34,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: theme.colors.black,
    borderRadius: 100,
    marginBottom: 8,
  },
});
