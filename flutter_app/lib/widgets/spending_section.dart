import 'package:flutter/material.dart';
import '../constants/colors.dart';
import '../constants/text_styles.dart';
import './filter_chips.dart';

class SpendingSection extends StatefulWidget {
  const SpendingSection({super.key});

  @override
  State<SpendingSection> createState() => _SpendingSectionState();
}

class _SpendingSectionState extends State<SpendingSection> {
  String selectedFilter = '오늘';
  bool isContentVisible = true;  // 콘텐츠 표시 여부

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 섹션 제목
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '나의 소비 현황',
                style: AppTextStyles.heading2.copyWith(
                  color: AppColors.black,
                ),
              ),
              GestureDetector(
                onTap: () {
                  setState(() {
                    isContentVisible = !isContentVisible;
                  });
                },
                child: Text(
                  isContentVisible ? '소비 현황 숨기기' : '소비 현황 보기',
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.gray2,
                  ),
                ),
              ),
            ],
          ),
        ),

        // 콘텐츠가 보이는 경우에만 표시
        if (isContentVisible) ...[
          const SizedBox(height: 16),

          // 필터 칩들
          FilterChips(
            options: const ['오늘', '이번 주', '이번 달'],
            selectedOption: selectedFilter,
            onSelected: (option) {
              setState(() {
                selectedFilter = option;
              });
            },
          ),

          const SizedBox(height: 20),

          // 소비 현황 카드
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Container(
            width: double.infinity,
            height: 138,
            decoration: BoxDecoration(
              color: AppColors.white,  // 항상 흰색 배경
              borderRadius: BorderRadius.circular(32),
              boxShadow: [
                BoxShadow(
                  color: const Color.fromARGB(255, 255, 255, 255)
                      .withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Stack(
              children: [
                // 좌측 텍스트 정보
                Positioned(
                  left: 20,
                  top: 20,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 오늘 소비량
                      Row(
                        children: [
                          Text(
                            '오늘 소비량',
                            style: TextStyle(
                              color: AppColors.black,  // 항상 검은색 텍스트
                              fontSize: 14,
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                          Container(
                            margin: const EdgeInsets.symmetric(horizontal: 16),
                            width: 1,
                            height: 12,
                            color: const Color(0xFFE9E9E9),
                          ),
                          Text(
                            '33,000원',
                            style: TextStyle(
                              color: AppColors.primary,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 7),
                      // 가장 많이 쓴 항목
                      Row(
                        children: [
                          Text(
                            '가장 많이 쓴 항목',
                            style: TextStyle(
                              color: AppColors.black,  // 항상 검은색 텍스트
                              fontSize: 14,
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                          Container(
                            margin: const EdgeInsets.symmetric(horizontal: 16),
                            width: 1,
                            height: 12,
                            color: const Color(0xFFE9E9E9),
                          ),
                          Text(
                            '식비  🍱',
                            style: TextStyle(
                              color: AppColors.primary,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // 우측 핑구 이미지 - 새로운 3D 펭귄 이미지
                Positioned(
                  right: 11,
                  bottom: 0,
                  child: Image.asset(
                    'assets/images/ping.png',  // ping.png으로 변경
                    width: 104,
                    height: 104,
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) {
                      // 이미지 로드 실패시 이모지 펭귄 표시
                      return Container(
                        width: 104,
                        height: 104,
                        decoration: BoxDecoration(
                          color: Colors.transparent,
                        ),
                        child: Center(
                          child: Text(
                            '🐧',
                            style: TextStyle(fontSize: 60),
                          ),
                        ),
                      );
                    },
                  ),
                ),

                // 지출 내역 보기 버튼
                Positioned(
                  left: 20,
                  bottom: 20,
                  child: GestureDetector(
                    onTap: () {
                      // 지출 내역 보기 액션
                    },
                    child: Row(
                      children: [
                        Text(
                          '지출 내역 보기',
                          style: TextStyle(
                            color: AppColors.black,  // 항상 검은색 텍스트
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Icon(
                          Icons.arrow_forward,
                          size: 20,
                          color: AppColors.black,  // 항상 검은색 아이콘
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        ],
      ],
    );
  }
}
