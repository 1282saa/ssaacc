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
import { StatusBar } from '../components/common/StatusBar';
import { BackgroundGradient } from '../components/common/BackgroundGradient';
import { HOME_GRADIENTS } from '../constants/gradients';
import { theme } from '../constants/theme';
import type { AppNavigation } from '../types/navigation';

/**
 * 로그인 화면 (Login Screen) - Anima Design
 *
 * 이메일/비밀번호 기반 로그인 화면입니다.
 *
 * @component
 * @category UI/Screens
 * @since 2.0.0
 */
export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log('Login:', { email, password, rememberMe });
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
            <Text style={styles.headerTitle}>로그인</Text>
          </View>

          {/* White Card Container */}
          <View style={styles.cardContainer}>
            {/* FinQ Logo */}
            <Text style={styles.logo}>FinQ</Text>

            {/* Input Fields Container */}
            <View style={styles.inputContainer}>
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
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#92A3B2"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Remember Me Checkbox */}
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && (
                  <Ionicons name="checkmark" size={16} color={theme.colors.white} />
                )}
              </View>
              <Text style={styles.rememberMeText}>아이디 저장</Text>
            </TouchableOpacity>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPasswordLink}>
              <Text style={styles.forgotPasswordText}>아이디/비밀번호 찾기</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>
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
    gap: 106,
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
    marginTop: 88,
    paddingTop: 40,
    paddingHorizontal: 17,
    paddingBottom: 40,
    height: 612,
  },
  logo: {
    fontFamily: 'Almarai',
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 36,
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
    borderRadius: 16,
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.black,
    letterSpacing: -0.35,
  },
  eyeIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    paddingLeft: 2,
    gap: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  rememberMeText: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '400',
    color: '#92A3B2',
    letterSpacing: -0.35,
  },
  forgotPasswordLink: {
    position: 'absolute',
    right: 20,
    top: 337,
  },
  forgotPasswordText: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '400',
    color: '#92A3B2',
    letterSpacing: -0.35,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 79,
  },
  loginButtonText: {
    fontFamily: 'Pretendard',
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.white,
    letterSpacing: -0.45,
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
