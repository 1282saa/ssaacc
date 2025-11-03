import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class VideoPenguin extends StatefulWidget {
  const VideoPenguin({super.key});

  @override
  State<VideoPenguin> createState() => _VideoPenguinState();
}

class _VideoPenguinState extends State<VideoPenguin>
    with TickerProviderStateMixin {
  late AnimationController _lottieController;
  late AnimationController _floatController;
  late Animation<double> _floatAnimation;

  String _currentAnimation = 'assets/animations/penguin_hand_wave.json';
  bool _isLoading = false; // 즉시 로딩 완료로 설정

  @override
  void initState() {
    super.initState();
    _setupAnimations();
  }

  void _setupAnimations() {
    // Lottie 애니메이션 컨트롤러 (더 느리게)
    _lottieController = AnimationController(
      duration: const Duration(seconds: 5), // 더 느리게
      vsync: this,
    );

    // 부유 애니메이션 제거 - 성능 향상
    _floatController = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    );

    _floatAnimation = Tween<double>(
      begin: 0.0, // 움직임 없음
      end: 0.0,
    ).animate(_floatController);

    // 애니메이션 시작 (부유 효과 비활성화)
    _lottieController.repeat();
    // _floatController는 시작하지 않음

    // 즉시 로딩 완료 - 지연 제거
  }

  @override
  void dispose() {
    _lottieController.dispose();
    _floatController.dispose();
    super.dispose();
  }

  void _handleTap() {
    // 단순히 애니메이션 재시작만 하고 다른 파일로 변경하지 않음
    _lottieController.reset();
    _lottieController.repeat();
  }

  Widget _buildLottieWidget() {
    try {
      return Lottie.asset(
        _currentAnimation,
        controller: _lottieController,
        width: 350,
        height: 350,
        fit: BoxFit.contain,
        repeat: true,
        reverse: false,
        animate: true,
        frameRate: FrameRate(15), // 15fps로 더 제한
        addRepaintBoundary: false, // 단순화
        filterQuality: FilterQuality.none, // 최저 품질로 성능 최우선
        options: LottieOptions(
          enableMergePaths: false,
        ),
        onLoaded: (composition) {
          if (mounted) {
            _lottieController.duration = composition.duration;
            _lottieController.repeat();
          }
        },
        errorBuilder: (context, error, stackTrace) {
          // 오류 발생 시 대체 위젯 표시
          return const SizedBox(
            width: 350,
            height: 350,
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.pets,
                    size: 80,
                    color: Colors.blue,
                  ),
                  SizedBox(height: 10),
                  Text(
                    '🐧 펭귄',
                    style: TextStyle(
                      fontSize: 24,
                      color: Colors.blue,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      );
    } catch (e) {
      // 예외 발생 시 대체 위젯 반환
      return const SizedBox(
        width: 350,
        height: 350,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.pets,
                size: 80,
                color: Colors.blue,
              ),
              SizedBox(height: 10),
              Text(
                '🐧 펭귄',
                style: TextStyle(
                  fontSize: 24,
                  color: Colors.blue,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _handleTap,
      child: AnimatedBuilder(
        animation: _floatAnimation,
        builder: (context, child) {
          return Transform.translate(
            offset: Offset(0, _floatAnimation.value),
            child: _buildLottieWidget(),
          );
        },
      ),
    );
  }
}

