import 'package:flutter/material.dart';
import '../../core/constants.dart';
import '../../services/api_service.dart';
import '../../widgets/khadamati_logo.dart';

class LeaveBalanceScreen extends StatefulWidget {
  const LeaveBalanceScreen({super.key});

  @override
  State<LeaveBalanceScreen> createState() => _LeaveBalanceScreenState();
}

class _LeaveBalanceScreenState extends State<LeaveBalanceScreen> {
  Map<String, dynamic>? _balance;
  List<dynamic> _requests = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final results = await Future.wait([
        ApiService.getLeaveBalance(),
        ApiService.getMyLeaveRequests(),
      ]);
      if (!mounted) return;
      setState(() {
        _balance = results[0] as Map<String, dynamic>;
        _requests = results[1] is List ? results[1] as List : <dynamic>[];
      });
    } catch (e) {
      _snack(e.toString(), danger: true);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _snack(String message, {bool danger = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message.replaceAll('Exception: ', '')),
        backgroundColor: danger ? AppColors.danger : AppColors.primary,
      ),
    );
  }

  String _leaveTypeLabel(String value) => switch (value) {
        'ANNUAL_LEAVE' => 'Conge annuel',
        'SICK_LEAVE' => 'Conge maladie',
        'PERSONAL_LEAVE' => 'Conge personnel',
        'MATERNITY_LEAVE' => 'Conge maternite',
        'PATERNITY_LEAVE' => 'Conge paternite',
        'EMERGENCY_LEAVE' => 'Conge urgence',
        _ => value,
      };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : RefreshIndicator(
              color: AppColors.primary,
              onRefresh: _load,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Conges',
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.gray900),
                    ),
                    const SizedBox(height: 4),
                    const Text('Solde, demandes et suivi de validation', style: TextStyle(color: AppColors.gray500)),
                    const SizedBox(height: 16),
                    if (_balance != null) ...[
                      Row(children: [
                        Expanded(child: _balanceCard('Annuels', _balance!['annualLeave'] ?? 0, 25, AppColors.primary, Icons.wb_sunny_outlined)),
                        const SizedBox(width: 10),
                        Expanded(child: _balanceCard('Maladie', _balance!['sickLeave'] ?? 0, 10, AppColors.danger, Icons.favorite_outline)),
                        const SizedBox(width: 10),
                        Expanded(child: _balanceCard('Perso', _balance!['personalLeave'] ?? 0, 5, AppColors.primaryLight, Icons.person_outline)),
                      ]),
                      const SizedBox(height: 16),
                    ],
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const LeaveRequestFormScreen()),
                        ).then((_) => _load()),
                        icon: const Icon(Icons.add),
                        label: const Text('Nouvelle demande de conge'),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text('Mes demandes', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.gray900)),
                    const SizedBox(height: 12),
                    if (_requests.isEmpty)
                      _empty('Aucune demande de conge', Icons.event_busy_outlined)
                    else
                      ..._requests.map((raw) {
                        final item = Map<String, dynamic>.from(raw as Map);
                        return _requestCard(item);
                      }),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _balanceCard(String label, int value, int max, Color color, IconData icon) => Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.gray200)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text('$value', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: color)),
          Text(label, style: const TextStyle(fontSize: 11, color: AppColors.gray500, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: max == 0 ? 0 : (value / max).clamp(0.0, 1.0),
              backgroundColor: AppColors.gray100,
              valueColor: AlwaysStoppedAnimation(color),
              minHeight: 5,
            ),
          ),
        ]),
      );

  Widget _requestCard(Map<String, dynamic> item) => Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.gray200)),
        child: Row(children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(color: AppColors.primaryBg, borderRadius: BorderRadius.circular(12)),
            child: const Icon(Icons.calendar_today_outlined, color: AppColors.primary, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(_leaveTypeLabel('${item['leaveType'] ?? ''}'), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.gray900)),
              const SizedBox(height: 3),
              Text(
                '${item['startDate'] ?? ''} -> ${item['endDate'] ?? ''} - ${item['daysRequested'] ?? 0}j',
                style: const TextStyle(fontSize: 12, color: AppColors.gray500),
              ),
            ]),
          ),
          StatusBadge(status: '${item['status'] ?? ''}'),
        ]),
      );

  Widget _empty(String label, IconData icon) => Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 44),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: AppColors.gray200)),
        child: Column(children: [
          Icon(icon, size: 42, color: AppColors.gray400),
          const SizedBox(height: 10),
          Text(label, style: const TextStyle(color: AppColors.gray500, fontWeight: FontWeight.w700)),
        ]),
      );
}

class LeaveRequestFormScreen extends StatefulWidget {
  const LeaveRequestFormScreen({super.key});

  @override
  State<LeaveRequestFormScreen> createState() => _LeaveRequestFormScreenState();
}

class _LeaveRequestFormScreenState extends State<LeaveRequestFormScreen> {
  String _leaveType = 'ANNUAL_LEAVE';
  DateTime? _startDate;
  DateTime? _endDate;
  Map<String, dynamic>? _availability;
  bool _checkingAvailability = false;
  bool _submitting = false;
  final _reasonCtrl = TextEditingController();

  final _types = const [
    ('ANNUAL_LEAVE', 'Conge annuel'),
    ('SICK_LEAVE', 'Conge maladie'),
    ('PERSONAL_LEAVE', 'Conge personnel'),
    ('MATERNITY_LEAVE', 'Conge maternite'),
    ('PATERNITY_LEAVE', 'Conge paternite'),
    ('EMERGENCY_LEAVE', 'Conge urgence'),
  ];

  int get _days {
    if (_startDate == null || _endDate == null) return 0;
    return _endDate!.difference(_startDate!).inDays + 1;
  }

  String _dateValue(DateTime date) => date.toIso8601String().split('T')[0];

  Future<void> _refreshAvailability() async {
    if (_startDate == null || _endDate == null || _endDate!.isBefore(_startDate!)) {
      setState(() => _availability = null);
      return;
    }
    setState(() => _checkingAvailability = true);
    try {
      final data = await ApiService.checkLeaveAvailability(_dateValue(_startDate!), _dateValue(_endDate!));
      if (mounted) setState(() => _availability = data);
    } catch (_) {
      if (mounted) setState(() => _availability = null);
    } finally {
      if (mounted) setState(() => _checkingAvailability = false);
    }
  }

  Future<void> _submit() async {
    if (_startDate == null || _endDate == null) {
      _snack('Veuillez selectionner les dates', danger: true);
      return;
    }
    if (_endDate!.isBefore(_startDate!)) {
      _snack('La date de fin doit etre apres la date de debut', danger: true);
      return;
    }

    setState(() => _submitting = true);
    try {
      final availability = await ApiService.checkLeaveAvailability(_dateValue(_startDate!), _dateValue(_endDate!));
      if (availability['available'] == false) {
        throw Exception('Planning conges complet: choisissez une autre periode.');
      }
      await ApiService.requestLeave({
        'leaveType': _leaveType,
        'startDate': _dateValue(_startDate!),
        'endDate': _dateValue(_endDate!),
        'daysRequested': _days,
        'reason': _reasonCtrl.text.trim().isEmpty ? null : _reasonCtrl.text.trim(),
      });
      if (!mounted) return;
      _snack('Demande envoyee');
      Navigator.pop(context);
    } catch (e) {
      _snack(e.toString(), danger: true);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _snack(String message, {bool danger = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message.replaceAll('Exception: ', '')), backgroundColor: danger ? AppColors.danger : AppColors.primary),
    );
  }

  @override
  Widget build(BuildContext context) {
    final available = _availability?['available'] != false;
    final slots = _availability?['remainingSlots'] ?? 2;

    return Scaffold(
      appBar: AppBar(title: const Text('Demande de conge')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Type de conge', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _types.map((type) {
              final active = _leaveType == type.$1;
              return ChoiceChip(
                label: Text(type.$2),
                selected: active,
                onSelected: (_) => setState(() => _leaveType = type.$1),
                selectedColor: AppColors.primaryBg,
                labelStyle: TextStyle(color: active ? AppColors.primary : AppColors.gray500, fontWeight: FontWeight.w700),
              );
            }).toList(),
          ),
          const SizedBox(height: 22),
          Row(children: [
            Expanded(child: _datePicker('Date de debut', _startDate, (date) { setState(() => _startDate = date); _refreshAvailability(); })),
            const SizedBox(width: 12),
            Expanded(child: _datePicker('Date de fin', _endDate, (date) { setState(() => _endDate = date); _refreshAvailability(); })),
          ]),
          if (_days > 0) ...[
            const SizedBox(height: 14),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(13),
              decoration: BoxDecoration(
                color: available ? AppColors.primaryBg : AppColors.dangerBg,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(children: [
                Icon(Icons.calendar_today, color: available ? AppColors.primary : AppColors.danger, size: 18),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    _checkingAvailability
                        ? 'Verification disponibilite...'
                        : available
                            ? 'Duree : $_days jour${_days > 1 ? 's' : ''} - $slots place(s) disponible(s)'
                            : 'Planning complet sur cette periode',
                    style: TextStyle(color: available ? AppColors.primary : AppColors.danger, fontWeight: FontWeight.w800),
                  ),
                ),
              ]),
            ),
          ],
          const SizedBox(height: 22),
          const Text('Motif (optionnel)', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
          const SizedBox(height: 8),
          TextField(
            controller: _reasonCtrl,
            maxLines: 3,
            decoration: const InputDecoration(hintText: 'Decrivez brievement la raison de votre demande...'),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _submitting || !available ? null : _submit,
              child: _submitting
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Text('Envoyer la demande'),
            ),
          ),
        ]),
      ),
    );
  }

  Widget _datePicker(String label, DateTime? value, ValueChanged<DateTime> onPick) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
          const SizedBox(height: 7),
          InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: () async {
              final picked = await showDatePicker(
                context: context,
                initialDate: value ?? DateTime.now(),
                firstDate: DateTime.now(),
                lastDate: DateTime.now().add(const Duration(days: 365)),
                builder: (ctx, child) => Theme(
                  data: Theme.of(ctx).copyWith(colorScheme: const ColorScheme.light(primary: AppColors.primary)),
                  child: child!,
                ),
              );
              if (picked != null) onPick(picked);
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
              decoration: BoxDecoration(color: AppColors.gray50, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.gray200, width: 2)),
              child: Row(children: [
                const Icon(Icons.calendar_today_outlined, size: 16, color: AppColors.gray400),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    value != null ? '${value.day}/${value.month}/${value.year}' : 'Choisir',
                    style: TextStyle(color: value != null ? AppColors.gray900 : AppColors.gray400, fontSize: 13),
                  ),
                ),
              ]),
            ),
          ),
        ],
      );
}
