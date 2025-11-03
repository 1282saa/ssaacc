import 'package:flutter/material.dart';
import '../constants/colors.dart';
import '../constants/text_styles.dart';

class SavingsDetailScreen extends StatelessWidget {
  const SavingsDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              // 상단 헤더
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back, color: AppColors.black),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const Text(
                    '저축 현황 상세',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: AppColors.black,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // 메인 카드
              Container(
                width: double.infinity,
                height: 311,
                decoration: BoxDecoration(
                  color: const Color(0xFFA9BFF3),
                  borderRadius: BorderRadius.circular(32),
                ),
                child: Stack(
                  children: [
                    // 우측 상단 아이콘 버튼
                    Positioned(
                      right: 16,
                      top: 16,
                      child: Container(
                        width: 32,
                        height: 32,
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.more_horiz,
                          color: AppColors.black,
                          size: 20,
                        ),
                      ),
                    ),

                    // 상단 텍스트
                    Positioned(
                      left: 20,
                      top: 20,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '좋아요 은별님!',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              height: 1.3,
                            ),
                          ),
                          Text(
                            '이번 달 목표치의 72% 달성했어요',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              height: 1.3,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                '이번 달 저축 금액은 ',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              Text(
                                '870,000원',
                                style: TextStyle(
                                  color: const Color(0xFF3060F1),
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                '이에요',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    // 차트 영역
                    Positioned(
                      bottom: 40,
                      left: 37,
                      right: 37,
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          // 첫 번째 막대 - 내 집 마련 적금
                          _buildChartBar(
                            percentage: '24%',
                            amount: '12,340,000원',
                            label: '내 집 마련 적금',
                            height: 40,
                            color: const Color(0xFFFFFFFF).withOpacity(0.8),
                            percentageColor: Colors.white,
                          ),

                          // 두 번째 막대 - 비상금
                          _buildChartBar(
                            percentage: '63%',
                            amount: '630,000원',
                            label: '비상금',
                            height: 60,
                            color: const Color(0xFFFFFFFF).withOpacity(0.8),
                            percentageColor: Colors.white,
                          ),

                          // 세 번째 막대 - 여름 여행 적금
                          _buildChartBar(
                            percentage: '100%',
                            amount: '2,000,000원',
                            label: '여름 여행 적금',
                            height: 98,
                            color: const Color(0xFF3060F1),
                            percentageColor: const Color(0xFF3060F1),
                            isHighlighted: true,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChartBar({
    required String percentage,
    required String amount,
    required String label,
    required double height,
    required Color color,
    required Color percentageColor,
    bool isHighlighted = false,
  }) {
    return Column(
      children: [
        // 퍼센트 텍스트
        Text(
          percentage,
          style: TextStyle(
            color: isHighlighted ? const Color(0xFF3060F1) : Colors.white,
            fontSize: 10,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 6),

        // 막대 차트
        Container(
          width: 60,
          height: height,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        const SizedBox(height: 32),

        // 금액
        Text(
          amount,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 4),

        // 라벨
        Text(
          label,
          style: TextStyle(
            color: Colors.white,
            fontSize: label.length > 6 ? 10 : 11,
            fontWeight: FontWeight.w400,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}