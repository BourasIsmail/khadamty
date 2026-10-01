'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import Link from 'next/link'
import {
  ArrowLeftIcon, DocumentTextIcon, PlusIcon,
  ClockIcon, CheckCircleIcon, XCircleIcon,
} from '@heroicons/react/24/outline'

const DOC_TYPES = [
  { value: 'WORK_CERTIFICATE', label: 'Attestation de travail' },
  { value: 'SALARY_CERTIFICATE', label: 'Attestation de salaire' },
  { value: 'EMPLOYMENT_CONTRACT', label: 'Contrat de travail' },
  { value: 'LEAVE_BALANCE', label: 'Solde de congés' },
  { value: 'TAX_CERTIFICATE', label: 'Certificat fiscal' },
  { value: 'EXPERIENCE_CERTIFICATE', label: "Certificat d'expérience" },
]

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminé',
  REJECTED: 'Rejeté',
}

export default function DocumentRequestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ documentType: 'WORK_CERTIFICATE', purpose: '' })

  const loadRequests = async () => {
    try {
      const data = await api.getMyDocumentRequests()
      setRequests(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message || 'Erreur de chargement')
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => { loadRequests() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.requestDocument({ documentType: form.documentType, purpose: form.purpose })
      toast.success('Demande envoyée avec succès !')
      setShowForm(false)
      setForm({ documentType: 'WORK_CERTIFICATE', purpose: '' })
      loadRequests()
    } catch (e: any) {
      toast.error(e.message || 'Erreur lors de la demande')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes attestations</h1>
          <p className="text-gray-500 mt-1">Demandez vos documents administratifs</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-500/25"
        >
          <PlusIcon className="h-4 w-4" />
          Nouvelle demande
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Nouvelle demande de document</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type de document <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DOC_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm({ ...form, documentType: type.value })}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition text-left ${
                    form.documentType === type.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motif / Destination (optionnel)
            </label>
            <textarea
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              rows={3}
              placeholder="Ex: Pour une demande de visa, pour une banque..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition shadow-lg shadow-blue-500/25"
            >
              {loading ? 'Envoi...' : 'Envoyer la demande'}
            </button>
          </div>
        </form>
      )}

      {/* Liste des demandes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Mes demandes</h2>
        </div>

        {loadingList ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Aucune demande de document</p>
            <p className="text-sm mt-1">Cliquez sur "Nouvelle demande" pour commencer</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {requests.map((req: any) => (
              <div key={req.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {DOC_TYPES.find(t => t.value === req.documentType)?.label || req.documentType}
                    </p>
                    {req.purpose && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{req.purpose}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {req.createdAt && new Date(req.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {req.status === 'COMPLETED' && <CheckCircleIcon className="h-4 w-4 text-emerald-500" />}
                  {req.status === 'REJECTED' && <XCircleIcon className="h-4 w-4 text-red-500" />}
                  {(req.status === 'PENDING' || req.status === 'IN_PROGRESS') && <ClockIcon className="h-4 w-4 text-yellow-500" />}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[req.status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[req.status] || req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
