import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';
import '../providers/sales_provider.dart';
import 'sale_detail_screen.dart';

class SalesScreen extends ConsumerWidget {
  const SalesScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final salesAsync = ref.watch(salesProvider);

    return salesAsync.when(
      data: (sales) => sales.isEmpty
          ? _buildEmptyState(context)
          : _buildSalesList(context, sales),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => Center(child: Text('Error: $err')),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.shopping_cart_outlined, size: 64, color: Colors.grey),
          const SizedBox(height: 16),
          const Text('No active sales yet'),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              // Navigate to new sale
            },
            icon: const Icon(Icons.add),
            label: const Text('Create Sale'),
          ),
        ],
      ),
    );
  }

  Widget _buildSalesList(BuildContext context, List<Sale> sales) {
    return ListView.builder(
      itemCount: sales.length,
      itemBuilder: (context, index) {
        final sale = sales[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: ListTile(
            leading: const Icon(Icons.shopping_cart),
            title: Text('Sale #${sale.id}'),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Price: KES ${sale.totalPrice}'),
                Text('Status: ${sale.status}'),
              ],
            ),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (ctx) => SaleDetailScreen(saleId: sale.id),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
