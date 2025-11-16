import 'dart:io';

class ApiConfig {
  // Android Emulator: localhost = 10.0.2.2
  // iOS Simulator: localhost = 127.0.0.1
  // Physical Device: Use your computer's local IP (e.g., 192.168.1.100)
  
  static String get baseUrl {
    if (Platform.isAndroid) {
      // Android Emulator: localhost = 10.0.2.2
      return 'http://10.0.2.2:5299/api';
    } else {
      // iOS, Web, Desktop: use localhost
      return 'http://localhost:5299/api';
    }
  }

  // API Endpoints
  static String get authLogin => '$baseUrl/auth/login';
  static String get authRegister => '$baseUrl/auth/register';
  
  static String get userProfile => '$baseUrl/user/profile';
  static String get userPassword => '$baseUrl/user/password';
  
  static String get memories => '$baseUrl/memories';
  static String memoriesById(String id) => '$baseUrl/memories/$id';
  static String get memoriesStats => '$baseUrl/memories/stats';
  
  static String get upload => '$baseUrl/upload';
  static String uploadDelete(String fileUrl) => '$baseUrl/upload?fileUrl=$fileUrl';
  
  static String get spotifySearch => '$baseUrl/spotify/search';
  static String get spotifyRecommendations => '$baseUrl/spotify/recommendations';
  static String spotifyTrack(String trackId) => '$baseUrl/spotify/track/$trackId';

  // Timeouts
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
}
