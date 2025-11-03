import 'package:flutter/material.dart';
import '../constants/colors.dart';

class BottomNavigation extends StatefulWidget {
  const BottomNavigation({super.key});

  @override
  State<BottomNavigation> createState() => _BottomNavigationState();
}

class _BottomNavigationState extends State<BottomNavigation> {
  int _selectedIndex = 0; // 현재 선택된 인덱스 (첫 번째가 활성화)

  // 네비게이션 아이템 데이터
  final List<IconData> _icons = [
    Icons.home,
    Icons.wallet,
    Icons.pie_chart,
    Icons.notifications,
    Icons.person,
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    // TODO: 각 탭에 따른 네비게이션 로직 추가
  }

  /// 개별 네비게이션 버튼 생성
  Widget _buildNavButton(int index) {
    final bool isSelected = index == _selectedIndex;

    return GestureDetector(
      onTap: () => _onItemTapped(index),
      child: Container(
        width: 52,
        height: 52,
        child: Stack(
          children: [
            // 버튼 배경
            Positioned(
              left: 0,
              top: 0,
              child: Container(
                width: 52,
                height: 52,
                decoration: ShapeDecoration(
                  gradient: isSelected
                    ? const LinearGradient(
                        begin: Alignment(0.05, 0.43),
                        end: Alignment(1.19, 0.62),
                        colors: [
                          Color(0xFF001E6E),
                          Color(0xFF3060F1),
                          Color(0xFFE9E9E9)
                        ],
                      )
                    : null,
                  color: isSelected ? null : Colors.transparent,
                  shape: OvalBorder(
                    side: isSelected
                      ? BorderSide.none
                      : const BorderSide(
                          width: 1,
                          color: Color(0xFFA0A0A0),
                        ),
                  ),
                ),
              ),
            ),
            // 아이콘
            Positioned(
              left: 14,
              top: 14,
              child: Container(
                width: 24,
                height: 24,
                child: Icon(
                  _icons[index],
                  size: 24,
                  color: isSelected
                    ? Colors.white
                    : const Color(0xFFA0A0A0),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 300,
      height: 60,
      decoration: ShapeDecoration(
        color: Colors.black.withValues(alpha: 0.40),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(100),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          for (int i = 0; i < _icons.length; i++) ...[
            _buildNavButton(i),
            if (i < _icons.length - 1) const SizedBox(width: 8),
          ],
        ],
      ),
    );
  }
}