'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, MapPinIcon, CheckCircleIcon,
  XCircleIcon, ClockIcon,
} from '@heroicons/react/24/outline'

export default function OrdresMissionPage() {
  const { user } = useAuthStore()
  const [ordres, setOrdres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState('')

  const STATUTS = ['EN_ATTENTE', 'APPROUVE', 'REJETE', 'EN_COURS', 'TERMINE', 'ANNULE']

  const load = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (statut) params.statut = statut
      if (user?.role === 'EMPLOYEE') {
        const data = await api.getMyMissionOrders(params)
        setOrdres(Array.isArray(data) ? data : [])
        return
      }
      
      const data = await api.getOrdresMission(params)
      setOrdres(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statut, user?.role])

  const filteredOrdres = ordres.filter(o =>
    o.employeNom?.toLowerCase().includes(search.toLowerCase()) ||
    o.employePrenom?.toLowerCase().includes(search.toLowerCase()) ||
    o.destination?.toLowerCase().includes(search.toLowerCase())
  )

  const handleApprove = async (id: string) => {
    try {
      await api.approveOrdreMission(id, user?.email || 'admin')
      toast.success('Ordre de mission approuvé')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleReject = async (id: string) => {
    const motif = prompt('Motif du rejet :')
    if (!motif) return
    try {
      await api.rejectOrdreMission(id, user?.email || 'admin', motif)
      toast.success('Ordre de mission rejeté')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleCreate = async () => {
    try {
      const employeesData = await api.getEmployees({ page: 1, limit: 50 })
      const employees = employeesData?.employees || []
      if (employees.length === 0) {
        toast.error('Aucun employé disponible')
        return
      }
      const employee = employees[0]
      const objet = prompt('Objet de la mission :', 'Mission administrative')
      if (!objet) return
      const lieuDepart = prompt('Lieu de départ :', 'Direction Générale')
      if (!lieuDepart) return
      const lieuArrivee = prompt('Destination :', 'Délégation provinciale')
      if (!lieuArrivee) return
      const today = new Date().toISOString().slice(0, 10)
      const dateRetour = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)
      await api.createOrdreMission({
        employee: { id: employee.id },
        numero: `OM-${Date.now()}`,
        objet,
        lieuDepart,
        lieuArrivee,
        dateDepart: today,
        dateRetour,
        dureeJours: 2,
        montantIndemnite: 300,
        montantTransport: 120,
        montantHebergement: 0,
        montantTotal: 420,
        statut: 'EN_ATTENTE',
      })
      toast.success('Ordre de mission créé')
      load()
    } catch (e: any) {
      toast.error(e.message || 'Erreur création ordre de mission')
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ordres de Mission</h1>
          <p className="text-gray-500 mt-1">{filteredOrdres.length} ordre{filteredOrdres.length !== 1 ? 's' : ''}</p>
        </div>
        {user?.role !== 'EMPLOYEE' && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-500/25"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvel ordre de mission
          </button>
        )}
      </div>

      {/* Filters */}
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
            {STATUTS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrdres.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-20 text-center">
          <MapPinIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Aucun ordre de mission trouvé</p>
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

              <h3 className="text-base font-bold text-gray-900 mb-2">
                {ordre.employeNom} {ordre.employePrenom}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Destination:</span> {ordre.destination}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Objet:</span> {ordre.objet}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <ClockIcon className="h-4 w-4" />
                <span>
                  {ordre.dateDebut ? new Date(ordre.dateDebut).toLocaleDateString('fr-FR') : '—'} → {ordre.dateFin ? new Date(ordre.dateFin).toLocaleDateString('fr-FR') : '—'}
                </span>
              </div>

              {user?.role !== 'EMPLOYEE' && ordre.statut === 'EN_ATTENTE' && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleApprove(ordre.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg transition"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    Approuver
                  </button>
                  <button
                    onClick={() => handleReject(ordre.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition"
                  >
                    <XCircleIcon className="h-4 w-4" />
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
