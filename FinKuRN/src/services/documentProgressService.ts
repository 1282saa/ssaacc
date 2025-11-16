/**
 * Document Progress Service
 * 문서 완료 현황 관련 API 호출
 *
 * 📋 목적:
 * - PlanScreen의 체크박스 상태를 백엔드 API와 동기화
 * - 사용자별 정책 문서 준비 현황을 데이터베이스에서 조회/저장
 * - 페이지 새로고침 시에도 체크 상태 유지
 *
 * 🔗 관련 파일:
 * - UI: FinKuRN/src/screens/plan/PlanScreen.tsx
 * - Backend API: backend/app/api/v1/document_progress.py
 * - Model: backend/app/models/document_progress.py
 *
 * 🔐 인증:
 * - 모든 API 호출은 JWT Bearer Token 필요
 * - apiClient가 자동으로 토큰을 헤더에 포함
 *
 * 📡 API 엔드포인트 매핑:
 * - getAllDocumentProgress()     → GET  /api/v1/document-progress/
 * - getPolicyDocumentProgress()  → GET  /api/v1/document-progress/policy/{id}
 * - toggleDocumentCompletion()   → POST /api/v1/document-progress/toggle
 * - getDocumentProgressStats()   → GET  /api/v1/document-progress/stats
 *
 * 📅 작성일: 2025-01-16
 * 👤 작성자: Claude Code
 */

import { apiClient } from './apiClient';

/**
 * 문서 진행 상황 인터페이스
 *
 * 백엔드 DocumentProgressResponse 스키마와 매핑됨
 * (backend/app/schemas/document_progress.py)
 */
export interface DocumentProgress {
  /** 진행 상황 고유 ID (데이터베이스 자동 생성) */
  id: number;

  /** 사용자 ID (UUID 문자열) */
  user_id: string;

  /** 정책 ID (youth_policies.id) */
  policy_id: number;

  /** 문서 인덱스 (required_documents 배열의 인덱스, 0부터 시작) */
  document_index: number;

  /** 문서명 (예: "신분증", "통장 사본") */
  document_name: string;

  /** 완료 여부 (체크박스 상태) */
  is_completed: boolean;

  /** 생성 시간 (ISO 8601 문자열) */
  created_at: string;

  /** 업데이트 시간 (ISO 8601 문자열 또는 null) */
  updated_at: string | null;

  /** 완료 시간 (ISO 8601 문자열 또는 null, is_completed가 false면 null) */
  completed_at: string | null;
}

/**
 * 문서 진행 통계 인터페이스
 *
 * 사용자의 전체 문서 준비 현황 요약
 */
export interface DocumentProgressStats {
  /** 전체 문서 개수 */
  total_documents: number;

  /** 완료된 문서 개수 */
  completed_documents: number;

  /** 완료율 (0.0 ~ 100.0) */
  completion_percentage: number;
}

/**
 * 사용자의 모든 문서 진행 상황 조회
 *
 * 페이지 로드 시 호출하여 저장된 체크박스 상태를 복원
 *
 * @returns {Promise<DocumentProgress[]>} 사용자의 모든 문서 진행 상황 배열
 *
 * @example
 * ```typescript
 * const progress = await getAllDocumentProgress();
 * console.log(`총 ${progress.length}개의 문서 진행 상황`);
 *
 * // 응답 예시:
 * // [
 * //   { id: 1, policy_id: 1, document_index: 0, is_completed: true, ... },
 * //   { id: 2, policy_id: 1, document_index: 1, is_completed: false, ... }
 * // ]
 * ```
 *
 * @see PlanScreen.tsx의 loadDocumentProgress() 함수에서 사용
 */
export async function getAllDocumentProgress(): Promise<DocumentProgress[]> {
  const response = await apiClient.get<DocumentProgress[]>('/document-progress/');
  return response.data;
}

/**
 * 특정 정책의 문서 진행 상황 조회
 *
 * 특정 정책의 문서만 필터링하여 조회 (향후 사용)
 *
 * @param {number} policyId - 정책 ID (youth_policies.id)
 * @returns {Promise<DocumentProgress[]>} 해당 정책의 문서 진행 상황 배열
 *
 * @example
 * ```typescript
 * const policyProgress = await getPolicyDocumentProgress(1);
 * console.log(`정책 1의 문서 ${policyProgress.length}개`);
 * ```
 */
export async function getPolicyDocumentProgress(policyId: number): Promise<DocumentProgress[]> {
  const response = await apiClient.get<DocumentProgress[]>(`/document-progress/policy/${policyId}`);
  return response.data;
}

/**
 * 문서 완료 상태 토글 (체크박스 클릭)
 *
 * PlanScreen의 체크박스 클릭 시 호출
 * - 레코드가 없으면 생성 (is_completed=true)
 * - 레코드가 있으면 is_completed 토글 (true ↔ false)
 *
 * @param {number} policyId - 정책 ID
 * @param {number} documentIndex - 문서 인덱스 (0부터 시작)
 * @param {string} documentName - 문서명 (예: "신분증")
 * @returns {Promise<DocumentProgress>} 업데이트된 문서 진행 상황
 *
 * @example
 * ```typescript
 * // 사용자가 "신분증" 체크박스 클릭
 * const updated = await toggleDocumentCompletion(1, 0, "신분증");
 * console.log(`완료 상태: ${updated.is_completed}`);
 *
 * // 첫 클릭: is_completed = true (새 레코드 생성)
 * // 두 번째 클릭: is_completed = false (토글)
 * // 세 번째 클릭: is_completed = true (토글)
 * ```
 *
 * @see PlanScreen.tsx의 handleCheckboxToggle() 함수에서 사용
 *
 * @throws {Error} API 호출 실패 시 에러 발생 (PlanScreen에서 catch하여 UI 롤백)
 */
export async function toggleDocumentCompletion(
  policyId: number,
  documentIndex: number,
  documentName: string
): Promise<DocumentProgress> {
  const response = await apiClient.post<DocumentProgress>('/document-progress/toggle', {
    policy_id: policyId,
    document_index: documentIndex,
    document_name: documentName
  });
  return response.data;
}

/**
 * 문서 진행 통계 조회
 *
 * 사용자의 전체 문서 준비 현황 요약 (향후 대시보드에서 사용)
 *
 * @returns {Promise<DocumentProgressStats>} 문서 진행 통계
 *
 * @example
 * ```typescript
 * const stats = await getDocumentProgressStats();
 * console.log(`진행률: ${stats.completion_percentage}%`);
 * console.log(`완료: ${stats.completed_documents} / ${stats.total_documents}`);
 *
 * // 응답 예시:
 * // {
 * //   total_documents: 10,
 * //   completed_documents: 7,
 * //   completion_percentage: 70.0
 * // }
 * ```
 */
export async function getDocumentProgressStats(): Promise<DocumentProgressStats> {
  const response = await apiClient.get<DocumentProgressStats>('/document-progress/stats');
  return response.data;
}
