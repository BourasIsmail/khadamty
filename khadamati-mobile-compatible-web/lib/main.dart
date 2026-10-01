import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'core/theme.dart';
import 'providers/auth_provider.dart';
import 'screens/force_password_change_screen.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('fr_FR', null);
  runApp(const KhadamatiApp());
}

class KhadamatiApp extends StatelessWidget {
  const KhadamatiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AuthProvider()..init(),
      child: MaterialApp(
        title: 'Khadamati',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        home: const _AppRouter(),
      ),
    );
  }
}

class _AppRouter extends StatelessWidget {
  const _AppRouter();

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (auth.user?.passwordChangeRequired == true) {
      return const ForcePasswordChangeScreen();
    }
    if (auth.isAuth) return const HomeScreen();
    return const LoginScreen();
  }
}
