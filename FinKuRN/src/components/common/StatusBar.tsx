import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

/**
 * 상태 표시줄 컴포넌트 (Status Bar Component)
 *
 * iOS 스타일의 상태 표시줄을 시간과 시스템 아이콘과 함께 표시합니다.
 * 모든 화면에서 일관되게 사용되어 통일된 상단 UI를 유지합니다.
 *
 * @component
 * @category UI/Components/Common
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { StatusBar } from './components/common/StatusBar';
 *
 * <StatusBar />
 * ```
 *
 * @description
 * 표시 내용:
 * - 시간: "9:41" (Time Display)
 * - 시스템 아이콘: 배터리, 신호, Wi-Fi 등 (System Icons: Battery, Signal, Wi-Fi)
 *
 * @features
 * - 절대 위치 지정 (Absolute Positioning) - 화면 최상단 고정
 * - z-index: 100 - 다른 요소 위에 표시
 * - 반응형 레이아웃 (Responsive Layout)
 *
 * @styling
 * - height: 44px
 * - paddingTop: 12px
 * - paddingHorizontal: 18px
 */
export const StatusBar: React.FC = () => {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.statusTime}>9:41</Text>
      <Image
        source={{ uri: 'https://c.animaapp.com/FbLlYdc1/img/right-side@2x.png' }}
        style={styles.statusIcons}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    zIndex: 100,
  },
  statusTime: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 15,
    color: '#000',
    width: 54,
    textAlign: 'center',
  },
  statusIcons: {
    width: 66.66,
    height: 11.34,
    marginTop: 4.3,
    marginRight: 2,
  },
});
