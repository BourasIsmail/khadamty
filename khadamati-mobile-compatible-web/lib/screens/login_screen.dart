import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants.dart';
import '../providers/auth_provider.dart';
import '../widgets/khadamati_logo.dart';
import 'register_screen.dart';

// ── Modes de la page login ────────────────────────────────────────────────────
enum LoginMode { select, adminLogin, rhChoice, rhLogin, empChoice, empLogin, otp }

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  LoginMode _mode = LoginMode.select;

  final _emailCtrl = TextEditingController();
  final _passCtrl  = TextEditingController();
  bool _showPass   = false;

  // OTP
  final List<TextEditingController> _otpCtrl =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _otpFocus = List.generate(6, (_) => FocusNode());
  int _resendTimer = 60;
  bool _canResend  = false;
  Timer? _timer;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    for (final c in _otpCtrl) c.dispose();
    for (final f in _otpFocus) f.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer?.cancel();
    setState(() { _resendTimer = 60; _canResend = false; });
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_resendTimer <= 1) {
        t.cancel();
        setState(() => _canResend = true);
      } else {
        setState(() => _resendTimer--);
      }
    });
  }

  void _goTo(LoginMode mode) {
    setState(() {
      _mode = mode;
      if (mode == LoginMode.otp) _startTimer();
    });
  }

  void _back() {
    _emailCtrl.clear(); _passCtrl.clear();
    for (final c in _otpCtrl) c.clear();
    setState(() => _mode = LoginMode.select);
  }

  Future<void> _submitLogin() async {
    final auth = context.read<AuthProvider>();
    final ok = await auth.loginStep1(_emailCtrl.text.trim(), _passCtrl.text.trim());
    if (!mounted) return;
    if (auth.isAuth) return;
    if (ok) {
      _goTo(LoginMode.otp);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Code envoyé sur votre email !'),
            backgroundColor: AppColors.primary));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(auth.error ?? 'Erreur de connexion'),
            backgroundColor: AppColors.danger));
    }
  }

  Future<void> _submitOtp() async {
    final code = _otpCtrl.map((c) => c.text).join();
    if (code.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Entrez les 6 chiffres du code')));
      return;
    }
    final auth = context.read<AuthProvider>();
    final ok = await auth.loginStep2(code);
    if (!mounted) return;
    if (!ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(auth.error ?? 'Code incorrect ou expiré'),
            backgroundColor: AppColors.danger));
      for (final c in _otpCtrl) c.clear();
      _otpFocus[0].requestFocus();
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),
              Center(child: const KhadamatiLogo(size: 44)),
              const SizedBox(height: 6),
              Center(child: Text(AppStrings.orgName,
                style: const TextStyle(fontSize: 12, color: AppColors.gray400, fontWeight: FontWeight.w500))),
              const SizedBox(height: 36),

              // ── Sélection du rôle ──────────────────────────────────────
              if (_mode == LoginMode.select) ...[
                const Text('Qui êtes-vous ?',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.gray900)),
                const SizedBox(height: 6),
                const Text('Sélectionnez votre profil pour continuer',
                  style: TextStyle(fontSize: 13, color: AppColors.gray400)),
                const SizedBox(height: 28),
                _roleCard(
                  icon: Icons.shield_outlined,
                  color: AppColors.danger,
                  title: 'Administrateur',
                  subtitle: 'Accès complet au système',
                  onTap: () => _goTo(LoginMode.adminLogin),
                ),
                const SizedBox(height: 12),
                _roleCard(
                  icon: Icons.work_outline,
                  color: AppColors.primary,
                  title: 'Ressources Humaines',
                  subtitle: 'Gestion employés & demandes',
                  onTap: () => _goTo(LoginMode.rhChoice),
                ),
                const SizedBox(height: 12),
                _roleCard(
                  icon: Icons.person_outline,
                  color: AppColors.primaryLight,
                  title: 'Employé',
                  subtitle: 'Congés, attestations, profil',
                  onTap: () => _goTo(LoginMode.empChoice),
                ),
              ],

              // ── Connexion Admin ────────────────────────────────────────
              if (_mode == LoginMode.adminLogin)
                _loginForm('Espace Administrateur',
                    'Connectez-vous avec vos identifiants', AppColors.danger, auth),

              // ── Choix RH ───────────────────────────────────────────────
              if (_mode == LoginMode.rhChoice) ...[
                _backButton(),
                _choiceCard(
                  icon: Icons.work_outline,
                  color: AppColors.primary,
                  title: 'Espace RH',
                  yesLabel: 'J\'ai un compte RH',
                  noLabel: 'Je m\'inscris comme RH',
                  onYes: () => _goTo(LoginMode.rhLogin),
                  onNo: () => Navigator.push(context,
                    MaterialPageRoute(builder: (_) => RegisterScreen(role: 'RH'))),
                ),
              ],

              // ── Connexion RH ───────────────────────────────────────────
              if (_mode == LoginMode.rhLogin)
                _loginForm('Connexion RH',
                    'Accédez à votre espace Ressources Humaines', AppColors.primary, auth),

              // ── Choix Employé ──────────────────────────────────────────
              if (_mode == LoginMode.empChoice) ...[
                _backButton(),
                _choiceCard(
                  icon: Icons.person_outline,
                  color: AppColors.primaryLight,
                  title: 'Espace Employé',
                  yesLabel: 'J\'ai un compte',
                  noLabel: 'Je m\'inscris',
                  onYes: () => _goTo(LoginMode.empLogin),
                  onNo: () => Navigator.push(context,
                    MaterialPageRoute(builder: (_) => RegisterScreen(role: 'EMPLOYEE'))),
                ),
              ],

              // ── Connexion Employé ──────────────────────────────────────
              if (_mode == LoginMode.empLogin)
                _loginForm('Connexion Employé',
                    'Accédez à votre espace personnel', AppColors.primaryLight, auth),

              // ── OTP ────────────────────────────────────────────────────
              if (_mode == LoginMode.otp) ...[
                Container(
                  width: 56, height: 56,
                  decoration: BoxDecoration(color: AppColors.primaryBg, borderRadius: BorderRadius.circular(16)),
                  child: const Icon(Icons.email_outlined, color: AppColors.primary, size: 28),
                ),
                const SizedBox(height: 16),
                const Text('Vérification', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
                const SizedBox(height: 6),
                Text('Code envoyé à ${auth.pendingEmail ?? ''}',
                  style: const TextStyle(fontSize: 13, color: AppColors.gray400)),
                const SizedBox(height: 28),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(6, (i) => SizedBox(
                    width: 46, height: 56,
                    child: TextField(
                      controller: _otpCtrl[i],
                      focusNode: _otpFocus[i],
                      keyboardType: TextInputType.number,
                      maxLength: 1,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
                      decoration: InputDecoration(
                        counterText: '',
                        filled: true,
                        fillColor: _otpCtrl[i].text.isNotEmpty
                            ? AppColors.primaryBg : AppColors.gray50,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: _otpCtrl[i].text.isNotEmpty
                                ? AppColors.primary : AppColors.gray200,
                            width: 2,
                          ),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: _otpCtrl[i].text.isNotEmpty
                                ? AppColors.primary : AppColors.gray200,
                            width: 2,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppColors.primary, width: 2),
                        ),
                      ),
                      onChanged: (v) {
                        setState(() {});
                        if (v.isNotEmpty && i < 5) {
                          _otpFocus[i + 1].requestFocus();
                        } else if (v.isEmpty && i > 0) {
                          _otpFocus[i - 1].requestFocus();
                        }
                        // Auto-submit si complet
                        final code = _otpCtrl.map((c) => c.text).join();
                        if (code.length == 6) _submitOtp();
                      },
                    ),
                  )),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: auth.loading ? null : _submitOtp,
                    child: auth.loading
                        ? const SizedBox(width: 20, height: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Text('Confirmer'),
                  ),
                ),
                const SizedBox(height: 16),
                Center(
                  child: _canResend
                      ? TextButton.icon(
                          onPressed: () async {
                            await auth.resendOtp();
                            _startTimer();
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Nouveau code envoyé')));
                            }
                          },
                          icon: const Icon(Icons.refresh, size: 16),
                          label: const Text('Renvoyer le code'),
                        )
                      : Text('Renvoyer dans ${_resendTimer}s',
                          style: const TextStyle(color: AppColors.gray400, fontSize: 13)),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Text(
                    '💡 Si vous ne recevez pas le code, vérifiez les logs du backend.',
                    style: TextStyle(fontSize: 11, color: Color(0xFFD97706)),
                  ),
                ),
              ],

              const SizedBox(height: 32),
              Center(child: Text(
                '© ${DateTime.now().year} Khadamati · Entraide Nationale',
                style: const TextStyle(fontSize: 11, color: AppColors.gray400))),
            ],
          ),
        ),
      ),
    );
  }

  // ── Widgets helpers ───────────────────────────────────────────────────────

  Widget _backButton() => GestureDetector(
    onTap: _back,
    child: const Row(children: [
      Icon(Icons.arrow_back_ios, size: 14, color: AppColors.gray400),
      SizedBox(width: 4),
      Text('Retour', style: TextStyle(fontSize: 13, color: AppColors.gray400)),
    ]),
  );

  Widget _roleCard({
    required IconData icon, required Color color,
    required String title, required String subtitle,
    required VoidCallback onTap,
  }) => InkWell(
    onTap: onTap,
    borderRadius: BorderRadius.circular(16),
    child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.gray200),
      ),
      child: Row(children: [
        Container(
          width: 44, height: 44,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: AppColors.gray900)),
          Text(subtitle, style: const TextStyle(fontSize: 12, color: AppColors.gray400)),
        ])),
        const Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.gray400),
      ]),
    ),
  );

  Widget _choiceCard({
    required IconData icon, required Color color,
    required String title, required String yesLabel, required String noLabel,
    required VoidCallback onYes, required VoidCallback onNo,
  }) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Container(
      width: 48, height: 48,
      decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(12)),
      child: Icon(icon, color: color, size: 24),
    ),
    const SizedBox(height: 12),
    Text(title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.gray900)),
    const SizedBox(height: 6),
    const Text('Avez-vous déjà un compte ?',
      style: TextStyle(fontSize: 13, color: AppColors.gray400)),
    const SizedBox(height: 20),
    SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: onYes,
        icon: const Icon(Icons.check_circle_outline, size: 18),
        label: Text(yesLabel),
      ),
    ),
    const SizedBox(height: 10),
    SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: onNo,
        icon: const Icon(Icons.person_add_outlined, size: 18),
        label: Text(noLabel),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.gray700,
          side: const BorderSide(color: AppColors.gray200),
          padding: const EdgeInsets.symmetric(vertical: 14),
        ),
      ),
    ),
  ]);

  Widget _loginForm(String title, String subtitle, Color color, AuthProvider auth) =>
    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      _backButton(),
      const SizedBox(height: 20),
      Text(title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.gray900)),
      const SizedBox(height: 4),
      Text(subtitle, style: const TextStyle(fontSize: 13, color: AppColors.gray400)),
      const SizedBox(height: 24),
      TextField(
        controller: _emailCtrl,
        keyboardType: TextInputType.emailAddress,
        decoration: const InputDecoration(
          labelText: 'Adresse email',
          prefixIcon: Icon(Icons.email_outlined, color: AppColors.gray400),
        ),
      ),
      const SizedBox(height: 14),
      TextField(
        controller: _passCtrl,
        obscureText: !_showPass,
        decoration: InputDecoration(
          labelText: 'Mot de passe',
          prefixIcon: const Icon(Icons.lock_outline, color: AppColors.gray400),
          suffixIcon: IconButton(
            icon: Icon(_showPass ? Icons.visibility_off_outlined : Icons.visibility_outlined,
              color: AppColors.gray400),
            onPressed: () => setState(() => _showPass = !_showPass),
          ),
        ),
      ),
      const SizedBox(height: 20),
      SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: auth.loading ? null : _submitLogin,
          style: ElevatedButton.styleFrom(backgroundColor: color),
          child: auth.loading
              ? const SizedBox(width: 20, height: 20,
                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
              : const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Text('Se connecter'),
                  SizedBox(width: 8),
                  Icon(Icons.arrow_forward, size: 18),
                ]),
        ),
      ),
    ]);
}
