import 'package:flutter/foundation.dart';
import '../models/savings_item.dart';
import '../models/spending_data.dart';
import '../models/task_item.dart';

class FinanceProvider with ChangeNotifier {
  // 저축 항목들
  List<SavingsItem> _savingsItems = [
    const SavingsItem(
      id: 'savings_001',
      name: '내 집 마련 적금',
      currentAmount: 12340000,
      targetAmount: 50000000,
      monthlyAmount: 870000,
      installmentNumber: 10,
    ),
    const SavingsItem(
      id: 'savings_002',
      name: '비상금',
      currentAmount: 630000,
      targetAmount: 1000000,
      monthlyAmount: 100000,
      installmentNumber: 6,
    ),
    const SavingsItem(
      id: 'savings_003',
      name: '여름 여행 적금',
      currentAmount: 2000000,
      targetAmount: 2000000,
      monthlyAmount: 200000,
      installmentNumber: 10,
    ),
  ];

  // 소비 데이터
  SpendingData _todaySpending = const SpendingData(
    period: '오늘',
    totalAmount: 33000,
    topCategory: '식비',
    topCategoryEmoji: '🍱',
  );

  SpendingData _weekSpending = const SpendingData(
    period: '이번 주',
    totalAmount: 150000,
    topCategory: '교통비',
    topCategoryEmoji: '🚗',
  );

  SpendingData _monthSpending = const SpendingData(
    period: '이번 달',
    totalAmount: 650000,
    topCategory: '식비',
    topCategoryEmoji: '🍱',
  );

  // 오늘 할 일 목록
  List<TaskItem> _todayTasks = [
    TaskItem(
      id: 'task_001',
      title: '청약저축 자동이체',
      amount: 50000,
      description: '이번 달 10회차',
      daysRemaining: 2,
      dueDate: DateTime.now().add(const Duration(days: 2)),
    ),
    TaskItem(
      id: 'task_002',
      title: '500원 동전 모으기',
      amount: 3500,
      description: '목표까지 1,500원 남음',
      daysRemaining: 7,
      dueDate: DateTime.now().add(const Duration(days: 7)),
    ),
    TaskItem(
      id: 'task_003',
      title: '여름 휴가비 적금',
      amount: 200000,
      description: '3회차 납입 예정',
      daysRemaining: 14,
      dueDate: DateTime.now().add(const Duration(days: 14)),
    ),
  ];

  // Getters
  List<SavingsItem> get savingsItems => _savingsItems;

  List<TaskItem> get todayTasks => _todayTasks;

  SpendingData getSpendingData(String filter) {
    switch (filter) {
      case '오늘':
        return _todaySpending;
      case '이번 주':
        return _weekSpending;
      case '이번 달':
        return _monthSpending;
      default:
        return _todaySpending;
    }
  }

  // 필터별 저축 항목 가져오기
  SavingsItem? getSavingsItemByName(String name) {
    try {
      return _savingsItems.firstWhere((item) => item.name == name);
    } catch (e) {
      return null;
    }
  }

  // 전체 저축 금액
  double get totalSavingsAmount {
    return _savingsItems.fold(0, (sum, item) => sum + item.currentAmount);
  }

  // 전체 저축 목표 금액
  double get totalTargetAmount {
    return _savingsItems.fold(0, (sum, item) => sum + item.targetAmount);
  }

  // 전체 저축 진행률
  double get totalProgress {
    if (totalTargetAmount == 0) return 0;
    return totalSavingsAmount / totalTargetAmount;
  }

  // 이번 달 저축 금액
  double get thisMonthSavings {
    return _savingsItems.fold(0, (sum, item) => sum + item.monthlyAmount);
  }

  // 저축 항목 추가
  void addSavingsItem(SavingsItem item) {
    _savingsItems.add(item);
    notifyListeners();
  }

  // 저축 항목 업데이트
  void updateSavingsItem(String id, SavingsItem updatedItem) {
    final index = _savingsItems.indexWhere((item) => item.id == id);
    if (index != -1) {
      _savingsItems[index] = updatedItem;
      notifyListeners();
    }
  }

  // 저축 항목 삭제
  void removeSavingsItem(String id) {
    _savingsItems.removeWhere((item) => item.id == id);
    notifyListeners();
  }

  // 할 일 추가
  void addTask(TaskItem task) {
    _todayTasks.add(task);
    notifyListeners();
  }

  // 할 일 삭제
  void removeTask(String id) {
    _todayTasks.removeWhere((task) => task.id == id);
    notifyListeners();
  }

  // 소비 데이터 업데이트
  void updateSpendingData(String period, SpendingData data) {
    switch (period) {
      case '오늘':
        _todaySpending = data;
        break;
      case '이번 주':
        _weekSpending = data;
        break;
      case '이번 달':
        _monthSpending = data;
        break;
    }
    notifyListeners();
  }
}
