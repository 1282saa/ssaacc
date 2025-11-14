/**
 * 인증 서비스 (Authentication Service)
 *
 * 이 파일은 모든 사용자 인증 관련 기능을 제공하는 서비스 레이어입니다.
 * 로그인, 로그아웃, 회원가입, 토큰 관리 등 인증과 관련된 모든 API 호출을 담당합니다.
 *
 * UI와 백엔드 API 사이의 깔끔한 추상화 레이어를 제공합니다.
 * FastAPI 백엔드와 연동되어 실제 JWT 인증을 처리합니다.
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

import { API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  TokenResponse,
  GoogleAuthRequest 
} from '../types/auth';

/**
 * HTTP 에러 응답 인터페이스
 */
interface ErrorResponse {
  detail: string;
}

/**
 * API 요청 헤더 생성
 */
const createHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * API 요청 래퍼 함수
 */
const apiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...createHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ErrorResponse;
    throw new Error(errorData.detail || '요청 실패');
  }

  return data as T;
};

/**
 * 토큰 저장 키 상수
 */
const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'user_info';

/**
 * 서비스 응답 인터페이스 (로컬 사용)
 */
interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
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
): Promise<ServiceResponse<{ user: any; token: TokenResponse }>> => {
  try {
    const requestData: LoginRequest = { email, password };
    
    const response = await apiRequest<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      }
    );

    // 토큰과 사용자 정보 저장
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.token.access_token);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

    return {
      success: true,
      data: {
        user: response.user,
        token: response.token,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "로그인에 실패했습니다.",
    };
  }
};

/**
 * 회원가입 (Register new user)
 *
 * 새로운 사용자를 등록합니다.
 * 이메일, 비밀번호, 이름을 받아서 계정을 생성합니다.
 *
 * @async
 * @param {string} email - 사용자 이메일 주소
 * @param {string} password - 사용자 비밀번호
 * @param {string} name - 사용자 이름
 * @returns {Promise<ServiceResponse>} 회원가입 응답을 담은 Promise
 */
export const register = async (
  email: string,
  password: string,
  name: string
): Promise<ServiceResponse<{ user: any }>> => {
  try {
    const requestData: RegisterRequest = { email, password, name };
    
    const response = await apiRequest<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      }
    );

    return {
      success: true,
      data: {
        user: response.user,
      },
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "회원가입에 실패했습니다.",
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
  provider: SocialProvider,
  accessToken: string
): Promise<ServiceResponse<{ user: any; token: TokenResponse }>> => {
  try {
    // Google OAuth의 경우 구현된 엔드포인트 사용
    if (provider === 'google') {
      const requestData: GoogleAuthRequest = { access_token: accessToken };
      
      const response = await apiRequest<LoginResponse>(
        API_ENDPOINTS.AUTH.GOOGLE,
        {
          method: 'POST',
          body: JSON.stringify(requestData),
        }
      );

      // 토큰과 사용자 정보 저장
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.token.access_token);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

      return {
        success: true,
        data: {
          user: response.user,
          token: response.token,
        },
      };
    }
    
    // 카카오, 네이버는 아직 미구현
    console.log(`${provider} login not yet implemented`);
    return {
      success: false,
      error: `${provider} 로그인은 아직 지원되지 않습니다.`,
    };
  } catch (error) {
    console.error(`${provider} login error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `${provider} 로그인에 실패했습니다.`,
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
export const logout = async (): Promise<ServiceResponse> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    
    if (token) {
      // 백엔드에 로그아웃 요청 (토큰 무효화)
      await apiRequest(
        API_ENDPOINTS.AUTH.LOGOUT,
        {
          method: 'POST',
          headers: createHeaders(token),
        }
      );
    }
    
    // 로컬 저장소에서 토큰과 사용자 정보 삭제
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    
    // 서버 에러가 발생해도 로컬 토큰은 삭제
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "로그아웃 처리 중 오류가 발생했습니다.",
    };
  }
};

/**
 * 저장된 토큰 조회
 *
 * AsyncStorage에서 저장된 인증 토큰을 가져옵니다.
 *
 * @async
 * @returns {Promise<string | null>} 저장된 토큰 또는 null
 */
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("Token retrieval error:", error);
    return null;
  }
};

/**
 * 저장된 사용자 정보 조회
 *
 * AsyncStorage에서 저장된 사용자 정보를 가져옵니다.
 *
 * @async
 * @returns {Promise<any | null>} 저장된 사용자 정보 또는 null
 */
export const getStoredUser = async (): Promise<any | null> => {
  try {
    const userString = await AsyncStorage.getItem(USER_STORAGE_KEY);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("User info retrieval error:", error);
    return null;
  }
};

/**
 * 현재 사용자 정보 조회
 *
 * 백엔드에서 최신 사용자 정보를 가져옵니다.
 *
 * @async
 * @returns {Promise<ServiceResponse>} 사용자 정보 조회 결과
 */
export const getCurrentUser = async (): Promise<ServiceResponse<any>> => {
  try {
    const token = await getStoredToken();
    
    if (!token) {
      return {
        success: false,
        error: "인증 토큰이 없습니다.",
      };
    }

    const user = await apiRequest(
      API_ENDPOINTS.USERS.ME,
      {
        method: 'GET',
        headers: createHeaders(token),
      }
    );

    // 최신 사용자 정보로 업데이트
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "사용자 정보 조회에 실패했습니다.",
    };
  }
};

/**
 * 토큰 유효성 확인
 *
 * 현재 토큰이 유효한지 확인합니다.
 *
 * @async
 * @returns {Promise<boolean>} 토큰 유효성 여부
 */
export const isTokenValid = async (): Promise<boolean> => {
  const userResult = await getCurrentUser();
  return userResult.success;
};

/**
 * 자동 로그인 확인
 *
 * 저장된 토큰으로 자동 로그인이 가능한지 확인합니다.
 *
 * @async
 * @returns {Promise<ServiceResponse>} 자동 로그인 결과
 */
export const checkAutoLogin = async (): Promise<ServiceResponse<any>> => {
  try {
    const token = await getStoredToken();
    
    if (!token) {
      return {
        success: false,
        error: "저장된 토큰이 없습니다.",
      };
    }

    // 토큰으로 사용자 정보 조회
    const userResult = await getCurrentUser();
    
    if (!userResult.success) {
      // 토큰이 유효하지 않은 경우 삭제
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      
      return {
        success: false,
        error: "토큰이 만료되었습니다.",
      };
    }

    return {
      success: true,
      data: userResult.data,
    };
  } catch (error) {
    console.error("Auto login check error:", error);
    return {
      success: false,
      error: "자동 로그인 확인 중 오류가 발생했습니다.",
    };
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
  register,
  socialLogin,
  logout,
  getStoredToken,
  getStoredUser,
  getCurrentUser,
  isTokenValid,
  checkAutoLogin,
};
