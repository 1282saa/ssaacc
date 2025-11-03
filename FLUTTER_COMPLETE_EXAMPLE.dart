// 완전한 Flutter 변환 예제
// main.dart

import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Finance App',
      theme: ThemeData(
        primaryColor: Color(0xFF3060F1),
        scaffoldBackgroundColor: Color(0xFFE9E9E9),
      ),
      home: HomeScreen(),
    );
  }
}

// screens/home_screen.dart
class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String selectedSavingsFilter = '전체';
  String selectedSpendingFilter = '오늘';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // 상단 바
              _buildTopBar(),
              
              // 인사말 섹션
              GreetingSection(userName: '은별'),
              
              // 중앙 이미지
              Center(
                child: Image.network(
                  'https://c.animaapp.com/GLqSBWOv/img/--@2x.png',
                  width: 240,
                  height: 240,
                ),
              ),
              
              SizedBox(height: 20),
              
              // Today 카드
              TodayTasksCard(),
              
              SizedBox(height: 20),
              
              // 정책 & 퀴즈 카드
              PolicyCards(),
              
              SizedBox(height: 20),
              
              // 저축 현황
              _buildSectionHeader('나의 저축 현황', '저축 현황 숨기기'),
              
              SizedBox(height: 12),
              
              // 필터 버튼
              _buildFilterButtons(
                ['전체', '내 집 마련 적금', '여름 여행', '비상금'],
                selectedSavingsFilter,
                (value) => setState(() => selectedSavingsFilter = value),
              ),
              
              SizedBox(height: 20),
              
              // 저축 차트
              SavingsStatusCard(),
              
              SizedBox(height: 40),
              
              // 소비 현황
              _buildSectionHeader('나의 소비 현황', '소비 현황 숨기기'),
              
              SizedBox(height: 12),
              
              // 필터 버튼
              _buildFilterButtons(
                ['오늘', '이번 주', '이번 달'],
                selectedSpendingFilter,
                (value) => setState(() => selectedSpendingFilter = value),
              ),
              
              SizedBox(height: 20),
              
              // 소비 카드
              SpendingStatusCard(),
              
              SizedBox(height: 80),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNavBar(),
    );
  }

  Widget _buildTopBar() {
    return Container(
      height: 56,
      padding: EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            '9:41',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          NotificationBadge(count: 3),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, String action) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          Text(
            action,
            style: TextStyle(
              fontSize: 12,
              color: Color(0xFFA0A0A0),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterButtons(
    List<String> options,
    String selected,
    Function(String) onSelect,
  ) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: options.map((option) {
          final isSelected = option == selected;
          return Padding(
            padding: EdgeInsets.only(right: 6),
            child: CustomButton(
              text: option,
              isSelected: isSelected,
              onPressed: () => onSelect(option),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildBottomNavBar() {
    return Container(
      height: 60,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Center(
        child: Image.network(
          'https://c.animaapp.com/GLqSBWOv/img/----------.svg',
          width: 300,
          height: 60,
        ),
      ),
    );
  }
}

// 나머지 위젯들은 위의 매핑 가이드를 참고하여 구현
