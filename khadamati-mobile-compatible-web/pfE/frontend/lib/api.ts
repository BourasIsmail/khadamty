const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;

  const directToken = localStorage.getItem('token');
  if (directToken) return directToken;

  try {
    const persisted = localStorage.getItem('auth-storage');
    if (!persisted) return null;

    const parsed = JSON.parse(persisted);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
}

function clearAuthOnUnauthorized() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('auth-storage');

  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = getStoredToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthOnUnauthorized();
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  private async download(endpoint: string, filename: string) {
    const url = `${this.baseURL}${endpoint}`;
    const token = getStoredToken();
    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthOnUnauthorized();
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(objectUrl);
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  async login(credentials: { email: string; password: string }) {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async verifyOtp(data: { email: string; code: string }) {
    return this.request<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendOtp(email: string) {
    return this.request<any>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async register(data: {
    firstName: string; lastName: string; email: string; password: string;
    phone: string; department: string; position: string; hireDate: string;
    address?: string; city?: string; cin?: string; birthDate?: string;
    gender?: string; emergencyContactName?: string; emergencyContactPhone?: string;
    role?: string;
  }) {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request<any>('/auth/me');
  }

  async updateProfile(data: { firstName?: string; lastName?: string }) {
    return this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.request<any>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ── Employees ─────────────────────────────────────────────────────────────
  async getEmployees(params?: {
    page?: number; limit?: number; search?: string;
    department?: string; status?: string;
  }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/employees${qs ? `?${qs}` : ''}`);
  }

  async getEmployee(id: string) {
    return this.request<any>(`/employees/${id}`);
  }

  async createEmployee(data: any) {
    return this.request<any>('/employees', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateEmployee(id: string, data: any) {
    return this.request<any>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteEmployee(id: string) {
    return this.request<any>(`/employees/${id}`, { method: 'DELETE' });
  }

  async getEmployeeStats() {
    return this.request<any>('/employees/stats');
  }

  // ── Attendance ────────────────────────────────────────────────────────────
  async getAttendance(params?: {
    employee_id?: string; start_date?: string;
    end_date?: string; status?: string;
  }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/attendance${qs ? `?${qs}` : ''}`);
  }

  async checkIn(employee_id: string) {
    return this.request<any>('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({ employee_id }),
    });
  }

  async checkOut(employee_id: string) {
    return this.request<any>('/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify({ employee_id }),
    });
  }

  async createAttendance(data: any) {
    return this.request<any>('/attendance', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateAttendance(id: string, data: any) {
    return this.request<any>(`/attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async getAttendanceSummary(employeeId: string, month?: number, year?: number) {
    const qs = new URLSearchParams();
    if (month) qs.set('month', String(month));
    if (year) qs.set('year', String(year));
    return this.request<any>(`/attendance/summary/${employeeId}?${qs.toString()}`);
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/admin/users${qs ? `?${qs}` : ''}`);
  }

  async updateUser(id: string, data: any) {
    return this.request<any>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteUser(id: string) {
    return this.request<any>(`/admin/users/${id}`, { method: 'DELETE' });
  }

  async toggleUserStatus(id: string) {
    return this.request<any>(`/admin/users/${id}/toggle-status`, { method: 'PATCH' });
  }

  async getDashboardStats() {
    return this.request<any>('/admin/dashboard-stats');
  }

  // ── Employee self-service ─────────────────────────────────────────────────
  async getEmployeeProfile() {
    return this.request<any>('/employees/profile');
  }

  async getMySalary() {
    return this.request<any>('/employees/profile/salary');
  }

  async getMyMissionOrders(params?: { statut?: string }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/employees/mission-orders${qs ? `?${qs}` : ''}`);
  }

  async getMyAnnouncements() {
    return this.request<any>('/employees/announcements');
  }

  async getMyDocuments(params?: { typeId?: string }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/employees/documents${qs ? `?${qs}` : ''}`);
  }

  async downloadMyDocumentPdf(id: string, filename = 'document.pdf') {
    return this.download(`/employees/documents/${id}/download-pdf`, filename);
  }

  async getLeaveBalance() {
    return this.request<any>('/employees/leave-balance');
  }

  async getMyLeaveRequests() {
    return this.request<any>('/employees/leave-requests');
  }

  async requestLeave(data: {
    leaveType: string; startDate: string; endDate: string;
    daysRequested: number; reason?: string;
  }) {
    return this.request<any>('/employees/leave-request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyDocumentRequests() {
    return this.request<any>('/employees/document-requests');
  }

  async requestDocument(data: { documentType: string; purpose?: string }) {
    return this.request<any>('/employees/document-request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyPaySlips(params?: { annee?: number; mois?: number }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/employees/pay-slips${qs ? `?${qs}` : ''}`);
  }

  async downloadMyPaySlipPdf(id: string, filename = 'bulletin-paie.pdf') {
    return this.download(`/employees/pay-slips/${id}/pdf`, filename);
  }

  // ── RH ────────────────────────────────────────────────────────────────────
  async getRhStats() {
    return this.request<any>('/rh/stats');
  }

  // ── Grades ────────────────────────────────────────────────────────────────
  async getGrades() {
    return this.request<any>('/grades');
  }

  async getGrade(id: string) {
    return this.request<any>(`/grades/${id}`);
  }

  async createGrade(data: any) {
    return this.request<any>('/grades', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateGrade(id: string, data: any) {
    return this.request<any>(`/grades/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteGrade(id: string) {
    return this.request<any>(`/grades/${id}`, { method: 'DELETE' });
  }

  // ── Coordinations ─────────────────────────────────────────────────────────
  async getCoordinations(active?: boolean) {
    const qs = active ? '?active=true' : '';
    return this.request<any>(`/coordinations${qs}`);
  }

  async getCoordination(id: string) {
    return this.request<any>(`/coordinations/${id}`);
  }

  async createCoordination(data: any) {
    return this.request<any>('/coordinations', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateCoordination(id: string, data: any) {
    return this.request<any>(`/coordinations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteCoordination(id: string) {
    return this.request<any>(`/coordinations/${id}`, { method: 'DELETE' });
  }

  // ── Délégations ───────────────────────────────────────────────────────────
  async getDelegations(coordinationId?: string, active?: boolean) {
    const params = new URLSearchParams();
    if (coordinationId) params.set('coordinationId', coordinationId);
    if (active) params.set('active', 'true');
    const qs = params.toString();
    return this.request<any>(`/delegations${qs ? `?${qs}` : ''}`);
  }

  async getDelegation(id: string) {
    return this.request<any>(`/delegations/${id}`);
  }

  async createDelegation(data: any) {
    return this.request<any>('/delegations', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateDelegation(id: string, data: any) {
    return this.request<any>(`/delegations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteDelegation(id: string) {
    return this.request<any>(`/delegations/${id}`, { method: 'DELETE' });
  }

  // ── Structures ────────────────────────────────────────────────────────────
  async getStructures(params?: { delegationId?: string; active?: boolean; rootOnly?: boolean }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/structures${qs ? `?${qs}` : ''}`);
  }

  async getStructure(id: string) {
    return this.request<any>(`/structures/${id}`);
  }

  async createStructure(data: any) {
    return this.request<any>('/structures', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateStructure(id: string, data: any) {
    return this.request<any>(`/structures/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteStructure(id: string) {
    return this.request<any>(`/structures/${id}`, { method: 'DELETE' });
  }

  // ── Salaires ──────────────────────────────────────────────────────────────
  async getSalaires(params?: { employeeId?: string; annee?: number; mois?: number; paye?: boolean }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/salaires${qs ? `?${qs}` : ''}`);
  }

  async getSalaire(id: string) {
    return this.request<any>(`/salaires/${id}`);
  }

  async createSalaire(data: any) {
    return this.request<any>('/salaires', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateSalaire(id: string, data: any) {
    return this.request<any>(`/salaires/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteSalaire(id: string) {
    return this.request<any>(`/salaires/${id}`, { method: 'DELETE' });
  }

  async downloadSalaireBulletinPdf(id: string, filename = 'bulletin-paie.pdf') {
    return this.download(`/salaires/${id}/bulletin-pdf`, filename);
  }

  // ── Primes ────────────────────────────────────────────────────────────────
  async getPrimes(params?: { employeeId?: string; type?: string; annee?: number; paye?: boolean }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/primes${qs ? `?${qs}` : ''}`);
  }

  async getPrime(id: string) {
    return this.request<any>(`/primes/${id}`);
  }

  async createPrime(data: any) {
    return this.request<any>('/primes', { method: 'POST', body: JSON.stringify(data) });
  }

  async updatePrime(id: string, data: any) {
    return this.request<any>(`/primes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deletePrime(id: string) {
    return this.request<any>(`/primes/${id}`, { method: 'DELETE' });
  }

  // ── Crédits ───────────────────────────────────────────────────────────────
  async getCredits(params?: { employeeId?: string; type?: string; statut?: string }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/credits${qs ? `?${qs}` : ''}`);
  }

  async getCredit(id: string) {
    return this.request<any>(`/credits/${id}`);
  }

  async createCredit(data: any) {
    return this.request<any>('/credits', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateCredit(id: string, data: any) {
    return this.request<any>(`/credits/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteCredit(id: string) {
    return this.request<any>(`/credits/${id}`, { method: 'DELETE' });
  }

  // ── Ordres de Mission ─────────────────────────────────────────────────────
  async getOrdresMission(params?: { employeeId?: string; statut?: string; enCours?: boolean }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/rh/management/mission-orders${qs ? `?${qs}` : ''}`);
  }

  async getOrdreMission(id: string) {
    return this.request<any>(`/rh/management/mission-orders/${id}`);
  }

  async createOrdreMission(data: any) {
    return this.request<any>('/rh/management/mission-orders', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateOrdreMission(id: string, data: any) {
    return this.request<any>(`/rh/management/mission-orders/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async approveOrdreMission(id: string, validateur: string) {
    return this.request<any>(`/rh/management/mission-orders/${id}/approve`, { 
      method: 'POST', 
      body: JSON.stringify({ validateur }) 
    });
  }

  async rejectOrdreMission(id: string, validateur: string, observations: string) {
    return this.request<any>(`/rh/management/mission-orders/${id}/reject`, { 
      method: 'POST', 
      body: JSON.stringify({ validateur, observations }) 
    });
  }

  async deleteOrdreMission(id: string) {
    return this.request<any>(`/rh/management/mission-orders/${id}`, { method: 'DELETE' });
  }

  // ── Demandes ──────────────────────────────────────────────────────────────
  async getDemandes(params?: { employeeId?: string; typeId?: string; statut?: string; enAttente?: boolean }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/demandes${qs ? `?${qs}` : ''}`);
  }

  async getDemande(id: string) {
    return this.request<any>(`/demandes/${id}`);
  }

  async createDemande(data: any) {
    return this.request<any>('/demandes', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateDemande(id: string, data: any) {
    return this.request<any>(`/demandes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async approveDemande(id: string, traiteePar: string) {
    return this.request<any>(`/demandes/${id}/approve`, { 
      method: 'POST', 
      body: JSON.stringify({ traiteePar }) 
    });
  }

  async rejectDemande(id: string, traiteePar: string, motifRejet: string) {
    return this.request<any>(`/demandes/${id}/reject`, { 
      method: 'POST', 
      body: JSON.stringify({ traiteePar, motifRejet }) 
    });
  }

  async deleteDemande(id: string) {
    return this.request<any>(`/demandes/${id}`, { method: 'DELETE' });
  }

  // ── Documents ─────────────────────────────────────────────────────────────
  async getDocuments(params?: { typeId?: string; publique?: boolean; archive?: boolean; search?: string }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/rh/management/documents${qs ? `?${qs}` : ''}`);
  }

  async getDocument(id: string) {
    return this.request<any>(`/rh/management/documents/${id}`);
  }

  async createDocument(data: any) {
    return this.request<any>('/rh/management/documents', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateDocument(id: string, data: any) {
    return this.request<any>(`/rh/management/documents/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async publishDocument(id: string) {
    return this.request<any>(`/rh/management/documents/${id}/publish`, { method: 'PATCH' });
  }

  async deleteDocument(id: string) {
    return this.request<any>(`/rh/management/documents/${id}`, { method: 'DELETE' });
  }

  async downloadDocumentPdf(id: string, filename = 'document.pdf') {
    return this.download(`/rh/management/documents/${id}/download-pdf`, filename);
  }

  async getTypeDocuments() {
    return this.request<any>('/types-documents');
  }

  // ── Annonces ──────────────────────────────────────────────────────────────
  async getAnnonces(params?: { type?: string; priorite?: string; publiee?: boolean; active?: boolean }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/rh/management/announcements${qs ? `?${qs}` : ''}`);
  }

  async getAnnonce(id: string) {
    return this.request<any>(`/rh/management/announcements/${id}`);
  }

  async createAnnonce(data: any) {
    return this.request<any>('/rh/management/announcements', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateAnnonce(id: string, data: any) {
    return this.request<any>(`/rh/management/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async publishAnnonce(id: string) {
    return this.request<any>(`/rh/management/announcements/${id}/publish`, { method: 'PATCH' });
  }

  async deleteAnnonce(id: string) {
    return this.request<any>(`/rh/management/announcements/${id}`, { method: 'DELETE' });
  }

  // ── Réclamations ──────────────────────────────────────────────────────────
  async getReclamations(params?: { employeeId?: string; type?: string; statut?: string; enAttente?: boolean }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/reclamations${qs ? `?${qs}` : ''}`);
  }

  async getReclamation(id: string) {
    return this.request<any>(`/reclamations/${id}`);
  }

  async createReclamation(data: any) {
    return this.request<any>('/reclamations', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateReclamation(id: string, data: any) {
    return this.request<any>(`/reclamations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async traiterReclamation(id: string, traiteePar: string, reponse: string) {
    return this.request<any>(`/reclamations/${id}/traiter`, { 
      method: 'POST', 
      body: JSON.stringify({ traiteePar, reponse }) 
    });
  }

  async deleteReclamation(id: string) {
    return this.request<any>(`/reclamations/${id}`, { method: 'DELETE' });
  }

  // ── Notes Annuelles ───────────────────────────────────────────────────────
  async getNotesAnnuelles(params?: { employeeId?: string; annee?: number; validee?: boolean }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/notes-annuelles${qs ? `?${qs}` : ''}`);
  }

  async getNoteAnnuelle(id: string) {
    return this.request<any>(`/notes-annuelles/${id}`);
  }

  async createNoteAnnuelle(data: any) {
    return this.request<any>('/notes-annuelles', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateNoteAnnuelle(id: string, data: any) {
    return this.request<any>(`/notes-annuelles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async validerNoteAnnuelle(id: string, validateur: string) {
    return this.request<any>(`/notes-annuelles/${id}/valider`, { 
      method: 'POST', 
      body: JSON.stringify({ validateur }) 
    });
  }

  async deleteNoteAnnuelle(id: string) {
    return this.request<any>(`/notes-annuelles/${id}`, { method: 'DELETE' });
  }

  // ── Examens ───────────────────────────────────────────────────────────────
  async getExamens(params?: { annee?: number; gradeId?: string; avenir?: boolean }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/examens${qs ? `?${qs}` : ''}`);
  }

  async getExamen(id: string) {
    return this.request<any>(`/examens/${id}`);
  }

  async createExamen(data: any) {
    return this.request<any>('/examens', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateExamen(id: string, data: any) {
    return this.request<any>(`/examens/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteExamen(id: string) {
    return this.request<any>(`/examens/${id}`, { method: 'DELETE' });
  }

  async getRhLeaveRequests(status?: string, employeeId?: string) {
    const qs = new URLSearchParams();
    if (status) qs.set('status', status);
    if (employeeId) qs.set('employeeId', employeeId);
    const q = qs.toString();
    return this.request<any>(`/rh/leave-requests${q ? `?${q}` : ''}`);
  }

  async approveLeaveRequest(id: string) {
    return this.request<any>(`/rh/leave-requests/${id}/approve`, { method: 'PUT' });
  }

  async rejectLeaveRequest(id: string, reason?: string) {
    return this.request<any>(`/rh/leave-requests/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason: reason || '' }),
    });
  }

  async getRhDocumentRequests(status?: string, employeeId?: string) {
    const qs = new URLSearchParams();
    if (status) qs.set('status', status);
    if (employeeId) qs.set('employeeId', employeeId);
    const q = qs.toString();
    return this.request<any>(`/rh/document-requests${q ? `?${q}` : ''}`);
  }

  async processDocumentRequest(id: string, status: string, notes?: string) {
    return this.request<any>(`/rh/document-requests/${id}/process`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes: notes || '' }),
    });
  }

  async rejectDocumentRequest(id: string, reason?: string) {
    return this.request<any>(`/rh/document-requests/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason: reason || '' }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
