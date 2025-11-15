/**
 * 인증 서비스 (Authentication Service)
 *
 * 이 파일은 모든 사용자 인증 관련 기능을 제공하는 서비스 레이어입니다.
 * 로그인, 로그아웃, 회원가입, 토큰 관리 등 인증과 관련된 모든 API 호출을 담당합니다.
 *
 * UI와 백엔드 API 사이의 깔끔한 추상화 레이어를 제공하며,
 * 현재는 개발을 위해 더미 데이터를 사용하고 있습니다.
 * 백엔드가 준비되면 실제 API 호출로 교체할 수 있습니다.
 *
 * @module services/authService
 * @category Services
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * import { authService } from '@/services/authService';
 *
 * // 이메일 로그인
 * const result = await authService.login('user@example.com', 'password123');
 * if (result.success && result.token) {
 *   // 토큰 저장 및 홈 화면으로 이동
 * }
 *
 * // 소셜 로그인
 * const socialResult = await authService.socialLogin('kakao');
 *
 * // 로그아웃
 * await authService.logout();
 * ```
 */

/**
 * 로그인 요청 인터페이스 (Login Request Interface)
 *
 * 이메일/비밀번호 로그인 시 서버로 전송할 데이터 구조입니다.
 *
 * @interface LoginRequest
 * @property {string} email - 사용자 이메일 주소
 * @property {string} password - 사용자 비밀번호
 */
export interface LoginRequest {
  /** 사용자 이메일 주소 (User email address) */
  email: string;
  /** 사용자 비밀번호 (User password) */
  password: string;
}

/**
 * 로그인 응답 인터페이스 (Login Response Interface)
 *
 * 로그인 API 호출의 응답 데이터 구조입니다.
 * 성공 시 JWT 토큰과 사용자 정보를 포함하며, 실패 시 에러 메시지를 포함합니다.
 *
 * @interface LoginResponse
 * @property {boolean} success - 로그인 성공 여부
 * @property {string} [token] - JWT 인증 토큰 (성공 시)
 * @property {Object} [user] - 사용자 정보 (성공 시)
 * @property {string} user.id - 사용자 고유 식별자
 * @property {string} user.email - 사용자 이메일
 * @property {string} user.name - 사용자 이름
 * @property {string} [error] - 에러 메시지 (실패 시)
 */
export interface LoginResponse {
  /** 로그인 성공 여부 (Login success status) */
  success: boolean;
  /** JWT 인증 토큰 (JWT authentication token) */
  token?: string;
  /** 사용자 정보 (User information) */
  user?: {
    /** 사용자 고유 식별자 */
    id: string;
    /** 사용자 이메일 */
    email: string;
    /** 사용자 이름 */
    name: string;
  };
  /** 에러 메시지 (Error message if login failed) */
  error?: string;
}

/**
 * 소셜 로그인 제공자 타입 (Social Login Provider Types)
 *
 * 지원하는 소셜 로그인 플랫폼 타입입니다.
 *
 * @typedef {('kakao' | 'naver' | 'google')} SocialProvider
 */
export type SocialProvider = "kakao" | "naver" | "google";

/**
 * 이메일/비밀번호 로그인 (Authenticate user with email and password)
 *
 * 사용자의 이메일과 비밀번호로 인증을 수행합니다.
 * 성공 시 JWT 토큰과 사용자 정보를 반환합니다.
 *
 * @async
 * @param {string} email - 사용자 이메일 주소
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<LoginResponse>} 로그인 응답을 담은 Promise
 *
 * @example
 * ```typescript
 * const LoginScreen = () => {
 *   const [email, setEmail] = useState('');
 *   const [password, setPassword] = useState('');
 *   const [loading, setLoading] = useState(false);
 *   const navigation = useNavigation();
 *
 *   const handleLogin = async () => {
 *     setLoading(true);
 *     try {
 *       const response = await authService.login(email, password);
 *
 *       if (response.success && response.token) {
 *         // 토큰을 안전하게 저장 (Expo SecureStore 사용)
 *         await SecureStore.setItemAsync('authToken', response.token);
 *
 *         // 사용자 정보도 저장
 *         await AsyncStorage.setItem('user', JSON.stringify(response.user));
 *
 *         // 메인 화면으로 이동
 *         navigation.replace('MainTabs');
 *       } else {
 *         // 로그인 실패 처리
 *         Alert.alert('로그인 실패', response.error || '다시 시도해주세요');
 *       }
 *     } catch (error) {
 *       console.error('Login error:', error);
 *       Alert.alert('오류', '로그인 중 문제가 발생했습니다');
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 *
 *   return (
 *     <View>
 *       <TextInput
 *         value={email}
 *         onChangeText={setEmail}
 *         placeholder="이메일"
 *         keyboardType="email-address"
 *       />
 *       <TextInput
 *         value={password}
 *         onChangeText={setPassword}
 *         placeholder="비밀번호"
 *         secureTextEntry
 *       />
 *       <Button
 *         title="로그인"
 *         onPress={handleLogin}
 *         disabled={loading}
 *       />
 *     </View>
 *   );
 * };
 * ```
 *
 * @todo 실제 API 엔드포인트로 교체 필요
 * @see {@link LoginResponse} 반환 데이터 타입
 */
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch('https://api.finkurn.com/api/auth/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await response.json();
    // return data;

    // API 호출 시뮬레이션 (1.5초 지연)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 개발용 더미 응답
    return {
      success: true,
      token: "dummy_jwt_token_12345",
      user: {
        id: "1",
        email: email,
        name: "은별",
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "로그인에 실패했습니다. 다시 시도해주세요.",
    };
  }
};

/**
 * 소셜 로그인 (Authenticate user with social login provider)
 *
 * 카카오, 네이버, 구글 등의 소셜 로그인 플랫폼을 통해 인증을 수행합니다.
 * OAuth 2.0 플로우를 사용하여 사용자 인증 후 JWT 토큰을 발급받습니다.
 *
 * @async
 * @param {SocialProvider} provider - 소셜 로그인 제공자 ('kakao', 'naver', 'google')
 * @returns {Promise<LoginResponse>} 로그인 응답을 담은 Promise
 *
 * @example
 * ```typescript
 * const LoginScreen = () => {
 *   const navigation = useNavigation();
 *
 *   const handleSocialLogin = async (provider: SocialProvider) => {
 *     try {
 *       const response = await authService.socialLogin(provider);
 *
 *       if (response.success && response.token) {
 *         // 토큰 저장
 *         await SecureStore.setItemAsync('authToken', response.token);
 *         await AsyncStorage.setItem('user', JSON.stringify(response.user));
 *         await AsyncStorage.setItem('loginMethod', provider);
 *
 *         // 메인 화면으로 이동
 *         navigation.replace('MainTabs');
 *       } else {
 *         Alert.alert(
 *           `${provider} 로그인 실패`,
 *           response.error || '다시 시도해주세요'
 *         );
 *       }
 *     } catch (error) {
 *       console.error(`${provider} login error:`, error);
 *       Alert.alert('오류', '소셜 로그인 중 문제가 발생했습니다');
 *     }
 *   };
 *
 *   return (
 *     <View>
 *       <Button
 *         title="카카오로 시작하기"
 *         onPress={() => handleSocialLogin('kakao')}
 *       />
 *       <Button
 *         title="네이버로 시작하기"
 *         onPress={() => handleSocialLogin('naver')}
 *       />
 *       <Button
 *         title="구글로 시작하기"
 *         onPress={() => handleSocialLogin('google')}
 *       />
 *     </View>
 *   );
 * };
 * ```
 *
 * @todo OAuth 플로우 구현 필요:
 * 1. 소셜 로그인 SDK 초기화
 * 2. OAuth 인증 화면 열기
 * 3. Authorization Code 받기
 * 4. Code를 백엔드로 전송하여 JWT 토큰 받기
 *
 * @see {@link SocialProvider} 지원하는 소셜 로그인 타입
 * @see {@link LoginResponse} 반환 데이터 타입
 */
export const socialLogin = async (
  provider: SocialProvider
): Promise<LoginResponse> => {
  try {
    if (provider === 'google') {
      // 구글 로그인: 백엔드 OAuth 플로우 사용
      const backendUrl = 'http://localhost:8000/api/v1/auth/google/login';
      
      // 브라우저에서 OAuth 플로우 시작 (새 창 열기)
      const authWindow = window.open(
        backendUrl,
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // 메시지 리스너로 결과 받기
      return new Promise((resolve) => {
        const messageListener = (event: MessageEvent) => {
          if (event.origin !== 'http://localhost:8081') return;
          
          if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            window.removeEventListener('message', messageListener);
            try {
              authWindow?.close();
            } catch (e) {
              console.warn('Could not close auth window:', e);
            }
            resolve({
              success: true,
              token: event.data.token,
              user: event.data.user
            });
          } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
            window.removeEventListener('message', messageListener);
            try {
              authWindow?.close();
            } catch (e) {
              console.warn('Could not close auth window:', e);
            }
            resolve({
              success: false,
              error: event.data.error || '구글 로그인에 실패했습니다.'
            });
          }
        };

        window.addEventListener('message', messageListener);

        // 10초 후 타임아웃
        setTimeout(() => {
          window.removeEventListener('message', messageListener);
          try {
            authWindow?.close();
          } catch (e) {
            console.warn('Could not close auth window:', e);
          }
          resolve({
            success: false,
            error: '로그인 시간이 초과되었습니다.'
          });
        }, 10000);
      });
    }

    // 다른 소셜 로그인 (카카오, 네이버)는 아직 미구현
    console.log(`Social login with ${provider} not yet implemented`);
    
    return {
      success: false,
      error: `${provider} 로그인은 아직 지원하지 않습니다.`,
    };
  } catch (error) {
    console.error(`${provider} login error:`, error);
    return {
      success: false,
      error: `${provider} 로그인에 실패했습니다.`,
    };
  }
};

/**
 * 로그아웃 (Logout current user)
 *
 * 현재 로그인된 사용자를 로그아웃합니다.
 * 서버에 로그아웃 요청을 보내고 클라이언트의 인증 토큰을 삭제합니다.
 *
 * @async
 * @returns {Promise<void>} 로그아웃 완료 시 resolve되는 Promise
 *
 * @example
 * ```typescript
 * const ProfileScreen = () => {
 *   const navigation = useNavigation();
 *
 *   const handleLogout = async () => {
 *     Alert.alert(
 *       '로그아웃',
 *       '로그아웃 하시겠습니까?',
 *       [
 *         { text: '취소', style: 'cancel' },
 *         {
 *           text: '로그아웃',
 *           style: 'destructive',
 *           onPress: async () => {
 *             try {
 *               // 서버에 로그아웃 요청
 *               await authService.logout();
 *
 *               // 저장된 토큰과 사용자 정보 삭제
 *               await SecureStore.deleteItemAsync('authToken');
 *               await AsyncStorage.removeItem('user');
 *               await AsyncStorage.removeItem('loginMethod');
 *
 *               // 로그인 화면으로 이동
 *               navigation.replace('Login');
 *
 *               Toast.show('로그아웃되었습니다');
 *             } catch (error) {
 *               console.error('Logout error:', error);
 *               Alert.alert('오류', '로그아웃 중 문제가 발생했습니다');
 *             }
 *           }
 *         }
 *       ]
 *     );
 *   };
 *
 *   return (
 *     <View>
 *       <Button title="로그아웃" onPress={handleLogout} />
 *     </View>
 *   );
 * };
 * ```
 *
 * @todo 실제 API 엔드포인트로 교체 필요
 * @note 서버 측 로그아웃이 실패해도 클라이언트 토큰은 삭제해야 합니다
 */
export const logout = async (): Promise<void> => {
  try {
    // TODO: 실제 API 호출로 교체
    // const token = await SecureStore.getItemAsync('authToken');
    // await fetch('https://api.finkurn.com/api/auth/logout', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //   },
    // });

    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error);
    // 에러가 발생해도 클라이언트 측 토큰은 삭제해야 함
  }
};

/**
 * 인증 서비스 객체 Export (Auth Service Export)
 *
 * 모든 인증 관련 함수를 하나의 객체로 묶어 export합니다.
 * 이 객체를 import하여 인증 기능을 사용할 수 있습니다.
 *
 * @constant
 * @type {Object}
 * @property {Function} login - 이메일/비밀번호 로그인 함수
 * @property {Function} socialLogin - 소셜 로그인 함수
 * @property {Function} logout - 로그아웃 함수
 *
 * @example
 * ```typescript
 * import { authService } from '@/services/authService';
 *
 * // 로그인
 * await authService.login(email, password);
 *
 * // 소셜 로그인
 * await authService.socialLogin('kakao');
 *
 * // 로그아웃
 * await authService.logout();
 * ```
 */
export const authService = {
  login,
  socialLogin,
  logout,
};
