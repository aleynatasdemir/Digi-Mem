class User {
  final String id;
  final String email;
  final String? userName;
  final bool emailConfirmed;
  final DateTime memberSince;

  User({
    required this.id,
    required this.email,
    this.userName,
    required this.emailConfirmed,
    required this.memberSince,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      userName: json['userName'],
      emailConfirmed: json['emailConfirmed'] ?? false,
      memberSince: DateTime.parse(json['memberSince'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'userName': userName,
      'emailConfirmed': emailConfirmed,
      'memberSince': memberSince.toIso8601String(),
    };
  }
}
