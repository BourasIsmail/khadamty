import 'package:flutter/material.dart';
import '../core/constants.dart';
import '../services/api_service.dart';

const _departments = [
  'Direction Générale', 'Ressources Humaines', 'Finance & Comptabilité',
  'Informatique', 'Marketing & Communication', 'Formation & Développement',
  'Action Sociale', 'Logistique', 'Juridique', 'Audit & Contrôle',
];

const _positions = [
  'Directeur', 'Chef de département', 'Chef de service', 'Responsable',
  'Ingénieur', 'Technicien', 'Assistant', 'Chargé de mission',
  'Conseiller', 'Agent administratif', 'Stagiaire',
];

const _cities = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
  'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'El Jadida',
];

class RegisterScreen extends StatefulWidget {
  final String role;
  const RegisterScreen({super.key, required this.role});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  int _step = 1;
  bool _loading = false;

  // Étape 1
  final _firstNameCtrl  = TextEditingController();
  final _lastNameCtrl   = TextEditingController();
  final _emailCtrl      = TextEditingController();
  final _passwordCtrl   = TextEditingController();
  final _confirmCtrl    = TextEditingController();
  final _cinCtrl        = TextEditingController();
  bool _showPass        = false;
  bool _showConfirm     = false;
  String _gender        = '';
  String _birthDate     = '';

  // Étape 2
  final _phoneCtrl    = TextEditingController();
  String _department  = '';
  String _position    = '';
  String _hireDate    = '';

  // Étape 3
  final _addressCtrl  = TextEditingController();
  String _city        = '';
  final _ecNameCtrl   = TextEditingController();
  final _ecPhoneCtrl  = TextEditingController();

  @override
  void dispose() {
    for (final c in [_firstNameCtrl, _lastNameCtrl, _emailCtrl, _passwordCtrl,
        _confirmCtrl, _cinCtrl, _phoneCtrl, _addressCtrl, _ecNameCtrl, _ecPhoneCtrl]) {
      c.dispose();
    }
    super.dispose();
  }

  String? _validateStep() {
    if (_step == 1) {
      if (_firstNameCtrl.text.trim().isEmpty) return 'Le prénom est requis';
      if (_lastNameCtrl.text.trim().isEmpty)  return 'Le nom est requis';
      if (!_emailCtrl.text.contains('@'))     return 'Email invalide';
      if (_passwordCtrl.text.length < 8)      return 'Mot de passe : 8 caractères minimum';
      if (_passwordCtrl.text != _confirmCtrl.text) return 'Les mots de passe ne correspondent pas';
      if (_cinCtrl.text.trim().isEmpty)       return 'Le CIN est requis';
    }
    if (_step == 2) {
      if (_phoneCtrl.text.trim().isEmpty) return 'Le téléphone est requis';
      if (_department.isEmpty)            return 'Le département est requis';
      if (_position.isEmpty)              return 'Le poste est requis';
      if (_hireDate.isEmpty)              return "La date d'embauche est requise";
    }
    if (_step == 3) {
      if (_city.isEmpty) return 'La ville est requise';
    }
    return null;
  }

  void _next() {
    final err = _validateStep();
    if (err != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(err), backgroundColor: AppColors.danger));
      return;
    }
    if (_step < 3) {
      setState(() => _step++);
    } else {
      _submit();
    }
  }

  Future<void> _submit() async {
    setState(() => _loading = true);
    try {
      await ApiService.register({
        'firstName':             _firstNameCtrl.text.trim(),
        'lastName':              _lastNameCtrl.text.trim(),
        'email':                 _emailCtrl.text.trim(),
        'password':              _passwordCtrl.text,
        'phone':                 _phoneCtrl.text.trim(),
        'department':            _department,
        'position':              _position,
        'hireDate':              _hireDate,
        'address':               _addressCtrl.text.trim(),
        'city':                  _city,
        'cin':                   _cinCtrl.text.trim(),
        'birthDate':             _birthDate,
        'gender':                _gender,
        'emergencyContactName':  _ecNameCtrl.text.trim(),
        'emergencyContactPhone': _ecPhoneCtrl.text.trim(),
      });
      if (mounted) setState(() => _step = 4);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceAll('Exception: ', '')),
              backgroundColor: AppColors.danger));
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        title: Text(_step < 4 ? 'Inscription — Étape $_step/3' : 'Inscription'),
        leading: _step > 1 && _step < 4
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios),
                onPressed: () => setState(() => _step--))
            : null,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Progress bar
            if (_step < 4) ...[
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: _step / 3,
                  backgroundColor: AppColors.gray100,
                  valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                  minHeight: 6,
                ),
              ),
              const SizedBox(height: 20),
            ],

            // ── Étape 1 : Identité ──────────────────────────────────────
            if (_step == 1) ...[
              _stepTitle('Informations personnelles', 'Vos données d\'identité'),
              const SizedBox(height: 20),
              Row(children: [
                Expanded(child: _field('Prénom *', _firstNameCtrl, hint: 'Mohamed')),
                const SizedBox(width: 12),
                Expanded(child: _field('Nom *', _lastNameCtrl, hint: 'Alami')),
              ]),
              const SizedBox(height: 14),
              _field('Email *', _emailCtrl, hint: 'm.alami@entraide.ma', type: TextInputType.emailAddress),
              const SizedBox(height: 14),
              _field('CIN *', _cinCtrl, hint: 'AB123456'),
              const SizedBox(height: 14),
              Row(children: [
                Expanded(child: _dropdown('Genre', _gender, ['', 'Homme', 'Femme'],
                    (v) => setState(() => _gender = v ?? ''))),
                const SizedBox(width: 12),
                Expanded(child: _datePicker('Date naissance', _birthDate,
                    (d) => setState(() => _birthDate = d))),
              ]),
              const SizedBox(height: 14),
              _passwordField('Mot de passe *', _passwordCtrl, _showPass,
                  () => setState(() => _showPass = !_showPass)),
              const SizedBox(height: 14),
              _passwordField('Confirmer *', _confirmCtrl, _showConfirm,
                  () => setState(() => _showConfirm = !_showConfirm)),
            ],

            // ── Étape 2 : Profil professionnel ──────────────────────────
            if (_step == 2) ...[
              _stepTitle('Profil professionnel', 'Vos informations au sein de l\'Entraide Nationale'),
              const SizedBox(height: 20),
              _field('Téléphone *', _phoneCtrl, hint: '+212 6XX XXX XXX', type: TextInputType.phone),
              const SizedBox(height: 14),
              _dropdown('Département *', _department, ['', ..._departments],
                  (v) => setState(() => _department = v ?? '')),
              const SizedBox(height: 14),
              _dropdown('Poste *', _position, ['', ..._positions],
                  (v) => setState(() => _position = v ?? '')),
              const SizedBox(height: 14),
              _datePicker("Date d'embauche *", _hireDate,
                  (d) => setState(() => _hireDate = d)),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.primaryBg,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  'Votre compte sera créé avec le rôle Employé.',
                  style: const TextStyle(fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.w500),
                ),
              ),
            ],

            // ── Étape 3 : Coordonnées ────────────────────────────────────
            if (_step == 3) ...[
              _stepTitle('Coordonnées', 'Adresse et contact d\'urgence'),
              const SizedBox(height: 20),
              _field('Adresse', _addressCtrl, hint: 'N° rue, quartier...'),
              const SizedBox(height: 14),
              _dropdown('Ville *', _city, ['', ..._cities],
                  (v) => setState(() => _city = v ?? '')),
              const SizedBox(height: 20),
              const Text('Contact d\'urgence',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.gray700)),
              const SizedBox(height: 12),
              _field('Nom du contact', _ecNameCtrl, hint: 'Nom complet'),
              const SizedBox(height: 14),
              _field('Téléphone du contact', _ecPhoneCtrl, hint: '+212 6XX XXX XXX', type: TextInputType.phone),
              const SizedBox(height: 20),
              // Récapitulatif
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.gray50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.gray200),
                ),
                child: Column(children: [
                  _recapRow('Nom', '${_firstNameCtrl.text} ${_lastNameCtrl.text}'),
                  _recapRow('Email', _emailCtrl.text),
                  _recapRow('Département', _department),
                  _recapRow('Poste', _position),
                  _recapRow('Téléphone', _phoneCtrl.text),
                ]),
              ),
            ],

            // ── Étape 4 : Succès ─────────────────────────────────────────
            if (_step == 4) ...[
              const SizedBox(height: 40),
              Center(child: Container(
                width: 80, height: 80,
                decoration: BoxDecoration(color: AppColors.primaryBg, shape: BoxShape.circle),
                child: const Icon(Icons.check_circle_outline, color: AppColors.primary, size: 44),
              )),
              const SizedBox(height: 20),
              Center(child: Text('Inscription réussie !',
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.gray900))),
              const SizedBox(height: 8),
              Center(child: Text('Bienvenue ${_firstNameCtrl.text} ! Vous pouvez maintenant vous connecter.',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 13, color: AppColors.gray400))),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Se connecter'),
                ),
              ),
            ],

            // ── Bouton navigation ─────────────────────────────────────────
            if (_step < 4) ...[
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _loading ? null : _next,
                  child: _loading
                      ? const SizedBox(width: 20, height: 20,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : Text(_step == 3 ? 'Créer mon compte' : 'Continuer'),
                ),
              ),
              const SizedBox(height: 12),
              Center(child: TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Déjà un compte ? Se connecter',
                  style: TextStyle(color: AppColors.primary)),
              )),
            ],
          ],
        ),
      ),
    );
  }

  // ── Helpers UI ────────────────────────────────────────────────────────────

  Widget _stepTitle(String title, String subtitle) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.gray900)),
      const SizedBox(height: 4),
      Text(subtitle, style: const TextStyle(fontSize: 12, color: AppColors.gray400)),
    ],
  );

  Widget _field(String label, TextEditingController ctrl, {
    String hint = '', TextInputType type = TextInputType.text,
  }) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.gray700)),
    const SizedBox(height: 6),
    TextField(
      controller: ctrl,
      keyboardType: type,
      decoration: InputDecoration(hintText: hint),
    ),
  ]);

  Widget _passwordField(String label, TextEditingController ctrl, bool show, VoidCallback toggle) =>
    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.gray700)),
      const SizedBox(height: 6),
      TextField(
        controller: ctrl,
        obscureText: !show,
        decoration: InputDecoration(
          hintText: '••••••••',
          suffixIcon: IconButton(
            icon: Icon(show ? Icons.visibility_off_outlined : Icons.visibility_outlined,
              color: AppColors.gray400),
            onPressed: toggle,
          ),
        ),
      ),
    ]);

  Widget _dropdown(String label, String value, List<String> items, ValueChanged<String?> onChanged) =>
    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.gray700)),
      const SizedBox(height: 6),
      DropdownButtonFormField<String>(
        value: value.isEmpty ? '' : value,
        decoration: const InputDecoration(),
        items: items.map((i) => DropdownMenuItem(value: i, child: Text(i.isEmpty ? 'Sélectionner' : i))).toList(),
        onChanged: onChanged,
      ),
    ]);

  Widget _datePicker(String label, String value, ValueChanged<String> onPick) =>
    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.gray700)),
      const SizedBox(height: 6),
      InkWell(
        onTap: () async {
          final d = await showDatePicker(
            context: context,
            initialDate: DateTime.now(),
            firstDate: DateTime(1950),
            lastDate: DateTime.now(),
            builder: (ctx, child) => Theme(
              data: Theme.of(ctx).copyWith(
                colorScheme: const ColorScheme.light(primary: AppColors.primary)),
              child: child!,
            ),
          );
          if (d != null) onPick('${d.year}-${d.month.toString().padLeft(2,'0')}-${d.day.toString().padLeft(2,'0')}');
        },
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          decoration: BoxDecoration(
            color: AppColors.gray50,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.gray200, width: 2),
          ),
          child: Row(children: [
            const Icon(Icons.calendar_today_outlined, size: 16, color: AppColors.gray400),
            const SizedBox(width: 8),
            Text(value.isEmpty ? 'Choisir une date' : value,
              style: TextStyle(color: value.isEmpty ? AppColors.gray400 : AppColors.gray900, fontSize: 13)),
          ]),
        ),
      ),
    ]);

  Widget _recapRow(String label, String value) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 4),
    child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Text(label, style: const TextStyle(fontSize: 12, color: AppColors.gray400)),
      Text(value.isEmpty ? '—' : value,
        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.gray700)),
    ]),
  );
}
