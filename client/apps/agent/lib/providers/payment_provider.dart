import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';

final paymentsProvider = FutureProvider.autoDispose<List<Payment>>((ref) async {
  final repo = ref.watch(paymentRepositoryProvider);
  return repo.getPayments();
});

final salePaymentsProvider = FutureProvider.autoDispose.family<List<Payment>, int>((ref, saleId) async {
  final repo = ref.watch(paymentRepositoryProvider);
  return repo.getPayments(saleId: saleId);
});

final recordPaymentProvider = FutureProvider.family<Payment, PaymentInput>((ref, input) async {
  final repo = ref.watch(paymentRepositoryProvider);
  final payment = await repo.recordPayment(
    saleId: input.saleId,
    amount: input.amount,
    method: input.method,
    notes: input.notes,
  );
  ref.invalidate(paymentsProvider);
  ref.invalidate(salePaymentsProvider(input.saleId));
  return payment;
});

class PaymentInput {
  final int saleId;
  final double amount;
  final String method;
  final String? notes;

  PaymentInput({
    required this.saleId,
    required this.amount,
    required this.method,
    this.notes,
  });
}
