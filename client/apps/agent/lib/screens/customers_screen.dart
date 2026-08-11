import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';
import '../providers/customer_provider.dart';
import 'new_customer_screen.dart';

class CustomersScreen extends ConsumerWidget {
  const CustomersScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final customersAsync = ref.watch(customersProvider);

    return customersAsync.when(
      data: (customers) => _buildScreen(context, customers),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => Center(child: Text('Error: $err')),
    );
  }

  Widget _buildScreen(BuildContext context, List<Customer> customers) {
    return Scaffold(
      body: customers.isEmpty
          ? _buildEmptyState(context)
          : _buildCustomersList(context, customers),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (ctx) => const NewCustomerScreen()),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.people_outline, size: 64, color: Colors.grey),
          const SizedBox(height: 16),
          const Text('No customers yet'),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (ctx) => const NewCustomerScreen()),
              );
            },
            icon: const Icon(Icons.add),
            label: const Text('Add Customer'),
          ),
        ],
      ),
    );
  }

  Widget _buildCustomersList(BuildContext context, List<Customer> customers) {
    return ListView.builder(
      itemCount: customers.length,
      itemBuilder: (context, index) {
        final customer = customers[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: ListTile(
            leading: const Icon(Icons.person),
            title: Text(customer.name),
            subtitle: Text(customer.phone),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // Navigate to customer detail
            },
          ),
        );
      },
    );
  }
}
