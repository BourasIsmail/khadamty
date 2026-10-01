import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/user_model.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _loading = false;
  String? _error;
  // Email en attente de vérification OTP
  String? _pendingEmail;

  UserModel? get user         => _user;
  bool       get loading      => _loading;
  String?    get error        => _error;
  bool       get isAuth       => _user != null;
  String?    get pendingEmail => _pendingEmail;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final userJson = prefs.getString('user');
    if (token != null && userJson != null) {
      _user = UserModel.fromJson(jsonDecode(userJson));
      ApiService.setToken(token);
      notifyListeners();
    }
  }

  /// Étape 1 : vérifier email + mot de passe → retourne true si OTP envoyé
  Future<bool> loginStep1(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final data = await ApiService.login(email, password);
      if (data['token'] != null) {
        await _completeLogin(data);
        return false;
      }
      if (data['requireOtp'] == true) {
        _pendingEmail = data['email'] as String;
        _loading = false;
        notifyListeners();
        return true; // OTP envoyé
      }
      _error = 'Réponse inattendue du serveur';
      _loading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  /// Étape 2 : vérifier le code OTP → connecte l'utilisateur
  Future<bool> loginStep2(String code) async {
    if (_pendingEmail == null) return false;
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final data = await ApiService.verifyOtp(_pendingEmail!, code);
      await _completeLogin(data);
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> _completeLogin(Map<String, dynamic> data) async {
    final token = data['token'] as String;
    _user = UserModel.fromJson(data);
    ApiService.setToken(token);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    await prefs.setString('user', jsonEncode(_user!.toJson()));
    _pendingEmail = null;
    _loading = false;
    notifyListeners();
  }

  Future<bool> changePassword(String currentPassword, String newPassword) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      await ApiService.changePassword(currentPassword, newPassword);
      if (_user != null) {
        _user = _user!.copyWith(passwordChangeRequired: false);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('user', jsonEncode(_user!.toJson()));
      }
      _loading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> resendOtp() async {
    if (_pendingEmail == null) return;
    await ApiService.resendOtp(_pendingEmail!);
  }

  Future<void> logout() async {
    _user = null;
    _pendingEmail = null;
    ApiService.clearToken();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
    notifyListeners();
  }

  void updateUser(String firstName, String lastName) {
    if (_user == null) return;
    _user = _user!.copyWith(firstName: firstName, lastName: lastName);
    notifyListeners();
  }
}
