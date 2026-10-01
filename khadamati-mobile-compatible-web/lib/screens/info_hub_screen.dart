import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../services/file_download.dart';

class InfoHubScreen extends StatefulWidget {
  const InfoHubScreen({super.key});

  @override
  State<InfoHubScreen> createState() => _InfoHubScreenState();
}

class _InfoHubScreenState extends State<InfoHubScreen> with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  bool _loading = true;
  List<dynamic> _announcements = [];
  List<dynamic> _documents = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _load();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final user = context.read<AuthProvider>().user!;
    setState(() => _loading = true);
    try {
      final results = await Future.wait([
        user.isEmployee ? ApiService.getMyAnnouncements() : ApiService.getManagementAnnouncements(),
        user.isEmployee ? ApiService.getMyDocuments() : ApiService.getManagementDocuments(),
      ]);
      setState(() {
        _announcements = results[0] is List ? results[0] as List : <dynamic>[];
        _documents = results[1] is List ? results[1] as List : <dynamic>[];
      });
    } catch (e) {
      _snack(e.toString(), danger: true);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _createAnnouncement() async {
    final titleCtrl = TextEditingController();
    final msgCtrl = TextEditingController();
    final ok = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(26))),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(left: 16, right: 16, top: 18, bottom: MediaQuery.of(ctx).viewInsets.bottom + 18),
        child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Nouvelle annonce', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
          const SizedBox(height: 14),
          TextField(controller: titleCtrl, decoration: const InputDecoration(labelText: 'Titre')),
          const SizedBox(height: 10),
          TextField(controller: msgCtrl, minLines: 3, maxLines: 5, decoration: const InputDecoration(labelText: 'Message')),
          const SizedBox(height: 16),
          SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Publier'))),
        ]),
      ),
    );
    if (ok != true || titleCtrl.text.trim().isEmpty || msgCtrl.text.trim().isEmpty) return;
    await ApiService.createManagementAnnouncement({
      'titre': titleCtrl.text.trim(),
      'message': msgCtrl.text.trim(),
      'estActive': true,
      'publieLe': DateTime.now().toIso8601String(),
    });
    _snack('Annonce publiée');
    await _load();
  }

  Future<void> _publishAnnouncement(String id) async {
    await ApiService.publishManagementAnnouncement(id);
    _snack('Annonce publiée');
    await _load();
  }

  Future<void> _deleteAnnouncement(String id) async {
    await ApiService.deleteManagementAnnouncement(id);
    _snack('Annonce supprimée');
    await _load();
  }

  Future<void> _publishDocument(String id) async {
    await ApiService.publishManagementDocument(id);
    _snack('Document publié');
    await _load();
  }

  Future<void> _deleteDocument(String id) async {
    await ApiService.deleteManagementDocument(id);
    _snack('Document supprimé');
    await _load();
  }

  Future<void> _downloadDocument(Map<String, dynamic> item, bool employeeMode) async {
    try {
      final id = '${item['id']}';
      final bytes = employeeMode
          ? await ApiService.downloadMyDocumentPdf(id)
          : await ApiService.downloadManagementDocumentPdf(id);
      final title = '${item['titre'] ?? 'document'}';
      final result = await savePdfBytes('$title.pdf', bytes);
      _snack(result);
    } catch (e) {
      _snack(e.toString(), danger: true);
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
    final user = context.watch<AuthProvider>().user!;
    return Scaffold(
      backgroundColor: AppColors.surface,
      floatingActionButton: user.isEmployee ? null : FloatingActionButton.extended(
        onPressed: _createAnnouncement,
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.campaign_outlined),
        label: const Text('Annonce'),
      ),
      body: Column(children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 10),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Informations', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.gray900)),
            const SizedBox(height: 4),
            Text(user.isEmployee ? 'Annonces et documents publiés' : 'Communication interne et bibliothèque RH',
                style: const TextStyle(color: AppColors.gray500)),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.gray200)),
              child: TabBar(
                controller: _tabController,
                indicator: BoxDecoration(color: AppColors.primaryBg, borderRadius: BorderRadius.circular(12)),
                labelColor: AppColors.primary,
                unselectedLabelColor: AppColors.gray500,
                tabs: [
                  Tab(text: 'Annonces (${_announcements.length})'),
                  Tab(text: 'Documents (${_documents.length})'),
                ],
              ),
            ),
          ]),
        ),
        Expanded(
          child: RefreshIndicator(
            color: AppColors.primary,
            onRefresh: _load,
            child: _loading
                ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                : TabBarView(
                    controller: _tabController,
                    children: [
                      _announcements.isEmpty
                          ? _empty('Aucune annonce publiée', Icons.campaign_outlined)
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: _announcements.length,
                              itemBuilder: (_, i) => _announcementCard(Map<String, dynamic>.from(_announcements[i] as Map), user.isEmployee),
                            ),
                      _documents.isEmpty
                          ? _empty('Aucun document publié', Icons.folder_open_outlined)
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: _documents.length,
                              itemBuilder: (_, i) => _documentCard(Map<String, dynamic>.from(_documents[i] as Map), user.isEmployee),
                            ),
                    ],
                  ),
          ),
        ),
      ]),
    );
  }

  Widget _announcementCard(Map<String, dynamic> item, bool employeeMode) => Container(
    margin: const EdgeInsets.only(bottom: 12),
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.gray200)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          decoration: BoxDecoration(color: AppColors.primaryBg, borderRadius: BorderRadius.circular(999)),
          child: const Text('INFORMATION', style: TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.w900)),
        ),
        const Spacer(),
        Icon(item['estPubliee'] == true ? Icons.verified_outlined : Icons.schedule_outlined, color: AppColors.primary),
      ]),
      const SizedBox(height: 12),
      Text(item['titre'] ?? 'Annonce', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.gray900)),
      const SizedBox(height: 6),
      Text(item['contenu'] ?? item['message'] ?? '', style: const TextStyle(color: AppColors.gray500, height: 1.35)),
      const SizedBox(height: 10),
      Text('${item['publiePar'] ?? 'Service RH'} · ${item['datePublication'] ?? ''}', style: const TextStyle(color: AppColors.gray400, fontSize: 11)),
      if (!employeeMode) ...[
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: OutlinedButton(onPressed: () => _deleteAnnouncement(item['id']), child: const Text('Supprimer'))),
          const SizedBox(width: 10),
          Expanded(child: ElevatedButton(onPressed: () => _publishAnnouncement(item['id']), child: const Text('Publier'))),
        ]),
      ],
    ]),
  );

  Widget _documentCard(Map<String, dynamic> item, bool employeeMode) => Container(
    margin: const EdgeInsets.only(bottom: 12),
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.gray200)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(color: AppColors.dangerBg, borderRadius: BorderRadius.circular(14)),
          child: const Icon(Icons.picture_as_pdf_outlined, color: AppColors.danger),
        ),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(item['titre'] ?? 'Document', style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.gray900)),
          Text(item['typeDocumentLibelle'] ?? 'Document', style: const TextStyle(color: AppColors.gray400, fontSize: 12)),
        ])),
        if (item['estPublie'] == true)
          const Icon(Icons.public, color: AppColors.primary, size: 18),
      ]),
      if ((item['description'] ?? '').toString().isNotEmpty) ...[
        const SizedBox(height: 10),
        Text(item['description'], style: const TextStyle(color: AppColors.gray500, height: 1.35)),
      ],
      const SizedBox(height: 10),
      Text('Réf. ${item['numeroReference'] ?? '—'} · ${item['dateCreation'] ?? ''}', style: const TextStyle(color: AppColors.gray400, fontSize: 11)),
      const SizedBox(height: 12),
      SizedBox(
        width: double.infinity,
        child: OutlinedButton.icon(
          onPressed: () => _downloadDocument(item, employeeMode),
          icon: const Icon(Icons.download_rounded),
          label: const Text('Télécharger PDF'),
        ),
      ),
      if (!employeeMode) ...[
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: OutlinedButton(onPressed: () => _deleteDocument(item['id']), child: const Text('Supprimer'))),
          const SizedBox(width: 10),
          Expanded(child: ElevatedButton(onPressed: () => _publishDocument(item['id']), child: const Text('Publier'))),
        ]),
      ],
    ]),
  );

  Widget _empty(String label, IconData icon) => ListView(
    physics: const AlwaysScrollableScrollPhysics(),
    padding: const EdgeInsets.all(16),
    children: [
      Container(
        padding: const EdgeInsets.symmetric(vertical: 48),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.gray200)),
        child: Column(children: [
          Icon(icon, size: 46, color: AppColors.gray400),
          const SizedBox(height: 10),
          Text(label, style: const TextStyle(color: AppColors.gray500, fontWeight: FontWeight.w800)),
        ]),
      ),
    ],
  );
}
