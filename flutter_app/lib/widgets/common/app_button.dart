import 'package:flutter/material.dart';
import '../../constants/colors.dart';
import '../../constants/dimensions.dart';

enum AppButtonType {
  circular,
  rounded,
}

class AppButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final IconData icon;
  final Color? backgroundColor;
  final Color? iconColor;
  final double? size;
  final double? iconSize;
  final AppButtonType type;

  const AppButton({
    super.key,
    required this.onPressed,
    required this.icon,
    this.backgroundColor,
    this.iconColor,
    this.size,
    this.iconSize,
    this.type = AppButtonType.circular,
  });

  const AppButton.circular({
    super.key,
    required this.onPressed,
    required this.icon,
    this.backgroundColor,
    this.iconColor,
    this.size,
    this.iconSize,
  }) : type = AppButtonType.circular;

  const AppButton.rounded({
    super.key,
    required this.onPressed,
    required this.icon,
    this.backgroundColor,
    this.iconColor,
    this.size,
    this.iconSize,
  }) : type = AppButtonType.rounded;

  @override
  Widget build(BuildContext context) {
    final buttonSize = size ?? AppDimensions.buttonHeightMedium;
    final effectiveIconSize = iconSize ?? AppDimensions.iconSizeMedium;

    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: buttonSize,
        height: buttonSize,
        decoration: BoxDecoration(
          color: backgroundColor ?? AppColors.black,
          shape: type == AppButtonType.circular
              ? BoxShape.circle
              : BoxShape.rectangle,
          borderRadius: type == AppButtonType.rounded
              ? BorderRadius.circular(AppDimensions.borderRadiusMedium)
              : null,
        ),
        child: Icon(
          icon,
          color: iconColor ?? AppColors.white,
          size: effectiveIconSize,
        ),
      ),
    );
  }
}
