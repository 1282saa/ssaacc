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
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '../../components/common/StatusBar';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';
import { authService } from '../../services/authService';

/**
 * 새싹 해커톤 디자인 회원가입 화면
 *
 * React 디자인을 React Native로 변환
 * - 기존 백엔드 API 연결 유지
 * - 새로운 UI 디자인 적용
 * - 소셜 로그인 아이콘 추가 (Kakao, Google, Apple)
 */
export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * 회원가입 처리 핸들러
   */
  const handleSignup = async () => {
    setError(null);

    // Validation
    if (!name || !email || !password) {
      setError('모든 항목을 입력해주세요');
      return;
    }

    if (name.length < 2) {
      setError('이름은 2자 이상 입력해주세요');
      return;
    }

    if (!email.includes('@')) {
      setError('올바른 이메일 주소를 입력해주세요');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(email, password, name);

      if (response.success && response.data?.token) {
        console.log('Signup successful:', response.data.user);

        // 회원가입 성공 시 온보딩 화면으로 이동
        navigation.navigate('OnboardingWelcome' as any);
      } else {
        setError(response.error || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 소셜 회원가입 처리 핸들러
   */
  const handleSocialSignup = async (provider: 'kakao' | 'google' | 'apple') => {
    setError(`${provider === 'kakao' ? '카카오' : provider === 'google' ? '구글' : '애플'} 로그인은 준비 중입니다.`);
  };

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar />

      {/* Gradient Background Blobs */}
      <View style={styles.gradientBlob1} />
      <View style={styles.gradientBlob2} />

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
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>회원가입</Text>
            <View style={{ width: 32 }} />
          </View>

          {/* Signup Form Card */}
          <View style={styles.formCard}>
            {/* Logo */}
            <Text style={styles.logo}>FinKuRN</Text>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="이름을 입력해 주세요"
                  placeholderTextColor="#B0B5BF"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setError(null);
                  }}
                  autoCapitalize="words"
                  editable={!loading}
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
                  onChangeText={(text) => {
                    setEmail(text);
                    setError(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
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
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#92A3B2"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signupButtonText}>회원가입</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Signup Icons */}
            <View style={styles.socialIconsContainer}>
              {/* Kakao */}
              <TouchableOpacity
                style={styles.socialIconButton}
                onPress={() => handleSocialSignup('kakao')}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: 'https://c.animaapp.com/91rwi3X0/img/kakaotalk-1.svg' }}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Google */}
              <TouchableOpacity
                style={styles.socialIconButton}
                onPress={() => handleSocialSignup('google')}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: 'https://c.animaapp.com/91rwi3X0/img/google---original-1.svg' }}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Apple */}
              <TouchableOpacity
                style={styles.socialIconButton}
                onPress={() => handleSocialSignup('apple')}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: 'https://c.animaapp.com/91rwi3X0/img/apple---original-1.svg' }}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginPrompt}>
              <Text style={styles.loginPromptText}>이미 계정이 있으신가요? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                disabled={loading}
              >
                <Text style={styles.loginLink}>로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Home Indicator (iOS style) */}
      <View style={styles.homeIndicatorWrapper}>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: theme.layout.statusBarHeight,
  },

  // Gradient Background Blobs (matching React design)
  gradientBlob1: {
    position: 'absolute',
    width: 330,
    height: 330,
    borderRadius: 165,
    left: 18,
    top: 70,
    backgroundColor: 'rgba(66, 0, 255, 0.2)',
    opacity: 0.3,
  },
  gradientBlob2: {
    position: 'absolute',
    width: 607,
    height: 607,
    borderRadius: 303.5,
    left: -231,
    top: 159,
    backgroundColor: 'rgba(223, 127, 127, 0.2)',
    opacity: 0.3,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Pretendard Variable',
  },

  // Form Card
  formCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 17,
    paddingTop: 40,
    paddingBottom: 24,
    marginTop: 132,
    minHeight: 612,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },

  // Logo
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3060F1',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Almarai',
  },

  // Input Group
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#45474C',
    marginBottom: 8,
    paddingLeft: 8,
    fontFamily: 'SF Pro Text',
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  input: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    fontFamily: 'SF Pro Text',
    height: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },

  // Error Banner
  errorBanner: {
    backgroundColor: '#FFF1F1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.error,
    textAlign: 'center',
    fontFamily: 'Pretendard Variable',
  },

  // Signup Button
  signupButton: {
    backgroundColor: '#3060F1',
    borderRadius: 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3060F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  signupButtonDisabled: {
    opacity: 0.5,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Pretendard',
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999',
    marginHorizontal: 12,
    fontFamily: 'Pretendard Variable',
  },

  // Social Icons Container
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  socialIconButton: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },

  // Login Prompt
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginPromptText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666',
    fontFamily: 'Pretendard Variable',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3060F1',
    fontFamily: 'Pretendard Variable',
  },

  // Home Indicator (iOS style)
  homeIndicatorWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 34,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: '#000000',
  },
});
