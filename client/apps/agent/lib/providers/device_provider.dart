import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';

final devicesProvider = FutureProvider.autoDispose<List<Device>>((ref) async {
  final repo = ref.watch(deviceRepositoryProvider);
  return repo.getDevices();
});

final deviceDetailProvider = FutureProvider.autoDispose.family<Device, int>((ref, id) async {
  final repo = ref.watch(deviceRepositoryProvider);
  return repo.getDevice(id);
});
