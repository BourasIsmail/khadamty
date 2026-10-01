'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, BellIcon,
  TrashIcon, CheckCircleIcon, XCircleIcon, XMarkIcon,
} from '@heroicons/react/24/outline'

const emptyForm = {
  titre: '',
  message: '',
  expireLe: '',
  estActive: true,
}

export default function AnnoncesPage() {
  const { user } = useAuthStore()
  const [annonces, setAnnonces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'active' | 'all'>('active')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const canManage = user?.role === 'ADMIN' || user?.role === 'RH'

  const load = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filter === 'active') params.active = true
      const data = await api.getAnnonces(params)
      setAnnonces(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message || 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter])

  const filteredAnnonces = annonces.filter((annonce) => {
    const q = search.toLowerCase()
    return (
      (annonce.titre || '').toLowerCase().includes(q) ||
      (annonce.message || annonce.contenu || '').toLowerCase().includes(q)
    )
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.titre.trim() || !form.message.trim()) {
      toast.error('Titre et message obligatoires')
      return
    }

    setSubmitting(true)
    try {
      await api.createAnnonce({
        titre: form.titre,
        message: form.message,
        estActive: form.estActive,
        publieLe: new Date().toISOString(),
        expireLe: form.expireLe ? `${form.expireLe}T23:59:59` : null,
      })
      toast.success('Annonce creee')
      setShowForm(false)
      setForm(emptyForm)
      load()
    } catch (e: any) {
      toast.error(e.message || 'Creation impossible')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Supprimer l'annonce "${titre}" ?`)) return
    try {
      await api.deleteAnnonce(id)
      toast.success('Annonce supprimee')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleActivate = async (id: string) => {
    try {
      await api.publishAnnonce(id)
      toast.success('Annonce activee')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDeactivate = async (id: string) => {
    try {
      await api.deactivateAnnonce(id)
      toast.success('Annonce desactivee')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const isExpired = (annonce: any) => annonce.expireLe && new Date(annonce.expireLe) < new Date()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Annonces</h1>
          <p className="text-gray-500 mt-1">{filteredAnnonces.length} annonce{filteredAnnonces.length !== 1 ? 's' : ''}</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-green-700/20"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvelle annonce
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une annonce..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: 'active', label: 'Actives' },
              { value: 'all', label: 'Toutes' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value as any)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  filter === item.value
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredAnnonces.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-20 text-center">
          <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Aucune annonce trouvee</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnnonces.map((annonce) => (
            <div key={annonce.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {annonce.estActive ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Inactive</span>
                  )}
                  {isExpired(annonce) && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Expiree</span>
                  )}
                </div>
                {annonce.estActive ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-300" />
                )}
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{annonce.titre}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{annonce.message || annonce.contenu}</p>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>{annonce.creePar?.email || 'Systeme'}</span>
                <span>{annonce.publieLe ? new Date(annonce.publieLe).toLocaleDateString('fr-FR') : '-'}</span>
              </div>

              {canManage && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  {annonce.estActive ? (
                    <button onClick={() => handleDeactivate(annonce.id)} className="flex-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg transition">
                      Desactiver
                    </button>
                  ) : (
                    <button onClick={() => handleActivate(annonce.id)} className="flex-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg transition">
                      Activer
                    </button>
                  )}
                  <button onClick={() => handleDelete(annonce.id, annonce.titre)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Nouvelle annonce</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Titre
                <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600" required />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Message
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600" required />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Expire le
                  <input type="date" value={form.expireLe} onChange={(e) => setForm({ ...form, expireLe: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600" />
                </label>
                <label className="flex items-center gap-2 mt-7 text-sm font-medium text-gray-700">
                  <input type="checkbox" checked={form.estActive} onChange={(e) => setForm({ ...form, estActive: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600" />
                  Publier maintenant
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">Annuler</button>
                <button type="submit" disabled={submitting} className="px-4 py-2.5 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 disabled:opacity-60">
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
