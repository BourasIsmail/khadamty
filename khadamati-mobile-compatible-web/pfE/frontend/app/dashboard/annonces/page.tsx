'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, BellIcon, EyeIcon,
  TrashIcon, CheckCircleIcon, XCircleIcon,
} from '@heroicons/react/24/outline'

export default function AnnoncesPage() {
  const { user } = useAuthStore()
  const [annonces, setAnnonces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'publiee'>('active')

  const load = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filter === 'active') params.active = true
      if (filter === 'publiee') params.publiee = true
      
      const data = user?.role === 'EMPLOYEE'
        ? await api.getMyAnnouncements()
        : await api.getAnnonces(params)
      setAnnonces(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter, user?.role])

  const filteredAnnonces = annonces.filter(a => 
    a.titre?.toLowerCase().includes(search.toLowerCase()) ||
    a.contenu?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Supprimer l'annonce "${titre}" ?`)) return
    try {
      await api.deleteAnnonce(id)
      toast.success('Annonce supprimée')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await api.publishAnnonce(id)
      toast.success('Annonce publiée')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleCreate = async () => {
    const titre = prompt("Titre de l'annonce :")
    if (!titre) return
    const message = prompt("Message de l'annonce :")
    if (!message) return
    try {
      await api.createAnnonce({
        titre,
        message,
        estActive: true,
        publieLe: new Date().toISOString(),
      })
      toast.success('Annonce créée')
      load()
    } catch (e: any) {
      toast.error(e.message || 'Erreur création annonce')
    }
  }

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'HAUTE': return 'bg-red-100 text-red-700'
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-700'
      case 'BASSE': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INFORMATION': return 'bg-blue-100 text-blue-700'
      case 'ALERTE': return 'bg-red-100 text-red-700'
      case 'EVENEMENT': return 'bg-purple-100 text-purple-700'
      case 'URGENT': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Annonces</h1>
          <p className="text-gray-500 mt-1">{filteredAnnonces.length} annonce{filteredAnnonces.length !== 1 ? 's' : ''}</p>
        </div>
        {user?.role !== 'EMPLOYEE' && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-primary-500/25"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvelle annonce
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
              placeholder="Rechercher une annonce..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: 'active', label: 'Actives' },
              { value: 'publiee', label: 'Publiées' },
              { value: 'all', label: 'Toutes' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as any)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  filter === f.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Annonces Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredAnnonces.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-20 text-center">
          <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Aucune annonce trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnnonces.map((annonce) => (
            <div key={annonce.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(annonce.type)}`}>
                    {annonce.type}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(annonce.priorite)}`}>
                    {annonce.priorite}
                  </span>
                </div>
                {annonce.estPubliee ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" title="Publiée" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-300" title="Non publiée" />
                )}
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{annonce.titre}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{annonce.contenu}</p>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>{annonce.publiePar || 'Système'}</span>
                <span>{annonce.datePublication ? new Date(annonce.datePublication).toLocaleDateString('fr-FR') : 'Non publié'}</span>
              </div>

              {user?.role !== 'EMPLOYEE' && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  {!annonce.estPubliee && (
                    <button
                      onClick={() => handlePublish(annonce.id)}
                      className="flex-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg transition"
                    >
                      Publier
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(annonce.id, annonce.titre)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition"
                  >
                    <TrashIcon className="h-4 w-4" />
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
