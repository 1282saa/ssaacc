import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import type { YouthPolicy } from '../../services/policyService';

interface PolicyDetailModalProps {
  visible: boolean;
  policy: YouthPolicy | null;
  onClose: () => void;
}

/**
 * 정책 상세 정보 모달
 *
 * 정책 카드 클릭 시 표시되는 상세 정보 모달
 * - 신청 링크
 * - 담당 기관
 * - 지원 내용
 * - 필요 서류 목록
 */
export const PolicyDetailModal: React.FC<PolicyDetailModalProps> = ({
  visible,
  policy,
  onClose,
}) => {
  if (!policy) return null;

  const handleLinkPress = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch(err =>
        console.error('Failed to open URL:', err)
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* 헤더 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{policy.policy_name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 컨텐츠 */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* 기본 정보 */}
            <View style={styles.section}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>카테고리</Text>
                <Text style={styles.infoValue}>{policy.category || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>지역</Text>
                <Text style={styles.infoValue}>{policy.region || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>마감일</Text>
                <Text style={styles.infoValue}>{policy.deadline || '상시 모집'}</Text>
              </View>
            </View>

            {/* 지원 내용 */}
            {policy.support_content && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>지원 내용</Text>
                <Text style={styles.sectionText}>{policy.support_content}</Text>
              </View>
            )}

            {/* 요약 */}
            {policy.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>정책 요약</Text>
                <Text style={styles.sectionText}>{policy.summary}</Text>
              </View>
            )}

            {/* 필요 서류 */}
            {policy.required_documents && policy.required_documents.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>필요 서류</Text>
                {policy.required_documents.map((doc, index) => (
                  <View key={doc.id || index} style={styles.documentItem}>
                    <View style={styles.documentHeader}>
                      <Text style={styles.documentName}>
                        {doc.is_required ? '✓ ' : '○ '}
                        {doc.name}
                      </Text>
                      {doc.is_required && (
                        <View style={styles.requiredBadge}>
                          <Text style={styles.requiredBadgeText}>필수</Text>
                        </View>
                      )}
                    </View>
                    {doc.description && (
                      <Text style={styles.documentDescription}>{doc.description}</Text>
                    )}
                    {doc.issue_location && (
                      <Text style={styles.documentInfo}>
                        📍 발급처: {doc.issue_location}
                      </Text>
                    )}
                    {doc.notes && (
                      <Text style={styles.documentNotes}>💡 {doc.notes}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* 신청 정보 */}
            {policy.application_info && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>신청 정보</Text>

                {policy.application_info.managing_agency && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>담당 기관</Text>
                    <Text style={styles.infoValue}>
                      {policy.application_info.managing_agency}
                    </Text>
                  </View>
                )}

                {policy.application_info.contact && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>문의처</Text>
                    <Text style={styles.infoValue}>
                      {policy.application_info.contact}
                    </Text>
                  </View>
                )}

                {policy.application_info.application_url && (
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => handleLinkPress(policy.application_info?.application_url)}
                  >
                    <Text style={styles.linkButtonText}>🔗 신청 페이지로 이동</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* 하단 여백 */}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  modalTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
    paddingRight: 40,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#F1F3F5',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#767676',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  sectionText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '400',
    color: '#494949',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoLabel: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '600',
    color: '#767676',
    width: 80,
  },
  infoValue: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  documentItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  documentName: {
    fontFamily: 'Pretendard Variable',
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: '#3060F1',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  requiredBadgeText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  documentDescription: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '400',
    color: '#767676',
    marginBottom: 6,
  },
  documentInfo: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#494949',
    marginTop: 4,
  },
  documentNotes: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '400',
    color: '#FF8A00',
    marginTop: 6,
    fontStyle: 'italic',
  },
  linkButton: {
    backgroundColor: '#3060F1',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  linkButtonText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
