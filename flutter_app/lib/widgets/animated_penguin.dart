import 'package:flutter/material.dart';
import 'dart:math' as math;

class AnimatedPenguin extends StatefulWidget {
  const AnimatedPenguin({super.key});

  @override
  State<AnimatedPenguin> createState() => _AnimatedPenguinState();
}

class _AnimatedPenguinState extends State<AnimatedPenguin>
    with TickerProviderStateMixin {
  late AnimationController _floatController;
  late AnimationController _bounceController;
  late AnimationController _scaleController;
  late Animation<double> _floatAnimation;
  late Animation<double> _bounceAnimation;
  late Animation<double> _scaleAnimation;

  bool _isPressed = false;
  int _tapCount = 0;
  List<String> _messages = [
    '안녕! 오늘도 저축 화이팅!',
    '우와! 목표에 가까워지고 있어요!',
    '대단해요! 계속 힘내요!',
    '오늘도 절약 성공!',
    '저축왕이 되는 그날까지!',
  ];
  String _currentMessage = '';

  @override
  void initState() {
    super.initState();

    // 둥둥 떠있는 애니메이션
    _floatController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat(reverse: true);

    _floatAnimation = Tween<double>(
      begin: 0.0,
      end: 10.0,
    ).animate(CurvedAnimation(
      parent: _floatController,
      curve: Curves.easeInOut,
    ));

    // 탭했을 때 튀는 애니메이션
    _bounceController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );

    _bounceAnimation = Tween<double>(
      begin: 0.0,
      end: -30.0,
    ).animate(CurvedAnimation(
      parent: _bounceController,
      curve: Curves.elasticOut,
    ));

    // 크기 변화 애니메이션
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _scaleController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _floatController.dispose();
    _bounceController.dispose();
    _scaleController.dispose();
    super.dispose();
  }

  void _handleTap() {
    setState(() {
      _isPressed = true;
      _tapCount++;
      _currentMessage = _messages[_tapCount % _messages.length];
    });

    // 애니메이션 실행
    _scaleController.forward().then((_) {
      _scaleController.reverse();
    });

    _bounceController.forward().then((_) {
      _bounceController.reverse();
    });

    // 메시지 3초 후 사라지기
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          _currentMessage = '';
          _isPressed = false;
        });
      }
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
            top: -40,
            child: AnimatedOpacity(
              opacity: _isPressed ? 1.0 : 0.0,
              duration: const Duration(milliseconds: 300),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      _currentMessage,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF333333),
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Text(
                      '✨',
                      style: TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
          ),

        // 펭귄 캐릭터
        AnimatedBuilder(
          animation: Listenable.merge([
            _floatAnimation,
            _bounceAnimation,
            _scaleAnimation,
          ]),
          builder: (context, child) {
            return Transform.translate(
              offset: Offset(
                0,
                _floatAnimation.value + _bounceAnimation.value,
              ),
              child: Transform.scale(
                scale: _scaleAnimation.value,
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
                                color: Colors.blue.withOpacity(0.3),
                                blurRadius: 20,
                                spreadRadius: 5,
                              ),
                            ]
                          : [],
                    ),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // 펭귄 이미지
                        Image.asset(
                          'assets/images/pinggu_3d.png',
                          fit: BoxFit.contain,
                          errorBuilder: (context, error, stackTrace) {
                            return const Text(
                              '🐧',
                              style: TextStyle(fontSize: 100),
                            );
                          },
                        ),

                        // 반짝이는 이펙트 (탭했을 때)
                        if (_isPressed)
                          ...List.generate(
                            6,
                            (index) => Positioned(
                              top: 60 + math.sin(index * math.pi / 3) * 60,
                              left: 120 + math.cos(index * math.pi / 3) * 60,
                              child: AnimatedOpacity(
                                opacity: _isPressed ? 1.0 : 0.0,
                                duration: Duration(
                                  milliseconds: 200 + (index * 100),
                                ),
                                child: const Text(
                                  '⭐',
                                  style: TextStyle(fontSize: 20),
                                ),
                              ),
                            ),
                          ),
                      ],
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
            bottom: -30,
            child: AnimatedOpacity(
              opacity: 1.0,
              duration: const Duration(seconds: 1),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.7),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  '👆 펭귄을 눌러보세요!',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}