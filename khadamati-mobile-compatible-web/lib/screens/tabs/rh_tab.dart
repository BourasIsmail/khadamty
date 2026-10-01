import 'package:flutter/material.dart';
import '../../core/constants.dart';
import '../../services/api_service.dart';
import '../../widgets/khadamati_logo.dart';

class RhTab extends StatefulWidget {
  const RhTab({super.key});
  @override
  State<RhTab> createState() => _RhTabState();
}

class _RhTabState extends State<RhTab> with SingleTickerProviderStateMixin {
  late TabController _tabs;
  List<dynamic> _leaveRequests = [];
  List<dynamic> _docRequests   = [];
  List<dynamic> _calendarEvents = [];
  Map<String, dynamic>? _stats;
  bool _loading = true;
  String? _actionLoading;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 3, vsync: this);
    _load();
  }

  Future<void> _load() async {
    try {
      final results = await Future.wait([
        ApiService.getRhStats(),
        ApiService.getRhLeaveRequests(),
        ApiService.getRhDocumentRequests(),
        ApiService.getRhLeaveCalendar(),
      ]);
      setState(() {
        _stats         = results[0] as Map<String, dynamic>;
        _leaveRequests = (results[1] is List) ? results[1] as List : [];
        _docRequests   = (results[2] is List) ? results[2] as List : [];
        final calendar = results[3] as Map<String, dynamic>;
        _calendarEvents = calendar['events'] is List ? calendar['events'] as List : [];
      });
    } catch (e) { debugPrint('$e'); }
    finally { setState(() => _loading = false); }
  }

  Future<void> _approveLeave(String id) async {
    setState(() => _actionLoading = id);
    try {
      await ApiService.approveLeaveRequest(id);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Demande approuvÃ©e âœ“'), backgroundColor: AppColors.primary));
      await _load();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$e'), backgroundColor: AppColors.danger));
    } finally { setState(() => _actionLoading = null); }
  }

  Future<void> _rejectLeave(String id) async {
    final reason = await _showRejectDialog();
    if (reason == null) return;
    setState(() => _actionLoading = id);
    try {
      await ApiService.rejectLeaveRequest(id, reason);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Demande rejetÃ©e'), backgroundColor: AppColors.danger));
      await _load();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$e')));
    } finally { setState(() => _actionLoading = null); }
  }

  Future<String?> _showRejectDialog() async {
    final ctrl = TextEditingController();
    return showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Motif du rejet'),
        content: TextField(controller: ctrl, decoration: const InputDecoration(hintText: 'Raison (optionnel)'), maxLines: 3),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Annuler')),
          ElevatedButton(onPressed: () => Navigator.pop(ctx, ctrl.text), child: const Text('Confirmer')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Stats
        if (_stats != null)
          Container(
            color: Colors.white,
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                _miniStat('CongÃ©s en attente', '${_stats!['pendingLeave'] ?? 0}', AppColors.danger),
                const SizedBox(width: 10),
                _miniStat('Docs en attente', '${_stats!['pendingDocs'] ?? 0}', AppColors.primary),
                const SizedBox(width: 10),
                _miniStat('ApprouvÃ©s', '${_stats!['approvedLeave'] ?? 0}', AppColors.primaryLight),
              ],
            ),
          ),

        // Tabs
        Container(
          color: Colors.white,
          child: TabBar(
            controller: _tabs,
            labelColor: AppColors.primary,
            unselectedLabelColor: AppColors.gray400,
            indicatorColor: AppColors.primary,
            tabs: [
              Tab(text: 'CongÃ©s (${_leaveRequests.where((r) => r['status'] == 'PENDING').length})'),
              Tab(text: 'Attestations (${_docRequests.where((r) => r['status'] == 'PENDING').length})'),
              Tab(text: 'Calendrier (${_calendarEvents.length})'),
            ],
          ),
        ),

        Expanded(
          child: _loading
            ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
            : TabBarView(
                controller: _tabs,
                children: [_buildLeaveList(), _buildDocList(), _buildCalendarList()],
              ),
        ),
      ],
    );
  }

  Widget _miniStat(String label, String value, Color color) => Expanded(
    child: Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(color: color.withOpacity(0.08), borderRadius: BorderRadius.circular(10)),
      child: Column(
        children: [
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: color)),
          Text(label, style: const TextStyle(fontSize: 10, color: AppColors.gray500), textAlign: TextAlign.center),
        ],
      ),
    ),
  );

  Widget _buildLeaveList() {
    if (_leaveRequests.isEmpty) return const Center(child: Text('Aucune demande', style: TextStyle(color: AppColors.gray400)));
    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: () async { setState(() => _loading = true); await _load(); },
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _leaveRequests.length,
        separatorBuilder: (_, __) => const SizedBox(height: 10),
        itemBuilder: (_, i) {
          final r = _leaveRequests[i];
          final isPending = r['status'] == 'PENDING';
          return Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.gray200),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(child: Text(r['employeeName'] ?? '', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14))),
                    StatusBadge(status: r['status'] ?? ''),
                  ],
                ),
                const SizedBox(height: 4),
                Text(_leaveTypeLabel(r['leaveType'] ?? ''),
                  style: const TextStyle(fontSize: 12, color: AppColors.gray500)),
                Text('${r['startDate'] ?? ''} â†’ ${r['endDate'] ?? ''} Â· ${r['daysRequested'] ?? 0}j',
                  style: const TextStyle(fontSize: 12, color: AppColors.gray400)),
                if (isPending) ...[
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _actionLoading == r['id'] ? null : () => _rejectLeave(r['id']),
                          icon: const Icon(Icons.close, size: 16),
                          label: const Text('Rejeter'),
                          style: OutlinedButton.styleFrom(foregroundColor: AppColors.danger, side: const BorderSide(color: AppColors.danger)),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _actionLoading == r['id'] ? null : () => _approveLeave(r['id']),
                          icon: const Icon(Icons.check, size: 16),
                          label: const Text('Approuver'),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildDocList() {
    if (_docRequests.isEmpty) return const Center(child: Text('Aucune demande', style: TextStyle(color: AppColors.gray400)));
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _docRequests.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (_, i) {
        final r = _docRequests[i];
        final isPending = r['status'] == 'PENDING';
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.gray200),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(child: Text(r['employeeName'] ?? '', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14))),
                  StatusBadge(status: r['status'] ?? ''),
                ],
              ),
              const SizedBox(height: 4),
              Text(_docTypeLabel(r['documentType'] ?? ''), style: const TextStyle(fontSize: 12, color: AppColors.gray500)),
              if (r['purpose'] != null) Text(r['purpose'], style: const TextStyle(fontSize: 12, color: AppColors.gray400)),
              if (isPending) ...[
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () async {
                      await ApiService.processDocumentRequest(r['id'], 'IN_PROGRESS');
                      await _load();
                    },
                    icon: const Icon(Icons.play_arrow, size: 16),
                    label: const Text('Traiter'),
                  ),
                ),
              ],
            ],
          ),
        );
      },
    );
  }


  Widget _buildCalendarList() {
    if (_calendarEvents.isEmpty) {
      return const Center(child: Text('Aucun conge planifie', style: TextStyle(color: AppColors.gray400)));
    }
    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: () async { setState(() => _loading = true); await _load(); },
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _calendarEvents.length,
        separatorBuilder: (_, __) => const SizedBox(height: 10),
        itemBuilder: (_, i) {
          final item = Map<String, dynamic>.from(_calendarEvents[i] as Map);
          return Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.gray200),
            ),
            child: Row(children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(color: AppColors.primaryBg, borderRadius: BorderRadius.circular(12)),
                child: const Icon(Icons.event_available_outlined, color: AppColors.primary, size: 18),
              ),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(item['employeeName'] ?? 'Employe', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                Text('${item['startDate'] ?? ''} -> ${item['endDate'] ?? ''} - ${item['daysRequested'] ?? 0}j',
                    style: const TextStyle(fontSize: 12, color: AppColors.gray400)),
              ])),
              StatusBadge(status: '${item['status'] ?? ''}'),
            ]),
          );
        },
      ),
    );
  }
  String _leaveTypeLabel(String t) => switch (t) {
    'ANNUAL_LEAVE'    => 'CongÃ© annuel',
    'SICK_LEAVE'      => 'CongÃ© maladie',
    'PERSONAL_LEAVE'  => 'CongÃ© personnel',
    'MATERNITY_LEAVE' => 'CongÃ© maternitÃ©',
    'PATERNITY_LEAVE' => 'CongÃ© paternitÃ©',
    'EMERGENCY_LEAVE' => "CongÃ© d'urgence",
    _ => t,
  };

  String _docTypeLabel(String t) => switch (t) {
    'WORK_CERTIFICATE'      => 'Attestation de travail',
    'SALARY_CERTIFICATE'    => 'Attestation de salaire',
    'EMPLOYMENT_CONTRACT'   => 'Contrat de travail',
    'LEAVE_BALANCE'         => 'Solde de congÃ©s',
    'TAX_CERTIFICATE'       => 'Certificat fiscal',
    'EXPERIENCE_CERTIFICATE'=> "Certificat d'expÃ©rience",
    _ => t,
  };
}

