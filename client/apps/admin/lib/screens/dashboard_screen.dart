import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';
import 'login_screen.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  int _selectedIndex = 0;

  final List<Tab> _tabs = const [
    Tab(text: 'Devices'),
    Tab(text: 'Sales'),
    Tab(text: 'Payments'),
    Tab(text: 'Customers'),
  ];

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: _tabs.length,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Lipa Mdogo - Admin Dashboard'),
          bottom: TabBar(tabs: _tabs),
          actions: [
            IconButton(
              icon: const Icon(Icons.logout),
              onPressed: _logout,
            ),
          ],
        ),
        body: TabBarView(
          children: [
            _buildDevicesTab(),
            _buildSalesTab(),
            _buildPaymentsTab(),
            _buildCustomersTab(),
          ],
        ),
      ),
    );
  }

  Future<void> _logout() async {
    final authRepo = ref.read(authRepositoryProvider);
    await authRepo.logout();
    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  Widget _buildDevicesTab() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.phone_android, size: 64),
          const SizedBox(height: 16),
          Text('Devices Inventory', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          const Text('View and manage all devices'),
        ],
      ),
    );
  }

  Widget _buildSalesTab() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.shopping_cart, size: 64),
          const SizedBox(height: 16),
          Text('Sales Overview', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          const Text('View all financing agreements and sales'),
        ],
      ),
    );
  }

  Widget _buildPaymentsTab() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.credit_card, size: 64),
          const SizedBox(height: 16),
          Text('Payment History', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          const Text('Track customer payments'),
        ],
      ),
    );
  }

  Widget _buildCustomersTab() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.people, size: 64),
          const SizedBox(height: 16),
          Text('Customers', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          const Text('Manage customer information'),
        ],
      ),
    );
  }
}
