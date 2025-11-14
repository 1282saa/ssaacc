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
import { StatusBar } from '../components/common/StatusBar';
import { BackgroundGradient } from '../components/common/BackgroundGradient';
import { HOME_GRADIENTS } from '../constants/gradients';
import { theme } from '../constants/theme';
import type { AppNavigation } from '../types/navigation';
import { authService } from '../services/authService';

/**
 * 로그인 화면 (Login Screen)
 *
 * 사용자 인증을 위한 프리미엄 로그인 화면입니다.
 * 이메일/비밀번호 기반 로그인과 소셜 로그인을 지원합니다.
 *
 * @component
 * @category UI/Screens
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { LoginScreen } from './screens/LoginScreen';
 *
 * <LoginScreen />
 * ```
 *
 * @description
 * 주요 기능:
 * - 이메일/비밀번호 기반 로그인 (Email/Password Login)
 * - 소셜 로그인 지원 (Kakao, Naver, Google)
 * - 실시간 입력 유효성 검사 (Real-time Validation)
 * - 포커스 상태에 따른 입력 필드 스타일 변경 (Focus State Styling)
 * - 로딩 상태 표시 (Loading State Indicator)
 * - 에러 메시지 배너 (Error Message Banner)
 * - 비밀번호 찾기 링크 (Forgot Password Link)
 * - 회원가입 페이지로 이동 (Navigate to Signup)
 *
 * @features
 * - 키보드 회피 레이아웃 (KeyboardAvoidingView)
 * - 스크롤 가능한 폼 (Scrollable Form)
 * - 그라디언트 배경 (Gradient Background)
 * - 펭귄 마스코트 이미지 (Penguin Mascot)
 * - 반응형 입력 필드 (Responsive Input Fields)
 *
 * @see {@link SignupScreen}
 * @see {@link authService}
 */
export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  /**
   * 로그인 처리 핸들러 (Login Handler)
   *
   * 이메일과 비밀번호를 검증하고 authService를 통해 로그인을 시도합니다.
   *
   * @async
   * @function handleLogin
   *
   * @description
   * 처리 과정:
   * 1. 입력값 검증 (빈 값, 이메일 형식, 비밀번호 길이)
   * 2. authService.login() 호출
   * 3. 성공 시 Main 화면으로 이동
   * 4. 실패 시 에러 메시지 표시
   *
   * @validation
   * - 이메일과 비밀번호 필수 입력 확인
   * - 이메일 형식 검증 (@ 포함 여부)
   * - 비밀번호 최소 6자 이상
   *
   * @throws {Error} 로그인 실패 시 에러 메시지 표시
   *
   * @see {@link authService.login}
   */
  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요');
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
      const response = await authService.login(email, password);

      if (response.success && response.token) {
        console.log('Login successful:', response.user);

        // TODO: 실제 구현 시 checkOnboardingStatus API로 확인
        // const status = await checkOnboardingStatus(response.user.id);
        // if (status.completed) {
        //   navigation.navigate('Main');
        // } else {
        //   navigation.navigate('OnboardingWelcome' as any);
        // }

        // 임시: 로그인 시 온보딩으로 이동
        navigation.navigate('OnboardingWelcome' as any);
      } else {
        setError(response.error || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 소셜 로그인 처리 핸들러 (Social Login Handler)
   *
   * 카카오, 네이버, 구글 등의 소셜 로그인을 처리합니다.
   *
   * @async
   * @function handleSocialLogin
   * @param {('kakao'|'naver'|'google')} provider - 소셜 로그인 제공자
   *
   * @description
   * 처리 과정:
   * 1. authService.socialLogin() 호출
   * 2. 성공 시 Main 화면으로 이동
   * 3. 실패 시 에러 메시지 표시
   *
   * @example
   * ```tsx
   * handleSocialLogin('kakao');
   * handleSocialLogin('naver');
   * handleSocialLogin('google');
   * ```
   *
   * @see {@link authService.socialLogin}
   */
  const handleSocialLogin = async (provider: 'kakao' | 'naver' | 'google') => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.socialLogin(provider);
      if (response.success && response.token) {
        // TODO: 실제 구현 시 checkOnboardingStatus API로 확인
        // 임시: 소셜 로그인 시 온보딩으로 이동
        navigation.navigate('OnboardingWelcome' as any);
      } else {
        setError(response.error || `${provider} 로그인에 실패했습니다.`);
      }
    } catch (err) {
      setError('소셜 로그인에 실패했습니다.');
      console.error('Social login error:', err);
    } finally {
      setLoading(false);
    }
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
          {/* Skip Button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>건너뛰기</Text>
          </TouchableOpacity>

          {/* Header with Logo and Penguin */}
          <View style={styles.header}>
            <Text style={styles.logo}>FinKuRN</Text>
            <Text style={styles.tagline}>금융 지식과 자원 내비게이터</Text>

            <Image
              source={{ uri: 'https://c.animaapp.com/FwW9Xg6K/img/--@2x.png' }}
              style={styles.penguinImage}
              resizeMode="contain"
            />
          </View>

          {/* Login Form Card */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>로그인</Text>
              <Text style={styles.welcomeText}>다시 만나서 반가워요</Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused,
                  error && !emailFocused && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  placeholderTextColor="#A0A0A0"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError(null);
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
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
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputWrapperFocused,
                  error && !passwordFocused && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="6자 이상 입력"
                  placeholderTextColor="#A0A0A0"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={() => console.log('Forgot password')}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>로그인</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={[styles.socialButton, styles.kakaoButton]}
                onPress={() => handleSocialLogin('kakao')}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.kakaoText}>카카오로 계속하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.naverButton]}
                onPress={() => handleSocialLogin('naver')}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.naverText}>네이버로 계속하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialLogin('google')}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.googleText}>Google로 계속하기</Text>
              </TouchableOpacity>
            </View>

            {/* Signup Link */}
            <View style={styles.signupPrompt}>
              <Text style={styles.signupPromptText}>계정이 없으신가요? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Signup')}
                disabled={loading}
              >
                <Text style={styles.signupLink}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: theme.layout.statusBarHeight + 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  logo: {
    fontFamily: 'Pretendard Variable',
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  tagline: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '400',
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  penguinImage: {
    width: 120,
    height: 120,
  },
  formCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  formHeader: {
    marginBottom: 24,
  },
  formTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  welcomeText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.textSecondary,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 6,
    paddingLeft: 2,
  },
  inputWrapper: {
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FAFAFA',
  },
  inputWrapperError: {
    borderColor: theme.colors.error,
    backgroundColor: '#FFF9F9',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.textPrimary,
  },
  errorBanner: {
    backgroundColor: '#FFF1F1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  errorText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.error,
    textAlign: 'center',
    lineHeight: 16,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    marginBottom: 12,
  },
  forgotPasswordText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: -0.2,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '400',
    color: '#999',
    marginHorizontal: 12,
  },
  socialButtonsContainer: {
    gap: 10,
  },
  socialButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    borderColor: '#FEE500',
  },
  kakaoText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '600',
    color: '#3C1E1E',
    letterSpacing: -0.2,
  },
  naverButton: {
    backgroundColor: '#03C75A',
    borderColor: '#03C75A',
  },
  naverText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: -0.2,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#DADCE0',
  },
  googleText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  signupPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupPromptText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '400',
    color: '#666',
  },
  signupLink: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  skipButton: {
    position: 'absolute',
    top: theme.layout.statusBarHeight + 16,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 10,
  },
  skipButtonText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
