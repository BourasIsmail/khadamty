import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants.dart';
import '../providers/auth_provider.dart';
import '../widgets/khadamati_logo.dart';
import 'tabs/dashboard_tab.dart';
import 'tabs/employees_tab.dart';
import 'tabs/profile_tab.dart';
import 'tabs/rh_tab.dart';
import 'employee/pay_slips_screen.dart';
import 'employee/leave_balance_screen.dart';
import 'employee/document_request_screen.dart';
import 'info_hub_screen.dart';
import 'mission_orders_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  List<_NavItem> _getNavItems(String role) {
    if (role == 'EMPLOYEE') {
      return [
        _NavItem(icon: Icons.home_outlined,             activeIcon: Icons.home,            label: 'Accueil',  screen: const DashboardTab()),
        _NavItem(icon: Icons.event_available_outlined,  activeIcon: Icons.event_available, label: 'Conges',   screen: const LeaveBalanceScreen()),
        _NavItem(icon: Icons.description_outlined,      activeIcon: Icons.description,     label: 'Docs',     screen: const DocumentRequestScreen()),
        _NavItem(icon: Icons.payments_outlined,         activeIcon: Icons.payments,        label: 'Paie',     screen: const PaySlipsScreen()),
        _NavItem(icon: Icons.route_outlined,            activeIcon: Icons.route,           label: 'Missions', screen: const MissionOrdersScreen()),
        _NavItem(icon: Icons.person_outline,            activeIcon: Icons.person,          label: 'Profil',   screen: const ProfileTab()),
      ];
    } else {
      return [
        _NavItem(icon: Icons.home_outlined,      activeIcon: Icons.home,     label: 'Accueil',  screen: const DashboardTab()),
        _NavItem(icon: Icons.people_outline,     activeIcon: Icons.people,   label: 'Employes', screen: const EmployeesTab()),
        _NavItem(icon: Icons.approval_outlined,  activeIcon: Icons.approval, label: 'Demandes', screen: const RhTab()),
        _NavItem(icon: Icons.route_outlined,     activeIcon: Icons.route,    label: 'Missions', screen: const MissionOrdersScreen()),
        _NavItem(icon: Icons.campaign_outlined,  activeIcon: Icons.campaign, label: 'Infos',    screen: const InfoHubScreen()),
        _NavItem(icon: Icons.person_outline,     activeIcon: Icons.person,   label: 'Profil',   screen: const ProfileTab()),
      ];
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user!;
    final items = _getNavItems(user.role);

    return Scaffold(
      appBar: AppBar(
        title: const KhadamatiLogo(size: 32),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                onPressed: () {},
              ),
              Positioned(
                right: 10, top: 10,
                child: Container(
                  width: 8, height: 8,
                  decoration: const BoxDecoration(color: AppColors.danger, shape: BoxShape.circle),
                ),
              ),
            ],
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: items.map((e) => e.screen).toList(),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        backgroundColor: Colors.white,
        indicatorColor: AppColors.primaryBg,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        destinations: items.map((item) => NavigationDestination(
          icon: Icon(item.icon, color: AppColors.gray400),
          selectedIcon: Icon(item.activeIcon, color: AppColors.primary),
          label: item.label,
        )).toList(),
      ),
    );
  }
}

class _NavItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final Widget screen;
  const _NavItem({required this.icon, required this.activeIcon, required this.label, required this.screen});
}

