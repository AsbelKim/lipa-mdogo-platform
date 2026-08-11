import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';
import '../providers/device_provider.dart';

class DeviceDetailScreen extends ConsumerWidget {
  final int deviceId;

  const DeviceDetailScreen({Key? key, required this.deviceId}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final deviceAsync = ref.watch(deviceDetailProvider(deviceId));

    return Scaffold(
      appBar: AppBar(title: const Text('Device Details')),
      body: deviceAsync.when(
        data: (device) => _buildDeviceDetail(context, device),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }

  Widget _buildDeviceDetail(BuildContext context, Device device) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildCard(
            'Device Information',
            [
              _buildDetailRow('Category', device.category),
              _buildDetailRow('Brand', device.brand),
              _buildDetailRow('Model', device.model),
              _buildDetailRow('Serial Number', device.serialNumber),
              if (device.imei != null) _buildDetailRow('IMEI', device.imei!),
              if (device.colour != null) _buildDetailRow('Colour', device.colour!),
              _buildDetailRow('Unit Cost', 'KES ${device.unitCost}'),
              _buildDetailRow('Status', device.status),
            ],
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => _showSaleDialog(context),
            icon: const Icon(Icons.add_shopping_cart),
            label: const Text('Create Sale'),
          ),
        ],
      ),
    );
  }

  Widget _buildCard(String title, List<Widget> children) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  void _showSaleDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Create Sale'),
        content: const Text('Feature coming soon'),
        actions: [
          TextButton(onPressed: Navigator.of(ctx).pop, child: const Text('OK')),
        ],
      ),
    );
  }
}
