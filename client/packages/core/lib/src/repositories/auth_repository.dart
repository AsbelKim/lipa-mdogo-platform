import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';
import '../services/api_client.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  final prefs = ref.watch(sharedPreferencesProvider);
  return AuthRepository(apiClient, prefs);
});

class AuthRepository {
  final ApiClient _apiClient;
  final SharedPreferences _prefs;

  AuthRepository(this._apiClient, this._prefs);

  Future<AuthResponse> login(String email, String password) async {
    try {
      final response = await _apiClient.post('/auth/login', {
        'email': email,
        'password': password,
      });

      final authResponse = AuthResponse.fromJson(response.data);
      await _prefs.setString('auth_token', authResponse.token);
      await _prefs.setInt('user_id', authResponse.user.id);
      await _prefs.setString('user_role', authResponse.user.role);

      return authResponse;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> logout() async {
    try {
      await _apiClient.post('/auth/logout', {});
      await _prefs.remove('auth_token');
      await _prefs.remove('user_id');
      await _prefs.remove('user_role');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<User?> getCurrentUser() async {
    final token = _prefs.getString('auth_token');
    if (token == null) return null;

    try {
      final response = await _apiClient.get('/auth/me');
      return User.fromJson(response.data['user']);
    } on DioException {
      return null;
    }
  }

  bool isLoggedIn() => _prefs.getString('auth_token') != null;

  String? get token => _prefs.getString('auth_token');

  String? get userRole => _prefs.getString('user_role');

  Exception _handleError(DioException e) {
    if (e.response?.statusCode == 401) {
      return UnauthorizedException('Invalid credentials');
    } else if (e.response?.statusCode == 422) {
      final errors = e.response?.data['errors'] as Map?;
      return ValidationException(errors ?? {});
    }
    return NetworkException(e.message ?? 'Network error');
  }
}

class UnauthorizedException implements Exception {
  final String message;
  UnauthorizedException(this.message);

  @override
  String toString() => message;
}

class ValidationException implements Exception {
  final Map<String, dynamic> errors;
  ValidationException(this.errors);

  @override
  String toString() => errors.toString();
}

class NetworkException implements Exception {
  final String message;
  NetworkException(this.message);

  @override
  String toString() => message;
}
