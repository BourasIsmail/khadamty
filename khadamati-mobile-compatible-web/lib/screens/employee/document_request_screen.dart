import 'package:flutter/material.dart';
import '../../core/constants.dart';
import '../../services/api_service.dart';
import '../../widgets/khadamati_logo.dart';

class DocumentRequestScreen extends StatefulWidget {
  const DocumentRequestScreen({super.key});
  @override
  State<DocumentRequestScreen> createState() => _DocumentRequestScreenState();
}

class _DocumentRequestScreenState extends State<DocumentRequestScreen> {
  List<dynamic> _requests = [];
  bool _loading = true;
  bool _showForm = false;
  String _docType = 'WORK_CERTIFICATE';
  final _purposeCtrl = TextEditingController();
  bool _submitting = false;

  final _types = [
    ('WORK_CERTIFICATE',       'Attestation de travail'),
    ('SALARY_CERTIFICATE',     'Attestation de salaire'),
    ('EMPLOYMENT_CONTRACT',    'Contrat de travail'),
    ('LEAVE_BALANCE',          'Solde de congés'),
    ('TAX_CERTIFICATE',        'Certificat fiscal'),
    ('EXPERIENCE_CERTIFICATE', "Certificat d'expérience"),
  ];

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    try {
      final data = await ApiService.getMyDocumentRequests();
      setState(() => _requests = (data is List) ? data : []);
    } catch (e) { debugPrint('$e'); }
    finally { setState(() => _loading = false); }
  }

  Future<void> _submit() async {
    setState(() => _submitting = true);
    try {
      await ApiService.requestDocument({'documentType': _docType, 'purpose': _purposeCtrl.text});
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Demande envoyée ✓'), backgroundColor: AppColors.primary));
      setState(() { _showForm = false; _purposeCtrl.clear(); });
      await _load();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$e'), backgroundColor: AppColors.danger));
    } finally { setState(() => _submitting = false); }
  }

  String _docTypeLabel(String t) => _types.firstWhere((e) => e.$1 == t, orElse: () => (t, t)).$2;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: _loading
        ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
        : SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Bouton nouvelle demande
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => setState(() => _showForm = !_showForm),
                    icon: Icon(_showForm ? Icons.close : Icons.add),
                    label: Text(_showForm ? 'Annuler' : 'Nouvelle demande'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _showForm ? AppColors.gray400 : AppColors.primary,
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Formulaire
                if (_showForm) ...[
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.gray200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Type de document', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8, runSpacing: 8,
                          children: _types.map((t) => ChoiceChip(
                            label: Text(t.$2, style: const TextStyle(fontSize: 12)),
                            selected: _docType == t.$1,
                            onSelected: (_) => setState(() => _docType = t.$1),
                            selectedColor: AppColors.primaryBg,
                            labelStyle: TextStyle(
                              color: _docType == t.$1 ? AppColors.primary : AppColors.gray500,
                              fontWeight: FontWeight.w600,
                            ),
                          )).toList(),
                        ),
                        const SizedBox(height: 16),
                        const Text('Motif / Destination', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _purposeCtrl,
                          maxLines: 2,
                          decoration: const InputDecoration(hintText: 'Ex: Pour une demande de visa...'),
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _submitting ? null : _submit,
                            child: _submitting
                              ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                              : const Text('Envoyer'),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // Liste
                const Text('Mes demandes',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.gray900)),
                const SizedBox(height: 12),
                if (_requests.isEmpty)
                  const Center(child: Padding(
                    padding: EdgeInsets.all(32),
                    child: Text('Aucune demande', style: TextStyle(color: AppColors.gray400)),
                  ))
                else
                  ..._requests.map((r) => Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.gray200),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 40, height: 40,
                            decoration: BoxDecoration(color: AppColors.dangerBg, borderRadius: BorderRadius.circular(10)),
                            child: const Icon(Icons.description_outlined, color: AppColors.danger, size: 18),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(_docTypeLabel(r['documentType'] ?? ''),
                                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                                if (r['purpose'] != null && r['purpose'].isNotEmpty)
                                  Text(r['purpose'], style: const TextStyle(fontSize: 11, color: AppColors.gray400)),
                              ],
                            ),
                          ),
                          StatusBadge(status: r['status'] ?? ''),
                        ],
                      ),
                    ),
                  )),
              ],
            ),
          ),
    );
  }
}
