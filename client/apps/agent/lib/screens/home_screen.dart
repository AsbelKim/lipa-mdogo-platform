import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';
import 'login_screen.dart';

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
    BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Customers'),
    BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Profile'),
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
        return _buildDevices();
      case 2:
        return _buildCustomers();
      case 3:
        return _buildProfile();
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
            _buildStatCard('Total Devices', '0', Colors.blue),
            const SizedBox(height: 12),
            _buildStatCard('Active Sales', '0', Colors.green),
            const SizedBox(height: 12),
            _buildStatCard('Total Revenue', 'KES 0', Colors.orange),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.add),
              label: const Text('New Sale'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDevices() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.phone_android, size: 64),
          const SizedBox(height: 16),
          Text('My Devices', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          const Text('Devices assigned to you'),
        ],
      ),
    );
  }

  Widget _buildCustomers() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.people, size: 64),
          const SizedBox(height: 16),
          Text('My Customers', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          const Text('Customers and sales'),
        ],
      ),
    );
  }

  Widget _buildProfile() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.person, size: 64),
          const SizedBox(height: 16),
          Text('My Profile', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          const Text('Agent information and settings'),
        ],
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
