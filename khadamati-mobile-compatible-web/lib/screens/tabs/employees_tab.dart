import 'package:flutter/material.dart';
import '../../core/constants.dart';
import '../../services/api_service.dart';

class EmployeesTab extends StatefulWidget {
  const EmployeesTab({super.key});
  @override
  State<EmployeesTab> createState() => _EmployeesTabState();
}

class _EmployeesTabState extends State<EmployeesTab> {
  List<dynamic> _employees = [];
  bool _loading = true;
  String _search = '';

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    try {
      final data = await ApiService.getEmployees();
      setState(() => _employees = data['employees'] ?? []);
    } catch (e) { debugPrint('$e'); }
    finally { setState(() => _loading = false); }
  }

  List<dynamic> get _filtered => _employees.where((e) {
    final name = '${e['firstName']} ${e['lastName']}'.toLowerCase();
    return name.contains(_search.toLowerCase());
  }).toList();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          color: Colors.white,
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
          child: TextField(
            onChanged: (v) => setState(() => _search = v),
            decoration: InputDecoration(
              hintText: 'Rechercher un employé...',
              prefixIcon: const Icon(Icons.search, color: AppColors.gray400),
              contentPadding: const EdgeInsets.symmetric(vertical: 10),
            ),
          ),
        ),
        Expanded(
          child: _loading
            ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
            : RefreshIndicator(
                color: AppColors.primary,
                onRefresh: () async { setState(() => _loading = true); await _load(); },
                child: _filtered.isEmpty
                  ? const Center(child: Text('Aucun employé trouvé', style: TextStyle(color: AppColors.gray400)))
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: _filtered.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (_, i) {
                        final e = _filtered[i];
                        final initials = '${(e['firstName'] ?? '')[0]}${(e['lastName'] ?? '')[0]}';
                        return Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: AppColors.gray200),
                          ),
                          child: Row(
                            children: [
                              CircleAvatar(
                                backgroundColor: AppColors.primaryBg,
                                child: Text(initials.toUpperCase(),
                                  style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700, fontSize: 14)),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('${e['firstName']} ${e['lastName']}',
                                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: AppColors.gray900)),
                                    Text('${e['position'] ?? ''} · ${e['department'] ?? ''}',
                                      style: const TextStyle(fontSize: 12, color: AppColors.gray400)),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: e['status'] == 'active' ? AppColors.primaryBg : AppColors.gray100,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  e['status'] == 'active' ? 'Actif' : 'Inactif',
                                  style: TextStyle(
                                    fontSize: 11, fontWeight: FontWeight.w600,
                                    color: e['status'] == 'active' ? AppColors.primary : AppColors.gray400,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
              ),
        ),
      ],
    );
  }
}
