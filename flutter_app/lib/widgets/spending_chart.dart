import 'package:flutter/material.dart';
import '../constants/colors.dart';
import '../constants/text_styles.dart';

class SpendingChart extends StatelessWidget {
  const SpendingChart({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 헤더
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '이번 달 소비',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.gray2,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '1,234,000원',
                    style: AppTextStyles.heading1.copyWith(
                      fontSize: 28,
                    ),
                  ),
                ],
              ),
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppColors.black,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.arrow_forward,
                  color: AppColors.white,
                  size: 18,
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // 카테고리별 소비
          _buildSpendingItem(
            icon: '🍔',
            category: '식비',
            amount: '423,000원',
            percentage: 0.35,
            color: AppColors.primary,
          ),

          const SizedBox(height: 16),

          _buildSpendingItem(
            icon: '🚕',
            category: '교통',
            amount: '234,000원',
            percentage: 0.19,
            color: AppColors.primaryLight,
          ),

          const SizedBox(height: 16),

          _buildSpendingItem(
            icon: '🎮',
            category: '문화생활',
            amount: '189,000원',
            percentage: 0.15,
            color: const Color(0xFF90A4AE),
          ),

          const SizedBox(height: 16),

          _buildSpendingItem(
            icon: '🛍️',
            category: '쇼핑',
            amount: '156,000원',
            percentage: 0.13,
            color: const Color(0xFFB0BEC5),
          ),

          const SizedBox(height: 16),

          _buildSpendingItem(
            icon: '📚',
            category: '교육',
            amount: '232,000원',
            percentage: 0.18,
            color: const Color(0xFFCFD8DC),
          ),
        ],
      ),
    );
  }

  Widget _buildSpendingItem({
    required String icon,
    required String category,
    required String amount,
    required double percentage,
    required Color color,
  }) {
    return Column(
      children: [
        Row(
          children: [
            // 아이콘
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: Text(
                  icon,
                  style: const TextStyle(fontSize: 18),
                ),
              ),
            ),

            const SizedBox(width: 12),

            // 카테고리명
            Expanded(
              child: Text(
                category,
                style: AppTextStyles.bodyMedium,
              ),
            ),

            // 금액
            Text(
              amount,
              style: AppTextStyles.bodyMedium.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),

        const SizedBox(height: 8),

        // 프로그레스 바
        Stack(
          children: [
            Container(
              width: double.infinity,
              height: 8,
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            FractionallySizedBox(
              widthFactor: percentage,
              child: Container(
                height: 8,
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}