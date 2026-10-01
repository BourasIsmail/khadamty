'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, ExclamationTriangleIcon,
  CheckCircleIcon, XCircleIcon,
} from '@heroicons/react/24/outline'

export default function ReclamationsPage() {
  const { user } = useAuthStore()
  const [reclamations, setReclamations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState('')

  const STATUTS = ['OUVERTE', 'EN_COURS', 'RESOLUE', 'FERMEE', 'REJETEE']

  const load = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (statut) params.statut = statut
      
      const data = await api.getReclamations(params)
      setReclamations(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statut])

  const filteredReclamations = reclamations.filter(r =>
    r.employeNom?.toLowerCase().includes(search.toLowerCase()) ||
    r.employePrenom?.toLowerCase().includes(search.toLowerCase()) ||
    r.objet?.toLowerCase().includes(search.toLowerCase())
  )

  const handleResolve = async (id: string) => {
    const reponse = prompt('Réponse à la réclamation :')
    if (!reponse) return
    try {
      await api.traiterReclamation(id, user?.email || 'admin', reponse)
      toast.success('Réclamation résolue')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'OUVERTE': return 'bg-yellow-100 text-yellow-700'
      case 'EN_COURS': return 'bg-blue-100 text-blue-700'
      case 'RESOLUE': return 'bg-green-100 text-green-700'
      case 'FERMEE': return 'bg-gray-100 text-gray-700'
      case 'REJETEE': return 'bg-red-100 text-red-700'
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
          <h1 className="text-2xl font-bold text-gray-900">Suivi des Réclamations</h1>
          <p className="text-gray-500 mt-1">{filteredReclamations.length} réclamation{filteredReclamations.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => toast('Fonctionnalité à venir', { icon: '🚧' })}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-orange-500/25"
        >
          <PlusIcon className="h-4 w-4" />
          Nouvelle réclamation
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une réclamation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          >
            <option value="">Tous les statuts</option>
            {STATUTS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredReclamations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-20 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Aucune réclamation trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReclamations.map((reclamation) => (
            <div key={reclamation.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(reclamation.statut)}`}>
                    {reclamation.statut?.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioriteColor(reclamation.priorite)}`}>
                    {reclamation.priorite}
                  </span>
                </div>
                <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2">{reclamation.objet}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{reclamation.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{reclamation.employeNom} {reclamation.employePrenom}</span>
                <span>{reclamation.dateReclamation ? new Date(reclamation.dateReclamation).toLocaleDateString('fr-FR') : '—'}</span>
              </div>

              {reclamation.reponse && (
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-3">
                  <p className="text-xs font-medium text-green-700 mb-1">Réponse :</p>
                  <p className="text-xs text-green-600">{reclamation.reponse}</p>
                </div>
              )}

              {user?.role !== 'EMPLOYEE' && (reclamation.statut === 'OUVERTE' || reclamation.statut === 'EN_COURS') && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleResolve(reclamation.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg transition"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    Résoudre
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
