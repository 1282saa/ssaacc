import 'package:flutter/material.dart';
import '../constants/colors.dart';
import '../constants/text_styles.dart';

class GreetingSection extends StatelessWidget {
  final String userName;

  const GreetingSection({
    super.key,
    required this.userName,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, right: 16, top: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 인사 메시지
          Text(
            '좋은 아침이에요, $userName님',
            style: AppTextStyles.heading1,
          ),

          const SizedBox(height: 8),

          // 서브 메시지
          Text(
            '오늘은 커피값만큼 절약 도전 어떨까요? 🩵',
            style: AppTextStyles.bodyLarge,
          ),
        ],
      ),
    );
  }
}