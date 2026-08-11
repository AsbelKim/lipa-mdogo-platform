import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/models.dart';
import '../services/api_client.dart';

final customerRepositoryProvider = Provider<CustomerRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return CustomerRepository(apiClient);
});

class CustomerRepository {
  final ApiClient _apiClient;

  CustomerRepository(this._apiClient);

  Future<List<Customer>> getCustomers({int page = 1}) async {
    final response = await _apiClient.get('/customers?page=$page');
    final data = response.data['data'] as List;
    return data.map((d) => Customer.fromJson(d)).toList();
  }

  Future<Customer> getCustomer(int id) async {
    final response = await _apiClient.get('/customers/$id');
    return Customer.fromJson(response.data);
  }

  Future<Customer> createCustomer({
    required String name,
    required String phone,
    String? nationalId,
    String? address,
  }) async {
    final response = await _apiClient.post('/customers', {
      'name': name,
      'phone': phone,
      if (nationalId != null) 'national_id': nationalId,
      if (address != null) 'address': address,
    });
    return Customer.fromJson(response.data['customer']);
  }

  Future<Customer> updateCustomer(
    int id, {
    String? name,
    String? phone,
    String? nationalId,
    String? address,
  }) async {
    final response = await _apiClient.patch('/customers/$id', {
      if (name != null) 'name': name,
      if (phone != null) 'phone': phone,
      if (nationalId != null) 'national_id': nationalId,
      if (address != null) 'address': address,
    });
    return Customer.fromJson(response.data['customer']);
  }

  Future<void> deleteCustomer(int id) async {
    await _apiClient.delete('/customers/$id');
  }
}
