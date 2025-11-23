class ApiConstants {
  // Backend URL - localhost yerine bilgisayarınızın IP adresini kullanın
  // Emulator için: 10.0.2.2
  // Fiziksel cihaz için: Bilgisayarınızın yerel IP'si (örn: 192.168.1.100)
  static const String baseUrl = 'http://10.0.2.2:5299/api';
  
  // Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String memories = '/memories';
  static const String memoriesStats = '/memories/stats';
  static const String upload = '/upload';
}
