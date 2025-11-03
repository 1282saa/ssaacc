import 'package:flutter/foundation.dart';
import '../models/user.dart';

class UserProvider with ChangeNotifier {
  User _user = const User(
    name: '은별',
    userId: 'eunbyul_001',
  );

  User get user => _user;

  String get userName => _user.name;

  void updateUser(User newUser) {
    _user = newUser;
    notifyListeners();
  }

  void updateUserName(String newName) {
    _user = _user.copyWith(name: newName);
    notifyListeners();
  }
}
