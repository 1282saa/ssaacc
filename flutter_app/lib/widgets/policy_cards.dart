import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../constants/colors.dart';
import '../constants/text_styles.dart';

class PolicyCards extends StatelessWidget {
  const PolicyCards({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // 청년 월세 지원 정책 카드
        Expanded(
          child: _buildCard(
            title: '청년 월세 지원 정책',
            subtitle: '은별님에게 해당되는\n지원만 가져왔어요',
            backgroundColor: AppColors.black,
            textColor: AppColors.white,
            hasArrow: true,
            backgroundImage: 'assets/images/policy.png',
          ),
        ),

        const SizedBox(width: 12),

        // 오늘의 금융 퀴즈 카드
        Expanded(
          child: _buildCard(
            title: '오늘의 금융 퀴즈',
            subtitle: '예금과 적금의 차이,\n함께 확인해보실래요?',
            backgroundColor: AppColors.white,
            textColor: AppColors.black,
            hasArrow: true,
            backgroundImage: 'assets/images/quiz.png',
          ),
        ),
      ],
    );
  }

  Widget _buildCard({
    required String title,
    required String subtitle,
    required Color backgroundColor,
    required Color textColor,
    required bool hasArrow,
    String? backgroundImage,
  }) {
    return Container(
      height: 152,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(32),
        boxShadow: backgroundColor == AppColors.white
            ? [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(32),
        child: Stack(
          children: [
            // 정책 카드 이미지 - 좌하단 (화살표와 수평 정렬)
            if (backgroundImage != null && backgroundColor == AppColors.black)
              Positioned(
                bottom: -8, // 많이 아래로 이동
                left: 12, // 좌측 위치 유지
                child: Image.asset(
                  backgroundImage,
                  width: 92, // 더 크게
                  height: 92,
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) {
                    return Container();
                  },
                ),
              ),

            // 퀴즈 카드 이미지 - 좌하단 (화살표와 수평 정렬)
            if (backgroundImage != null && backgroundColor == AppColors.white)
              Positioned(
                bottom: 10, // 같은 높이 유지
                left: 20, // 좌측으로 더 이동
                child: Image.asset(
                  backgroundImage,
                  width: 56, // 같은 크기 유지
                  height: 56,
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) {
                    return Container();
                  },
                ),
              ),

            // Content
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // 텍스트 영역
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: textColor,
                          fontWeight: FontWeight.w700,
                          fontSize: 15,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Container(
                        width: backgroundColor == AppColors.black
                            ? 120
                            : 130, // 정책 카드는 좁게, 퀴즈는 넓게
                        child: Text(
                          subtitle,
                          style: AppTextStyles.caption.copyWith(
                            color: textColor.withOpacity(0.6),
                            fontSize: 14, // 12에서 14로 증가
                            height: 1.2, // 줄 간격 줄이기
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),

                  // 화살표 버튼 - 우측 정렬
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      if (hasArrow)
                        Padding(
                          padding: const EdgeInsets.only(right: 5), // 좌측으로 이동
                          child: Container(
                            width: 36, // 더 크게
                            height: 36, // 더 크게
                            decoration: BoxDecoration(
                              color: backgroundColor == AppColors.black
                                  ? AppColors.white
                                  : AppColors.black,
                              shape: BoxShape.circle, // 원형으로 변경
                            ),
                            child: Icon(
                              Icons.arrow_forward,
                              color: backgroundColor == AppColors.black
                                  ? AppColors.black
                                  : AppColors.white,
                              size: 20, // 아이콘도 크게
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
