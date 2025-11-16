import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import 'storage_service.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final _storage = StorageService();

  Future<Map<String, String>> _getHeaders({bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      final token = await _storage.getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  Future<http.Response> get(String url, {bool includeAuth = true}) async {
    try {
      final headers = await _getHeaders(includeAuth: includeAuth);
      final response = await http
          .get(Uri.parse(url), headers: headers)
          .timeout(ApiConfig.connectTimeout);
      return response;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<http.Response> post(
    String url,
    Map<String, dynamic> body, {
    bool includeAuth = true,
  }) async {
    try {
      print('[API] POST $url');
      print('[API] Body: ${jsonEncode(body)}');
      final headers = await _getHeaders(includeAuth: includeAuth);
      print('[API] Headers: $headers');
      final response = await http
          .post(
            Uri.parse(url),
            headers: headers,
            body: jsonEncode(body),
          )
          .timeout(ApiConfig.connectTimeout);
      print('[API] Response status: ${response.statusCode}');
      print('[API] Response body: ${response.body}');
      return response;
    } catch (e) {
      print('[API ERROR] $e');
      throw _handleError(e);
    }
  }

  Future<http.Response> put(
    String url,
    Map<String, dynamic> body, {
    bool includeAuth = true,
  }) async {
    try {
      final headers = await _getHeaders(includeAuth: includeAuth);
      final response = await http
          .put(
            Uri.parse(url),
            headers: headers,
            body: jsonEncode(body),
          )
          .timeout(ApiConfig.connectTimeout);
      return response;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<http.Response> delete(String url, {bool includeAuth = true}) async {
    try {
      final headers = await _getHeaders(includeAuth: includeAuth);
      final response = await http
          .delete(Uri.parse(url), headers: headers)
          .timeout(ApiConfig.connectTimeout);
      return response;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<http.StreamedResponse> uploadFile(
    String url,
    File file, {
    String fieldName = 'file',
  }) async {
    try {
      final token = await _storage.getToken();
      final request = http.MultipartRequest('POST', Uri.parse(url));

      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }

      request.files.add(await http.MultipartFile.fromPath(fieldName, file.path));

      final response = await request.send().timeout(ApiConfig.receiveTimeout);
      return response;
    } catch (e) {
      throw _handleError(e);
    }
  }

  String _handleError(dynamic error) {
    if (error is SocketException) {
      return 'No internet connection';
    } else if (error is HttpException) {
      return 'HTTP error occurred';
    } else if (error is FormatException) {
      return 'Bad response format';
    } else {
      return 'Unexpected error: ${error.toString()}';
    }
  }

  Map<String, dynamic> parseResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    } else {
      throw HttpException(
        'Request failed: ${response.statusCode} - ${response.body}',
      );
    }
  }
}
