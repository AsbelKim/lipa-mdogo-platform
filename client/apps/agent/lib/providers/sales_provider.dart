import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';

final salesProvider = FutureProvider.autoDispose<List<Sale>>((ref) async {
  final repo = ref.watch(saleRepositoryProvider);
  return repo.getSales();
});

final saleDetailProvider = FutureProvider.autoDispose.family<Sale, int>((ref, id) async {
  final repo = ref.watch(saleRepositoryProvider);
  return repo.getSale(id);
});

final createSaleProvider = FutureProvider.family<Sale, SaleInput>((ref, input) async {
  final repo = ref.watch(saleRepositoryProvider);
  final sale = await repo.createSale(
    deviceId: input.deviceId,
    customerId: input.customerId,
    agentId: input.agentId,
    downPayment: input.downPayment,
    totalPrice: input.totalPrice,
    installmentAmount: input.installmentAmount,
    installmentFrequency: input.installmentFrequency,
    startDate: input.startDate,
  );
  ref.invalidate(salesProvider);
  return sale;
});

class SaleInput {
  final int deviceId;
  final int customerId;
  final int agentId;
  final double downPayment;
  final double totalPrice;
  final double installmentAmount;
  final String installmentFrequency;
  final String startDate;

  SaleInput({
    required this.deviceId,
    required this.customerId,
    required this.agentId,
    required this.downPayment,
    required this.totalPrice,
    required this.installmentAmount,
    required this.installmentFrequency,
    required this.startDate,
  });
}
