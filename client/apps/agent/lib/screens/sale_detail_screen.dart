import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';
import '../providers/sales_provider.dart';
import '../providers/payment_provider.dart';

class SaleDetailScreen extends ConsumerWidget {
  final int saleId;

  const SaleDetailScreen({Key? key, required this.saleId}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final saleAsync = ref.watch(saleDetailProvider(saleId));

    return Scaffold(
      appBar: AppBar(title: const Text('Sale Details')),
      body: saleAsync.when(
        data: (sale) => _buildSaleDetail(context, ref, sale),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }

  Widget _buildSaleDetail(BuildContext context, WidgetRef ref, Sale sale) {
    final paymentsAsync = ref.watch(salePaymentsProvider(saleId));

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildCard(
            'Sale Information',
            [
              _buildDetailRow('Sale ID', '#${sale.id}'),
              _buildDetailRow('Total Price', 'KES ${sale.totalPrice}'),
              _buildDetailRow('Down Payment', 'KES ${sale.downPayment}'),
              _buildDetailRow('Installment Amount', 'KES ${sale.installmentAmount}'),
              _buildDetailRow('Frequency', sale.installmentFrequency),
              _buildDetailRow('Status', sale.status),
            ],
          ),
          const SizedBox(height: 24),
          Text('Payment History', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 12),
          paymentsAsync.when(
            data: (payments) => payments.isEmpty
                ? const Text('No payments recorded yet')
                : Column(
                    children: payments
                        .map((p) => _buildPaymentTile(p))
                        .toList(),
                  ),
            loading: () => const CircularProgressIndicator(),
            error: (err, stack) => Text('Error: $err'),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => _showRecordPaymentDialog(context),
            icon: const Icon(Icons.add_circle),
            label: const Text('Record Payment'),
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

  Widget _buildPaymentTile(Payment payment) {
    return Card(
      child: ListTile(
        leading: const Icon(Icons.check_circle, color: Colors.green),
        title: Text('KES ${payment.amount}'),
        subtitle: Text(payment.paidAt),
        trailing: Text(payment.method),
      ),
    );
  }

  void _showRecordPaymentDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => const _RecordPaymentDialog(),
    );
  }
}

class _RecordPaymentDialog extends ConsumerStatefulWidget {
  const _RecordPaymentDialog();

  @override
  ConsumerState<_RecordPaymentDialog> createState() => _RecordPaymentDialogState();
}

class _RecordPaymentDialogState extends ConsumerState<_RecordPaymentDialog> {
  final _amountController = TextEditingController();
  String _selectedMethod = 'cash';
  bool _isLoading = false;

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Record Payment'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _amountController,
            decoration: const InputDecoration(
              labelText: 'Amount (KES)',
              border: OutlineInputBorder(),
            ),
            keyboardType: TextInputType.number,
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            value: _selectedMethod,
            decoration: const InputDecoration(
              labelText: 'Payment Method',
              border: OutlineInputBorder(),
            ),
            items: const [
              DropdownMenuItem(value: 'cash', child: Text('Cash')),
              DropdownMenuItem(value: 'mpesa', child: Text('M-Pesa')),
              DropdownMenuItem(value: 'other', child: Text('Other')),
            ],
            onChanged: (v) => setState(() => _selectedMethod = v!),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: Navigator.of(context).pop,
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _isLoading ? null : _submitPayment,
          child: _isLoading
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Record'),
        ),
      ],
    );
  }

  Future<void> _submitPayment() async {
    if (_amountController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter amount')),
      );
      return;
    }

    setState(() => _isLoading = true);
    // Payment submission will be wired when sale context is added
    setState(() => _isLoading = false);
  }
}
