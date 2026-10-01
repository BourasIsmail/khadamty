'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, MapPinIcon, CheckCircleIcon,
  XCircleIcon, ClockIcon, XMarkIcon, TrashIcon,
} from '@heroicons/react/24/outline'

const STATUTS = ['EN_ATTENTE', 'APPROUVE', 'REJETE', 'EN_COURS', 'TERMINE', 'ANNULE']

const emptyForm = {
  employeeId: '',
  numero: '',
  objet: '',
  lieuDepart: '',
  lieuArrivee: '',
  dateDepart: '',
  dateRetour: '',
  montantIndemnite: '0',
  montantTransport: '0',
  montantHebergement: '0',
  observations: '',
}

export default function OrdresMissionPage() {
  const { user } = useAuthStore()
  const [ordres, setOrdres] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [myEmployee, setMyEmployee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const isEmployee = user?.role === 'EMPLOYEE'
  const canManage = user?.role === 'ADMIN' || user?.role === 'RH'

  const selectedEmployee = useMemo(
    () => employees.find((employee) => String(employee.id) === String(form.employeeId)),
    [employees, form.employeeId]
  )

  const loadEmployees = async () => {
    if (!canManage) return
    const data = await api.getEmployees({ page: 1, limit: 200 })
    setEmployees(Array.isArray(data) ? data : data?.employees || [])
  }

  const load = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (statut) params.statut = statut

      if (isEmployee) {
        const profile = await api.getEmployeeProfile()
        setMyEmployee(profile)
        params.employeeId = profile?.id
      }

      const data = await api.getOrdresMission(params)
      setOrdres(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message || 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees().catch((e: any) => toast.error(e.message || 'Erreur employes'))
  }, [user?.role])

  useEffect(() => { load() }, [statut, user?.role])

  const getEmployee = (ordre: any) => ordre.employee || {}
  const getEmployeeName = (ordre: any) => {
    const employee = getEmployee(ordre)
    return `${employee.firstName || ordre.employePrenom || ''} ${employee.lastName || ordre.employeNom || ''}`.trim() || 'Employe'
  }
  const getDestination = (ordre: any) => ordre.destination || ordre.lieuArrivee || '-'
  const getDateStart = (ordre: any) => ordre.dateDebut || ordre.dateDepart
  const getDateEnd = (ordre: any) => ordre.dateFin || ordre.dateRetour

  const filteredOrdres = ordres.filter((ordre) => {
    const q = search.toLowerCase()
    return (
      getEmployeeName(ordre).toLowerCase().includes(q) ||
      getDestination(ordre).toLowerCase().includes(q) ||
      (ordre.objet || '').toLowerCase().includes(q) ||
      (ordre.numero || '').toLowerCase().includes(q)
    )
  })

  const calcDays = (start: string, end: string) => {
    if (!start || !end) return 1
    const diff = new Date(end).getTime() - new Date(start).getTime()
    return Math.max(1, Math.floor(diff / 86400000) + 1)
  }

  const resetForm = () => {
    const currentEmployee = isEmployee ? myEmployee : null
    setForm({
      ...emptyForm,
      employeeId: currentEmployee?.id ? String(currentEmployee.id) : '',
      numero: `OM-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`,
    })
  }

  const openForm = () => {
    resetForm()
    setShowForm(true)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const employee = isEmployee ? myEmployee : selectedEmployee

    if (!employee?.id) {
      toast.error('Choisis un employe')
      return
    }
    if (!form.objet || !form.lieuDepart || !form.lieuArrivee || !form.dateDepart || !form.dateRetour) {
      toast.error('Complete les champs obligatoires')
      return
    }

    const montantIndemnite = Number(form.montantIndemnite || 0)
    const montantTransport = Number(form.montantTransport || 0)
    const montantHebergement = Number(form.montantHebergement || 0)

    setSubmitting(true)
    try {
      await api.createOrdreMission({
        employee: { id: employee.id },
        numero: form.numero || `OM-${Date.now()}`,
        objet: form.objet,
        lieuDepart: form.lieuDepart,
        lieuArrivee: form.lieuArrivee,
        dateDepart: form.dateDepart,
        dateRetour: form.dateRetour,
        dureeJours: calcDays(form.dateDepart, form.dateRetour),
        montantIndemnite,
        montantTransport,
        montantHebergement,
        montantTotal: montantIndemnite + montantTransport + montantHebergement,
        statut: 'EN_ATTENTE',
        observations: form.observations,
      })
      toast.success('Ordre de mission cree')
      setShowForm(false)
      load()
    } catch (e: any) {
      toast.error(e.message || 'Creation impossible')
    } finally {
      setSubmitting(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await api.approveOrdreMission(id, user?.email || 'validateur')
      toast.success('Ordre de mission approuve')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleReject = async (id: string) => {
    const motif = prompt('Motif du rejet :')
    if (!motif) return
    try {
      await api.rejectOrdreMission(id, user?.email || 'validateur', motif)
      toast.success('Ordre de mission rejete')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDelete = async (ordre: any) => {
    if (!confirm(`Supprimer l'ordre ${ordre.numero || ''} ?`)) return
    try {
      await api.deleteOrdreMission(ordre.id)
      toast.success('Ordre supprime')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const getStatutColor = (value: string) => {
    switch (value) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-700'
      case 'APPROUVE': return 'bg-green-100 text-green-700'
      case 'REJETE': return 'bg-red-100 text-red-700'
      case 'EN_COURS': return 'bg-blue-100 text-blue-700'
      case 'TERMINE': return 'bg-gray-100 text-gray-700'
      case 'ANNULE': return 'bg-gray-100 text-gray-500'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ordres de Mission</h1>
          <p className="text-gray-500 mt-1">{filteredOrdres.length} ordre{filteredOrdres.length !== 1 ? 's' : ''}</p>
        </div>
        {canManage && (
          <button
            onClick={openForm}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-500/25"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvel ordre
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un ordre de mission..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Tous les statuts</option>
            {STATUTS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrdres.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-20 text-center">
          <MapPinIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Aucun ordre de mission trouve</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrdres.map((ordre) => (
            <div key={ordre.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex items-start justify-between mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(ordre.statut)}`}>
                  {ordre.statut?.replace('_', ' ')}
                </span>
                <MapPinIcon className="h-5 w-5 text-blue-500" />
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-1">{getEmployeeName(ordre)}</h3>
              <p className="text-xs text-gray-400 mb-3">{ordre.numero || 'Sans numero'}</p>
              <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Depart:</span> {ordre.lieuDepart || '-'}</p>
              <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Destination:</span> {getDestination(ordre)}</p>
              <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Objet:</span> {ordre.objet}</p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <ClockIcon className="h-4 w-4" />
                <span>
                  {getDateStart(ordre) ? new Date(getDateStart(ordre)).toLocaleDateString('fr-FR') : '-'} {'->'} {getDateEnd(ordre) ? new Date(getDateEnd(ordre)).toLocaleDateString('fr-FR') : '-'}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-4">Total: {Number(ordre.montantTotal || 0).toLocaleString('fr-FR')} DH</p>

              {canManage && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  {ordre.statut === 'EN_ATTENTE' && (
                    <>
                      <button onClick={() => handleApprove(ordre.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg transition">
                        <CheckCircleIcon className="h-4 w-4" />
                        Approuver
                      </button>
                      <button onClick={() => handleReject(ordre.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition">
                        <XCircleIcon className="h-4 w-4" />
                        Rejeter
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(ordre)} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-lg transition">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {canManage && showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Nouvel ordre de mission</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {canManage && (
                <label className="md:col-span-2 text-sm font-medium text-gray-700">
                  Employe
                  <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" required>
                    <option value="">Choisir un employe</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName} - {employee.employeeId}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="text-sm font-medium text-gray-700">
                Numero
                <input value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Depart
                <input value={form.lieuDepart} onChange={(e) => setForm({ ...form, lieuDepart: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Destination
                <input value={form.lieuArrivee} onChange={(e) => setForm({ ...form, lieuArrivee: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Date depart
                <input type="date" value={form.dateDepart} onChange={(e) => setForm({ ...form, dateDepart: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Date retour
                <input type="date" value={form.dateRetour} onChange={(e) => setForm({ ...form, dateRetour: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Indemnite
                <input type="number" min="0" step="0.01" value={form.montantIndemnite} onChange={(e) => setForm({ ...form, montantIndemnite: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Transport
                <input type="number" min="0" step="0.01" value={form.montantTransport} onChange={(e) => setForm({ ...form, montantTransport: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Hebergement
                <input type="number" min="0" step="0.01" value={form.montantHebergement} onChange={(e) => setForm({ ...form, montantHebergement: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="md:col-span-2 text-sm font-medium text-gray-700">
                Objet
                <textarea value={form.objet} onChange={(e) => setForm({ ...form, objet: e.target.value })} rows={3} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </label>
              <label className="md:col-span-2 text-sm font-medium text-gray-700">
                Observations
                <textarea value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} rows={2} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
                  {submitting ? 'Creation...' : 'Creer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
