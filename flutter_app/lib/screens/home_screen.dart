import 'package:flutter/material.dart';
import 'dart:ui';
import '../constants/colors.dart';
import '../widgets/greeting_section.dart';
import '../widgets/today_card.dart';
import '../widgets/policy_cards.dart';
import '../widgets/savings_section.dart';
import '../widgets/spending_section.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/bottom_navigation.dart';
import '../widgets/video_penguin.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // 배경 그라데이션 효과
          Positioned(
            top: -177,
            left: 89,
            child: Container(
              width: 513,
              height: 513,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  transform: const GradientRotation(142 * 3.14159 / 180),
                  colors: [
                    AppColors.backgroundGradientStart,
                    AppColors.backgroundGradientMiddle,
                    AppColors.backgroundGradientEnd,
                  ],
                  stops: const [0.0, 0.49, 1.0],
                ),
              ),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 100, sigmaY: 100),
                child: Container(
                  color: Colors.transparent,
                ),
              ),
            ),
          ),

          // 메인 컨텐츠
          SafeArea(
            bottom: false,
            child: Column(
              children: [
                // 커스텀 앱바
                const CustomAppBar(),

                // 스크롤 가능한 컨텐츠
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // 인사말 섹션
                        const GreetingSection(userName: '은별'),

                        const SizedBox(height: 8),

                        // 중앙 애니메이션 펭귄 - 동영상 펭귄!
                        const Center(
                          child: VideoPenguin(),
                        ),

                        const SizedBox(height: 12),

                        // Today 카드
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 16),
                          child: TodayCard(),
                        ),

                        const SizedBox(height: 16),

                        // 정책 & 퀴즈 카드
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 16),
                          child: PolicyCards(),
                        ),

                        const SizedBox(height: 40),

                        // 저축 현황 섹션
                        const SavingsSection(),

                        const SizedBox(height: 40),

                        // 소비 현황 섹션
                        const SpendingSection(),

                        const SizedBox(height: 100),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // 하단 네비게이션
          const Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: BottomNavigation(),
          ),
        ],
      ),
    );
  }
}