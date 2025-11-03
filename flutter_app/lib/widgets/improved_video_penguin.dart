import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'dart:async';

/// 개선된 애니메이션 펭귄 위젯
/// 성능 최적화, 코드 정리, 그리고 더 나은 구조로 개선
class ImprovedVideoPenguin extends StatefulWidget {
  const ImprovedVideoPenguin({super.key});

  @override
  State<ImprovedVideoPenguin> createState() => _ImprovedVideoPenguinState();
}

class _ImprovedVideoPenguinState extends State<ImprovedVideoPenguin>
    with TickerProviderStateMixin {

  // 🎯 애니메이션 설정 상수들 - 쉽게 조정 가능
  static const Duration _floatDuration = Duration(seconds: 3);
  static const Duration _wobbleDuration = Duration(seconds: 5);
  static const Duration _breatheDuration = Duration(seconds: 4);
  static const Duration _tapDuration = Duration(milliseconds: 200);
  static const Duration _glowDuration = Duration(seconds: 2);

  static const double _penguinSize = 280.0;
  static const double _imageSize = 220.0;
  static const Color _glowColor = Color(0xFF87CEEB);

  // 🎮 애니메이션 컨트롤러들
  late final AnimationController _mainController;
  late final AnimationController _tapController;

  // 🎨 애니메이션들
  late final Animation<double> _floatAnimation;
  late final Animation<double> _wobbleAnimation;
  late final Animation<double> _breatheAnimation;
  late final Animation<double> _glowAnimation;
  late final Animation<double> _tapScaleAnimation;

  // 📱 상태 관리
  bool _isPressed = false;
  Timer? _pressedTimer;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
  }

  /// 🏗️ 애니메이션 초기화를 별도 메서드로 분리
  void _initializeAnimations() {
    // 메인 애니메이션 컨트롤러 (연속 애니메이션용)
    _mainController = AnimationController(
      duration: const Duration(seconds: 12), // 모든 애니메이션의 LCM
      vsync: this,
    )..repeat();

    // 탭 애니메이션 컨트롤러 (개별 제어용)
    _tapController = AnimationController(
      duration: _tapDuration,
      vsync: this,
    );

    // 🌊 부유 애니메이션 (3초 주기)
    _floatAnimation = Tween<double>(
      begin: -8.0,
      end: 8.0,
    ).animate(CurvedAnimation(
      parent: _mainController,
      curve: const Interval(0.0, 0.25, curve: Curves.easeInOut),
    ));

    // 🔄 흔들기 애니메이션 (5초 주기)
    _wobbleAnimation = Tween<double>(
      begin: -0.03,
      end: 0.03,
    ).animate(CurvedAnimation(
      parent: _mainController,
      curve: const Interval(0.0, 0.42, curve: Curves.easeInOut),
    ));

    // 💨 숨쉬기 애니메이션 (4초 주기)
    _breatheAnimation = Tween<double>(
      begin: 0.98,
      end: 1.02,
    ).animate(CurvedAnimation(
      parent: _mainController,
      curve: const Interval(0.0, 0.33, curve: Curves.easeInOut),
    ));

    // ✨ 글로우 애니메이션 (2초 주기)
    _glowAnimation = Tween<double>(
      begin: 0.3,
      end: 0.8,
    ).animate(CurvedAnimation(
      parent: _mainController,
      curve: const Interval(0.0, 0.17, curve: Curves.easeInOut),
    ));

    // 👆 탭 스케일 애니메이션
    _tapScaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(
      parent: _tapController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _pressedTimer?.cancel();
    _mainController.dispose();
    _tapController.dispose();
    super.dispose();
  }

  /// 🎯 탭 처리 로직 개선
  void _handleTap() {
    if (!mounted) return;

    // 이전 타이머 취소
    _pressedTimer?.cancel();

    setState(() {
      _isPressed = true;
    });

    // 애니메이션 실행
    _tapController.forward().then((_) {
      if (mounted) {
        _tapController.reverse();
      }
    });

    // 안전한 상태 해제
    _pressedTimer = Timer(const Duration(seconds: 1), () {
      if (mounted) {
        setState(() {
          _isPressed = false;
        });
      }
    });
  }

  /// 🎨 그림자 효과 생성
  List<BoxShadow> _buildShadows() {
    return [
      BoxShadow(
        color: _isPressed
            ? _glowColor.withOpacity(_glowAnimation.value)
            : const Color(0x1A000000),
        blurRadius: _isPressed ? 30 : 20,
        offset: Offset(0, _isPressed ? 5 : 10),
        spreadRadius: _isPressed ? 5 : 0,
      ),
    ];
  }

  /// 🖼️ 펭귄 이미지 위젯 생성
  Widget _buildPenguinImage() {
    return Image.asset(
      'assets/images/cute_winter_penguin.png',
      width: _imageSize,
      height: _imageSize,
      fit: BoxFit.contain,
      errorBuilder: (context, error, stackTrace) {
        return Image.asset(
          'assets/images/pinggu_3d.png',
          width: _imageSize,
          height: _imageSize,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) {
            return const Center(
              child: Text(
                '🐧',
                style: TextStyle(fontSize: 120),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      // 🚀 최적화: 필요한 애니메이션만 감시
      animation: Listenable.merge([
        _mainController,
        _tapController,
      ]),
      builder: (context, child) {
        // 🎭 복합 변환 적용
        return Transform.translate(
          offset: Offset(0, _floatAnimation.value),
          child: Transform.rotate(
            angle: _wobbleAnimation.value,
            child: Transform.scale(
              scale: _tapScaleAnimation.value * _breatheAnimation.value,
              child: GestureDetector(
                onTap: _handleTap,
                child: Container(
                  width: _penguinSize,
                  height: _penguinSize,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.transparent,
                    boxShadow: _buildShadows(),
                  ),
                  child: ClipOval(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                        border: _isPressed
                            ? Border.all(
                                color: _glowColor.withOpacity(0.6),
                                width: 3,
                              )
                            : null,
                      ),
                      child: Center(
                        child: _buildPenguinImage(),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}