import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/models.dart';
import '../services/api_client.dart';

final paymentRepositoryProvider = Provider<PaymentRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return PaymentRepository(apiClient);
});

class PaymentRepository {
  final ApiClient _apiClient;

  PaymentRepository(this._apiClient);

  Future<List<Payment>> getPayments({int? saleId, int page = 1}) async {
    final query = saleId != null ? '?sale_id=$saleId&page=$page' : '?page=$page';
    final response = await _apiClient.get('/payments$query');
    final data = response.data['data'] as List;
    return data.map((d) => Payment.fromJson(d)).toList();
  }

  Future<Payment> getPayment(int id) async {
    final response = await _apiClient.get('/payments/$id');
    return Payment.fromJson(response.data);
  }

  Future<Payment> recordPayment({
    required int saleId,
    required double amount,
    required String method,
    String? notes,
  }) async {
    final response = await _apiClient.post('/payments', {
      'sale_id': saleId,
      'amount': amount,
      'method': method,
      if (notes != null) 'notes': notes,
    });
    return Payment.fromJson(response.data['payment']);
  }

  Future<void> deletePayment(int id) async {
    await _apiClient.delete('/payments/$id');
  }
}
