class SavingsItem {
  final String id;
  final String name;
  final double currentAmount;
  final double targetAmount;
  final double monthlyAmount;
  final int installmentNumber;

  const SavingsItem({
    required this.id,
    required this.name,
    required this.currentAmount,
    required this.targetAmount,
    required this.monthlyAmount,
    this.installmentNumber = 0,
  });

  double get progress => targetAmount > 0 ? currentAmount / targetAmount : 0;

  double get progressPercentage => progress * 100;

  bool get isCompleted => progress >= 1.0;

  SavingsItem copyWith({
    String? id,
    String? name,
    double? currentAmount,
    double? targetAmount,
    double? monthlyAmount,
    int? installmentNumber,
  }) {
    return SavingsItem(
      id: id ?? this.id,
      name: name ?? this.name,
      currentAmount: currentAmount ?? this.currentAmount,
      targetAmount: targetAmount ?? this.targetAmount,
      monthlyAmount: monthlyAmount ?? this.monthlyAmount,
      installmentNumber: installmentNumber ?? this.installmentNumber,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'currentAmount': currentAmount,
      'targetAmount': targetAmount,
      'monthlyAmount': monthlyAmount,
      'installmentNumber': installmentNumber,
    };
  }

  factory SavingsItem.fromJson(Map<String, dynamic> json) {
    return SavingsItem(
      id: json['id'] as String,
      name: json['name'] as String,
      currentAmount: (json['currentAmount'] as num).toDouble(),
      targetAmount: (json['targetAmount'] as num).toDouble(),
      monthlyAmount: (json['monthlyAmount'] as num).toDouble(),
      installmentNumber: json['installmentNumber'] as int? ?? 0,
    );
  }
}
