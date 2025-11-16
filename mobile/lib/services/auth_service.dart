import '../config/api_config.dart';
import '../models/auth_response.dart';
import '../models/user.dart';
import 'api_service.dart';
import 'storage_service.dart';

class AuthService {
  final _api = ApiService();
  final _storage = StorageService();

  Future<AuthResponse> login(String email, String password) async {
    final response = await _api.post(
      ApiConfig.authLogin,
      {
        'email': email,
        'password': password,
      },
      includeAuth: false,
    );

    final data = _api.parseResponse(response);
    final authResponse = AuthResponse.fromJson(data);

    // Save token and userId
    await _storage.saveToken(authResponse.token);
    await _storage.saveUserId(authResponse.userId);

    return authResponse;
  }

  Future<AuthResponse> register(String email, String password) async {
    final response = await _api.post(
      ApiConfig.authRegister,
      {
        'email': email,
        'password': password,
      },
      includeAuth: false,
    );

    final data = _api.parseResponse(response);
    final authResponse = AuthResponse.fromJson(data);

    // Save token and userId
    await _storage.saveToken(authResponse.token);
    await _storage.saveUserId(authResponse.userId);

    return authResponse;
  }

  Future<User> getProfile() async {
    final response = await _api.get(ApiConfig.userProfile);
    final data = _api.parseResponse(response);
    return User.fromJson(data);
  }

  Future<void> updateProfile({String? userName, String? email}) async {
    await _api.put(ApiConfig.userProfile, {
      if (userName != null) 'userName': userName,
      if (email != null) 'email': email,
    });
  }

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    await _api.put(ApiConfig.userPassword, {
      'currentPassword': currentPassword,
      'newPassword': newPassword,
    });
  }

  Future<void> logout() async {
    await _storage.clearAll();
  }

  Future<bool> isLoggedIn() async {
    final token = await _storage.getToken();
    return token != null && token.isNotEmpty;
  }
}
