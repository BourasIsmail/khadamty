import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/constants.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';

class MissionOrdersScreen extends StatefulWidget {
  const MissionOrdersScreen({super.key});

  @override
  State<MissionOrdersScreen> createState() => _MissionOrdersScreenState();
}

class _MissionOrdersScreenState extends State<MissionOrdersScreen> {
  bool _loading = true;
  String _status = '';
  List<dynamic> _orders = [];

  final _statuses = const ['', 'EN_ATTENTE', 'APPROUVE', 'REJETE', 'EN_COURS', 'TERMINE', 'ANNULE'];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final user = context.read<AuthProvider>().user!;
    setState(() => _loading = true);
    try {
      final data = user.isEmployee
          ? await ApiService.getMyMissionOrders(statut: _status)
          : await ApiService.getMissionOrders(statut: _status);
      setState(() => _orders = data is List ? data : <dynamic>[]);
    } catch (e) {
      _snack(e.toString(), danger: true);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _createMission() async {
    final employeesData = await ApiService.getEmployees(page: 1, limit: 100);
    final employees = (employeesData['employees'] as List?) ?? [];
    if (!mounted || employees.isEmpty) {
      _snack('Aucun employÃ© disponible', danger: true);
      return;
    }

    String? employeeId = '${employees.first['id']}';
    final objetCtrl = TextEditingController(text: 'Mission administrative');
    final departCtrl = TextEditingController(text: 'Direction GÃ©nÃ©rale');
    final destinationCtrl = TextEditingController(text: 'DÃ©lÃ©gation provinciale');
    final amountCtrl = TextEditingController(text: '420');

    final ok = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(26))),
      builder: (ctx) => StatefulBuilder(builder: (ctx, setSheetState) {
        return Padding(
          padding: EdgeInsets.only(left: 16, right: 16, top: 18, bottom: MediaQuery.of(ctx).viewInsets.bottom + 18),
          child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Nouvel ordre de mission', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
            const SizedBox(height: 14),
            DropdownButtonFormField<String>(
              value: employeeId,
              decoration: const InputDecoration(labelText: 'EmployÃ© destinataire'),
              items: employees.map<DropdownMenuItem<String>>((e) {
                return DropdownMenuItem(value: '${e['id']}', child: Text('${e['firstName']} ${e['lastName']}'));
              }).toList(),
              onChanged: (v) => setSheetState(() => employeeId = v),
            ),
            const SizedBox(height: 10),
            TextField(controller: objetCtrl, decoration: const InputDecoration(labelText: 'Objet')),
            const SizedBox(height: 10),
            TextField(controller: departCtrl, decoration: const InputDecoration(labelText: 'DÃ©part')),
            const SizedBox(height: 10),
            TextField(controller: destinationCtrl, decoration: const InputDecoration(labelText: 'Destination')),
            const SizedBox(height: 10),
            TextField(controller: amountCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Montant total')),
            const SizedBox(height: 16),
            SizedBox(width: double.infinity, child: ElevatedButton(
              onPressed: () => Navigator.pop(ctx, true),
              child: const Text('Envoyer Ã  lâ€™employÃ©'),
            )),
          ]),
        );
      }),
    );

    if (ok != true || employeeId == null) return;
    final today = DateTime.now();
    final back = today.add(const Duration(days: 2));
    await ApiService.createMissionOrder({
      'employee': {'id': int.tryParse(employeeId!) ?? employeeId},
      'numero': 'OM-${DateTime.now().millisecondsSinceEpoch}',
      'objet': objetCtrl.text.trim(),
      'lieuDepart': departCtrl.text.trim(),
      'lieuArrivee': destinationCtrl.text.trim(),
      'dateDepart': DateFormat('yyyy-MM-dd').format(today),
      'dateRetour': DateFormat('yyyy-MM-dd').format(back),
      'dureeJours': 2,
      'montantIndemnite': double.tryParse(amountCtrl.text) ?? 0,
      'montantTransport': 0,
      'montantHebergement': 0,
      'montantTotal': double.tryParse(amountCtrl.text) ?? 0,
      'statut': 'EN_ATTENTE',
    });
    _snack('Ordre envoyÃ© Ã  lâ€™employÃ©');
    await _load();
  }

  Future<void> _approve(String id) async {
    final user = context.read<AuthProvider>().user!;
    await ApiService.approveMissionOrder(id, user.email);
    _snack('Ordre approuvÃ©');
    await _load();
  }

  Future<void> _reject(String id) async {
    final user = context.read<AuthProvider>().user!;
    await ApiService.rejectMissionOrder(id, user.email, 'RejetÃ© depuis mobile');
    _snack('Ordre rejetÃ©');
    await _load();
  }

  void _snack(String message, {bool danger = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message.replaceAll('Exception: ', '')), backgroundColor: danger ? AppColors.danger : AppColors.primary),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user!;
    return Scaffold(
      backgroundColor: AppColors.surface,
      floatingActionButton: user.isEmployee ? null : FloatingActionButton.extended(
        onPressed: _createMission,
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Envoyer'),
      ),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: _load,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(user.isEmployee ? 'Mes missions' : 'Ordres de mission',
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.gray900)),
            const SizedBox(height: 4),
            Text(user.isEmployee ? 'Missions envoyÃ©es par lâ€™administration' : 'CrÃ©er, suivre et valider les missions',
                style: const TextStyle(color: AppColors.gray500)),
            const SizedBox(height: 14),
            SizedBox(
              height: 42,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _statuses.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, i) {
                  final value = _statuses[i];
                  final active = value == _status;
                  return ChoiceChip(
                    selected: active,
                    label: Text(value.isEmpty ? 'Tous' : value.replaceAll('_', ' ')),
                    onSelected: (_) { setState(() => _status = value); _load(); },
                    selectedColor: AppColors.primaryBg,
                    labelStyle: TextStyle(color: active ? AppColors.primary : AppColors.gray500, fontWeight: FontWeight.w700),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),
            if (_loading)
              const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator(color: AppColors.primary)))
            else if (_orders.isEmpty)
              _empty()
            else
              ..._orders.map((raw) => _missionCard(Map<String, dynamic>.from(raw as Map), user.isEmployee)),
          ]),
        ),
      ),
    );
  }

  Widget _missionCard(Map<String, dynamic> order, bool employeeMode) {
    final status = '${order['statut'] ?? 'EN_ATTENTE'}';
    final color = _statusColor(status);
    final employee = order['employee'] is Map ? Map<String, dynamic>.from(order['employee'] as Map) : <String, dynamic>{};
    final employeeName = '${order['employePrenom'] ?? employee['firstName'] ?? ''} ${order['employeNom'] ?? employee['lastName'] ?? ''}'.trim();
    final employeeCode = '${order['employeMatricule'] ?? employee['employeeId'] ?? ''}';
    final depart = '${order['lieuDepart'] ?? '-'}';
    final destination = '${order['destination'] ?? order['lieuArrivee'] ?? '-'}';
    final start = '${order['dateDebut'] ?? order['dateDepart'] ?? '-'}';
    final end = '${order['dateFin'] ?? order['dateRetour'] ?? '-'}';
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.gray200)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(color: color.withOpacity(0.10), borderRadius: BorderRadius.circular(999)),
            child: Text(status.replaceAll('_', ' '), style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w900)),
          ),
          const Spacer(),
          const Icon(Icons.route_outlined, color: AppColors.primary),
        ]),
        const SizedBox(height: 12),
        Text(order['objet'] ?? 'Mission', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.gray900)),
        const SizedBox(height: 8),
        _line(Icons.person_outline, employeeName.isEmpty ? employeeCode : '$employeeName - $employeeCode'),
        _line(Icons.place_outlined, '$depart -> $destination'),
        _line(Icons.event_outlined, '$start -> $end'),
        if (!employeeMode && status == 'EN_ATTENTE') ...[
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: OutlinedButton.icon(onPressed: () => _reject(order['id']), icon: const Icon(Icons.close), label: const Text('Rejeter'))),
            const SizedBox(width: 10),
            Expanded(child: ElevatedButton.icon(onPressed: () => _approve(order['id']), icon: const Icon(Icons.check), label: const Text('Approuver'))),
          ]),
        ],
      ]),
    );
  }

  Widget _line(IconData icon, String text) => Padding(
    padding: const EdgeInsets.only(top: 5),
    child: Row(children: [
      Icon(icon, size: 16, color: AppColors.gray400),
      const SizedBox(width: 8),
      Expanded(child: Text(text, style: const TextStyle(color: AppColors.gray500, fontSize: 12))),
    ]),
  );

  Color _statusColor(String status) {
    switch (status) {
      case 'APPROUVE': return AppColors.primary;
      case 'REJETE': return AppColors.danger;
      case 'EN_COURS': return Colors.blue;
      case 'TERMINE': return AppColors.gray500;
      default: return Colors.orange;
    }
  }

  Widget _empty() => Container(
    width: double.infinity,
    padding: const EdgeInsets.symmetric(vertical: 42),
    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: AppColors.gray200)),
    child: const Column(children: [
      Icon(Icons.route_outlined, size: 44, color: AppColors.gray400),
      SizedBox(height: 10),
      Text('Aucun ordre de mission trouvÃ©', style: TextStyle(color: AppColors.gray500, fontWeight: FontWeight.w700)),
    ]),
  );
}

