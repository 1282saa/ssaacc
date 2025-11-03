import 'package:flutter/material.dart';
import '../../constants/colors.dart';
import '../../constants/dimensions.dart';

class AppCard extends StatelessWidget {
  final Widget child;
  final Color? backgroundColor;
  final double? height;
  final double? width;
  final EdgeInsetsGeometry? padding;
  final double? borderRadius;
  final bool hasShadow;
  final VoidCallback? onTap;

  const AppCard({
    super.key,
    required this.child,
    this.backgroundColor,
    this.height,
    this.width,
    this.padding,
    this.borderRadius,
    this.hasShadow = true,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final widget = Container(
      width: width ?? double.infinity,
      height: height,
      padding: padding ?? const EdgeInsets.all(AppDimensions.paddingXLarge),
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.white,
        borderRadius: BorderRadius.circular(
          borderRadius ?? AppDimensions.borderRadiusXLarge,
        ),
        boxShadow: hasShadow && backgroundColor != AppColors.black
            ? [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: child,
    );

    if (onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: widget,
      );
    }

    return widget;
  }
}
