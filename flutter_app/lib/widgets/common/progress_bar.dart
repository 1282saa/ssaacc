import 'package:flutter/material.dart';
import '../../constants/colors.dart';
import '../../constants/dimensions.dart';

class AppProgressBar extends StatelessWidget {
  final double progress;
  final Color? backgroundColor;
  final Color? progressColor;
  final double? height;
  final double? borderRadius;

  const AppProgressBar({
    super.key,
    required this.progress,
    this.backgroundColor,
    this.progressColor,
    this.height,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveHeight = height ?? AppDimensions.progressBarHeight;
    final effectiveBorderRadius = borderRadius ?? effectiveHeight / 2;

    return Stack(
      children: [
        Container(
          height: effectiveHeight,
          decoration: BoxDecoration(
            color: backgroundColor ?? Colors.white.withOpacity(0.2),
            borderRadius: BorderRadius.circular(effectiveBorderRadius),
          ),
        ),
        FractionallySizedBox(
          widthFactor: progress.clamp(0.0, 1.0),
          child: Container(
            height: effectiveHeight,
            decoration: BoxDecoration(
              color: progressColor ?? AppColors.primaryLight,
              borderRadius: BorderRadius.circular(effectiveBorderRadius),
            ),
          ),
        ),
      ],
    );
  }
}

class CircularProgressWidget extends StatelessWidget {
  final double progress;
  final String label;
  final String amount;
  final double? size;
  final Color? progressColor;
  final Color? backgroundColor;

  const CircularProgressWidget({
    super.key,
    required this.progress,
    required this.label,
    required this.amount,
    this.size,
    this.progressColor,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveSize = size ?? AppDimensions.circularProgressSize;

    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              width: effectiveSize,
              height: effectiveSize,
              child: CircularProgressIndicator(
                value: progress.clamp(0.0, 1.0),
                strokeWidth: 6,
                backgroundColor: backgroundColor ?? Colors.white.withOpacity(0.2),
                valueColor: AlwaysStoppedAnimation<Color>(
                  progress >= 1.0
                      ? (progressColor ?? AppColors.primary)
                      : Colors.white.withOpacity(0.5),
                ),
              ),
            ),
            Container(
              width: effectiveSize * 0.8,
              height: effectiveSize * 0.8,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
        const SizedBox(height: AppDimensions.spacingSmall),
        Text(
          amount,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppDimensions.spacingXSmall / 2),
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
