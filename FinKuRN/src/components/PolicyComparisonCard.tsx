/**
 * 정책 비교 카드 컴포넌트
 *
 * 두 개의 정책을 나란히 비교하여 보여주는 카드 컴포넌트
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { theme } from '../constants/theme';

export interface PolicyCardData {
  title: string;
  target: string;
  income: string;
  amount: string;
  application: string;
}

interface PolicyComparisonCardProps {
  policyA: PolicyCardData;
  policyB: PolicyCardData;
}

export const PolicyComparisonCard: React.FC<PolicyComparisonCardProps> = ({
  policyA,
  policyB,
}) => {
  // 화면 너비 감지
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      setIsNarrowScreen(width < 320); // 매우 작은 화면만 세로 배치
    };

    updateLayout();
    const subscription = Dimensions.addEventListener('change', updateLayout);

    return () => {
      subscription?.remove();
    };
  }, []);

  // 빈 데이터 처리 헬퍼 함수
  const formatValue = (value: string | undefined | null) => {
    return value && value.trim() ? value : '정보 없음';
  };

  const handleCardPress = (cardType: 'A' | 'B', policyTitle: string) => {
    console.log(`${cardType} 정책 카드 클릭:`, policyTitle);
    // TODO: 향후 외부 링크 열기 또는 상세 정보로 스크롤
  };

  return (
    <View style={[styles.container, isNarrowScreen && styles.containerVertical]}>
      {/* 정책 A */}
      <TouchableOpacity
        style={[styles.card, styles.cardA]}
        onPress={() => handleCardPress('A', policyA.title)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.cardLabelBadge, styles.cardLabelBadgeA]}>
            <Text style={[styles.cardLabel, styles.cardLabelA]}>A</Text>
          </View>
          <Text style={styles.cardTitle}>{formatValue(policyA.title)}</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>대상</Text>
            <Text style={styles.infoValue}>{formatValue(policyA.target)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>소득</Text>
            <Text style={styles.infoValue}>{formatValue(policyA.income)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>금액</Text>
            <Text style={styles.infoValue}>{formatValue(policyA.amount)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>신청</Text>
            <Text style={styles.infoValue}>{formatValue(policyA.application)}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* 정책 B */}
      <TouchableOpacity
        style={[styles.card, styles.cardB]}
        onPress={() => handleCardPress('B', policyB.title)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.cardLabelBadge, styles.cardLabelBadgeB]}>
            <Text style={[styles.cardLabel, styles.cardLabelB]}>B</Text>
          </View>
          <Text style={styles.cardTitle}>{formatValue(policyB.title)}</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>대상</Text>
            <Text style={styles.infoValue}>{formatValue(policyB.target)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>소득</Text>
            <Text style={styles.infoValue}>{formatValue(policyB.income)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>금액</Text>
            <Text style={styles.infoValue}>{formatValue(policyB.amount)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>신청</Text>
            <Text style={styles.infoValue}>{formatValue(policyB.application)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  containerVertical: {
    flexDirection: 'column',
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardA: {
    borderColor: '#4A90E2',
    backgroundColor: '#F8FBFF',
  },
  cardB: {
    borderColor: '#50C878',
    backgroundColor: '#F8FFF8',
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardLabelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 6,
  },
  cardLabelBadgeA: {
    backgroundColor: '#4A90E2',
  },
  cardLabelBadgeB: {
    backgroundColor: '#50C878',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardLabelA: {
    color: '#FFFFFF',
  },
  cardLabelB: {
    color: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    lineHeight: 16,
  },
  cardContent: {
    gap: 6,
  },
  infoRow: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: '400',
    color: theme.colors.textPrimary,
    lineHeight: 14,
  },
});
