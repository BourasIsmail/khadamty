'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, StarIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline'

export default function NotesAnnuellesPage() {
  const { user } = useAuthStore()
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [annee, setAnnee] = useState(new Date().getFullYear().toString())

  const load = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (annee) params.annee = parseInt(annee)
      
      const data = await api.getNotesAnnuelles(params)
      setNotes(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [annee])

  const filteredNotes = notes.filter(n =>
    n.employeNom?.toLowerCase().includes(search.toLowerCase()) ||
    n.employePrenom?.toLowerCase().includes(search.toLowerCase())
  )

  const handleValidate = async (id: string) => {
    try {
      await api.validerNoteAnnuelle(id, user?.email || 'admin')
      toast.success('Note annuelle validée')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const getAppreciationColor = (appreciation: string) => {
    switch (appreciation) {
      case 'EXCELLENT': return 'bg-green-100 text-green-700'
      case 'TRES_BIEN': return 'bg-blue-100 text-blue-700'
      case 'BIEN': return 'bg-yellow-100 text-yellow-700'
      case 'PASSABLE': return 'bg-orange-100 text-orange-700'
      case 'INSUFFISANT': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getNoteColor = (note: number) => {
    if (note >= 18) return 'text-green-600'
    if (note >= 16) return 'text-blue-600'
    if (note >= 14) return 'text-yellow-600'
    if (note >= 10) return 'text-orange-600'
    return 'text-red-600'
  }

  const moyenneNotes = filteredNotes.length > 0
    ? filteredNotes.reduce((sum, n) => sum + (n.noteFinale || 0), 0) / filteredNotes.length
    : 0

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Évaluations Annuelles</h1>
          <p className="text-gray-500 mt-1">{filteredNotes.length} évaluation{filteredNotes.length !== 1 ? 's' : ''}</p>
        </div>
        {user?.role !== 'EMPLOYEE' && (
          <button
            onClick={() => toast('Fonctionnalité à venir', { icon: '🚧' })}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-yellow-500/25"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvelle évaluation
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-100 text-sm font-medium">Note Moyenne {annee}</p>
            <p className="text-3xl font-bold mt-1">{moyenneNotes.toFixed(2)} / 20</p>
          </div>
          <StarIcon className="h-12 w-12 text-yellow-200 opacity-80" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <select
            value={annee}
            onChange={(e) => setAnnee(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = new Date().getFullYear() - i
              return <option key={y} value={y}>{y}</option>
            })}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20">
            <StarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Aucune évaluation trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Employé</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Année</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Note Finale</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Appréciation</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Évaluateur</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Statut</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {note.employeNom} {note.employePrenom}
                        </p>
                        <p className="text-xs text-gray-500">{note.employeMatricule}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{note.annee}</td>
                    <td className="px-6 py-4">
                      <span className={`text-2xl font-bold ${getNoteColor(note.noteFinale)}`}>
                        {note.noteFinale?.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500"> / 20</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAppreciationColor(note.appreciation)}`}>
                        {note.appreciation?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{note.evaluateurNom}</td>
                    <td className="px-6 py-4">
                      {note.estValidee ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Validée
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {user?.role !== 'EMPLOYEE' && !note.estValidee && (
                          <button
                            onClick={() => handleValidate(note.id)}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Valider"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
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
