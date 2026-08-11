import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/models.dart';
import '../services/api_client.dart';

final deviceRepositoryProvider = Provider<DeviceRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return DeviceRepository(apiClient);
});

class DeviceRepository {
  final ApiClient _apiClient;

  DeviceRepository(this._apiClient);

  Future<List<Device>> getDevices({int page = 1}) async {
    final response = await _apiClient.get('/devices?page=$page');
    final data = response.data['data'] as List;
    return data.map((d) => Device.fromJson(d)).toList();
  }

  Future<Device> getDevice(int id) async {
    final response = await _apiClient.get('/devices/$id');
    return Device.fromJson(response.data);
  }

  Future<Device> createDevice({
    required String category,
    required String brand,
    required String model,
    required String serialNumber,
    required double unitCost,
    String? imei,
    String? colour,
    Map<String, dynamic>? specs,
  }) async {
    final response = await _apiClient.post('/devices', {
      'category': category,
      'brand': brand,
      'model': model,
      'serial_number': serialNumber,
      'unit_cost': unitCost,
      if (imei != null) 'imei': imei,
      if (colour != null) 'colour': colour,
      if (specs != null) 'specs': specs,
    });
    return Device.fromJson(response.data['device']);
  }

  Future<Device> updateDevice(
    int id, {
    String? status,
    String? colour,
    double? unitCost,
  }) async {
    final response = await _apiClient.patch('/devices/$id', {
      if (status != null) 'status': status,
      if (colour != null) 'colour': colour,
      if (unitCost != null) 'unit_cost': unitCost,
    });
    return Device.fromJson(response.data['device']);
  }

  Future<void> deleteDevice(int id) async {
    await _apiClient.delete('/devices/$id');
  }
}
