class User {
  final String name;
  final String userId;

  const User({
    required this.name,
    required this.userId,
  });

  User copyWith({
    String? name,
    String? userId,
  }) {
    return User(
      name: name ?? this.name,
      userId: userId ?? this.userId,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'userId': userId,
    };
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      name: json['name'] as String,
      userId: json['userId'] as String,
    );
  }
}
