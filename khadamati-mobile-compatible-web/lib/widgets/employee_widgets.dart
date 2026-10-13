import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../core/constants.dart';

String formatMoney(dynamic value) {
  final number = value is num ? value.toDouble() : double.tryParse('$value') ?? 0;
  return NumberFormat('#,##0.00', 'fr_MA').format(number);
}

String formatDate(dynamic value) {
  final d = DateTime.tryParse('$value');
  return d == null ? '—' : DateFormat('dd/MM/yyyy').format(d);
}

/// « 2 ans et 3 mois » depuis la date d'embauche.
String seniority(dynamic hireDate) {
  final start = DateTime.tryParse('$hireDate');
  if (start == null) return '—';
  final now = DateTime.now();
  var months = (now.year - start.year) * 12 + (now.month - start.month);
  if (now.day < start.day) months--;
  if (months < 1) return 'Moins d’un mois';
  final years = months ~/ 12;
  final rest = months % 12;
  return [
    if (years > 0) '$years an${years > 1 ? 's' : ''}',
    if (rest > 0) '$rest mois',
  ].join(' et ');
}

class InfoCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Widget child;
  final Widget? trailing;
  const InfoCard({super.key, required this.title, required this.icon, required this.child, this.trailing});

  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: AppColors.gray200)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        Icon(icon, color: AppColors.primary, size: 18),
        const SizedBox(width: 8),
        Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.gray900))),
        if (trailing != null) trailing!,
      ]),
      const SizedBox(height: 12),
      child,
    ]),
  );
}

Widget _amountRow(String label, dynamic value, {bool strong = false, bool danger = false, bool hidden = false}) => Padding(
  padding: const EdgeInsets.symmetric(vertical: 5),
  child: Row(children: [
    Expanded(child: Text(label, style: TextStyle(color: strong ? AppColors.gray900 : AppColors.gray500, fontWeight: strong ? FontWeight.w800 : FontWeight.w500))),
    Text(hidden ? '••••' : '${danger ? '-' : ''}${formatMoney(value)} DH',
        style: TextStyle(color: danger ? AppColors.danger : AppColors.gray900, fontWeight: strong ? FontWeight.w900 : FontWeight.w700)),
  ]),
);

/// Détail d'un bulletin : rémunération, détail des retenues (une ligne par retenue) et net à payer.
class PaySlipSection extends StatelessWidget {
  final Map<String, dynamic> slip;
  final bool hidden;
  const PaySlipSection({super.key, required this.slip, this.hidden = false});

  @override
  Widget build(BuildContext context) {
    final r = Map<String, dynamic>.from((slip['remuneration'] as Map?) ?? {});
    final d = Map<String, dynamic>.from((slip['deductions'] as Map?) ?? {});
    final lines = (d['lignes'] as List?) ?? const [];
    const gains = {
      'indemniteLogement': 'Indemnité de logement',
      'indemniteTransport': 'Indemnité de transport',
      'indemniteFonction': 'Indemnité de fonction',
      'primes': 'Primes',
      'allocFamiliale': 'Allocation familiale',
      'rappel': 'Rappel',
    };
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const Text('Rémunération', style: TextStyle(fontWeight: FontWeight.w800, color: AppColors.gray700)),
      _amountRow('Salaire de base', r['salaireBase'], hidden: hidden),
      for (final e in gains.entries)
        if (r[e.key] is num && (r[e.key] as num) > 0) _amountRow(e.value, r[e.key], hidden: hidden),
      _amountRow('Total gains', r['totalGains'], strong: true, hidden: hidden),
      const Divider(height: 24),
      const Text('Détail des retenues', style: TextStyle(fontWeight: FontWeight.w800, color: AppColors.gray700)),
      if (lines.isEmpty)
        const Padding(padding: EdgeInsets.symmetric(vertical: 6), child: Text('Aucune retenue ce mois-ci', style: TextStyle(color: AppColors.gray400))),
      for (final raw in lines) ...[
        _amountRow('${(raw as Map)['type'] ?? ''}', raw['montant'], danger: true, hidden: hidden),
        if (!hidden && _loanDetails(Map<String, dynamic>.from(raw)).isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Text(_loanDetails(Map<String, dynamic>.from(raw)), style: const TextStyle(fontSize: 12, color: AppColors.gray500)),
          ),
      ],
      _amountRow('Total retenues', d['totalDeductions'], strong: true, danger: true, hidden: hidden),
      const Divider(height: 24),
      _amountRow('Net à payer', slip['netAPayer'], strong: true, hidden: hidden),
    ]);
  }

  static String _loanDetails(Map<String, dynamic> l) => [
    if ((l['numeroDossier'] ?? '').toString().isNotEmpty) 'Dossier ${l['numeroDossier']}',
    if (l['montantTotal'] != null) 'Total ${formatMoney(l['montantTotal'])} DH',
    if (l['montantRestant'] != null) 'Restant ${formatMoney(l['montantRestant'])} DH',
    if (l['moisRestants'] != null) '${l['moisRestants']} mois restants',
  ].join(' · ');
}

/// Crédits, prêts et avances en cours, avec avancement du remboursement.
class EngagementList extends StatelessWidget {
  final List<dynamic> engagements;
  final bool hidden;
  const EngagementList({super.key, required this.engagements, this.hidden = false});

  @override
  Widget build(BuildContext context) {
    if (engagements.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 8),
        child: Text('Aucun crédit ni engagement en cours.', style: TextStyle(color: AppColors.gray400)),
      );
    }
    return Column(children: [
      for (final raw in engagements) _tile(Map<String, dynamic>.from(raw as Map)),
    ]);
  }

  Widget _tile(Map<String, dynamic> e) {
    final progress = e['progression'] is num ? (e['progression'] as num).toDouble() / 100 : null;
    final sub = [
      if ((e['numeroDossier'] ?? '').toString().isNotEmpty) 'Dossier ${e['numeroDossier']}',
      if (e['moisRestants'] != null) '${e['moisRestants']} mois restants',
    ].join(' · ');
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: AppColors.gray50, borderRadius: BorderRadius.circular(14)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Expanded(child: Text('${e['libelle'] ?? ''}', style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.gray900))),
          Text(hidden ? '••••' : '-${formatMoney(e['mensualite'])} DH/mois',
              style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.danger)),
        ]),
        if (sub.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 2), child: Text(sub, style: const TextStyle(fontSize: 12, color: AppColors.gray500))),
        if (e['montantTotal'] != null || e['montantRestant'] != null)
          Padding(
            padding: const EdgeInsets.only(top: 6),
            child: Text(
              hidden ? 'Montants masqués'
                     : 'Total ${e['montantTotal'] != null ? formatMoney(e['montantTotal']) : '—'} DH · Restant ${e['montantRestant'] != null ? formatMoney(e['montantRestant']) : '—'} DH',
              style: const TextStyle(fontSize: 12, color: AppColors.gray700)),
          ),
        if (progress != null) ...[
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress.clamp(0.0, 1.0), minHeight: 6,
              backgroundColor: AppColors.gray200, valueColor: const AlwaysStoppedAnimation(AppColors.primaryLight)),
          ),
          Padding(padding: const EdgeInsets.only(top: 3), child: Text('${e['progression']} % remboursé', style: const TextStyle(fontSize: 11, color: AppColors.gray400))),
        ],
      ]),
    );
  }
}

/// Données personnelles et professionnelles.
class PersonalInfoList extends StatelessWidget {
  final Map<String, dynamic> profile;
  final Map<String, dynamic>? slip;
  const PersonalInfoList({super.key, required this.profile, this.slip});

  @override
  Widget build(BuildContext context) {
    final fields = <MapEntry<String, String>>[
      MapEntry('Nom complet', '${profile['firstName'] ?? ''} ${profile['lastName'] ?? ''}'.trim()),
      MapEntry('Matricule', '${profile['employeeId'] ?? ''}'),
      MapEntry('Email', '${profile['email'] ?? ''}'),
      MapEntry('Téléphone', '${profile['phone'] ?? ''}'),
      MapEntry('Adresse', '${profile['address'] ?? ''}'),
      MapEntry('Poste', '${profile['position'] ?? ''}'),
      MapEntry('Structure', '${profile['structurePath'] ?? profile['structureLibelle'] ?? profile['department'] ?? ''}'),
      MapEntry('Grade', '${slip?['grade'] ?? ''}'),
      MapEntry('Échelon', '${slip?['echelon'] ?? ''}'),
      MapEntry('Date d’embauche', formatDate(profile['hireDate'])),
      MapEntry('Ancienneté', seniority(profile['hireDate'])),
      MapEntry('Contact d’urgence', [profile['emergencyContact'], profile['emergencyPhone']].where((v) => v != null && '$v'.isNotEmpty).join(' · ')),
    ];
    return Column(children: [
      for (final f in fields)
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 5),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            SizedBox(width: 120, child: Text(f.key, style: const TextStyle(color: AppColors.gray500, fontWeight: FontWeight.w500))),
            Expanded(child: Text(f.value.isEmpty || f.value == 'null' ? '—' : f.value,
                style: const TextStyle(color: AppColors.gray900, fontWeight: FontWeight.w700))),
          ]),
        ),
    ]);
  }
}
