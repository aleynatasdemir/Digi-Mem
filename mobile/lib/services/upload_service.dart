import 'dart:convert';
import 'dart:io';
import '../config/api_config.dart';
import 'api_service.dart';

class UploadService {
  final _api = ApiService();

  Future<Map<String, dynamic>> uploadFile(File file) async {
    final response = await _api.uploadFile(ApiConfig.upload, file);
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      final responseBody = await response.stream.bytesToString();
      return jsonDecode(responseBody);
    } else {
      throw Exception('Upload failed: ${response.statusCode}');
    }
  }

  Future<void> deleteFile(String fileUrl) async {
    await _api.delete(ApiConfig.uploadDelete(fileUrl));
  }
}
