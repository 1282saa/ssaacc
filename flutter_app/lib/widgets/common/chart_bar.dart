import 'package:flutter/material.dart';
import '../../constants/dimensions.dart';

class ChartBar extends StatelessWidget {
  final String percentage;
  final String amount;
  final String label;
  final double height;
  final Color color;
  final Color percentageColor;
  final bool isHighlighted;
  final double? width;

  const ChartBar({
    super.key,
    required this.percentage,
    required this.amount,
    required this.label,
    required this.height,
    required this.color,
    required this.percentageColor,
    this.isHighlighted = false,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 퍼센트 텍스트
        Text(
          percentage,
          style: TextStyle(
            color: percentageColor,
            fontSize: 10,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 6),

        // 막대 차트
        Container(
          width: width ?? AppDimensions.chartBarWidth,
          height: height,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(AppDimensions.borderRadiusLarge),
          ),
        ),
        const SizedBox(height: AppDimensions.spacingXXLarge),

        // 금액
        Text(
          amount,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppDimensions.spacingXSmall),

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
