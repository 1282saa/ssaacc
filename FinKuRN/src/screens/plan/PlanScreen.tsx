import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from '../../components/common/StatusBar';
import { BackgroundGradient } from '../../components/common/BackgroundGradient';
import { PolicyDetailModal } from '../../components/policy/PolicyDetailModal';
import { theme } from '../../constants/theme';
import type { AppNavigation } from '../../types/navigation';
import { taskService, type Task, type TodayTasksResponse } from '../../services/taskService';
import { policyService, type UserPolicyProgress, type YouthPolicy } from '../../services/policyService';
import * as documentProgressService from '../../services/documentProgressService';

/**
 * Plan 화면 (할일 관리)
 * Anima 디자인을 React Native로 픽셀-퍼펙트 변환
 */
export const PlanScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();
  const [todayTasks, setTodayTasks] = useState<TodayTasksResponse | null>(null);
  const [youthPolicies, setYouthPolicies] = useState<YouthPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<YouthPolicy | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 체크박스 상태 관리: { policyId: { docIndex: true/false } }
  const [checkedItems, setCheckedItems] = useState<Record<number, Record<number, boolean>>>({});

  // 오늘의 할 일 및 정책 불러오기
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadTodayTasks(), loadYouthPolicies(), loadDocumentProgress()]);
  };

  // 문서 완료 현황 로드
  const loadDocumentProgress = async () => {
    try {
      const progressList = await documentProgressService.getAllDocumentProgress();

      // API 응답을 checkedItems 형식으로 변환
      const newCheckedItems: Record<number, Record<number, boolean>> = {};

      progressList.forEach((progress) => {
        if (!newCheckedItems[progress.policy_id]) {
          newCheckedItems[progress.policy_id] = {};
        }
        newCheckedItems[progress.policy_id][progress.document_index] = progress.is_completed;
      });

      setCheckedItems(newCheckedItems);
      console.log('📦 문서 진행 상황 로드 완료:', progressList.length, '개');
    } catch (err) {
      console.error('Load document progress error:', err);
      // 에러가 있어도 화면은 계속 표시
    }
  };

  const loadTodayTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTodayTasks();

      if (response.success && response.data) {
        setTodayTasks(response.data);
      } else {
        setError(response.error || '할 일을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('할 일을 불러오는 중 오류가 발생했습니다.');
      console.error('Load today tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadYouthPolicies = async () => {
    try {
      setPoliciesLoading(true);
      // 스마트 정렬: 마감일 있는 것 우선(최신순) → 상시 모집은 가나다순
      const response = await policyService.getAllYouthPolicies({
        limit: 28,
        sort_by: 'smart'
      });

      if (response.success && response.data) {
        console.log('📊 정책 데이터 로드 성공:', response.data.policies.length, '개');
        console.log('첫 번째 정책:', response.data.policies[0]);
        setYouthPolicies(response.data.policies);
      } else {
        console.error('Load youth policies error:', response.error);
      }
    } catch (err) {
      console.error('Load youth policies error:', err);
    } finally {
      setPoliciesLoading(false);
    }
  };

  // 체크박스 토글 핸들러 (API 연동)
  const handleCheckboxToggle = async (policyId: number, docIndex: number, documentName: string) => {
    try {
      // 먼저 UI 업데이트 (낙관적 업데이트)
      setCheckedItems(prev => {
        const newState = { ...prev };
        if (!newState[policyId]) {
          newState[policyId] = {};
        }
        newState[policyId][docIndex] = !newState[policyId]?.[docIndex];
        return newState;
      });

      // API 호출로 데이터베이스에 저장
      await documentProgressService.toggleDocumentCompletion(
        policyId,
        docIndex,
        documentName
      );

      console.log(`✅ 체크박스 토글 완료: 정책 ${policyId}, 문서 ${docIndex} (${documentName})`);
    } catch (err) {
      console.error('Toggle checkbox error:', err);

      // 에러 발생 시 UI 복원
      setCheckedItems(prev => {
        const newState = { ...prev };
        if (newState[policyId]) {
          newState[policyId][docIndex] = !newState[policyId][docIndex];
        }
        return newState;
      });
    }
  };

  // 진행률 계산 - 화면에 실제로 보이는 체크박스만 기준
  const calculateProgress = () => {
    // 오늘의 할 일에 표시되는 정책 (최대 4개)
    const todayPolicies = youthPolicies.slice(0, 4);

    if (todayPolicies.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    // 화면에 보이는 체크리스트 항목만 계산 (각 정책당 최대 2개)
    let totalItems = 0;
    let completedItems = 0;

    todayPolicies.forEach((policy) => {
      const docs = policy.required_documents || [];
      const visibleDocs = docs.slice(0, 2); // 화면에 보이는 것만
      totalItems += visibleDocs.length;

      // 실제 체크된 항목 개수
      visibleDocs.forEach((doc, docIndex) => {
        if (checkedItems[policy.id]?.[docIndex]) {
          completedItems += 1;
        }
      });
    });

    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return { completed: completedItems, total: totalItems, percentage };
  };

  const progress = calculateProgress();

  const handlePolicyPress = (policy: YouthPolicy) => {
    setSelectedPolicy(policy);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPolicy(null);
  };

  return (
    <View style={styles.container}>
      {/* 배경 그라디언트 */}
      <BackgroundGradient
        layers={[
          {
            top: 73,
            left: -14,
            opacity: 1,
            colors: [
              'rgba(66, 0, 255, 0.2)',
              'rgba(223, 127, 127, 0.2)',
              'rgba(255, 229, 0, 0.2)',
            ],
          },
          {
            top: 687,
            left: -226,
            opacity: 1,
            colors: [
              'rgba(66, 0, 255, 0.2)',
              'rgba(223, 127, 127, 0.2)',
              'rgba(255, 229, 0, 0.2)',
            ],
          },
          {
            top: 1198,
            left: -285,
            opacity: 1,
            colors: [
              'rgba(66, 0, 255, 0.2)',
              'rgba(223, 127, 127, 0.2)',
              'rgba(255, 229, 0, 0.2)',
            ],
          },
        ]}
        size={595}
      />

      <StatusBar />

      {/* 타이틀 바 (view-6) */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>할 일</Text>
        <Image
          source={{ uri: 'https://c.animaapp.com/7tTmI81R/img/------.svg' }}
          style={styles.titleImage}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 로딩 또는 에러 표시 */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3060F1" />
          </View>
        )}

        {error && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadData} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 진행률 카드 (Frame) - top: 112px */}
        {!loading && !error && (
          <View style={styles.progressCard}>
            <Text style={styles.progressText}>
              {progress.total > 0
                ? `오늘 챙길 서류 ${progress.total}개 중 ${progress.completed}개를 완료했어요`
                : '오늘 챙길 서류가 없습니다'}
            </Text>
            <View style={styles.progressBarWrapper}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${progress.percentage}%`,
                    maxWidth: 288,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressSubText}>
              진행률 {progress.percentage}%{'\n'}
              {youthPolicies.length > 0 && `진행 중인 정책 ${youthPolicies.slice(0, 4).length}건`}
            </Text>
          </View>
        )}

        {/* 오늘의 할 일 제목 - top: 287px */}
        {!loading && !error && (
          <>
            <Text style={styles.sectionTitle1}>오늘의 할 일</Text>

            {/* 오늘의 할 일 목록 - 정책 데이터 표시 */}
            {!policiesLoading && youthPolicies.length > 0 ? (
              youthPolicies.slice(0, 4).map((policy, index) => {
                // 필요 서류 (최대 2개만 표시)
                const requiredDocs = policy.required_documents?.slice(0, 2) || [];
                console.log(`정책 ${index + 1}: ${policy.policy_name}, 서류 개수: ${requiredDocs.length}`, requiredDocs);

                // 마감일 텍스트
                const deadlineText = policy.deadline || '상시 모집';

                // 포털 링크
                const portalUrl = policy.application_info?.application_url;
                console.log(`  포털 URL: ${portalUrl}`);

                // 카테고리 표시
                const categoryText = policy.category || '정책';

                return (
                  <View
                    key={policy.id}
                    style={[
                      styles.todayTaskCard,
                      index > 0 && { marginTop: 12 },
                    ]}
                  >
                    {/* 정책명 */}
                    <TouchableOpacity
                      onPress={() => handlePolicyPress(policy)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.todayTaskTitle}>{policy.policy_name}</Text>
                    </TouchableOpacity>

                    {/* 포털 바로가기 */}
                    {portalUrl && (
                      <TouchableOpacity
                        style={styles.portalLinkWrapper}
                        onPress={(e: any) => {
                          e.stopPropagation();
                          Linking.openURL(portalUrl).catch(err =>
                            console.error('Failed to open URL:', err)
                          );
                        }}
                      >
                        <Text style={styles.portalLink}>포털 바로가기</Text>
                      </TouchableOpacity>
                    )}

                    {/* 설명 텍스트 - 필요 서류 요약 */}
                    {requiredDocs.length > 0 && (
                      <Text style={styles.taskDescription}>
                        {requiredDocs.map(d => d.name).join('과 ')}를 제출해야 해요
                      </Text>
                    )}

                    {/* 챙겨야 하는 것들 (체크리스트) - Figma 스타일 */}
                    {requiredDocs.length > 0 && (
                      <View style={styles.todayTaskChecklist}>
                        {requiredDocs.map((doc, docIndex) => {
                          const isChecked = checkedItems[policy.id]?.[docIndex] || false;

                          return (
                            <TouchableOpacity
                              key={doc.id || docIndex}
                              style={styles.checklistItemFigma}
                              onPress={() => handleCheckboxToggle(policy.id, docIndex, doc.name)}
                              activeOpacity={0.7}
                            >
                              {/* 서류명 (왼쪽) */}
                              <Text style={styles.checklistTextFigma}>{doc.name}</Text>
                              {/* 체크박스 (오른쪽) */}
                              <View style={[
                                styles.checkboxFigma,
                                isChecked ? styles.checkboxChecked : styles.checkboxUnchecked
                              ]}>
                                {isChecked && (
                                  <Text style={styles.checkmarkFigma}>✓</Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}

                    {/* 마감일 */}
                    <Text style={styles.todayTaskDeadline}>
                      마감일  {deadlineText}
                    </Text>
                  </View>
                );
              })
            ) : policiesLoading ? (
              <View style={styles.emptyContainer}>
                <ActivityIndicator size="small" color="#3060F1" />
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>정책 정보가 없습니다</Text>
              </View>
            )}
          </>
        )}

        {/* 다가오는 일정 제목 - top: 846px */}
        {!loading && !error && (
          <>
            <Text style={styles.sectionTitle2}>다가오는 일정</Text>

            {/* 다가오는 일정 리스트 (Div) - top: 877px */}
            <View style={styles.scheduleContainer}>
              {todayTasks && todayTasks.tasks.length > 0 ? (
                todayTasks.tasks.slice(0, 4).map((task) => (
                  <View key={`schedule-${task.id}`} style={styles.scheduleItem}>
                    <View style={styles.scheduleLeft}>
                      <View style={styles.scheduleIconWrapper}>
                        <View style={styles.scheduleIcon} />
                        <Text style={styles.scheduleCategory}>{task.category === 'finance' ? '금융' : task.category === 'employment' ? '취업' : task.category === 'policy' ? '정책' : task.category}</Text>
                      </View>
                      <Text style={styles.scheduleTask}>{task.title}</Text>
                    </View>
                    <Text style={styles.scheduleDday}>
                      D{task.days_until_due >= 0 ? `-${task.days_until_due}` : `+${Math.abs(task.days_until_due)}`}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>다가오는 일정이 없습니다</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* 정책별 진행 현황 제목 - top: 1055px */}
        {!loading && !error && (
          <>
            <Text style={styles.sectionTitle3}>정책별 진행 현황 확인하기</Text>

            {/* 정책 카드 그리드 (2x2) - Figma 디자인 */}
            <View style={styles.policyGridFigma}>
              {!policiesLoading && youthPolicies.length > 0 ? (
                youthPolicies.slice(0, 4).map((policy, index) => {
                  // 상태 결정 (임의로 첫 2개는 진행 중, 나머지는 완료)
                  const isInProgress = index < 2;
                  const statusDotStyle = isInProgress ? styles.statusDotYellowSmall : styles.statusDotBlueSmall;

                  // 필요 서류 개수
                  const totalDocs = policy.required_documents?.length || 0;
                  const completedDocs = isInProgress ? Math.floor(totalDocs * 0.7) : totalDocs;

                  // 상태 텍스트
                  const statusText = isInProgress
                    ? `진행 중 (${completedDocs}/${totalDocs} 완료)`
                    : '지원 완료';

                  // D-day 또는 기타 상태
                  let bottomText = '';
                  if (index === 0) bottomText = 'D-1';
                  else if (index === 1) bottomText = 'D-2';
                  else if (index === 2) bottomText = '결과 발표 대기';
                  else bottomText = '심사 중';

                  // 카드 너비 (교대로 159px, 157px)
                  const cardWidth = index % 2 === 0 ? 159 : 157;

                  return (
                    <TouchableOpacity
                      key={policy.id}
                      style={[styles.policyCardSmall, { width: cardWidth }]}
                      onPress={() => handlePolicyPress(policy)}
                      activeOpacity={0.7}
                    >
                      {/* 정책명 */}
                      <Text style={styles.policyTitleSmall} numberOfLines={2}>
                        {policy.policy_name}
                      </Text>

                      {/* 상태 표시 */}
                      <View style={styles.policyStatusSmall}>
                        <View style={statusDotStyle} />
                        <Text style={styles.statusTextSmall}>{statusText}</Text>
                      </View>

                      {/* 화살표 버튼 */}
                      <View style={styles.arrowButtonSmall}>
                        <Image
                          source={{ uri: 'https://c.animaapp.com/j2BA0Pdd/img/arrow-sm-right-4.svg' }}
                          style={styles.arrowIconSmall}
                          resizeMode="contain"
                        />
                      </View>

                      {/* D-day / 상태 */}
                      <Text style={styles.policyBottomText}>{bottomText}</Text>
                    </TouchableOpacity>
                  );
                })
              ) : policiesLoading ? (
                <View style={styles.emptyContainer}>
                  <ActivityIndicator size="small" color="#3060F1" />
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>청년 정책이 없습니다</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* 하단 여백 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 정책 상세 모달 */}
      <PolicyDetailModal
        visible={modalVisible}
        policy={selectedPolicy}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // 타이틀 바 (view-6) - height: 56px
  titleBar: {
    flexDirection: 'row',
    gap: 108,
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.layout.statusBarHeight,
  },
  titleText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    height: 19,
    letterSpacing: 0,
    marginLeft: 164,
    marginTop: 18,
    width: 32,
  },
  titleImage: {
    height: 40,
    width: 40,
    marginTop: 8,
  },

  // 진행률 카드 (Frame) - left: 16px, width: 328px, height: 135px
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    height: 135,
    marginLeft: 16,
    marginTop: 12,
    width: 328,
    overflow: 'hidden',
    paddingLeft: 20,
    paddingTop: 20,
  },
  progressText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    height: 19,
    letterSpacing: 0,
    width: 236,
  },
  progressBarWrapper: {
    backgroundColor: '#F1F3F5',
    borderRadius: 100,
    marginTop: 20,
    width: 288,
    overflow: 'hidden',
  },
  progressBar: {
    backgroundColor: '#3060F1',
    borderRadius: 100,
    height: 12,
    width: 115,
  },
  progressSubText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    color: '#767676',
    height: 34,
    letterSpacing: 0,
    marginTop: 10,
    width: 208,
  },

  // 섹션 타이틀 1 - top: 287px
  sectionTitle1: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    marginLeft: 18,
    marginTop: 40,
  },

  // 오늘의 할 일 카드 (레퍼런스와 동일한 스타일)
  todayTaskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 226,
    width: 328,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginLeft: 16,
    marginTop: 31,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  todayTaskTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 20,
    fontWeight: '600',
    color: '#3060F1',
    letterSpacing: 0,
    maxWidth: 200,
  },
  todayTaskCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  taskDescription: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#767676',
    letterSpacing: 0,
    marginTop: 10,
  },
  todayTaskChecklist: {
    marginTop: 20,
    gap: 12,
  },
  todayTaskDeadline: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#A0A0A0',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    bottom: 20,
  },

  // Figma 스타일 체크리스트
  checklistItemFigma: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  checklistTextFigma: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    flex: 1,
  },
  checkboxFigma: {
    width: 20,
    height: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3060F1',
  },
  checkboxUnchecked: {
    backgroundColor: '#D9D9D9',
  },
  checkmarkFigma: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 14,
  },

  // 기존 할일 카드 (사용 안함)
  taskCard1: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 226,
    marginLeft: 16,
    marginTop: 31,
    width: 328,
  },
  taskTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 20,
    fontWeight: '600',
    color: '#3060F1',
    letterSpacing: 0,
    marginLeft: 20,
    marginTop: 20,
  },
  portalLinkWrapper: {
    position: 'absolute',
    left: 237,
    top: 20,
  },
  portalLink: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '400',
    color: '#3060F1',
    letterSpacing: 0,
  },
  taskDescription1: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#767676',
    letterSpacing: 0,
    marginLeft: 20,
    marginTop: 10,
  },
  deadline1: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#A0A0A0',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    top: 190,
  },
  checklistContainer1: {
    position: 'absolute',
    left: 20,
    top: 86,
    width: 288,
    gap: 12,
  },

  // 할일 카드 2 (DivWrapper) - left: 16px, top: 564px, width: 328px, height: 242px
  taskCard2: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 242,
    marginLeft: 16,
    marginTop: 20,
    width: 328,
  },
  taskDescription2: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#767676',
    letterSpacing: 0,
    marginLeft: 20,
    marginTop: 10,
  },
  deadline2: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#A0A0A0',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    top: 206,
  },
  checklistContainer2: {
    position: 'absolute',
    left: 20,
    top: 102,
    width: 288,
    gap: 12,
  },

  // 체크리스트 공통 (정책별 진행 현황 - 체크박스 오른쪽)
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  checklistText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    flex: 1,
  },
  checkIcon: {
    width: 20,
    height: 20,
  },
  checkboxWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    fontSize: 18,
    color: '#3060F1',
  },

  // 오늘의 할 일 체크리스트 (체크박스 왼쪽 + 체크마크 오른쪽)
  checklistItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  checkboxWrapperLeft: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLeft: {
    fontSize: 16,
    color: '#3060F1',
    fontWeight: '400',
  },
  checklistTextLeft: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    flex: 1,
    lineHeight: 20,
  },
  checkmarkWrapperRight: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkRight: {
    fontSize: 16,
    color: '#3060F1',
    fontWeight: '600',
  },

  // 섹션 타이틀 2 - top: 846px
  sectionTitle2: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    marginLeft: 18,
    marginTop: 40,
  },

  // 다가오는 일정 (Div) - left: 16px, top: 877px, width: 326px
  scheduleContainer: {
    marginLeft: 16,
    marginTop: 31,
    width: 326,
    gap: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  scheduleLeft: {
    flexDirection: 'column',
    flex: 1,
  },
  scheduleIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  scheduleIcon: {
    backgroundColor: '#A9BFF3',
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  scheduleCategory: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#3060F1',
    letterSpacing: 0,
    lineHeight: 22.4,
  },
  scheduleTask: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    color: '#767676',
    letterSpacing: 0,
    lineHeight: 19.6,
    marginTop: 8,
  },
  scheduleDday: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    color: '#A0A0A0',
    letterSpacing: 0,
    lineHeight: 19.6,
  },

  // 섹션 타이틀 3 - top: 1055px
  sectionTitle3: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    marginLeft: 18,
    marginTop: 100,
  },

  // 정책 카드 그리드 (Figma 2x2 그리드)
  policyGridFigma: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 11, // 세로 간격
    rowGap: 11,
    columnGap: 12, // 가로 간격
    marginLeft: 16,
    marginTop: 39,
    width: 328,
  },

  // 작은 정책 카드 (Figma 디자인)
  policyCardSmall: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 124,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },

  // 작은 카드 정책명
  policyTitleSmall: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    lineHeight: 16,
    position: 'absolute',
    left: 20,
    top: 20,
    width: 119,
  },

  // 작은 카드 상태 표시
  policyStatusSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    left: 20,
    top: 51,
  },

  // 작은 점 (노란색 - 진행 중)
  statusDotYellowSmall: {
    backgroundColor: '#FFE812',
    borderRadius: 4,
    height: 8,
    width: 8,
  },

  // 작은 점 (파란색 - 완료)
  statusDotBlueSmall: {
    backgroundColor: '#3060F1',
    borderRadius: 4,
    height: 8,
    width: 8,
  },

  // 작은 카드 상태 텍스트
  statusTextSmall: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: '#767676',
    letterSpacing: 0,
  },

  // 작은 화살표 버튼
  arrowButtonSmall: {
    backgroundColor: '#000000',
    borderRadius: 100,
    height: 32,
    width: 32,
    position: 'absolute',
    left: 115,
    top: 80,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // 작은 화살표 아이콘
  arrowIconSmall: {
    height: 20,
    width: 20,
  },

  // 하단 텍스트 (D-day 등)
  policyBottomText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: '#A0A0A0',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    top: 88,
  },

  // 기존 정책 카드 그리드 (사용 안함)
  policyGrid: {
    marginLeft: 16,
    marginTop: 39,
    width: 328,
  },

  // 큰 정책 카드 (전체 너비)
  policyCardLarge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 226,
    width: 328,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  policyTitleLarge: {
    fontFamily: 'Pretendard Variable',
    fontSize: 20,
    fontWeight: '600',
    color: '#3060F1',
    letterSpacing: 0,
    maxWidth: 200,
  },
  policyStatusLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  checklistContainerLarge: {
    marginTop: 20,
    gap: 12,
  },
  deadlineLarge: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '500',
    color: '#A0A0A0',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    bottom: 20,
  },

  // 기존 작은 정책 카드 (사용 안함)
  policyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 124,
    width: 159,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  policyCard2: {
    width: 157,
  },
  policyTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    top: 20,
  },
  policyTitle2: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    top: 16,
    width: 119,
    lineHeight: 16,
  },
  policyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    left: 20,
    top: 51,
  },
  policyStatus2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    left: 20,
    top: 50,
  },
  statusDotYellow: {
    backgroundColor: '#FFE812',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusDotBlue: {
    backgroundColor: '#3060F1',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: '#767676',
    letterSpacing: 0,
  },
  arrowButton: {
    backgroundColor: '#000000',
    borderRadius: 100,
    height: 32,
    width: 32,
    position: 'absolute',
    left: 115,
    top: 80,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  arrowIcon: {
    height: 20,
    width: 20,
  },
  policyDday: {
    fontFamily: 'Pretendard Variable',
    fontSize: 13,
    fontWeight: '600',
    color: '#A0A0A0',
    letterSpacing: 0,
    position: 'absolute',
    left: 20,
    top: 88,
  },
  requiredDocsIndicator: {
    position: 'absolute',
    left: 20,
    top: 65,
  },
  requiredDocsText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '500',
    color: '#3060F1',
    letterSpacing: 0,
  },

  // 로딩 및 에러 상태
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
  },
  errorText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    color: '#E53E3E',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#3060F1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryButtonText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // 상태 뱃지
  statusBadge: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  statusBadgeOverdue: {
    backgroundColor: '#FEE2E2',
  },

  // 빈 상태
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 31,
    marginHorizontal: 16,
  },
  emptyText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    color: '#A0A0A0',
    textAlign: 'center',
  },
});
