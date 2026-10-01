'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, DocumentTextIcon, CheckCircleIcon,
  XCircleIcon, ClockIcon,
} from '@heroicons/react/24/outline'

export default function DemandesPage() {
  const { user } = useAuthStore()
  const [demandes, setDemandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState('')

  const STATUTS = ['EN_ATTENTE', 'APPROUVEE', 'REJETEE', 'EN_COURS', 'TRAITEE', 'ANNULEE']

  const load = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (statut) params.statut = statut
      
      const data = await api.getDemandes(params)
      setDemandes(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statut])

  const filteredDemandes = demandes.filter(d =>
    d.employeNom?.toLowerCase().includes(search.toLowerCase()) ||
    d.employePrenom?.toLowerCase().includes(search.toLowerCase()) ||
    d.typeDemandeLibelle?.toLowerCase().includes(search.toLowerCase())
  )

  const handleApprove = async (id: string) => {
    try {
      await api.approveDemande(id, user?.email || 'admin')
      toast.success('Demande approuvée')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleReject = async (id: string) => {
    const motif = prompt('Motif du rejet :')
    if (!motif) return
    try {
      await api.rejectDemande(id, user?.email || 'admin', motif)
      toast.success('Demande rejetée')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-700'
      case 'APPROUVEE': return 'bg-green-100 text-green-700'
      case 'REJETEE': return 'bg-red-100 text-red-700'
      case 'EN_COURS': return 'bg-blue-100 text-blue-700'
      case 'TRAITEE': return 'bg-gray-100 text-gray-700'
      case 'ANNULEE': return 'bg-gray-100 text-gray-500'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'HAUTE': return 'bg-red-100 text-red-700'
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-700'
      case 'BASSE': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Demandes</h1>
          <p className="text-gray-500 mt-1">{filteredDemandes.length} demande{filteredDemandes.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => toast('Fonctionnalité à venir', { icon: '🚧' })}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-500/25"
        >
          <PlusIcon className="h-4 w-4" />
          Nouvelle demande
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une demande..."
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredDemandes.length === 0 ? (
          <div className="text-center py-20">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Aucune demande trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Numéro</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Employé</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Priorité</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Statut</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDemandes.map((demande) => (
                  <tr key={demande.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">{demande.numeroDemande}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {demande.employeNom} {demande.employePrenom}
                        </p>
                        <p className="text-xs text-gray-500">{demande.employeMatricule}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{demande.typeDemandeLibelle}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioriteColor(demande.priorite)}`}>
                        {demande.priorite}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {demande.dateDemande ? new Date(demande.dateDemande).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(demande.statut)}`}>
                        {demande.statut?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {user?.role !== 'EMPLOYEE' && demande.statut === 'EN_ATTENTE' && (
                          <>
                            <button
                              onClick={() => handleApprove(demande.id)}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Approuver"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(demande.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Rejeter"
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
