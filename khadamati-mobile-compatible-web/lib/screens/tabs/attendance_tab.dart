import 'package:flutter/material.dart';
import '../../core/constants.dart';
import '../../services/api_service.dart';
import '../../widgets/khadamati_logo.dart';

class AttendanceTab extends StatefulWidget {
  const AttendanceTab({super.key});
  @override
  State<AttendanceTab> createState() => _AttendanceTabState();
}

class _AttendanceTabState extends State<AttendanceTab> {
  List<dynamic> _records = [];
  bool _loading = true;

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    try {
      final data = await ApiService.getAttendance();
      setState(() => _records = data['records'] ?? []);
    } catch (e) { debugPrint('$e'); }
    finally { setState(() => _loading = false); }
  }

  Color _statusColor(String s) => switch (s) {
    'present'  => AppColors.primary,
    'late'     => const Color(0xFFD97706),
    'absent'   => AppColors.danger,
    'on-leave' => AppColors.primaryLight,
    _ => AppColors.gray400,
  };

  @override
  Widget build(BuildContext context) {
    return _loading
      ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
      : RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async { setState(() => _loading = true); await _load(); },
          child: _records.isEmpty
            ? const Center(child: Text('Aucun enregistrement', style: TextStyle(color: AppColors.gray400)))
            : ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: _records.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (_, i) {
                  final r = _records[i];
                  final color = _statusColor(r['status'] ?? '');
                  return Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.gray200),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 4, height: 48,
                          decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(4)),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (r['employee_name'] != null)
                                Text(r['employee_name'], style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                              Text(r['date'] ?? '', style: const TextStyle(fontSize: 12, color: AppColors.gray500)),
                              if (r['check_in'] != null)
                                Text('Entrée: ${r['check_in']}  Sortie: ${r['check_out'] ?? '—'}',
                                  style: const TextStyle(fontSize: 11, color: AppColors.gray400)),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            StatusBadge(status: r['status'] ?? ''),
                            if ((r['total_hours'] ?? 0) > 0) ...[
                              const SizedBox(height: 4),
                              Text('${r['total_hours']}h', style: const TextStyle(fontSize: 11, color: AppColors.gray400)),
                            ],
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
        );
  }
}
