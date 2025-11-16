import 'dart:convert';
import '../config/api_config.dart';
import '../models/memory.dart';
import 'api_service.dart';

class MemoryService {
  final _api = ApiService();

  Future<List<Memory>> getMemories({
    int page = 1,
    int pageSize = 20,
    String? search,
    List<String>? tags,
    String? type,
  }) async {
    var url = '${ApiConfig.memories}?page=$page&pageSize=$pageSize';
    
    if (search != null && search.isNotEmpty) {
      url += '&search=$search';
    }
    if (tags != null && tags.isNotEmpty) {
      url += '&tags=${tags.join(',')}';
    }
    if (type != null && type.isNotEmpty) {
      url += '&type=$type';
    }

    final response = await _api.get(url);
    final data = _api.parseResponse(response);
    
    final items = data['items'] as List;
    return items.map((json) => Memory.fromJson(json)).toList();
  }

  Future<Memory> getMemoryById(String id) async {
    final response = await _api.get(ApiConfig.memoriesById(id));
    final data = _api.parseResponse(response);
    return Memory.fromJson(data);
  }

  Future<Memory> createMemory({
    required String type,
    String? title,
    String? description,
    String? fileUrl,
    String? thumbnailUrl,
    List<String>? tags,
    String? location,
    String? spotifyTrackId,
  }) async {
    final response = await _api.post(ApiConfig.memories, {
      'type': type,
      if (title != null) 'title': title,
      if (description != null) 'description': description,
      if (fileUrl != null) 'fileUrl': fileUrl,
      if (thumbnailUrl != null) 'thumbnailUrl': thumbnailUrl,
      'tags': tags ?? [],
      if (location != null) 'location': location,
      if (spotifyTrackId != null) 'spotifyTrackId': spotifyTrackId,
    });

    final data = _api.parseResponse(response);
    return Memory.fromJson(data);
  }

  Future<Memory> updateMemory(
    String id, {
    String? title,
    String? description,
    List<String>? tags,
    String? location,
  }) async {
    final response = await _api.put(ApiConfig.memoriesById(id), {
      if (title != null) 'title': title,
      if (description != null) 'description': description,
      if (tags != null) 'tags': tags,
      if (location != null) 'location': location,
    });

    final data = _api.parseResponse(response);
    return Memory.fromJson(data);
  }

  Future<void> deleteMemory(String id) async {
    await _api.delete(ApiConfig.memoriesById(id));
  }

  Future<MemoryStats> getStats({String period = 'all'}) async {
    final response = await _api.get('${ApiConfig.memoriesStats}?period=$period');
    final data = _api.parseResponse(response);
    return MemoryStats.fromJson(data);
  }
}
