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
import { signInWithGoogle, initializeGoogleSignIn } from '../services/googleAuthService';

/**
 * 회원가입 화면 (Signup Screen)
 *
 * 신규 사용자 등록을 위한 회원가입 화면입니다.
 * LoginScreen과 동일한 디자인 미학을 적용했습니다.
 *
 * @component
 * @category UI/Screens
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { SignupScreen } from './screens/SignupScreen';
 *
 * <SignupScreen />
 * ```
 *
 * @description
 * 주요 기능:
 * - 이름, 이메일, 비밀번호 입력 (Name, Email, Password Input)
 * - 비밀번호 확인 (Password Confirmation)
 * - 소셜 회원가입 지원 (Social Signup: Kakao, Naver, Google)
 * - 실시간 입력 유효성 검사 (Real-time Validation)
 * - 포커스 상태 관리 (Focus State Management)
 * - 로딩 상태 표시 (Loading State Indicator)
 * - 에러 메시지 배너 (Error Message Banner)
 *
 * @validation
 * - 모든 필드 필수 입력 확인
 * - 이름 최소 2자 이상
 * - 이메일 형식 검증 (@ 포함)
 * - 비밀번호 최소 6자 이상
 * - 비밀번호 일치 확인
 *
 * @features
 * - 키보드 회피 레이아웃 (KeyboardAvoidingView)
 * - 스크롤 가능한 폼 (Scrollable Form)
 * - 그라디언트 배경 (Gradient Background)
 * - 펭귄 마스코트 이미지 (Penguin Mascot)
 * - 로그인 페이지로 이동 링크 (Navigate to Login Link)
 *
 * @see {@link LoginScreen}
 * @see {@link authService}
 */
export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordConfirmFocused, setPasswordConfirmFocused] = useState(false);

  /**
   * 회원가입 처리 핸들러 (Signup Handler)
   *
   * 입력된 정보를 검증하고 회원가입을 처리합니다.
   *
   * @async
   * @function handleSignup
   *
   * @description
   * 처리 과정:
   * 1. 모든 입력값 검증 (이름, 이메일, 비밀번호, 비밀번호 확인)
   * 2. 회원가입 API 호출 (TODO: 구현 예정)
   * 3. 성공 시 Main 화면으로 이동
   * 4. 실패 시 에러 메시지 표시
   *
   * @validation
   * - 모든 필드 필수 입력 확인
   * - 이름 최소 2자 이상
   * - 이메일 형식 검증 (@ 포함)
   * - 비밀번호 최소 6자 이상
   * - 비밀번호와 비밀번호 확인 일치 여부
   *
   * @note 현재는 시뮬레이션 딜레이 후 자동으로 Main 화면으로 이동합니다.
   *
   * @throws {Error} 회원가입 실패 시 에러 메시지 표시
   */
  const handleSignup = async () => {
    setError(null);

    // Validation
    if (!name || !email || !password || !passwordConfirm) {
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

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    setLoading(true);

    try {
      // 실제 회원가입 API 호출
      const response = await authService.register(email, password, name);

      if (response.success) {
        console.log('Signup successful:', response.data?.user);
        
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
   * 소셜 회원가입 처리 핸들러 (Social Signup Handler)
   *
   * 카카오, 네이버, 구글 등의 소셜 계정으로 회원가입을 처리합니다.
   *
   * @async
   * @function handleSocialSignup
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
   * handleSocialSignup('kakao');
   * handleSocialSignup('naver');
   * handleSocialSignup('google');
   * ```
   *
   * @see {@link authService.socialLogin}
   */
  const handleSocialSignup = async (provider: 'kakao' | 'naver' | 'google') => {
    setLoading(true);
    setError(null);

    try {
      if (provider === 'google') {
        // 실제 Google OAuth 처리
        const googleResult = await signInWithGoogle();
        
        if (!googleResult.success) {
          setError(googleResult.error || 'Google 회원가입에 실패했습니다.');
          return;
        }

        // 백엔드에 Google 액세스 토큰 전달
        const response = await authService.socialLogin('google', googleResult.accessToken || '');
        
        if (response.success && response.data?.token) {
          console.log('Google signup successful:', response.data.user);
          navigation.navigate('OnboardingWelcome' as any);
        } else {
          setError(response.error || 'Google 회원가입에 실패했습니다.');
        }
      } else {
        // 카카오, 네이버는 아직 구현 중
        setError(`${provider} 회원가입은 준비 중입니다. 이메일 회원가입을 이용해주세요.`);
      }
    } catch (err) {
      setError('소셜 회원가입에 실패했습니다.');
      console.error('Social signup error:', err);
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

          {/* Signup Form Card */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>회원가입</Text>
              <Text style={styles.welcomeText}>핀쿠와 함께 시작해보세요</Text>
            </View>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름</Text>
              <View
                style={[
                  styles.inputWrapper,
                  nameFocused && styles.inputWrapperFocused,
                  error && !nameFocused && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="홍길동"
                  placeholderTextColor="#A0A0A0"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setError(null);
                  }}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
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

            {/* Password Confirm Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <View
                style={[
                  styles.inputWrapper,
                  passwordConfirmFocused && styles.inputWrapperFocused,
                  error && !passwordConfirmFocused && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="비밀번호 다시 입력"
                  placeholderTextColor="#A0A0A0"
                  value={passwordConfirm}
                  onChangeText={(text) => {
                    setPasswordConfirm(text);
                    setError(null);
                  }}
                  onFocus={() => setPasswordConfirmFocused(true)}
                  onBlur={() => setPasswordConfirmFocused(false)}
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

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>회원가입</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Signup Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={[styles.socialButton, styles.kakaoButton]}
                onPress={() => handleSocialSignup('kakao')}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.kakaoText}>카카오로 계속하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.naverButton]}
                onPress={() => handleSocialSignup('naver')}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.naverText}>네이버로 계속하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialSignup('google')}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.googleText}>Google로 계속하기</Text>
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
    paddingBottom: 16,
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
    marginBottom: 8,
  },
  penguinImage: {
    width: 100,
    height: 100,
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
    marginBottom: 20,
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
    marginBottom: 12,
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
    marginBottom: 12,
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
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginPromptText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '400',
    color: '#666',
  },
  loginLink: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
