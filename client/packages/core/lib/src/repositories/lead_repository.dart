import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/models.dart';
import '../services/api_client.dart';

final leadRepositoryProvider = Provider<LeadRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return LeadRepository(apiClient);
});

class LeadRepository {
  final ApiClient _apiClient;

  LeadRepository(this._apiClient);

  Future<List<Lead>> getLeads({String? stage, int page = 1}) async {
    final query = stage != null ? '?stage=$stage&page=$page' : '?page=$page';
    final response = await _apiClient.get('/leads$query');
    final data = response.data['data'] as List;
    return data.map((d) => Lead.fromJson(d)).toList();
  }

  Future<Lead> getLead(int id) async {
    final response = await _apiClient.get('/leads/$id');
    return Lead.fromJson(response.data);
  }

  Future<Lead> createLead({
    required String customerName,
    required String phone,
    String? productInterest,
    String? notes,
    int? agentId,
  }) async {
    final response = await _apiClient.post('/leads', {
      'customer_name': customerName,
      'phone': phone,
      if (productInterest != null) 'product_interest': productInterest,
      if (notes != null) 'notes': notes,
      if (agentId != null) 'agent_id': agentId,
    });
    return Lead.fromJson(response.data['lead']);
  }

  Future<Lead> updateLead(
    int id, {
    String? customerName,
    String? phone,
    String? productInterest,
    String? stage,
    String? notes,
  }) async {
    final response = await _apiClient.patch('/leads/$id', {
      if (customerName != null) 'customer_name': customerName,
      if (phone != null) 'phone': phone,
      if (productInterest != null) 'product_interest': productInterest,
      if (stage != null) 'stage': stage,
      if (notes != null) 'notes': notes,
    });
    return Lead.fromJson(response.data['lead']);
  }

  Future<void> deleteLead(int id) async {
    await _apiClient.delete('/leads/$id');
  }
}
