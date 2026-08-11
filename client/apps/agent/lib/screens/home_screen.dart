import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';
import 'login_screen.dart';
import 'devices_screen.dart';
import 'customers_screen.dart';
import 'sales_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _selectedIndex = 0;

  final List<BottomNavigationBarItem> _navItems = const [
    BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
    BottomNavigationBarItem(icon: Icon(Icons.phone_android), label: 'Devices'),
    BottomNavigationBarItem(icon: Icon(Icons.shopping_cart), label: 'Sales'),
    BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Customers'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lipa Mdogo - Sales Agent'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: _buildContent(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        items: _navItems,
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

  Widget _buildContent() {
    switch (_selectedIndex) {
      case 0:
        return _buildDashboard();
      case 1:
        return const DevicesScreen();
      case 2:
        return const SalesScreen();
      case 3:
        return const CustomersScreen();
      default:
        return _buildDashboard();
    }
  }

  Widget _buildDashboard() {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Welcome Agent!', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 24),
            _buildStatCard('Assigned Devices', '—', Colors.blue),
            const SizedBox(height: 12),
            _buildStatCard('Active Sales', '—', Colors.green),
            const SizedBox(height: 12),
            _buildStatCard('Payments Today', 'KES 0', Colors.orange),
            const SizedBox(height: 24),
            Text('Quick Actions', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                ActionChip(
                  icon: const Icon(Icons.person_add),
                  label: const Text('Add Customer'),
                  onPressed: () => setState(() => _selectedIndex = 3),
                ),
                ActionChip(
                  icon: const Icon(Icons.add_shopping_cart),
                  label: const Text('New Sale'),
                  onPressed: () => setState(() => _selectedIndex = 2),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(Icons.trending_up, color: color),
            ),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: Theme.of(context).textTheme.bodySmall),
                const SizedBox(height: 4),
                Text(value, style: Theme.of(context).textTheme.headlineMedium),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
