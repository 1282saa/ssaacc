class TaskItem {
  final String id;
  final String title;
  final double amount;
  final String description;
  final int daysRemaining;
  final DateTime dueDate;

  const TaskItem({
    required this.id,
    required this.title,
    required this.amount,
    required this.description,
    required this.daysRemaining,
    required this.dueDate,
  });

  String get dDayText => 'D-$daysRemaining';

  bool get isOverdue => daysRemaining < 0;

  TaskItem copyWith({
    String? id,
    String? title,
    double? amount,
    String? description,
    int? daysRemaining,
    DateTime? dueDate,
  }) {
    return TaskItem(
      id: id ?? this.id,
      title: title ?? this.title,
      amount: amount ?? this.amount,
      description: description ?? this.description,
      daysRemaining: daysRemaining ?? this.daysRemaining,
      dueDate: dueDate ?? this.dueDate,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'amount': amount,
      'description': description,
      'daysRemaining': daysRemaining,
      'dueDate': dueDate.toIso8601String(),
    };
  }

  factory TaskItem.fromJson(Map<String, dynamic> json) {
    return TaskItem(
      id: json['id'] as String,
      title: json['title'] as String,
      amount: (json['amount'] as num).toDouble(),
      description: json['description'] as String,
      daysRemaining: json['daysRemaining'] as int,
      dueDate: DateTime.parse(json['dueDate'] as String),
    );
  }
}
