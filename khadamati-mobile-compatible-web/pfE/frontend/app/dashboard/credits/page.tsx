'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, CreditCardIcon, TrashIcon,
} from '@heroicons/react/24/outline'

export default function CreditsPage() {
  const { user } = useAuthStore()
  const [credits, setCredits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState('')

  const STATUTS = ['EN_COURS', 'REMBOURSE', 'EN_RETARD', 'ANNULE']

  const load = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (statut) params.statut = statut
      
      const data = await api.getCredits(params)
      setCredits(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statut])

  const filteredCredits = credits.filter(c =>
    c.employeNom?.toLowerCase().includes(search.toLowerCase()) ||
    c.employePrenom?.toLowerCase().includes(search.toLowerCase()) ||
    c.libelle?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string, libelle: string) => {
    if (!confirm(`Supprimer le crédit "${libelle}" ?`)) return
    try {
      await api.deleteCredit(id)
      toast.success('Crédit supprimé')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'EN_COURS': return 'bg-blue-100 text-blue-700'
      case 'REMBOURSE': return 'bg-green-100 text-green-700'
      case 'EN_RETARD': return 'bg-red-100 text-red-700'
      case 'ANNULE': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const totalCredits = filteredCredits.reduce((sum, c) => sum + (c.montantTotal || 0), 0)
  const totalRestant = filteredCredits.reduce((sum, c) => sum + (c.montantRestant || 0), 0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suivi des Crédits</h1>
          <p className="text-gray-500 mt-1">{filteredCredits.length} crédit{filteredCredits.length !== 1 ? 's' : ''}</p>
        </div>
        {user?.role !== 'EMPLOYEE' && (
          <button
            onClick={() => toast('Fonctionnalité à venir', { icon: '🚧' })}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-indigo-500/25"
          >
            <PlusIcon className="h-4 w-4" />
            Nouveau crédit
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total des Crédits</p>
              <p className="text-3xl font-bold mt-1">{totalCredits.toLocaleString('fr-FR')} DH</p>
            </div>
            <CreditCardIcon className="h-12 w-12 text-indigo-200 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Montant Restant</p>
              <p className="text-3xl font-bold mt-1">{totalRestant.toLocaleString('fr-FR')} DH</p>
            </div>
            <CreditCardIcon className="h-12 w-12 text-orange-200 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un crédit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredCredits.length === 0 ? (
          <div className="text-center py-20">
            <CreditCardIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Aucun crédit trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Employé</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Libellé</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Montant Total</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Restant</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Mensualité</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Statut</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCredits.map((credit) => (
                  <tr key={credit.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {credit.employeNom} {credit.employePrenom}
                        </p>
                        <p className="text-xs text-gray-500">{credit.employeMatricule}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{credit.libelle}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {credit.montantTotal?.toLocaleString('fr-FR')} DH
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-orange-600">
                      {credit.montantRestant?.toLocaleString('fr-FR')} DH
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {credit.mensualite?.toLocaleString('fr-FR')} DH
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(credit.statut)}`}>
                        {credit.statut?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {user?.role !== 'EMPLOYEE' && (
                          <button
                            onClick={() => handleDelete(credit.id, credit.libelle)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
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
