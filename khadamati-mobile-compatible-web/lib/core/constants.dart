// â”€â”€ Couleurs Khadamati / Entraide Nationale â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class AppColors {
  // Vert institutionnel Entraide Nationale
  static const Color primary      = Color(0xFF006233);
  static const Color primaryLight = Color(0xFF00843F);
  static const Color primaryDark  = Color(0xFF004D27);
  static const Color primaryBg    = Color(0xFFE6F2EC);

  // Rouge Maroc
  static const Color danger       = Color(0xFFC1272D);
  static const Color dangerLight  = Color(0xFFE03030);
  static const Color dangerBg     = Color(0xFFFDECEA);

  // Neutres
  static const Color surface      = Color(0xFFF5F6F8);
  static const Color white        = Color(0xFFFFFFFF);
  static const Color gray50       = Color(0xFFF9FAFB);
  static const Color gray100      = Color(0xFFF3F4F6);
  static const Color gray200      = Color(0xFFE5E7EB);
  static const Color gray400      = Color(0xFF9CA3AF);
  static const Color gray500      = Color(0xFF6B7280);
  static const Color gray700      = Color(0xFF374151);
  static const Color gray900      = Color(0xFF111827);
}

class AppStrings {
  static const String appName     = 'Khadamati';
  static const String appNameAr   = 'Ø®Ø¯Ù…Ø§ØªÙŠ';
  static const String orgName     = 'Entraide Nationale';
  static String get apiBase {
    const configured = String.fromEnvironment('API_BASE_URL');
    if (configured.isNotEmpty) return configured;
    if (kIsWeb) return 'http://localhost:8081/api';
    return 'http://10.0.2.2:8081/api';
  }
}

