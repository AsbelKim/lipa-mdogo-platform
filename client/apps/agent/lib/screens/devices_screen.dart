import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';
import '../providers/device_provider.dart';
import 'device_detail_screen.dart';

class DevicesScreen extends ConsumerWidget {
  const DevicesScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final devicesAsync = ref.watch(devicesProvider);

    return devicesAsync.when(
      data: (devices) => devices.isEmpty
          ? _buildEmptyState()
          : _buildDevicesList(context, devices),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => Center(child: Text('Error: $err')),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.phone_android_outlined, size: 64, color: Colors.grey),
          const SizedBox(height: 16),
          const Text('No devices assigned yet'),
        ],
      ),
    );
  }

  Widget _buildDevicesList(BuildContext context, List<Device> devices) {
    return ListView.builder(
      itemCount: devices.length,
      itemBuilder: (context, index) {
        final device = devices[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: ListTile(
            leading: const Icon(Icons.phone_android),
            title: Text('${device.brand} ${device.model}'),
            subtitle: Text('SN: ${device.serialNumber}'),
            trailing: _buildStatusBadge(device.status),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (ctx) => DeviceDetailScreen(deviceId: device.id),
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildStatusBadge(String status) {
    final colors = {
      'in_stock': Colors.blue,
      'assigned': Colors.amber,
      'sold': Colors.green,
      'lost': Colors.red,
    };
    return Chip(
      label: Text(status.replaceAll('_', ' ')),
      backgroundColor: colors[status] ?? Colors.grey,
      labelStyle: const TextStyle(color: Colors.white),
    );
  }
}
