import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';

final customersProvider = FutureProvider.autoDispose<List<Customer>>((ref) async {
  final repo = ref.watch(customerRepositoryProvider);
  return repo.getCustomers();
});

final customerDetailProvider = FutureProvider.autoDispose.family<Customer, int>((ref, id) async {
  final repo = ref.watch(customerRepositoryProvider);
  return repo.getCustomer(id);
});

final createCustomerProvider = FutureProvider.family<Customer, CustomerInput>((ref, input) async {
  final repo = ref.watch(customerRepositoryProvider);
  final customer = await repo.createCustomer(
    name: input.name,
    phone: input.phone,
    nationalId: input.nationalId,
    address: input.address,
  );
  ref.invalidate(customersProvider);
  return customer;
});

class CustomerInput {
  final String name;
  final String phone;
  final String? nationalId;
  final String? address;

  CustomerInput({
    required this.name,
    required this.phone,
    this.nationalId,
    this.address,
  });
}
