'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, DocumentIcon, ArrowDownTrayIcon,
  TrashIcon, XMarkIcon,
} from '@heroicons/react/24/outline'

const emptyForm = {
  typeDocumentId: '',
  titre: '',
  description: '',
  nomFichier: '',
  numeroReference: '',
  estPublic: true,
}

export default function DocumentsPage() {
  const { user } = useAuthStore()
  const [documents, setDocuments] = useState<any[]>([])
  const [types, setTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const canManage = user?.role === 'ADMIN' || user?.role === 'RH'

  const loadTypes = async () => {
    const data = await api.getTypeDocuments()
    const list = Array.isArray(data) ? data : []
    setTypes(list)
    if (list.length > 0 && !form.typeDocumentId) {
      setForm((current) => ({ ...current, typeDocumentId: list[0].id }))
    }
  }

  const load = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (type) params.typeId = type
      if (user?.role === 'EMPLOYEE') {
        params.publique = true
        params.archive = false
      }
      const data = await api.getDocuments(params)
      setDocuments(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message || 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTypes().catch((e: any) => toast.error(e.message || 'Erreur types documents'))
  }, [])

  useEffect(() => { load() }, [type, user?.role])

  const typeLabel = (doc: any) => doc.typeDocument?.libelle || doc.typeDocumentLibelle || 'Document'

  const filteredDocuments = documents.filter((doc) => {
    const q = search.toLowerCase()
    return (
      (doc.titre || '').toLowerCase().includes(q) ||
      (doc.description || '').toLowerCase().includes(q) ||
      typeLabel(doc).toLowerCase().includes(q)
    )
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.typeDocumentId || !form.titre.trim()) {
      toast.error('Type et titre obligatoires')
      return
    }

    const filename = form.nomFichier.trim() || `${form.titre.trim().replace(/[^a-zA-Z0-9._-]/g, '_')}.pdf`

    setSubmitting(true)
    try {
      await api.createDocument({
        typeDocument: { id: form.typeDocumentId },
        titre: form.titre,
        description: form.description,
        nomFichier: filename,
        cheminFichier: `/documents/${filename}`,
        typeMime: 'application/pdf',
        tailleOctets: 0,
        numeroReference: form.numeroReference || `DOC-${Date.now().toString().slice(-6)}`,
        datePublication: form.estPublic ? new Date().toISOString().slice(0, 10) : null,
        publiePar: user?.email || 'systeme',
        estPublic: form.estPublic,
        estArchive: false,
      })
      toast.success('Document cree')
      setShowForm(false)
      setForm({ ...emptyForm, typeDocumentId: types[0]?.id || '' })
      load()
    } catch (e: any) {
      toast.error(e.message || 'Creation impossible')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Supprimer le document "${titre}" ?`)) return
    try {
      await api.deleteDocument(id)
      toast.success('Document supprime')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await api.publishDocument(id)
      toast.success('Document publie')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDownloadPdf = async (doc: any) => {
    try {
      const name = String(doc.titre || doc.nomFichier || 'document').replace(/[^a-zA-Z0-9._-]/g, '_')
      await api.downloadDocumentPdf(doc.id, `${name}.pdf`)
      toast.success('Telechargement PDF lance')
    } catch (e: any) {
      toast.error(e.message || 'Erreur de telechargement')
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bibliotheque de Documents</h1>
          <p className="text-gray-500 mt-1">{filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-indigo-500/25"
          >
            <PlusIcon className="h-4 w-4" />
            Nouveau document
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">Tous les types</option>
            {types.map((item) => (
              <option key={item.id} value={item.id}>{item.libelle}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-20 text-center">
          <DocumentIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Aucun document trouve</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex items-start justify-between mb-3">
                <DocumentIcon className="h-8 w-8 text-indigo-500" />
                {doc.estPublic ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Publie</span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Brouillon</span>
                )}
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{doc.titre}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>{typeLabel(doc)}</span>
                <span>{doc.datePublication ? new Date(doc.datePublication).toLocaleDateString('fr-FR') : '-'}</span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleDownloadPdf(doc)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg transition"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  PDF
                </button>
                {canManage && (
                  <>
                    {!doc.estPublic && (
                      <button onClick={() => handlePublish(doc.id)} className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg transition">
                        Publier
                      </button>
                    )}
                    <button onClick={() => handleDelete(doc.id, doc.titre)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Nouveau document</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Type
                <select value={form.typeDocumentId} onChange={(e) => setForm({ ...form, typeDocumentId: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" required>
                  <option value="">Choisir un type</option>
                  {types.map((item) => <option key={item.id} value={item.id}>{item.libelle}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Titre
                <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Description
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nom fichier
                  <input value={form.nomFichier} onChange={(e) => setForm({ ...form, nomFichier: e.target.value })} placeholder="document.pdf" className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Reference
                  <input value={form.numeroReference} onChange={(e) => setForm({ ...form, numeroReference: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" checked={form.estPublic} onChange={(e) => setForm({ ...form, estPublic: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                Publier maintenant
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">Annuler</button>
                <button type="submit" disabled={submitting} className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60">
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
