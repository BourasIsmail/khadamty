'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import {
  CalendarDaysIcon, DocumentTextIcon, CheckCircleIcon,
  XCircleIcon, ClockIcon, UserGroupIcon, ChartBarIcon,
} from '@heroicons/react/24/outline'

type Tab = 'leave' | 'documents'

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)

const monthBounds = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return { start, end }
}

const buildMonthDays = (date: Date) => {
  const { start, end } = monthBounds(date)
  const days = []
  for (let day = 1; day <= end.getDate(); day++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), day))
  }
  return days
}

const overlapsDay = (event: any, day: Date) => {
  const current = toIsoDate(day)
  return event.startDate <= current && event.endDate >= current
}

const LEAVE_TYPE_LABELS: Record<string, string> = {
  ANNUAL_LEAVE: 'Congé annuel',
  SICK_LEAVE: 'Congé maladie',
  PERSONAL_LEAVE: 'Congé personnel',
  MATERNITY_LEAVE: 'Congé maternité',
  PATERNITY_LEAVE: 'Congé paternité',
  EMERGENCY_LEAVE: "Congé d'urgence",
}

const DOC_TYPE_LABELS: Record<string, string> = {
  WORK_CERTIFICATE: 'Attestation de travail',
  SALARY_CERTIFICATE: 'Attestation de salaire',
  EMPLOYMENT_CONTRACT: 'Contrat de travail',
  LEAVE_BALANCE: 'Solde de congés',
  TAX_CERTIFICATE: 'Certificat fiscal',
  EXPERIENCE_CERTIFICATE: "Certificat d'expérience",
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  CANCELLED: 'Annulé',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminé',
}

export default function RhDashboardPage() {
  const [tab, setTab] = useState<Tab>('leave')
  const [stats, setStats] = useState<any>(null)
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [docRequests, setDocRequests] = useState<any[]>([])
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [leaveCalendar, setLeaveCalendar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ id: string; type: 'leave' | 'doc' } | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { start, end } = monthBounds(calendarDate)
      const leaveStatus = tab === 'leave' ? filterStatus || undefined : undefined
      const docStatus = tab === 'documents' ? filterStatus || undefined : undefined
      const [s, lr, dr, cal] = await Promise.all([
        api.getRhStats(),
        api.getRhLeaveRequests(leaveStatus),
        api.getRhDocumentRequests(docStatus),
        api.getRhLeaveCalendar(toIsoDate(start), toIsoDate(end)),
      ])
      setStats(s)
      setLeaveRequests(Array.isArray(lr) ? lr : [])
      setDocRequests(Array.isArray(dr) ? dr : [])
      setLeaveCalendar(Array.isArray(cal?.events) ? cal.events : [])
    } catch (e: any) {
      toast.error(e.message || 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filterStatus, calendarDate, tab])

  const handleApproveLeave = async (id: string) => {
    setActionLoading(id)
    try {
      await api.approveLeaveRequest(id)
      toast.success('Demande approuvée !')
      load()
    } catch (e: any) {
      toast.error(e.message || 'Erreur')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!rejectModal) return
    setActionLoading(rejectModal.id)
    try {
      if (rejectModal.type === 'leave') {
        await api.rejectLeaveRequest(rejectModal.id, rejectReason)
        toast.success('Demande rejetée')
      } else {
        await api.rejectDocumentRequest(rejectModal.id, rejectReason)
        toast.success('Demande rejetée')
      }
      setRejectModal(null)
      setRejectReason('')
      load()
    } catch (e: any) {
      toast.error(e.message || 'Erreur')
    } finally {
      setActionLoading(null)
    }
  }

  const handleProcessDoc = async (id: string, status: string) => {
    setActionLoading(id)
    try {
      await api.processDocumentRequest(id, status)
      toast.success('Demande mise à jour !')
      load()
    } catch (e: any) {
      toast.error(e.message || 'Erreur')
    } finally {
      setActionLoading(null)
    }
  }

  const statCards = stats
    ? [
        { label: 'Congés en attente', value: stats.pendingLeave, icon: CalendarDaysIcon, color: 'yellow' },
        { label: 'Congés approuvés', value: stats.approvedLeave, icon: CheckCircleIcon, color: 'emerald' },
        { label: 'Docs en attente', value: stats.pendingDocs, icon: DocumentTextIcon, color: 'blue' },
        { label: 'Docs traités', value: stats.completedDocs, icon: CheckCircleIcon, color: 'purple' },
      ]
    : []

  const colorMap: Record<string, string> = {
    yellow: 'bg-yellow-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  }

  const monthDays = buildMonthDays(calendarDate)
  const monthLabel = calendarDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const changeMonth = (offset: number) => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + offset, 1))
  }
  const eventsForDay = (day: Date) => leaveCalendar.filter((event) => overlapsDay(event, day))

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord RH</h1>
        <p className="text-gray-500 mt-1">Gérez les demandes de congés et d'attestations</p>
      </div>

      {/* Stats */}
      {!loading && stats && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`w-10 h-10 ${colorMap[card.color]} rounded-xl flex items-center justify-center shadow-lg`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs + Filter */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => {
              setTab('leave')
              setFilterStatus('')
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'leave' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarDaysIcon className="h-4 w-4" />
            Congés
            {stats?.pendingLeave > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                {stats.pendingLeave}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setTab('documents')
              setFilterStatus('')
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'documents' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <DocumentTextIcon className="h-4 w-4" />
            Attestations
            {stats?.pendingDocs > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                {stats.pendingDocs}
              </span>
            )}
          </button>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="APPROVED">Approuvés</option>
          <option value="REJECTED">Rejetés</option>
          {tab === 'documents' && <option value="COMPLETED">Terminés</option>}
        </select>
      </div>

      {tab === 'leave' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Calendrier des conges</h2>
              <p className="text-sm text-gray-500">Maximum 2 employes absents sur la meme periode</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Precedent
              </button>
              <span className="min-w-36 text-center text-sm font-semibold text-gray-900 capitalize">{monthLabel}</span>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-400 mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <div key={day} className="px-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: (monthDays[0].getDay() + 6) % 7 }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
            {monthDays.map((day) => {
              const events = eventsForDay(day)
              const isFull = events.length >= 2
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-28 rounded-xl border p-2 ${isFull ? 'border-red-200 bg-red-50' : events.length ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-gray-50/50'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{day.getDate()}</span>
                    {events.length > 0 && (
                      <span className={`text-[11px] font-bold ${isFull ? 'text-red-700' : 'text-amber-700'}`}>
                        {events.length}/2
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    {events.slice(0, 3).map((event: any) => (
                      <div key={`${event.id}-${day.toISOString()}`} className="rounded-lg bg-white/80 px-2 py-1 shadow-sm">
                        <p className="truncate text-[11px] font-semibold text-gray-800">{event.employeeName}</p>
                        <p className="text-[10px] text-gray-500">
                          {event.daysRequested || 1}j - {STATUS_LABELS[event.status] || event.status}
                        </p>
                      </div>
                    ))}
                    {events.length > 3 && (
                      <p className="text-[10px] font-semibold text-gray-500">+{events.length - 3} autre(s)</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'leave' ? (
          leaveRequests.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <CalendarDaysIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Aucune demande de congé</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {leaveRequests.map((req: any) => (
                <div key={req.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{req.employeeName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {LEAVE_TYPE_LABELS[req.leaveType] || req.leaveType}
                        {' · '}
                        {req.startDate && new Date(req.startDate).toLocaleDateString('fr-FR')}
                        {' → '}
                        {req.endDate && new Date(req.endDate).toLocaleDateString('fr-FR')}
                        {req.daysRequested && ` · ${req.daysRequested}j`}
                      </p>
                      {req.reason && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-sm">{req.reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[req.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[req.status] || req.status}
                    </span>
                    {req.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveLeave(req.id)}
                          disabled={actionLoading === req.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                        >
                          <CheckCircleIcon className="h-3.5 w-3.5" />
                          Approuver
                        </button>
                        <button
                          onClick={() => setRejectModal({ id: req.id, type: 'leave' })}
                          disabled={actionLoading === req.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                        >
                          <XCircleIcon className="h-3.5 w-3.5" />
                          Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          docRequests.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Aucune demande de document</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {docRequests.map((req: any) => (
                <div key={req.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{req.employeeName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {DOC_TYPE_LABELS[req.documentType] || req.documentType}
                      </p>
                      {req.purpose && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-sm">{req.purpose}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {req.createdAt && new Date(req.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[req.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[req.status] || req.status}
                    </span>
                    {req.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProcessDoc(req.id, 'IN_PROGRESS')}
                          disabled={actionLoading === req.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                        >
                          <ClockIcon className="h-3.5 w-3.5" />
                          Traiter
                        </button>
                        <button
                          onClick={() => setRejectModal({ id: req.id, type: 'doc' })}
                          disabled={actionLoading === req.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                        >
                          <XCircleIcon className="h-3.5 w-3.5" />
                          Rejeter
                        </button>
                      </div>
                    )}
                    {req.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleProcessDoc(req.id, 'COMPLETED')}
                        disabled={actionLoading === req.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                      >
                        <CheckCircleIcon className="h-3.5 w-3.5" />
                        Terminer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Modal de rejet */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Motif du rejet</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Expliquez la raison du rejet (optionnel)..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectModal(null); setRejectReason('') }}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={!!actionLoading}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition"
              >
                {actionLoading ? 'Rejet...' : 'Confirmer le rejet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
