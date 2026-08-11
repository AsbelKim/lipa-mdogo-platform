import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/models.dart';
import '../services/api_client.dart';

final saleRepositoryProvider = Provider<SaleRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return SaleRepository(apiClient);
});

class SaleRepository {
  final ApiClient _apiClient;

  SaleRepository(this._apiClient);

  Future<List<Sale>> getSales({int page = 1}) async {
    final response = await _apiClient.get('/sales?page=$page');
    final data = response.data['data'] as List;
    return data.map((d) => Sale.fromJson(d)).toList();
  }

  Future<Sale> getSale(int id) async {
    final response = await _apiClient.get('/sales/$id');
    return Sale.fromJson(response.data);
  }

  Future<Sale> createSale({
    required int deviceId,
    required int customerId,
    required int agentId,
    required double downPayment,
    required double totalPrice,
    required double installmentAmount,
    required String installmentFrequency,
    required String startDate,
  }) async {
    final response = await _apiClient.post('/sales', {
      'device_id': deviceId,
      'customer_id': customerId,
      'agent_id': agentId,
      'down_payment': downPayment,
      'total_price': totalPrice,
      'installment_amount': installmentAmount,
      'installment_frequency': installmentFrequency,
      'start_date': startDate,
    });
    return Sale.fromJson(response.data['sale']);
  }

  Future<Sale> updateSaleStatus(int id, String status) async {
    final response = await _apiClient.patch('/sales/$id', {
      'status': status,
    });
    return Sale.fromJson(response.data['sale']);
  }

  Future<void> deleteSale(int id) async {
    await _apiClient.delete('/sales/$id');
  }
}
