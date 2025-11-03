class AppValidators {
  // 금액 유효성 검사
  static bool isValidAmount(double amount) {
    return amount >= 0 && amount.isFinite;
  }

  // 퍼센트 유효성 검사 (0.0 ~ 1.0)
  static bool isValidProgress(double progress) {
    return progress >= 0.0 && progress <= 1.0;
  }

  // 문자열 비어있지 않은지 검사
  static bool isNotEmpty(String? value) {
    return value != null && value.trim().isNotEmpty;
  }

  // 이름 유효성 검사
  static bool isValidName(String? name) {
    if (name == null || name.trim().isEmpty) return false;
    // 1자 이상 20자 이하
    return name.trim().length >= 1 && name.trim().length <= 20;
  }

  // ID 유효성 검사 (영문, 숫자, 언더스코어만 허용)
  static bool isValidId(String? id) {
    if (id == null || id.isEmpty) return false;
    final regex = RegExp(r'^[a-zA-Z0-9_]+$');
    return regex.hasMatch(id);
  }

  // 날짜가 미래인지 검사
  static bool isFutureDate(DateTime date) {
    return date.isAfter(DateTime.now());
  }

  // 날짜가 과거인지 검사
  static bool isPastDate(DateTime date) {
    return date.isBefore(DateTime.now());
  }

  // D-Day 계산
  static int calculateDaysRemaining(DateTime dueDate) {
    final now = DateTime.now();
    final difference = dueDate.difference(DateTime(now.year, now.month, now.day));
    return difference.inDays;
  }
}
