import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/memory.dart';
import '../utils/api_constants.dart';
import 'auth_service.dart';

class MemoryService extends ChangeNotifier {
  final AuthService _authService;
  List<Memory> _memories = [];
  bool _isLoading = false;
  String? _error;

  MemoryService(this._authService);

  List<Memory> get memories => _memories;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchMemories({
    String? from,
    String? to,
    String? types,
    String? tags,
    String? query,
    int page = 1,
    int pageSize = 20,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final queryParams = {
        'page': page.toString(),
        'pageSize': pageSize.toString(),
        if (from != null) 'from': from,
        if (to != null) 'to': to,
        if (types != null) 'types': types,
        if (tags != null) 'tags': tags,
        if (query != null) 'q': query,
      };

      final uri = Uri.parse('${ApiConstants.baseUrl}${ApiConstants.memories}')
          .replace(queryParameters: queryParams);

      final response = await http.get(
        uri,
        headers: _authService.getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _memories = (data['items'] as List)
            .map((json) => Memory.fromJson(json))
            .toList();
      } else {
        _error = 'Anılar yüklenemedi';
      }
    } catch (e) {
      _error = 'Bağlantı hatası: $e';
      print('Fetch memories error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createMemory(Memory memory) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.memories}'),
        headers: _authService.getAuthHeaders(),
        body: jsonEncode(memory.toJson()),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        await fetchMemories(); // Refresh list
        return true;
      }
      return false;
    } catch (e) {
      print('Create memory error: $e');
      return false;
    }
  }

  Future<bool> updateMemory(int id, Map<String, dynamic> updates) async {
    try {
      final response = await http.put(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.memories}/$id'),
        headers: _authService.getAuthHeaders(),
        body: jsonEncode(updates),
      );

      if (response.statusCode == 200) {
        await fetchMemories(); // Refresh list
        return true;
      }
      return false;
    } catch (e) {
      print('Update memory error: $e');
      return false;
    }
  }

  Future<bool> deleteMemory(int id) async {
    try {
      final response = await http.delete(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.memories}/$id'),
        headers: _authService.getAuthHeaders(),
      );

      if (response.statusCode == 204 || response.statusCode == 200) {
        _memories.removeWhere((m) => m.id == id);
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Delete memory error: $e');
      return false;
    }
  }

  Future<Map<String, dynamic>?> fetchStats() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.memoriesStats}'),
        headers: _authService.getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Fetch stats error: $e');
      return null;
    }
  }
}
