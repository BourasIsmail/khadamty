import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../core/constants.dart';
import '../../services/api_service.dart';
import '../../services/file_download.dart';

class PaySlipsScreen extends StatefulWidget {
  const PaySlipsScreen({super.key});

  @override
  State<PaySlipsScreen> createState() => _PaySlipsScreenState();
}

class _PaySlipsScreenState extends State<PaySlipsScreen> {
  bool _loading = true;
  bool _showSalary = false;
  List<dynamic> _paySlips = [];
  Map<String, dynamic>? _selected;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final data = await ApiService.getMyPaySlips(annee: DateTime.now().year);
      final list = data is List ? data : <dynamic>[];
      setState(() {
        _paySlips = list;
        _selected = list.isNotEmpty ? Map<String, dynamic>.from(list.first as Map) : null;
      });
    } catch (e) {
      _snack(e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _snack(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message.replaceAll('Exception: ', '')), backgroundColor: AppColors.danger),
    );
  }

  Future<void> _downloadPdf(Map<String, dynamic> slip) async {
    try {
      final id = '${slip['id']}';
      final bytes = await ApiService.downloadMyPaySlipPdf(id);
      final period = '${slip['periodeLabel'] ?? 'bulletin'}';
      final result = await savePdfBytes('bulletin_paie_$period.pdf', bytes);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result), backgroundColor: AppColors.primary),
      );
    } catch (e) {
      _snack(e.toString());
    }
  }

  String _money(dynamic value) {
    final number = value is num ? value.toDouble() : double.tryParse('$value') ?? 0;
    return NumberFormat('#,##0.00', 'fr_MA').format(number);
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Paie', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.gray900)),
          const SizedBox(height: 4),
          const Text('Bulletins, salaire net et détails de rémunération', style: TextStyle(color: AppColors.gray500)),
          const SizedBox(height: 16),
          if (_loading)
            const Center(child: Padding(
              padding: EdgeInsets.all(32),
              child: CircularProgressIndicator(color: AppColors.primary),
            ))
          else if (_paySlips.isEmpty)
            _empty('Aucun bulletin disponible', Icons.payments_outlined)
          else ...[
            _salaryHero(),
            const SizedBox(height: 16),
            SizedBox(
              height: 74,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _paySlips.length,
                separatorBuilder: (_, __) => const SizedBox(width: 10),
                itemBuilder: (context, index) {
                  final item = Map<String, dynamic>.from(_paySlips[index] as Map);
                  final active = _selected?['id'] == item['id'];
                  return InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: () => setState(() => _selected = item),
                    child: Container(
                      width: 170,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: active ? AppColors.primaryBg : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: active ? AppColors.primary : AppColors.gray200),
                      ),
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(item['periodeLabel'] ?? 'Période', style: const TextStyle(fontWeight: FontWeight.w800)),
                        const Spacer(),
                        Text('${_money(item['netAPayer'])} DH', style: const TextStyle(color: AppColors.gray500, fontSize: 12)),
                      ]),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),
            if (_selected != null) _paySlipDetails(_selected!),
          ],
        ]),
      ),
    );
  }

  Widget _salaryHero() {
    final net = _selected?['netAPayer'];
    final employee = _selected?['employeeName'] ?? '';
    final department = _selected?['department'] ?? '';
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [AppColors.primaryDark, AppColors.primaryLight]),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.22), blurRadius: 16, offset: const Offset(0, 8))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          const Expanded(child: Text('Salaire mensuel net', style: TextStyle(color: Colors.white70, fontWeight: FontWeight.w700))),
          IconButton(
            onPressed: () => setState(() => _showSalary = !_showSalary),
            icon: Icon(_showSalary ? Icons.visibility_off_outlined : Icons.visibility_outlined, color: Colors.white),
          ),
        ]),
        const SizedBox(height: 8),
        Text(_showSalary ? '${_money(net)} DH' : '•••••• DH',
            style: const TextStyle(fontSize: 34, fontWeight: FontWeight.w900, color: Colors.white)),
        const SizedBox(height: 8),
        Text('$employee · $department', style: const TextStyle(color: Colors.white70)),
      ]),
    );
  }

  Widget _paySlipDetails(Map<String, dynamic> slip) {
    final remuneration = Map<String, dynamic>.from((slip['remuneration'] as Map?) ?? {});
    final deductions = Map<String, dynamic>.from((slip['deductions'] as Map?) ?? {});
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      _section('Éléments de rémunération', Icons.trending_up_outlined, [
        _row('Salaire de base', remuneration['salaireBase']),
        _row('Allocation familiale', remuneration['allocFamiliale']),
        _row('Rappel', remuneration['rappel']),
        _row('Total gains', remuneration['totalGains'], strong: true),
      ]),
      const SizedBox(height: 12),
      _section('Retenues', Icons.remove_circle_outline, [
        _row('Mutuelle', deductions['mutuelle'], danger: true),
        _row('Total retenues', deductions['totalDeductions'], strong: true, danger: true),
      ]),
      const SizedBox(height: 12),
      _section('Document', Icons.picture_as_pdf_outlined, [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () => _downloadPdf(slip),
            icon: const Icon(Icons.download_rounded),
            label: const Text('Télécharger le bulletin PDF'),
          ),
        ),
      ]),
    ]);
  }

  Widget _section(String title, IconData icon, List<Widget> children) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: AppColors.gray200)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        Icon(icon, color: AppColors.primary, size: 18),
        const SizedBox(width: 8),
        Text(title, style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.gray900)),
      ]),
      const SizedBox(height: 12),
      ...children,
    ]),
  );

  Widget _row(String label, dynamic value, {bool strong = false, bool danger = false}) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 5),
    child: Row(children: [
      Expanded(child: Text(label, style: TextStyle(color: strong ? AppColors.gray900 : AppColors.gray500, fontWeight: strong ? FontWeight.w800 : FontWeight.w500))),
      Text('${_money(value)} DH', style: TextStyle(color: danger ? AppColors.danger : AppColors.gray900, fontWeight: strong ? FontWeight.w900 : FontWeight.w700)),
    ]),
  );

  Widget _empty(String text, IconData icon) => Container(
    width: double.infinity,
    padding: const EdgeInsets.symmetric(vertical: 42),
    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: AppColors.gray200)),
    child: Column(children: [
      Icon(icon, size: 44, color: AppColors.gray400),
      const SizedBox(height: 10),
      Text(text, style: const TextStyle(color: AppColors.gray500, fontWeight: FontWeight.w700)),
    ]),
  );
}
