class SpendingData {
  final String period;
  final double totalAmount;
  final String topCategory;
  final String topCategoryEmoji;

  const SpendingData({
    required this.period,
    required this.totalAmount,
    required this.topCategory,
    required this.topCategoryEmoji,
  });

  SpendingData copyWith({
    String? period,
    double? totalAmount,
    String? topCategory,
    String? topCategoryEmoji,
  }) {
    return SpendingData(
      period: period ?? this.period,
      totalAmount: totalAmount ?? this.totalAmount,
      topCategory: topCategory ?? this.topCategory,
      topCategoryEmoji: topCategoryEmoji ?? this.topCategoryEmoji,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'period': period,
      'totalAmount': totalAmount,
      'topCategory': topCategory,
      'topCategoryEmoji': topCategoryEmoji,
    };
  }

  factory SpendingData.fromJson(Map<String, dynamic> json) {
    return SpendingData(
      period: json['period'] as String,
      totalAmount: (json['totalAmount'] as num).toDouble(),
      topCategory: json['topCategory'] as String,
      topCategoryEmoji: json['topCategoryEmoji'] as String,
    );
  }
}
