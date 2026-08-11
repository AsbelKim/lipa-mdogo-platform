import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final apiClientProvider = Provider<ApiClient>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return ApiClient(prefs);
});

final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError();
});

class ApiClient {
  static const String baseUrl = 'http://localhost:8000/api/v1';

  late final Dio _dio;
  final SharedPreferences _prefs;

  ApiClient(this._prefs) {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        contentType: Headers.jsonContentType,
        responseType: ResponseType.json,
      ),
    );

    _dio.interceptors.add(AuthInterceptor(_prefs));
    _dio.interceptors.add(LoggingInterceptor());
  }

  Future<Response> get(String path) => _dio.get(path);
  Future<Response> post(String path, dynamic data) => _dio.post(path, data: data);
  Future<Response> patch(String path, dynamic data) => _dio.patch(path, data: data);
  Future<Response> delete(String path) => _dio.delete(path);
}

class AuthInterceptor extends Interceptor {
  final SharedPreferences prefs;

  AuthInterceptor(this.prefs);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = prefs.getString('auth_token');
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      prefs.remove('auth_token');
    }
    handler.next(err);
  }
}

class LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    print('→ ${options.method} ${options.path}');
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    print('← ${response.statusCode} ${response.requestOptions.path}');
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    print('✗ ${err.response?.statusCode ?? "ERROR"} ${err.requestOptions.path}');
    handler.next(err);
  }
}
