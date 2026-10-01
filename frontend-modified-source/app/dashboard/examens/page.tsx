'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, AcademicCapIcon, CalendarIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

export default function ExamensPage() {
  const { user } = useAuthStore()
  const [examens, setExamens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  const TYPES = ['CONCOURS', 'EXAMEN_PROFESSIONNEL', 'FORMATION_QUALIFIANTE', 'CERTIFICATION']

  const load = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (type) params.type = type
      
      const data = await api.getExamens(params)
      setExamens(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [type])

  const filteredExamens = examens.filter(e =>
    e.libelleFr?.toLowerCase().includes(search.toLowerCase()) ||
    e.libelleAr?.includes(search) ||
    e.gradeLibelle?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string, libelle: string) => {
    if (!confirm(`Supprimer l'examen "${libelle}" ?`)) return
    try {
      await api.deleteExamen(id)
      toast.success('Examen supprimé')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONCOURS': return 'bg-purple-100 text-purple-700'
      case 'EXAMEN_PROFESSIONNEL': return 'bg-blue-100 text-blue-700'
      case 'FORMATION_QUALIFIANTE': return 'bg-green-100 text-green-700'
      case 'CERTIFICATION': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const isUpcoming = (dateExamen: string) => {
    return new Date(dateExamen) > new Date()
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Concours et Examens</h1>
          <p className="text-gray-500 mt-1">{filteredExamens.length} examen{filteredExamens.length !== 1 ? 's' : ''}</p>
        </div>
        {user?.role !== 'EMPLOYEE' && (
          <button
            onClick={() => toast('Fonctionnalité à venir', { icon: '🚧' })}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-purple-500/25"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvel examen
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
              placeholder="Rechercher un examen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="">Tous les types</option>
            {TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredExamens.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-20 text-center">
          <AcademicCapIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Aucun examen trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExamens.map((examen) => (
            <div key={examen.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex items-start justify-between mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(examen.type)}`}>
                  {examen.type?.replace('_', ' ')}
                </span>
                {isUpcoming(examen.dateExamen) ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    À venir
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Passé
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{examen.libelleFr}</h3>
              {examen.libelleAr && (
                <p className="text-sm text-gray-600 mb-3" dir="rtl">{examen.libelleAr}</p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AcademicCapIcon className="h-4 w-4 text-purple-500" />
                  <span>{examen.gradeLibelle || 'Grade non spécifié'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 text-blue-500" />
                  <span>{examen.dateExamen ? new Date(examen.dateExamen).toLocaleDateString('fr-FR') : '—'}</span>
                </div>
              </div>

              {examen.description && (
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{examen.description}</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {examen.nombrePostes ? `${examen.nombrePostes} poste${examen.nombrePostes > 1 ? 's' : ''}` : 'Postes non définis'}
                </span>
                {user?.role !== 'EMPLOYEE' && (
                  <button
                    onClick={() => handleDelete(examen.id, examen.libelleFr)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
