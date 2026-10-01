import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../core/constants.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../../widgets/khadamati_logo.dart';
import '../employee/leave_balance_screen.dart';
import '../employee/document_request_screen.dart';
import 'profile_tab.dart';

class DashboardTab extends StatefulWidget {
  const DashboardTab({super.key});

  @override
  State<DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<DashboardTab> {
  Map<String, dynamic>? _stats;
  Map<String, dynamic>? _empStats;
  Map<String, dynamic>? _empProfile;
  Map<String, dynamic>? _leaveBalance;
  Map<String, dynamic>? _salaryInfo;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final user = context.read<AuthProvider>().user!;
    try {
      if (user.isAdmin) {
        final results = await Future.wait([
          ApiService.getDashboardStats(),
          ApiService.getEmployeeStats(),
        ]);
        setState(() { _stats = results[0]; _empStats = results[1]; });
      } else if (user.isRh) {
        final emp = await ApiService.getEmployeeStats();
        setState(() => _empStats = emp);
      } else {
        final results = await Future.wait([
          ApiService.getEmployeeProfile(),
          ApiService.getMySalary(),
          ApiService.getLeaveBalance(),
        ]);
        setState(() { _empProfile = results[0]; _salaryInfo = results[1]; _leaveBalance = results[2]; });
      }
    } catch (e) {
      debugPrint('Dashboard error: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  String _greeting() {
    final h = DateTime.now().hour;
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon aprÃ¨s-midi';
    return 'Bonsoir';
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user!;

    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: () async { setState(() => _loading = true); await _load(); },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // â”€â”€ Header â”€â”€
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${_greeting()}, ${user.firstName} ðŸ‘‹',
                        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.gray900)),
                      const SizedBox(height: 2),
                      Text(DateFormat('EEEE d MMMM yyyy', 'fr_FR').format(DateTime.now()),
                        style: const TextStyle(fontSize: 12, color: AppColors.gray400)),
                    ],
                  ),
                ),
                RoleBadge(role: user.role),
              ],
            ),
            const SizedBox(height: 20),

            if (_loading)
              const Center(child: CircularProgressIndicator(color: AppColors.primary))
            else if (user.isEmployee)
              _buildEmployeeDashboard()
            else
              _buildAdminRhDashboard(user.role),
          ],
        ),
      ),
    );
  }

  Widget _buildEmployeeDashboard() {
    final salary = _salaryInfo?['salary'];
    final fmt = NumberFormat('#,##0.00', 'fr_MA');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Salaire
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppColors.primary, AppColors.primaryLight],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 4))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Salaire mensuel net',
                    style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w500)),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(10)),
                    child: const Icon(Icons.account_balance_wallet_outlined, color: Colors.white, size: 20),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: salary != null ? fmt.format(salary) : 'â€”',
                      style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                    const TextSpan(
                      text: ' DH',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: Colors.white70),
                    ),
                  ],
                ),
              ),
              if (_empProfile?['position'] != null) ...[
                const SizedBox(height: 6),
                Text('${_empProfile!['position']} Â· ${_empProfile!['department'] ?? ''}',
                  style: const TextStyle(color: Colors.white60, fontSize: 12)),
              ],
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Solde congÃ©s
        if (_leaveBalance != null) ...[
          const Text('Solde de congÃ©s',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.gray900)),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: _leaveCard('Annuels', _leaveBalance!['annualLeave'] ?? 0, 25, AppColors.primary, Icons.wb_sunny_outlined)),
              const SizedBox(width: 10),
              Expanded(child: _leaveCard('Maladie', _leaveBalance!['sickLeave'] ?? 0, 10, AppColors.danger, Icons.favorite_outline)),
              const SizedBox(width: 10),
              Expanded(child: _leaveCard('Personnels', _leaveBalance!['personalLeave'] ?? 0, 5, AppColors.primaryLight, Icons.person_outline)),
            ],
          ),
          const SizedBox(height: 20),
        ],

        // Actions rapides
        const Text('Actions rapides',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.gray900)),
        const SizedBox(height: 12),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 1.6,
          children: [
            _actionCard('Demander un conge', Icons.calendar_today_outlined, AppColors.primary, () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const LeaveRequestFormScreen()));
            }),
            _actionCard('Demander attestation', Icons.description_outlined, AppColors.danger, () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const DocumentRequestScreen()));
            }),
            _actionCard('Mes conges', Icons.event_available_outlined, AppColors.primaryLight, () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const LeaveBalanceScreen()));
            }),
            _actionCard('Mon profil', Icons.person_outline, AppColors.gray500, () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileTab()));
            }),
          ],
        ),
      ],
    );
  }

  Widget _leaveCard(String label, int value, int max, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.gray200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 6),
          Text('$value', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: color)),
          Text(label, style: const TextStyle(fontSize: 10, color: AppColors.gray400, fontWeight: FontWeight.w500)),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: (value / max).clamp(0.0, 1.0),
              backgroundColor: AppColors.gray100,
              valueColor: AlwaysStoppedAnimation(color),
              minHeight: 4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _actionCard(String label, IconData icon, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withOpacity(0.15)),
        ),
        child: Row(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(width: 8),
            Expanded(child: Text(label,
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: color),
              maxLines: 2,
            )),
          ],
        ),
      ),
    );
  }

  Widget _buildAdminRhDashboard(String role) {
    final cards = [
      _StatData('Total EmployÃ©s',    '${_empStats?['total_employees'] ?? 0}',  Icons.people_outline,      AppColors.primary),
      _StatData('EmployÃ©s actifs',   '${_empStats?['active_employees'] ?? 0}', Icons.person_outline,      AppColors.primaryLight),
      _StatData('PrÃ©sents auj.',     '${_stats?['presentToday'] ?? 0}',        Icons.access_time_outlined, AppColors.danger),
      _StatData('Nouveaux ce mois',  '${_empStats?['new_this_month'] ?? 0}',   Icons.trending_up,         AppColors.primary),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 1.5,
          children: cards.map((c) => StatCard(label: c.label, value: c.value, icon: c.icon, color: c.color)).toList(),
        ),
        const SizedBox(height: 20),

        // RÃ©partition dÃ©partements
        if (_empStats?['department_stats'] != null) ...[
          const Text('RÃ©partition par dÃ©partement',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.gray900)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.gray200),
            ),
            child: Column(
              children: (_empStats!['department_stats'] as List).take(5).map<Widget>((dept) {
                final total = (_empStats!['total_employees'] as num?)?.toInt() ?? 1;
                final count = (dept['count'] as num?)?.toInt() ?? 0;
                final pct   = count / total;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(dept['department'] ?? '', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.gray700)),
                          Text('$count', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.gray500)),
                        ],
                      ),
                      const SizedBox(height: 4),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: pct,
                          backgroundColor: AppColors.gray100,
                          valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                          minHeight: 6,
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ],
    );
  }
}

class _StatData {
  final String label, value;
  final IconData icon;
  final Color color;
  const _StatData(this.label, this.value, this.icon, this.color);
}


