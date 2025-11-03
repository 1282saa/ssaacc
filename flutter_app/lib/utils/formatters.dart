import 'package:intl/intl.dart';

class AppFormatters {
  // 금액 포맷 (예: 1234567 -> "1,234,567원")
  static String formatCurrency(double amount, {bool showUnit = true}) {
    final formatter = NumberFormat('#,###', 'ko_KR');
    final formatted = formatter.format(amount.round());
    return showUnit ? '$formatted원' : formatted;
  }

  // 간단한 금액 포맷 (예: 1234567 -> "123만원")
  static String formatCurrencyShort(double amount) {
    if (amount >= 100000000) {
      // 1억 이상
      final億 = (amount / 100000000).toStringAsFixed(1);
      return '$億억원';
    } else if (amount >= 10000) {
      // 1만 이상
      final 만 = (amount / 10000).toStringAsFixed(0);
      return '$만만원';
    } else {
      return formatCurrency(amount);
    }
  }

  // 퍼센트 포맷 (예: 0.725 -> "72.5%")
  static String formatPercentage(double value, {int decimals = 0}) {
    final percentage = value * 100;
    return '${percentage.toStringAsFixed(decimals)}%';
  }

  // 날짜 포맷 (예: 2024-01-15 -> "2024년 1월 15일")
  static String formatDate(DateTime date) {
    return DateFormat('yyyy년 M월 d일', 'ko_KR').format(date);
  }

  // 날짜 포맷 짧게 (예: 2024-01-15 -> "1/15")
  static String formatDateShort(DateTime date) {
    return DateFormat('M/d').format(date);
  }

  // D-Day 포맷 (예: 2 -> "D-2")
  static String formatDDay(int daysRemaining) {
    if (daysRemaining < 0) {
      return 'D+${-daysRemaining}';
    } else if (daysRemaining == 0) {
      return 'D-Day';
    } else {
      return 'D-$daysRemaining';
    }
  }

  // 카운트 포맷 (예: 3 -> "3개")
  static String formatCount(int count) {
    return '$count개';
  }

  // 회차 포맷 (예: 10 -> "10회차")
  static String formatInstallment(int number) {
    return '$number회차';
  }

  // 메시지 템플릿 (플레이스홀더 치환)
  static String replaceTemplate(String template, Map<String, String> values) {
    String result = template;
    values.forEach((key, value) {
      result = result.replaceAll('{$key}', value);
    });
    return result;
  }

  // 사용자 이름 + "님" 추가
  static String formatUserName(String name) {
    return '$name님';
  }

  // 목표 달성률 메시지
  static String formatGoalMessage(String userName, double percentage) {
    final percentStr = formatPercentage(percentage);
    return '좋아요 ${formatUserName(userName)}! 이번 달 목표치의 $percentStr 달성했어요';
  }
}
