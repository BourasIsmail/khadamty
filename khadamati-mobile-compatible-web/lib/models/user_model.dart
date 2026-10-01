class UserModel {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String role;
  final String? token;
  final bool passwordChangeRequired;

  UserModel({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.role,
    this.token,
    this.passwordChangeRequired = false,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id:        json['id']        ?? '',
    email:     json['email']     ?? '',
    firstName: json['firstName'] ?? '',
    lastName:  json['lastName']  ?? '',
    role:      json['role']      ?? '',
    token:     json['token'],
    passwordChangeRequired: json['passwordChangeRequired'] == true,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'email': email,
    'firstName': firstName,
    'lastName': lastName,
    'role': role,
    'token': token,
    'passwordChangeRequired': passwordChangeRequired,
  };

  UserModel copyWith({
    String? firstName,
    String? lastName,
    bool? passwordChangeRequired,
  }) => UserModel(
    id: id,
    email: email,
    firstName: firstName ?? this.firstName,
    lastName: lastName ?? this.lastName,
    role: role,
    token: token,
    passwordChangeRequired:
        passwordChangeRequired ?? this.passwordChangeRequired,
  );

  String get fullName => '$firstName $lastName';
  String get initials => '${firstName.isNotEmpty ? firstName[0] : ''}${lastName.isNotEmpty ? lastName[0] : ''}';

  bool get isAdmin    => role == 'ADMIN';
  bool get isRh       => role == 'RH';
  bool get isEmployee => role == 'EMPLOYEE';
}

class EmployeeModel {
  final String id;
  final String employeeId;
  final String firstName;
  final String lastName;
  final String email;
  final String? phone;
  final String? department;
  final String? position;
  final double? salary;
  final String? status;
  final int? annualLeaveBalance;
  final int? sickLeaveBalance;
  final int? personalLeaveBalance;

  EmployeeModel({
    required this.id,
    required this.employeeId,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.phone,
    this.department,
    this.position,
    this.salary,
    this.status,
    this.annualLeaveBalance,
    this.sickLeaveBalance,
    this.personalLeaveBalance,
  });

  factory EmployeeModel.fromJson(Map<String, dynamic> json) => EmployeeModel(
    id:                   json['id']         ?? '',
    employeeId:           json['employeeId'] ?? '',
    firstName:            json['firstName']  ?? '',
    lastName:             json['lastName']   ?? '',
    email:                json['email']      ?? '',
    phone:                json['phone'],
    department:           json['department'],
    position:             json['position'],
    salary:               (json['salary'] as num?)?.toDouble(),
    status:               json['status'],
    annualLeaveBalance:   json['annualLeaveBalance'],
    sickLeaveBalance:     json['sickLeaveBalance'],
    personalLeaveBalance: json['personalLeaveBalance'],
  );

  String get fullName => '$firstName $lastName';
}

class LeaveBalance {
  final int annualLeave;
  final int sickLeave;
  final int personalLeave;
  final int totalLeave;

  LeaveBalance({
    required this.annualLeave,
    required this.sickLeave,
    required this.personalLeave,
    required this.totalLeave,
  });

  factory LeaveBalance.fromJson(Map<String, dynamic> json) => LeaveBalance(
    annualLeave:   json['annualLeave']   ?? 0,
    sickLeave:     json['sickLeave']     ?? 0,
    personalLeave: json['personalLeave'] ?? 0,
    totalLeave:    json['totalLeave']    ?? 0,
  );
}

class LeaveRequest {
  final String id;
  final String employeeId;
  final String employeeName;
  final String leaveType;
  final String startDate;
  final String endDate;
  final int daysRequested;
  final String? reason;
  final String status;

  LeaveRequest({
    required this.id,
    required this.employeeId,
    required this.employeeName,
    required this.leaveType,
    required this.startDate,
    required this.endDate,
    required this.daysRequested,
    this.reason,
    required this.status,
  });

  factory LeaveRequest.fromJson(Map<String, dynamic> json) => LeaveRequest(
    id:            json['id']            ?? '',
    employeeId:    json['employeeId']    ?? '',
    employeeName:  json['employeeName']  ?? '',
    leaveType:     json['leaveType']     ?? '',
    startDate:     json['startDate']     ?? '',
    endDate:       json['endDate']       ?? '',
    daysRequested: json['daysRequested'] ?? 0,
    reason:        json['reason'],
    status:        json['status']        ?? 'PENDING',
  );
}

class DocumentRequest {
  final String id;
  final String employeeId;
  final String employeeName;
  final String documentType;
  final String? purpose;
  final String status;

  DocumentRequest({
    required this.id,
    required this.employeeId,
    required this.employeeName,
    required this.documentType,
    this.purpose,
    required this.status,
  });

  factory DocumentRequest.fromJson(Map<String, dynamic> json) => DocumentRequest(
    id:           json['id']           ?? '',
    employeeId:   json['employeeId']   ?? '',
    employeeName: json['employeeName'] ?? '',
    documentType: json['documentType'] ?? '',
    purpose:      json['purpose'],
    status:       json['status']       ?? 'PENDING',
  );
}
