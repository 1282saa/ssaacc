/**
 * Google OAuth 서비스
 * 
 * Google Sign-In을 처리하는 전용 서비스입니다.
 * 웹과 모바일 모두 지원합니다.
 */

import { Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

/**
 * Google OAuth 설정
 */
const GOOGLE_CONFIG = {
  webClientId: '4468602791-l5ll7qlj5q2n30pvjtaff0sqdkgbrq83.apps.googleusercontent.com',
  offlineAccess: true,
};

/**
 * Google Sign-In 초기화
 */
export const initializeGoogleSignIn = () => {
  // 웹에서는 초기화 스킵
  if (Platform.OS === 'web') {
    console.log('Web platform - Google Sign-In initialization skipped');
    return;
  }
  
  GoogleSignin.configure(GOOGLE_CONFIG);
};

/**
 * Google Identity Services 스크립트 로드
 */
const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Script 로드 실패'));
    document.head.appendChild(script);
  });
};

/**
 * 웹용 Google OAuth 처리 (정식 구현)
 */
const signInWithGoogleWeb = async () => {
  try {
    // Google Identity Services 로드
    await loadGoogleScript();

    return new Promise<any>((resolve) => {
      const google = (window as any).google;
      
      if (!google) {
        resolve({
          success: false,
          error: 'Google Services를 로드할 수 없습니다.',
        });
        return;
      }

      // Google OAuth 초기화
      google.accounts.id.initialize({
        client_id: '4468602791-l5ll7qlj5q2n30pvjtaff0sqdkgbrq83.apps.googleusercontent.com',
        callback: (response: any) => {
          try {
            // JWT 토큰 디코딩 (간단한 방법)
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            
            resolve({
              success: true,
              userInfo: {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                given_name: payload.given_name,
                family_name: payload.family_name,
                picture: payload.picture,
              },
              accessToken: response.credential, // ID 토큰을 액세스 토큰으로 사용
            });
          } catch (error) {
            console.error('Token decode error:', error);
            resolve({
              success: false,
              error: '인증 정보 처리 중 오류가 발생했습니다.',
            });
          }
        },
        error_callback: (error: any) => {
          console.error('Google Sign-In Error:', error);
          resolve({
            success: false,
            error: 'Google 로그인에 실패했습니다.',
          });
        }
      });

      // One Tap 프롬프트 표시
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.log('One Tap not displayed:', notification.getNotDisplayedReason());
          
          // One Tap이 표시되지 않으면 팝업 방식 사용
          google.accounts.oauth2.initTokenClient({
            client_id: '4468602791-l5ll7qlj5q2n30pvjtaff0sqdkgbrq83.apps.googleusercontent.com',
            scope: 'openid email profile',
            callback: (response: any) => {
              if (response.access_token) {
                // Access Token을 사용해 사용자 정보 가져오기
                fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`)
                  .then(res => res.json())
                  .then(userInfo => {
                    resolve({
                      success: true,
                      userInfo: userInfo,
                      accessToken: response.access_token,
                    });
                  })
                  .catch(error => {
                    console.error('User info fetch error:', error);
                    resolve({
                      success: false,
                      error: '사용자 정보를 가져올 수 없습니다.',
                    });
                  });
              } else {
                resolve({
                  success: false,
                  error: '액세스 토큰을 받을 수 없습니다.',
                });
              }
            },
            error_callback: (error: any) => {
              console.error('OAuth2 Error:', error);
              resolve({
                success: false,
                error: 'Google 인증에 실패했습니다.',
              });
            }
          }).requestAccessToken();
        }
      });

      // 5초 후에도 응답이 없으면 타임아웃
      setTimeout(() => {
        resolve({
          success: false,
          error: '인증 요청 시간이 초과되었습니다.',
        });
      }, 10000);
    });
  } catch (error) {
    console.error('Web Google Sign-In Error:', error);
    return {
      success: false,
      error: 'Google 로그인 초기화에 실패했습니다.',
    };
  }
};

/**
 * Google 로그인 처리
 */
export const signInWithGoogle = async () => {
  // 웹 환경에서는 다른 방식 사용
  if (Platform.OS === 'web') {
    return await signInWithGoogleWeb();
  }

  try {
    // Google Play Services 확인 (모바일에서만)
    await GoogleSignin.hasPlayServices();
    
    // 사용자 정보 가져오기
    const userInfo = await GoogleSignin.signIn();
    
    return {
      success: true,
      userInfo: userInfo.data,
      accessToken: userInfo.data?.accessToken,
    };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return {
        success: false,
        error: '로그인이 취소되었습니다.',
      };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return {
        success: false,
        error: '이미 로그인이 진행 중입니다.',
      };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        success: false,
        error: 'Google Play Services를 사용할 수 없습니다.',
      };
    } else {
      return {
        success: false,
        error: 'Google 로그인에 실패했습니다.',
      };
    }
  }
};

/**
 * Google 로그아웃
 */
export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    return { success: true };
  } catch (error) {
    console.error('Google Sign-Out Error:', error);
    return { 
      success: false, 
      error: 'Google 로그아웃에 실패했습니다.' 
    };
  }
};

/**
 * 현재 Google 로그인 상태 확인
 */
export const checkGoogleSignInStatus = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      const userInfo = await GoogleSignin.getCurrentUser();
      return {
        isSignedIn: true,
        userInfo: userInfo?.data,
      };
    }
    return { isSignedIn: false };
  } catch (error) {
    console.error('Check Google Sign-In Status Error:', error);
    return { isSignedIn: false };
  }
};