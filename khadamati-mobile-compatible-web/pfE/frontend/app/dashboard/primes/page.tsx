'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, GiftIcon, TrashIcon,
} from '@heroicons/react/24/outline'

export default function PrimesPage() {
  const { user } = useAuthStore()
  const [primes, setPrimes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  const TYPES = ['PERFORMANCE', 'ANCIENNETE', 'RESPONSABILITE', 'RISQUE', 'EXCEPTIONNELLE']

  const load = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (type) params.type = type
      
      const data = await api.getPrimes(params)
      setPrimes(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [type])

  const filteredPrimes = primes.filter(p =>
    p.employeNom?.toLowerCase().includes(search.toLowerCase()) ||
    p.employePrenom?.toLowerCase().includes(search.toLowerCase()) ||
    p.libelle?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string, libelle: string) => {
    if (!confirm(`Supprimer la prime "${libelle}" ?`)) return
    try {
      await api.deletePrime(id)
      toast.success('Prime supprimée')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PERFORMANCE': return 'bg-green-100 text-green-700'
      case 'ANCIENNETE': return 'bg-blue-100 text-blue-700'
      case 'RESPONSABILITE': return 'bg-purple-100 text-purple-700'
      case 'RISQUE': return 'bg-orange-100 text-orange-700'
      case 'EXCEPTIONNELLE': return 'bg-pink-100 text-pink-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const totalPrimes = filteredPrimes.reduce((sum, p) => sum + (p.montant || 0), 0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Primes</h1>
          <p className="text-gray-500 mt-1">{filteredPrimes.length} prime{filteredPrimes.length !== 1 ? 's' : ''}</p>
        </div>
        {user?.role !== 'EMPLOYEE' && (
          <button
            onClick={() => toast('Fonctionnalité à venir', { icon: '🚧' })}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-green-500/25"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvelle prime
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Total des Primes</p>
            <p className="text-3xl font-bold mt-1">{totalPrimes.toLocaleString('fr-FR')} DH</p>
          </div>
          <GiftIcon className="h-12 w-12 text-green-200 opacity-80" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une prime..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Tous les types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPrimes.length === 0 ? (
          <div className="text-center py-20">
            <GiftIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Aucune prime trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Employé</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Libellé</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Montant</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Date</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPrimes.map((prime) => (
                  <tr key={prime.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {prime.employeNom} {prime.employePrenom}
                        </p>
                        <p className="text-xs text-gray-500">{prime.employeMatricule}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{prime.libelle}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(prime.type)}`}>
                        {prime.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      {prime.montant?.toLocaleString('fr-FR')} DH
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {prime.dateAttribution ? new Date(prime.dateAttribution).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {user?.role !== 'EMPLOYEE' && (
                          <button
                            onClick={() => handleDelete(prime.id, prime.libelle)}
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
