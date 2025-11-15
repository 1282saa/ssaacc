import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import { StatusBar } from '../../components/common/StatusBar';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { HOME_GRADIENTS } from '../../constants/gradients';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';
import { authService } from '../../services/authService';
import { signInWithGoogle, initializeGoogleSignIn } from '../../services/googleAuthService';

/**
 * 로그인 선택 화면 (Login Selection Screen)
 *
 * 초기 로그인 화면으로, 소셜 로그인과 이메일 로그인을 선택할 수 있습니다.
 *
 * @component
 * @category UI/Screens
 * @since 1.0.0
 */
export const LoginSelectionScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google Sign-In 초기화
  useEffect(() => {
    initializeGoogleSignIn();
  }, []);

  /**
   * 소셜 로그인 처리 핸들러
   */
  const handleSocialLogin = async (provider: 'kakao' | 'google' | 'apple') => {
    setLoading(true);
    setError(null);

    try {
      if (provider === 'google') {
        // Google OAuth 처리
        const googleResult = await signInWithGoogle();

        if (!googleResult.success) {
          setError(googleResult.error || 'Google 로그인에 실패했습니다.');
          Alert.alert('로그인 실패', googleResult.error || 'Google 로그인에 실패했습니다.');
          return;
        }

        // 백엔드에 Google 액세스 토큰 전달
        const response = await authService.socialLogin('google', googleResult.accessToken || '');

        if (response.success && response.data?.token) {
          console.log('Google login successful:', response.data.user);
          navigation.navigate('OnboardingWelcome' as any);
        } else {
          setError(response.error || 'Google 로그인에 실패했습니다.');
          Alert.alert('로그인 실패', response.error || 'Google 로그인에 실패했습니다.');
        }
      } else {
        // 카카오, 애플은 아직 구현 중
        const message = `${provider === 'kakao' ? '카카오' : '애플'} 로그인은 준비 중입니다. 이메일 로그인을 이용해주세요.`;
        Alert.alert('준비 중', message);
      }
    } catch (err) {
      const errorMessage = '소셜 로그인에 실패했습니다.';
      setError(errorMessage);
      Alert.alert('로그인 실패', errorMessage);
      console.error('Social login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundGradient layers={HOME_GRADIENTS} />
      <StatusBar />

      <View style={styles.contentContainer}>
        {/* Penguin Mascot */}
        <View style={styles.penguinContainer}>
          <Image
            source={{ uri: 'https://c.animaapp.com/vhvaNRX0/img/------@2x.png' }}
            style={styles.penguinImage}
            resizeMode="contain"
          />
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialButtonsContainer}>
          {/* Kakao Login */}
          <TouchableOpacity
            style={[styles.socialButton, loading && styles.socialButtonDisabled]}
            activeOpacity={0.8}
            onPress={() => handleSocialLogin('kakao')}
            disabled={loading}
          >
            <View style={styles.socialIcon}>
              {/* Kakao icon placeholder */}
            </View>
            <Text style={styles.socialButtonText}>카카오 로그인</Text>
          </TouchableOpacity>

          {/* Google Login */}
          <TouchableOpacity
            style={[styles.socialButton, loading && styles.socialButtonDisabled]}
            activeOpacity={0.8}
            onPress={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <View style={styles.socialIcon}>
              {/* Google icon placeholder */}
            </View>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.textPrimary} style={{ marginLeft: 12 }} />
            ) : (
              <Text style={styles.socialButtonText}>구글로 로그인</Text>
            )}
          </TouchableOpacity>

          {/* Apple Login */}
          <TouchableOpacity
            style={[styles.socialButton, loading && styles.socialButtonDisabled]}
            activeOpacity={0.8}
            onPress={() => handleSocialLogin('apple')}
            disabled={loading}
          >
            <View style={styles.socialIcon}>
              {/* Apple icon placeholder */}
            </View>
            <Text style={styles.socialButtonText}>애플로 로그인</Text>
          </TouchableOpacity>
        </View>

        {/* Email Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        {/* Signup Prompt */}
        <View style={styles.signupPrompt}>
          <Text style={styles.signupPromptText}>아직 회원이 아니신가요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicatorWrapper}>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    flex: 1,
    marginTop: theme.layout.statusBarHeight,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  penguinContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  penguinImage: {
    width: '70%',
    aspectRatio: 1,
    maxWidth: 280,
  },
  socialButtonsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    height: 56,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialButtonText: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.black,
    letterSpacing: -0.4,
  },
  socialButtonDisabled: {
    opacity: 0.5,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    fontFamily: 'Pretendard',
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.white,
    letterSpacing: -0.45,
  },
  signupPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    gap: 6,
  },
  signupPromptText: {
    fontFamily: 'Pretendard',
    fontSize: 15,
    fontWeight: '400',
    color: '#9EA3B2',
    letterSpacing: -0.35,
  },
  signupLink: {
    fontFamily: 'Pretendard',
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.primary,
    letterSpacing: -0.35,
    textDecorationLine: 'underline',
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
