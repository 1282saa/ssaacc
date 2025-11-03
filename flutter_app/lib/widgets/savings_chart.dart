import 'package:flutter/material.dart';
import '../constants/colors.dart';
import '../constants/text_styles.dart';

class SavingsChart extends StatelessWidget {
  final String selectedFilter;

  const SavingsChart({super.key, required this.selectedFilter});

  @override
  Widget build(BuildContext context) {
    // 선택된 필터가 '전체'가 아닐 때만 내용 표시
    if (selectedFilter == '전체') {
      // 전체 선택 시 빈 컨테이너 반환 또는 전체 통계 표시
      return const SizedBox.shrink();
    }

    return Container(
      width: double.infinity,
      height: 311,
      decoration: BoxDecoration(
        color: AppColors.black,
        borderRadius: BorderRadius.circular(32),
      ),
      child: Stack(
        children: [
          // 우측 상단 원형 화살표 버튼
          Positioned(
            top: 16,
            right: 16,
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.white,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.arrow_forward,
                color: AppColors.black,
                size: 20,
              ),
            ),
          ),

          // 상단 텍스트
          Positioned(
            top: 20,
            left: 24,
            right: 70,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _getTitleByFilter(),
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: AppColors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _getSubtitleByFilter(),
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.white.withOpacity(0.7),
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text(
                      '이번 달 지출 금액은 ',
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.white.withOpacity(0.7),
                      ),
                    ),
                    Text(
                      _getAmountByFilter(),
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: AppColors.white,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      ' 이예요',
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.white.withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // 하단 차트 영역
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  // 퍼센티지 표시
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        _getPercentageByFilter(),
                        style: const TextStyle(
                          fontSize: 14,
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        '100%',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.white.withOpacity(0.5),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // 프로그레스 바
                  Stack(
                    children: [
                      Container(
                        height: 12,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ),
                      FractionallySizedBox(
                        widthFactor: _getProgressByFilter(),
                        child: Container(
                          height: 12,
                          decoration: BoxDecoration(
                            color: AppColors.primaryLight,
                            borderRadius: BorderRadius.circular(6),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // 하단 금액 정보
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildAmountInfo('내 집 마련 적금', '12,340,000원', 0.24),
                      _buildAmountInfo('비상금', '630,000원', 0.18),
                      _buildAmountInfo('여름 여행 적금', '2,000,000원', 1.0),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getTitleByFilter() {
    switch (selectedFilter) {
      case '내 집 마련 적금':
        return '좋아요 은별님!';
      case '여름 여행':
        return '여름 여행 준비 순조로워요!';
      default:
        return '좋아요 은별님!';
    }
  }

  String _getSubtitleByFilter() {
    switch (selectedFilter) {
      case '내 집 마련 적금':
        return '이번 달 목표치의 72% 달성했어요';
      case '여름 여행':
        return '목표 금액까지 80% 모았어요';
      default:
        return '이번 달 목표치의 72% 달성했어요';
    }
  }

  String _getAmountByFilter() {
    switch (selectedFilter) {
      case '내 집 마련 적금':
        return '870,000원';
      case '여름 여행':
        return '200,000원';
      default:
        return '870,000원';
    }
  }

  String _getPercentageByFilter() {
    switch (selectedFilter) {
      case '내 집 마련 적금':
        return '72%';
      case '여름 여행':
        return '80%';
      default:
        return '72%';
    }
  }

  double _getProgressByFilter() {
    switch (selectedFilter) {
      case '내 집 마련 적금':
        return 0.72;
      case '여름 여행':
        return 0.80;
      default:
        return 0.72;
    }
  }

  Widget _buildAmountInfo(String label, String amount, double progress) {
    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              width: 80,
              height: 80,
              child: CircularProgressIndicator(
                value: progress,
                strokeWidth: 6,
                backgroundColor: Colors.white.withOpacity(0.2),
                valueColor: AlwaysStoppedAnimation<Color>(
                  progress == 1.0 ? AppColors.primary : Colors.white.withOpacity(0.5),
                ),
              ),
            ),
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          amount,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: TextStyle(
            fontSize: 10,
            color: Colors.white.withOpacity(0.6),
          ),
        ),
      ],
    );
  }
}