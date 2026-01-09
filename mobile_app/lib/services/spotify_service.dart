import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../utils/api_constants.dart';
import 'auth_service.dart';

class SpotifyService extends ChangeNotifier {
  final AuthService _authService;
  bool _isLoading = false;
  String? _error;

  SpotifyService(this._authService);

  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> connect() async {
    const url = 'http://10.0.2.2:5299/oauth/spotify/connect';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    } else {
      _error = 'Spotify bağlantı sayfası açılamadı';
      notifyListeners();
    }
  }

  Future<Map<String, dynamic>?> getStatus() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/spotify/status'),
        headers: _authService.getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Spotify status error: $e');
      return null;
    }
  }

  Future<bool> sync() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/spotify/sync'),
        headers: _authService.getAuthHeaders(),
      );

      _isLoading = false;
      notifyListeners();
      return response.statusCode == 200;
    } catch (e) {
      _isLoading = false;
      _error = 'Senkronizasyon hatası: $e';
      notifyListeners();
      return false;
    }
  }

  Future<List<dynamic>> getTopTracks() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/spotify/top-tracks?limit=50'),
        headers: _authService.getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['tracks'] as List;
      }
      return [];
    } catch (e) {
      print('Spotify top tracks error: $e');
      return [];
    }
  }
}
