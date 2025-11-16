import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final _authService = AuthService();
  
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  Future<bool> login(String email, String password) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      print('[AUTH] Attempting login with email: $email');
      final authResponse = await _authService.login(email, password);
      print('[AUTH] Login successful, token received');
      
      // Get user profile
      print('[AUTH] Fetching user profile...');
      _user = await _authService.getProfile();
      print('[AUTH] Profile loaded: ${_user?.email}');
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      print('[AUTH ERROR] Login failed: $e');
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String email, String password) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final authResponse = await _authService.register(email, password);
      
      // Get user profile
      _user = await _authService.getProfile();
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> loadUser() async {
    try {
      _isLoading = true;
      notifyListeners();

      final isLoggedIn = await _authService.isLoggedIn();
      if (isLoggedIn) {
        _user = await _authService.getProfile();
      }

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      _user = null;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    _user = null;
    _error = null;
    notifyListeners();
  }

  Future<bool> updateProfile({String? userName, String? email}) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _authService.updateProfile(userName: userName, email: email);
      
      // Reload user profile
      _user = await _authService.getProfile();
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
