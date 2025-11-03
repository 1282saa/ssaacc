import 'package:flutter/material.dart';
import 'dart:math' as math;

class RealPenguinAnimation extends StatefulWidget {
  const RealPenguinAnimation({super.key});

  @override
  State<RealPenguinAnimation> createState() => _RealPenguinAnimationState();
}

class _RealPenguinAnimationState extends State<RealPenguinAnimation>
    with TickerProviderStateMixin {

  // 애니메이션 컨트롤러들
  late AnimationController _breathingController;
  late AnimationController _walkController;
  late AnimationController _waveController;
  late AnimationController _bounceController;
  late AnimationController _rotateController;

  // 애니메이션들
  late Animation<double> _breathingAnimation;
  late Animation<double> _walkAnimation;
  late Animation<double> _waveAnimation;
  late Animation<double> _bounceAnimation;
  late Animation<double> _rotateAnimation;

  // 상태 관리
  bool _isPressed = false;
  bool _isWalking = false;
  bool _isWaving = false;
  int _tapCount = 0;

  List<String> _messages = [
    '안녕하세요! 저축 펭귄이에요! 🐧',
    '오늘도 돈 모으기 화이팅! 💪',
    '목표까지 거의 다 왔어요! ✨',
    '절약의 달인이 되어봐요! 💰',
    '펭귄과 함께 걸어볼까요? 🚶‍♀️',
    '따뜻한 차 한 잔 어때요? ☕',
    '저축왕 되는 그날까지! 👑',
    '뒤뚱뒤뚱 걸어가요~ 🎵',
  ];
  String _currentMessage = '';

  @override
  void initState() {
    super.initState();

    // 숨쉬기 애니메이션 (항상 실행)
    _breathingController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat(reverse: true);

    _breathingAnimation = Tween<double>(
      begin: 0.98,
      end: 1.02,
    ).animate(CurvedAnimation(
      parent: _breathingController,
      curve: Curves.easeInOut,
    ));

    // 걷기 애니메이션
    _walkController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _walkAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _walkController,
      curve: Curves.easeInOut,
    ));

    // 손 흔들기 애니메이션
    _waveController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _waveAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _waveController,
      curve: Curves.elasticOut,
    ));

    // 튀기 애니메이션
    _bounceController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _bounceAnimation = Tween<double>(
      begin: 0.0,
      end: -25.0,
    ).animate(CurvedAnimation(
      parent: _bounceController,
      curve: Curves.elasticOut,
    ));

    // 회전 애니메이션
    _rotateController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );

    _rotateAnimation = Tween<double>(
      begin: 0.0,
      end: 0.1,
    ).animate(CurvedAnimation(
      parent: _rotateController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _breathingController.dispose();
    _walkController.dispose();
    _waveController.dispose();
    _bounceController.dispose();
    _rotateController.dispose();
    super.dispose();
  }

  void _handleTap() {
    setState(() {
      _isPressed = true;
      _tapCount++;
      _currentMessage = _messages[_tapCount % _messages.length];
    });

    // 랜덤하게 다른 애니메이션 실행
    final random = math.Random().nextInt(3);

    switch (random) {
      case 0:
        _startWalkAnimation();
        break;
      case 1:
        _startWaveAnimation();
        break;
      case 2:
        _startBounceAnimation();
        break;
    }

    // 메시지 4초 후 사라지기
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) {
        setState(() {
          _currentMessage = '';
          _isPressed = false;
          _isWalking = false;
          _isWaving = false;
        });
      }
    });
  }

  void _startWalkAnimation() {
    setState(() => _isWalking = true);
    _walkController.forward().then((_) {
      _walkController.reverse().then((_) {
        _walkController.reset();
      });
    });
  }

  void _startWaveAnimation() {
    setState(() => _isWaving = true);
    _waveController.forward().then((_) {
      _waveController.reverse().then((_) {
        _waveController.reset();
      });
    });
  }

  void _startBounceAnimation() {
    _bounceController.forward().then((_) {
      _bounceController.reverse();
    });

    _rotateController.forward().then((_) {
      _rotateController.reverse();
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
            top: -70,
            child: AnimatedOpacity(
              opacity: _isPressed ? 1.0 : 0.0,
              duration: const Duration(milliseconds: 300),
              child: Container(
                constraints: const BoxConstraints(maxWidth: 220),
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(25),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF3060F1).withOpacity(0.2),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                      spreadRadius: 2,
                    ),
                  ],
                  border: Border.all(
                    color: const Color(0xFF3060F1).withOpacity(0.3),
                    width: 2,
                  ),
                ),
                child: Text(
                  _currentMessage,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF2D3748),
                    height: 1.4,
                  ),
                ),
              ),
            ),
          ),

        // 말풍선 꼬리
        if (_currentMessage.isNotEmpty)
          Positioned(
            top: -30,
            child: AnimatedOpacity(
              opacity: _isPressed ? 1.0 : 0.0,
              duration: const Duration(milliseconds: 300),
              child: CustomPaint(
                size: const Size(25, 20),
                painter: EnhancedSpeechBubblePainter(),
              ),
            ),
          ),

        // 펭귄 메인 애니메이션
        AnimatedBuilder(
          animation: Listenable.merge([
            _breathingAnimation,
            _walkAnimation,
            _waveAnimation,
            _bounceAnimation,
            _rotateAnimation,
          ]),
          builder: (context, child) {
            // 걷기 애니메이션을 위한 좌우 이동
            double walkOffsetX = 0.0;
            if (_isWalking) {
              walkOffsetX = math.sin(_walkAnimation.value * math.pi * 4) * 15;
            }

            // 손 흔들기를 위한 회전
            double waveRotation = 0.0;
            if (_isWaving) {
              waveRotation = math.sin(_waveAnimation.value * math.pi * 6) * 0.2;
            }

            return Transform.translate(
              offset: Offset(
                walkOffsetX,
                _bounceAnimation.value,
              ),
              child: Transform.rotate(
                angle: waveRotation + _rotateAnimation.value,
                child: Transform.scale(
                  scale: _breathingAnimation.value,
                  child: GestureDetector(
                    onTap: _handleTap,
                    child: Container(
                      width: 250,
                      height: 250,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(125),
                        boxShadow: [
                          if (_isPressed)
                            BoxShadow(
                              color: const Color(0xFF3060F1).withOpacity(0.4),
                              blurRadius: 35,
                              spreadRadius: 15,
                            ),
                          BoxShadow(
                            color: Colors.black.withOpacity(0.15),
                            blurRadius: 25,
                            offset: const Offset(0, 15),
                          ),
                        ],
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // 메인 펭귄 이미지
                          ClipRRect(
                            borderRadius: BorderRadius.circular(125),
                            child: Image.asset(
                              'assets/images/pinggu_3d.png',
                              width: 220,
                              height: 220,
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  width: 220,
                                  height: 220,
                                  alignment: Alignment.center,
                                  decoration: BoxDecoration(
                                    color: Colors.blue.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(110),
                                  ),
                                  child: const Text(
                                    '🐧',
                                    style: TextStyle(fontSize: 100),
                                  ),
                                );
                              },
                            ),
                          ),

                          // 하트 이펙트 (탭했을 때)
                          if (_isPressed)
                            ...List.generate(
                              6,
                              (index) => Positioned(
                                top: 60 + math.sin(index * math.pi / 3) * 80,
                                left: 125 + math.cos(index * math.pi / 3) * 80,
                                child: AnimatedOpacity(
                                  opacity: _isPressed ? 1.0 : 0.0,
                                  duration: Duration(
                                    milliseconds: 400 + (index * 150),
                                  ),
                                  child: Transform.scale(
                                    scale: 1.0 + (index * 0.2),
                                    child: Transform.rotate(
                                      angle: index * math.pi / 6,
                                      child: const Text(
                                        '💙',
                                        style: TextStyle(fontSize: 28),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),

                          // 걷기 상태 표시
                          if (_isWalking)
                            Positioned(
                              bottom: 10,
                              child: AnimatedOpacity(
                                opacity: _isWalking ? 1.0 : 0.0,
                                duration: const Duration(milliseconds: 200),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF3060F1).withOpacity(0.9),
                                    borderRadius: BorderRadius.circular(15),
                                  ),
                                  child: const Text(
                                    '🚶‍♀️ 뒤뚱뒤뚱',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),
                            ),

                          // 손 흔들기 상태 표시
                          if (_isWaving)
                            Positioned(
                              bottom: 10,
                              child: AnimatedOpacity(
                                opacity: _isWaving ? 1.0 : 0.0,
                                duration: const Duration(milliseconds: 200),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.orange.withOpacity(0.9),
                                    borderRadius: BorderRadius.circular(15),
                                  ),
                                  child: const Text(
                                    '👋 안녕!',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            );
          },
        ),

        // 탭 유도 텍스트 (처음에만)
        if (_tapCount == 0)
          Positioned(
            bottom: -50,
            child: AnimatedOpacity(
              opacity: 1.0,
              duration: const Duration(seconds: 2),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF3060F1),
                      const Color(0xFF5B73F5),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(25),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF3060F1).withOpacity(0.3),
                      blurRadius: 15,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      '👆',
                      style: TextStyle(fontSize: 18),
                    ),
                    SizedBox(width: 10),
                    Text(
                      '귀여운 펭귄을 눌러보세요!',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
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
}

// 향상된 말풍선 꼬리 디자인
class EnhancedSpeechBubblePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final borderPaint = Paint()
      ..color = const Color(0xFF3060F1).withOpacity(0.3)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    final path = Path()
      ..moveTo(size.width / 2, size.height)
      ..lineTo(size.width / 2 - 12, 0)
      ..lineTo(size.width / 2 + 12, 0)
      ..close();

    // 그림자 효과
    canvas.drawShadow(path, Colors.black.withOpacity(0.2), 8, false);

    // 메인 모양
    canvas.drawPath(path, paint);
    canvas.drawPath(path, borderPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}