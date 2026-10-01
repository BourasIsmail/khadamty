'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, DocumentIcon, ArrowDownTrayIcon,
  TrashIcon, EyeIcon,
} from '@heroicons/react/24/outline'

export default function DocumentsPage() {
  const { user } = useAuthStore()
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (type) params.typeId = type
      
      const data = user?.role === 'EMPLOYEE'
        ? await api.getMyDocuments(params)
        : await api.getDocuments(params)
      setDocuments(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [type, user?.role])

  const filteredDocuments = documents.filter(d =>
    d.titre?.toLowerCase().includes(search.toLowerCase()) ||
    d.description?.toLowerCase().includes(search.toLowerCase()) ||
    d.typeDocumentLibelle?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Supprimer le document "${titre}" ?`)) return
    try {
      await api.deleteDocument(id)
      toast.success('Document supprimé')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await api.publishDocument(id)
      toast.success('Document publié')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDownloadPdf = async (doc: any) => {
    try {
      const name = String(doc.titre || doc.nomFichier || 'document').replace(/[^a-zA-Z0-9._-]/g, '_')
      if (user?.role === 'EMPLOYEE') {
        await api.downloadMyDocumentPdf(doc.id, `${name}.pdf`)
      } else {
        await api.downloadDocumentPdf(doc.id, `${name}.pdf`)
      }
      toast.success('Téléchargement PDF lancé')
    } catch (e: any) {
      toast.error(e.message || 'Erreur de téléchargement')
    }
  }

  const handleCreate = async () => {
    const titre = prompt('Titre du document :', 'Note de service')
    if (!titre) return
    const description = prompt('Description :', 'Document administratif publié par le service RH') || ''
    try {
      const types = await api.getTypeDocuments()
      const type = Array.isArray(types) && types.length > 0 ? types[0] : null
      if (!type) {
        toast.error('Aucun type de document disponible')
        return
      }
      await api.createDocument({
        typeDocument: { id: type.id },
        titre,
        description,
        nomFichier: `${titre.replace(/[^a-zA-Z0-9._-]/g, '_')}.pdf`,
        cheminFichier: '/documents/generated.pdf',
        typeMime: 'application/pdf',
        tailleOctets: 0,
        numeroReference: `DOC-${Date.now()}`,
        datePublication: new Date().toISOString().slice(0, 10),
        publiePar: user?.email || 'Service RH',
        estPublic: true,
        estArchive: false,
      })
      toast.success('Document créé')
      load()
    } catch (e: any) {
      toast.error(e.message || 'Erreur création document')
    }
  }

  const getFileIcon = (nomFichier: string) => {
    const ext = nomFichier?.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf': return '📄'
      case 'doc':
      case 'docx': return '📝'
      case 'xls':
      case 'xlsx': return '📊'
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️'
      default: return '📎'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bibliothèque de Documents</h1>
          <p className="text-gray-500 mt-1">{filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}</p>
        </div>
        {user?.role !== 'EMPLOYEE' && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-indigo-500/25"
          >
            <PlusIcon className="h-4 w-4" />
            Nouveau document
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
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-20 text-center">
          <DocumentIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Aucun document trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{getFileIcon(doc.nomFichier)}</div>
                {doc.estPublie ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Publié
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Brouillon
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{doc.titre}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>{doc.typeDocumentLibelle || 'Document'}</span>
                <span>{doc.dateCreation ? new Date(doc.dateCreation).toLocaleDateString('fr-FR') : '—'}</span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleDownloadPdf(doc)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg transition"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  PDF
                </button>
                {user?.role !== 'EMPLOYEE' && (
                  <>
                    {!doc.estPublie && (
                      <button
                        onClick={() => handlePublish(doc.id)}
                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg transition"
                      >
                        Publier
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(doc.id, doc.titre)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
