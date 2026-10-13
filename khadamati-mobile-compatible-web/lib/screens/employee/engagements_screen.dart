import 'package:flutter/material.dart';
import '../../core/constants.dart';
import '../../services/api_service.dart';
import '../../widgets/employee_widgets.dart';

/// Mes engagements et crédits : crédits enregistrés par la RH et prêts/avances prélevés sur le bulletin.
class EngagementsScreen extends StatefulWidget {
  const EngagementsScreen({super.key});

  @override
  State<EngagementsScreen> createState() => _EngagementsScreenState();
}

class _EngagementsScreenState extends State<EngagementsScreen> {
  Map<String, dynamic>? _data;
  bool _loading = true;
  bool _hidden = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final data = await ApiService.getMyEngagements();
      if (mounted) setState(() => _data = data);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final list = (_data?['engagements'] as List?) ?? const [];
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        title: const Text('Mes engagements'),
        actions: [
          IconButton(
            tooltip: _hidden ? 'Afficher les montants' : 'Masquer les montants',
            icon: Icon(_hidden ? Icons.visibility_outlined : Icons.visibility_off_outlined),
            onPressed: () => setState(() => _hidden = !_hidden),
          ),
        ],
      ),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: _load,
        child: ListView(
          padding: const EdgeInsets.all(16),
          physics: const AlwaysScrollableScrollPhysics(),
          children: [
            if (_loading) const Padding(padding: EdgeInsets.only(top: 60), child: Center(child: CircularProgressIndicator(color: AppColors.primary)))
            else if (_error != null) Text(_error!, style: const TextStyle(color: AppColors.danger))
            else ...[
              if (list.isNotEmpty)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(color: AppColors.dangerBg, borderRadius: BorderRadius.circular(16)),
                  child: Row(children: [
                    Expanded(child: Text('${_data?['nombre']} engagement(s) en cours', style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.gray700))),
                    Text(_hidden ? '••••' : '${formatMoney(_data?['totalMensualites'])} DH/mois',
                        style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.danger)),
                  ]),
                ),
              const SizedBox(height: 12),
              InfoCard(
                title: 'Crédits, prêts et avances',
                icon: Icons.credit_card_outlined,
                child: EngagementList(engagements: list, hidden: _hidden),
              ),
              const SizedBox(height: 12),
              const Text(
                'Ces informations proviennent des crédits enregistrés par le service RH et de votre dernier bulletin de paie. En cas d’écart, contactez le service RH.',
                style: TextStyle(fontSize: 12, color: AppColors.gray400),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
