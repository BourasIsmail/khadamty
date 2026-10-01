'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, PencilSquareIcon,
  TrashIcon, AcademicCapIcon,
} from '@heroicons/react/24/outline'

export default function GradesPage() {
  const { user } = useAuthStore()
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingGrade, setEditingGrade] = useState<any>(null)
  const [formData, setFormData] = useState({
    code: '',
    libelleFr: '',
    libelleAr: '',
    description: '',
    niveauHierarchique: 1,
    salaireBase: 0,
    actif: true,
  })

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.getGrades()
      setGrades(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filteredGrades = grades.filter(g =>
    g.code?.toLowerCase().includes(search.toLowerCase()) ||
    g.libelleFr?.toLowerCase().includes(search.toLowerCase()) ||
    g.libelleAr?.includes(search)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingGrade) {
        await api.updateGrade(editingGrade.id, formData)
        toast.success('Grade modifié')
      } else {
        await api.createGrade(formData)
        toast.success('Grade créé')
      }
      setShowModal(false)
      setEditingGrade(null)
      resetForm()
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleEdit = (grade: any) => {
    setEditingGrade(grade)
    setFormData({
      code: grade.code || '',
      libelleFr: grade.libelleFr || '',
      libelleAr: grade.libelleAr || '',
      description: grade.description || '',
      niveauHierarchique: grade.niveauHierarchique || 1,
      salaireBase: grade.salaireBase || 0,
      actif: grade.actif !== false,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string, libelle: string) => {
    if (!confirm(`Supprimer le grade "${libelle}" ?`)) return
    try {
      await api.deleteGrade(id)
      toast.success('Grade supprimé')
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const resetForm = () => {
    setFormData({
      code: '',
      libelleFr: '',
      libelleAr: '',
      description: '',
      niveauHierarchique: 1,
      salaireBase: 0,
      actif: true,
    })
  }

  const openCreateModal = () => {
    setEditingGrade(null)
    resetForm()
    setShowModal(true)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Grades</h1>
          <p className="text-gray-500 mt-1">{filteredGrades.length} grade{filteredGrades.length !== 1 ? 's' : ''}</p>
        </div>
        {user?.role !== 'EMPLOYEE' && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-500/25"
          >
            <PlusIcon className="h-4 w-4" />
            Nouveau grade
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un grade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredGrades.length === 0 ? (
          <div className="text-center py-20">
            <AcademicCapIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Aucun grade trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Code</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Libellé FR</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Libellé AR</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Niveau</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Salaire Base</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Statut</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">{grade.code}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{grade.libelleFr}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{grade.libelleAr}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        Niveau {grade.niveauHierarchique}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {grade.salaireBase?.toLocaleString('fr-FR')} DH
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        grade.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {grade.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {user?.role !== 'EMPLOYEE' && (
                          <>
                            <button
                              onClick={() => handleEdit(grade)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Modifier"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(grade.id, grade.libelleFr)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Supprimer"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingGrade ? 'Modifier le grade' : 'Nouveau grade'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau Hiérarchique *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.niveauHierarchique}
                    onChange={(e) => setFormData({ ...formData, niveauHierarchique: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Libellé Français *</label>
                <input
                  type="text"
                  required
                  value={formData.libelleFr}
                  onChange={(e) => setFormData({ ...formData, libelleFr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Libellé Arabe</label>
                <input
                  type="text"
                  value={formData.libelleAr}
                  onChange={(e) => setFormData({ ...formData, libelleAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salaire de Base (DH)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salaireBase}
                  onChange={(e) => setFormData({ ...formData, salaireBase: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="actif"
                  checked={formData.actif}
                  onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="actif" className="text-sm font-medium text-gray-700">Grade actif</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingGrade(null); resetForm() }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                >
                  {editingGrade ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
