import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';

final leadsProvider = FutureProvider.autoDispose<List<Lead>>((ref) async {
  final repo = ref.watch(leadRepositoryProvider);
  return repo.getLeads();
});

final leadsByStageProvider = FutureProvider.autoDispose.family<List<Lead>, String>((ref, stage) async {
  final repo = ref.watch(leadRepositoryProvider);
  return repo.getLeads(stage: stage);
});

final createLeadProvider = FutureProvider.family<Lead, LeadInput>((ref, input) async {
  final repo = ref.watch(leadRepositoryProvider);
  final lead = await repo.createLead(
    customerName: input.customerName,
    phone: input.phone,
    productInterest: input.productInterest,
    notes: input.notes,
  );
  ref.invalidate(leadsProvider);
  return lead;
});

final updateLeadStageProvider = FutureProvider.family<Lead, UpdateLeadInput>((ref, input) async {
  final repo = ref.watch(leadRepositoryProvider);
  final lead = await repo.updateLead(
    input.id,
    stage: input.stage,
  );
  ref.invalidate(leadsProvider);
  ref.invalidate(leadsByStageProvider(input.stage));
  return lead;
});

class LeadInput {
  final String customerName;
  final String phone;
  final String? productInterest;
  final String? notes;

  LeadInput({
    required this.customerName,
    required this.phone,
    this.productInterest,
    this.notes,
  });
}

class UpdateLeadInput {
  final int id;
  final String stage;

  UpdateLeadInput({
    required this.id,
    required this.stage,
  });
}
