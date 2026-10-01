import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import '../core/constants.dart';

class ApiService {
  static String? _token;

  static void setToken(String token) => _token = token;
  static void clearToken() => _token = null;

  static Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  static Future<Map<String, dynamic>> _request(
    String method,
    String endpoint, {
    Map<String, dynamic>? body,
    Map<String, String>? queryParams,
  }) async {
    var uri = Uri.parse('${AppStrings.apiBase}$endpoint');
    if (queryParams != null && queryParams.isNotEmpty) {
      uri = uri.replace(queryParameters: queryParams);
    }

    http.Response response;
    switch (method) {
      case 'POST':
        response = await http.post(uri, headers: _headers, body: jsonEncode(body));
        break;
      case 'PUT':
        response = await http.put(uri, headers: _headers, body: jsonEncode(body));
        break;
      case 'PATCH':
        response = await http.patch(uri, headers: _headers, body: jsonEncode(body));
        break;
      case 'DELETE':
        response = await http.delete(uri, headers: _headers);
        break;
      default:
        response = await http.get(uri, headers: _headers);
    }
    dynamic data;
    final rawBody = utf8.decode(response.bodyBytes);
    if (rawBody.trim().isNotEmpty) {
      try {
        data = jsonDecode(rawBody);
      } catch (_) {
        data = {'message': rawBody};
      }
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (data == null) return {'success': true};
      if (data is Map<String, dynamic>) return data;
      return {'data': data};
    } else {
      final msg = data is Map
          ? (data['message'] ?? data['detail'] ?? 'Erreur serveur')
          : (response.reasonPhrase ?? 'Erreur serveur');
      throw Exception(msg.toString());
    }
  }

  static Future<Uint8List> downloadBytes(
    String endpoint, {
    Map<String, String>? queryParams,
  }) async {
    var uri = Uri.parse('${AppStrings.apiBase}$endpoint');
    if (queryParams != null && queryParams.isNotEmpty) {
      uri = uri.replace(queryParameters: queryParams);
    }

    final response = await http.get(uri, headers: _headers);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.bodyBytes;
    }

    var message = 'Erreur serveur';
    try {
      final data = jsonDecode(utf8.decode(response.bodyBytes));
      if (data is Map) {
        message = (data['message'] ?? data['detail'] ?? message).toString();
      }
    } catch (_) {
      message = response.reasonPhrase ?? message;
    }
    throw Exception(message);
  }

  // â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /// Ã‰tape 1 : email + mot de passe â†’ reÃ§oit requireOtp: true
  static Future<Map<String, dynamic>> login(String email, String password) =>
      _request('POST', '/auth/login', body: {'email': email, 'password': password});

  /// Ã‰tape 2 : vÃ©rifier le code OTP â†’ reÃ§oit le JWT
  static Future<Map<String, dynamic>> verifyOtp(String email, String code) =>
      _request('POST', '/auth/verify-otp', body: {'email': email, 'code': code});

  /// Renvoyer un nouveau code OTP
  static Future<Map<String, dynamic>> resendOtp(String email) =>
      _request('POST', '/auth/resend-otp', body: {'email': email});

  /// Inscription nouvel employÃ© ou RH
  static Future<Map<String, dynamic>> register(Map<String, dynamic> data) =>
      _request('POST', '/auth/register', body: data);

  /// Modifier le profil
  static Future<Map<String, dynamic>> updateProfile(String firstName, String lastName) =>
      _request('PUT', '/auth/profile', body: {'firstName': firstName, 'lastName': lastName});

  /// Changer le mot de passe
  static Future<Map<String, dynamic>> changePassword(String current, String newPwd) =>
      _request('POST', '/auth/change-password', body: {
        'currentPassword': current,
        'newPassword': newPwd,
      });

  // â”€â”€ Employee self-service â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  static Future<Map<String, dynamic>> getEmployeeProfile() =>
      _request('GET', '/employees/profile');

  static Future<Map<String, dynamic>> getMySalary() =>
      _request('GET', '/employees/profile/salary');

  static Future<Map<String, dynamic>> getLeaveBalance() =>
      _request('GET', '/employees/leave-balance');

  static Future<Map<String, dynamic>> checkLeaveAvailability(String startDate, String endDate) =>
      _request('GET', '/employees/leave-availability', queryParams: {
        'startDate': startDate,
        'endDate': endDate,
      });

  static Future<dynamic> getMyPaySlips({int? annee, int? mois}) async {
    final params = <String, String>{};
    if (annee != null) params['annee'] = '$annee';
    if (mois != null) params['mois'] = '$mois';
    final res = await _request('GET', '/employees/pay-slips', queryParams: params);
    return res['data'] ?? res;
  }

  static Future<Uint8List> downloadMyPaySlipPdf(String id) =>
      downloadBytes('/employees/pay-slips/$id/pdf');

  static Future<dynamic> getMyMissionOrders({String? statut}) async {
    final profile = await getEmployeeProfile();
    final params = <String, String>{'employeeId': '${profile['id']}'};
    if (statut != null && statut.isNotEmpty) params['statut'] = statut;
    final res = await _request('GET', '/ordres-mission', queryParams: params);
    return res['data'] ?? res;
  }

  static Future<dynamic> getMyAnnouncements() async {
    final res = await _request('GET', '/annonces', queryParams: {
      'active': 'true',
      'publiee': 'true',
    });
    return res['data'] ?? res;
  }

  static Future<dynamic> getMyDocuments({String? typeId}) async {
    final params = <String, String>{};
    if (typeId != null && typeId.isNotEmpty) params['typeId'] = typeId;
    params['publique'] = 'true';
    params['archive'] = 'false';
    final res = await _request('GET', '/documents', queryParams: params);
    return res['data'] ?? res;
  }

  static Future<Uint8List> downloadMyDocumentPdf(String id) =>
      downloadBytes('/documents/$id/download-pdf');

  static Future<dynamic> getMyLeaveRequests() async {
    final res = await _request('GET', '/employees/leave-requests');
    return res['data'] ?? res;
  }

  static Future<Map<String, dynamic>> requestLeave(Map<String, dynamic> data) =>
      _request('POST', '/employees/leave-request', body: data);

  static Future<dynamic> getMyDocumentRequests() async {
    final res = await _request('GET', '/employees/document-requests');
    return res['data'] ?? res;
  }

  static Future<Map<String, dynamic>> requestDocument(Map<String, dynamic> data) =>
      _request('POST', '/employees/document-request', body: data);

  // â”€â”€ Employees (ADMIN/RH) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  static Future<Map<String, dynamic>> getEmployees({int page = 1, int limit = 20}) =>
      _request('GET', '/employees', queryParams: {'page': '$page', 'limit': '$limit'});

  static Future<Map<String, dynamic>> getEmployeeStats() =>
      _request('GET', '/employees/stats');

  static Future<Map<String, dynamic>> createEmployee(Map<String, dynamic> data) =>
      _request('POST', '/employees', body: data);

  // â”€â”€ RH/Admin management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  static Future<dynamic> getManagementAnnouncements({bool? active}) async {
    final params = <String, String>{};
    if (active != null) params['active'] = '$active';
    final res = await _request('GET', '/annonces', queryParams: params);
    return res['data'] ?? res;
  }

  static Future<Map<String, dynamic>> createManagementAnnouncement(Map<String, dynamic> data) =>
      _request('POST', '/annonces', body: data);

  static Future<Map<String, dynamic>> publishManagementAnnouncement(String id) =>
      _request('PATCH', '/annonces/$id/activer');

  static Future<void> deleteManagementAnnouncement(String id) async {
    await _request('DELETE', '/annonces/$id');
  }

  static Future<dynamic> getManagementDocuments({String? typeId, String? search}) async {
    final params = <String, String>{};
    if (typeId != null && typeId.isNotEmpty) params['typeId'] = typeId;
    if (search != null && search.isNotEmpty) params['search'] = search;
    final res = await _request('GET', '/documents', queryParams: params);
    return res['data'] ?? res;
  }

  static Future<Map<String, dynamic>> createManagementDocument(Map<String, dynamic> data) =>
      _request('POST', '/documents', body: data);

  static Future<Map<String, dynamic>> publishManagementDocument(String id) async {
    final current = await _request('GET', '/documents/$id');
    current['estPublic'] = true;
    current['estArchive'] = false;
    current['datePublication'] = DateTime.now().toIso8601String().split('T')[0];
    return _request('PUT', '/documents/$id', body: current);
  }

  static Future<Uint8List> downloadManagementDocumentPdf(String id) =>
      downloadBytes('/documents/$id/download-pdf');

  static Future<void> deleteManagementDocument(String id) async {
    await _request('DELETE', '/documents/$id');
  }

  static Future<dynamic> getMissionOrders({String? employeeId, String? statut}) async {
    final params = <String, String>{};
    if (employeeId != null && employeeId.isNotEmpty) params['employeeId'] = employeeId;
    if (statut != null && statut.isNotEmpty) params['statut'] = statut;
    final res = await _request('GET', '/ordres-mission', queryParams: params);
    return res['data'] ?? res;
  }

  static Future<Map<String, dynamic>> createMissionOrder(Map<String, dynamic> data) =>
      _request('POST', '/ordres-mission', body: data);

  static Future<Map<String, dynamic>> approveMissionOrder(String id, String validateur) =>
      _request('POST', '/ordres-mission/$id/approve', body: {'validateur': validateur});

  static Future<Map<String, dynamic>> rejectMissionOrder(String id, String validateur, String observations) =>
      _request('POST', '/ordres-mission/$id/reject', body: {
        'validateur': validateur,
        'observations': observations,
      });

  // â”€â”€ Admin â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  static Future<Map<String, dynamic>> getDashboardStats() =>
      _request('GET', '/admin/dashboard-stats');

  // â”€â”€ RH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  static Future<Map<String, dynamic>> getRhStats() =>
      _request('GET', '/rh/stats');

  static Future<dynamic> getRhLeaveRequests({String? status}) async {
    final params = <String, String>{};
    if (status != null) params['status'] = status;
    final res = await _request('GET', '/rh/leave-requests', queryParams: params);
    return res['data'] ?? res;
  }

  static Future<Map<String, dynamic>> getRhLeaveCalendar({String? startDate, String? endDate}) async {
    final params = <String, String>{};
    if (startDate != null && startDate.isNotEmpty) params['startDate'] = startDate;
    if (endDate != null && endDate.isNotEmpty) params['endDate'] = endDate;
    return _request('GET', '/rh/leave-calendar', queryParams: params);
  }

  static Future<Map<String, dynamic>> approveLeaveRequest(String id) =>
      _request('PUT', '/rh/leave-requests/$id/approve');

  static Future<Map<String, dynamic>> rejectLeaveRequest(String id, String reason) =>
      _request('PUT', '/rh/leave-requests/$id/reject', body: {'reason': reason});

  static Future<dynamic> getRhDocumentRequests({String? status}) async {
    final params = <String, String>{};
    if (status != null) params['status'] = status;
    final res = await _request('GET', '/rh/document-requests', queryParams: params);
    return res['data'] ?? res;
  }

  static Future<Map<String, dynamic>> processDocumentRequest(String id, String status) =>
      _request('PUT', '/rh/document-requests/$id/process', body: {'status': status});

  // â”€â”€ Attendance â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  static Future<Map<String, dynamic>> getAttendance({String? employeeId}) =>
      _request('GET', '/attendance',
          queryParams: employeeId != null ? {'employee_id': employeeId} : null);
}





