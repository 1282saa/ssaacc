import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'dart:math' as math;

class LottiePenguin extends StatefulWidget {
  const LottiePenguin({super.key});

  @override
  State<LottiePenguin> createState() => _LottiePenguinState();
}

class _LottiePenguinState extends State<LottiePenguin>
    with TickerProviderStateMixin {

  // Lottie 애니메이션 컨트롤러들
  late AnimationController _idleController;
  late AnimationController _walkController;
  late AnimationController _bounceController;
  late Animation<double> _bounceAnimation;

  // 상태 관리
  bool _isPressed = false;
  bool _isWalking = false;
  int _tapCount = 0;

  List<String> _messages = [
    '안녕! 오늘도 저축 화이팅! 🐧',
    '우와! 목표에 가까워지고 있어요! ✨',
    '대단해요! 계속 힘내요! 💪',
    '오늘도 절약 성공! 🎉',
    '저축왕이 되는 그날까지! 👑',
    '펭귄과 함께 걸어봐요! 🚶‍♀️',
    '금융 관리의 달인이 되어보자! 💰',
  ];
  String _currentMessage = '';

  @override
  void initState() {
    super.initState();

    // Idle 애니메이션 컨트롤러 (계속 실행)
    _idleController = AnimationController(vsync: this);

    // 걷기 애니메이션 컨트롤러
    _walkController = AnimationController(vsync: this);

    // 튀는 효과 애니메이션
    _bounceController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _bounceAnimation = Tween<double>(
      begin: 0.0,
      end: -20.0,
    ).animate(CurvedAnimation(
      parent: _bounceController,
      curve: Curves.elasticOut,
    ));
  }

  @override
  void dispose() {
    _idleController.dispose();
    _walkController.dispose();
    _bounceController.dispose();
    super.dispose();
  }

  void _handleTap() {
    setState(() {
      _isPressed = true;
      _tapCount++;
      _currentMessage = _messages[_tapCount % _messages.length];
    });

    // 랜덤하게 걷기 또는 idle 애니메이션 선택
    if (math.Random().nextBool()) {
      _startWalkAnimation();
    } else {
      _startIdleAnimation();
    }

    // 튀는 효과
    _bounceController.forward().then((_) {
      _bounceController.reverse();
    });

    // 메시지 3초 후 사라지기
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          _currentMessage = '';
          _isPressed = false;
          _isWalking = false;
        });
      }
    });
  }

  void _startWalkAnimation() {
    setState(() {
      _isWalking = true;
    });
    _walkController.forward().then((_) {
      _walkController.reset();
    });
  }

  void _startIdleAnimation() {
    _idleController.forward().then((_) {
      _idleController.reset();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.center,
      children: [
        // 메시지 말풍선
        if (_currentMessage.isNotEmpty)
          Positioned(
            top: -60,
            child: AnimatedOpacity(
              opacity: _isPressed ? 1.0 : 0.0,
              duration: const Duration(milliseconds: 300),
              child: Container(
                constraints: const BoxConstraints(maxWidth: 200),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.15),
                      blurRadius: 15,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Text(
                  _currentMessage,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF333333),
                    height: 1.3,
                  ),
                ),
              ),
            ),
          ),

        // 말풍선 꼬리
        if (_currentMessage.isNotEmpty)
          Positioned(
            top: -25,
            child: AnimatedOpacity(
              opacity: _isPressed ? 1.0 : 0.0,
              duration: const Duration(milliseconds: 300),
              child: CustomPaint(
                size: const Size(20, 15),
                painter: SpeechBubblePainter(),
              ),
            ),
          ),

        // 펭귄 애니메이션
        AnimatedBuilder(
          animation: _bounceAnimation,
          builder: (context, child) {
            return Transform.translate(
              offset: Offset(0, _bounceAnimation.value),
              child: GestureDetector(
                onTap: _handleTap,
                child: Container(
                  width: 240,
                  height: 240,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(120),
                    boxShadow: _isPressed
                        ? [
                            BoxShadow(
                              color: const Color(0xFF3060F1).withOpacity(0.3),
                              blurRadius: 30,
                              spreadRadius: 10,
                            ),
                          ]
                        : [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            ),
                          ],
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Lottie 애니메이션
                      if (_isWalking)
                        Lottie.asset(
                          'assets/animations/penguin_walk.json',
                          controller: _walkController,
                          fit: BoxFit.contain,
                          width: 200,
                          height: 200,
                          onLoaded: (composition) {
                            _walkController.duration = composition.duration;
                          },
                          errorBuilder: (context, error, stackTrace) {
                            return _buildFallbackPenguin('🚶‍♀️🐧');
                          },
                        )
                      else
                        Lottie.asset(
                          'assets/animations/penguin_idle.json',
                          controller: _idleController,
                          fit: BoxFit.contain,
                          width: 200,
                          height: 200,
                          repeat: true,
                          onLoaded: (composition) {
                            _idleController.duration = composition.duration;
                            _idleController.repeat();
                          },
                          errorBuilder: (context, error, stackTrace) {
                            return _buildFallbackPenguin('🐧');
                          },
                        ),

                      // 반짝이는 이펙트 (탭했을 때)
                      if (_isPressed)
                        ...List.generate(
                          8,
                          (index) => Positioned(
                            top: 80 + math.sin(index * math.pi / 4) * 70,
                            left: 120 + math.cos(index * math.pi / 4) * 70,
                            child: AnimatedOpacity(
                              opacity: _isPressed ? 1.0 : 0.0,
                              duration: Duration(
                                milliseconds: 300 + (index * 100),
                              ),
                              child: Transform.rotate(
                                angle: index * math.pi / 4,
                                child: const Text(
                                  '✨',
                                  style: TextStyle(fontSize: 24),
                                ),
                              ),
                            ),
                          ),
                        ),

                      // 펄스 효과 (항상 실행)
                      Positioned.fill(
                        child: AnimatedContainer(
                          duration: const Duration(seconds: 2),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: const Color(0xFF3060F1).withOpacity(0.2),
                              width: _isPressed ? 3 : 1,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),

        // 탭 유도 텍스트 (처음에만)
        if (_tapCount == 0)
          Positioned(
            bottom: -40,
            child: AnimatedOpacity(
              opacity: 1.0,
              duration: const Duration(seconds: 2),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF3060F1).withOpacity(0.9),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      '👆',
                      style: TextStyle(fontSize: 16),
                    ),
                    SizedBox(width: 8),
                    Text(
                      '펭귄을 눌러보세요!',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildFallbackPenguin(String emoji) {
    return Container(
      width: 200,
      height: 200,
      alignment: Alignment.center,
      child: Text(
        emoji,
        style: const TextStyle(fontSize: 80),
      ),
    );
  }
}

// 말풍선 꼬리를 그리는 CustomPainter
class SpeechBubblePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(size.width / 2, size.height)
      ..lineTo(size.width / 2 - 10, 0)
      ..lineTo(size.width / 2 + 10, 0)
      ..close();

    canvas.drawPath(path, paint);

    // 그림자 효과
    canvas.drawShadow(path, Colors.black.withOpacity(0.1), 5, false);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}