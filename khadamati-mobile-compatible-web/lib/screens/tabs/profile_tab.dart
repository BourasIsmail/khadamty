import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../../widgets/khadamati_logo.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});
  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  late TextEditingController _firstNameCtrl;
  late TextEditingController _lastNameCtrl;
  final _currentPwdCtrl = TextEditingController();
  final _newPwdCtrl     = TextEditingController();
  final _confirmPwdCtrl = TextEditingController();

  bool _savingProfile = false;
  bool _savingPwd     = false;
  bool _showCurrent   = false;
  bool _showNew       = false;
  bool _showConfirm   = false;

  @override
  void initState() {
    super.initState();
    final user = context.read<AuthProvider>().user!;
    _firstNameCtrl = TextEditingController(text: user.firstName);
    _lastNameCtrl  = TextEditingController(text: user.lastName);
  }

  @override
  void dispose() {
    _firstNameCtrl.dispose();
    _lastNameCtrl.dispose();
    _currentPwdCtrl.dispose();
    _newPwdCtrl.dispose();
    _confirmPwdCtrl.dispose();
    super.dispose();
  }

  Future<void> _saveProfile() async {
    setState(() => _savingProfile = true);
    try {
      await ApiService.updateProfile(
        _firstNameCtrl.text.trim(),
        _lastNameCtrl.text.trim(),
      );
      if (mounted) {
        context.read<AuthProvider>().updateUser(
          _firstNameCtrl.text.trim(),
          _lastNameCtrl.text.trim(),
        );
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profil mis à jour ✓'),
              backgroundColor: AppColors.primary));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceAll('Exception: ', '')),
              backgroundColor: AppColors.danger));
      }
    } finally {
      if (mounted) setState(() => _savingProfile = false);
    }
  }

  Future<void> _changePassword() async {
    if (_newPwdCtrl.text != _confirmPwdCtrl.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Les mots de passe ne correspondent pas'),
            backgroundColor: AppColors.danger));
      return;
    }
    if (_newPwdCtrl.text.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Minimum 6 caractères'),
            backgroundColor: AppColors.danger));
      return;
    }
    setState(() => _savingPwd = true);
    try {
      await ApiService.changePassword(_currentPwdCtrl.text, _newPwdCtrl.text);
      if (mounted) {
        _currentPwdCtrl.clear();
        _newPwdCtrl.clear();
        _confirmPwdCtrl.clear();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Mot de passe modifié ✓'),
              backgroundColor: AppColors.primary));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceAll('Exception: ', '')),
              backgroundColor: AppColors.danger));
      }
    } finally {
      if (mounted) setState(() => _savingPwd = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user!;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          const SizedBox(height: 16),

          // Avatar
          CircleAvatar(
            radius: 44,
            backgroundColor: AppColors.primaryBg,
            child: Text(user.initials,
              style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.primary)),
          ),
          const SizedBox(height: 12),
          Text(user.fullName,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.gray900)),
          const SizedBox(height: 6),
          RoleBadge(role: user.role),
          const SizedBox(height: 4),
          Text(user.email, style: const TextStyle(fontSize: 13, color: AppColors.gray400)),
          const SizedBox(height: 28),

          // ── Modifier le profil ──────────────────────────────────────
          _card(
            title: 'Modifier le profil',
            icon: Icons.person_outline,
            child: Column(children: [
              Row(children: [
                Expanded(child: _field('Prénom', _firstNameCtrl)),
                const SizedBox(width: 12),
                Expanded(child: _field('Nom', _lastNameCtrl)),
              ]),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _savingProfile ? null : _saveProfile,
                  child: _savingProfile
                      ? const SizedBox(width: 18, height: 18,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('Enregistrer'),
                ),
              ),
            ]),
          ),
          const SizedBox(height: 16),

          // ── Changer le mot de passe ─────────────────────────────────
          _card(
            title: 'Changer le mot de passe',
            icon: Icons.lock_outline,
            child: Column(children: [
              _pwdField('Mot de passe actuel', _currentPwdCtrl, _showCurrent,
                  () => setState(() => _showCurrent = !_showCurrent)),
              const SizedBox(height: 12),
              _pwdField('Nouveau mot de passe', _newPwdCtrl, _showNew,
                  () => setState(() => _showNew = !_showNew)),
              const SizedBox(height: 12),
              _pwdField('Confirmer', _confirmPwdCtrl, _showConfirm,
                  () => setState(() => _showConfirm = !_showConfirm)),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _savingPwd ? null : _changePassword,
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.gray900),
                  child: _savingPwd
                      ? const SizedBox(width: 18, height: 18,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('Modifier le mot de passe'),
                ),
              ),
            ]),
          ),
          const SizedBox(height: 16),

          // ── Déconnexion ─────────────────────────────────────────────
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () async {
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Déconnexion'),
                    content: const Text('Voulez-vous vous déconnecter ?'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Annuler')),
                      ElevatedButton(
                        onPressed: () => Navigator.pop(ctx, true),
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.danger),
                        child: const Text('Déconnecter'),
                      ),
                    ],
                  ),
                );
                if (confirm == true && context.mounted) {
                  await context.read<AuthProvider>().logout();
                }
              },
              icon: const Icon(Icons.logout, color: AppColors.danger),
              label: const Text('Se déconnecter', style: TextStyle(color: AppColors.danger)),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppColors.danger),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text('© ${DateTime.now().year} Khadamati · Entraide Nationale',
            style: const TextStyle(fontSize: 11, color: AppColors.gray400)),
        ],
      ),
    );
  }

  Widget _card({required String title, required IconData icon, required Widget child}) =>
    Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.gray200),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Icon(icon, size: 18, color: AppColors.primary),
          const SizedBox(width: 8),
          Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.gray900)),
        ]),
        const SizedBox(height: 16),
        child,
      ]),
    );

  Widget _field(String label, TextEditingController ctrl) =>
    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.gray500)),
      const SizedBox(height: 6),
      TextField(controller: ctrl, decoration: const InputDecoration()),
    ]);

  Widget _pwdField(String label, TextEditingController ctrl, bool show, VoidCallback toggle) =>
    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.gray500)),
      const SizedBox(height: 6),
      TextField(
        controller: ctrl,
        obscureText: !show,
        decoration: InputDecoration(
          suffixIcon: IconButton(
            icon: Icon(show ? Icons.visibility_off_outlined : Icons.visibility_outlined,
              color: AppColors.gray400, size: 18),
            onPressed: toggle,
          ),
        ),
      ),
    ]);
}
