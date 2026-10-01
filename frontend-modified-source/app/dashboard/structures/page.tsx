'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, PencilSquareIcon,
  TrashIcon, BuildingOfficeIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline'

export default function StructuresPage() {
  const { user } = useAuthStore()
  const [structures, setStructures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingStructure, setEditingStructure] = useState<any>(null)
  const [formData, setFormData] = useState({
    code: '',
    libelleFr: '',
    libelleAr: '',
    type: 'DIRECTION',
    niveau: 1,
    structureParenteId: '',
    actif: true,
  })

  const TYPES = [
    'DIRECTION',
    'DIRECTION_ADJOINTE',
    'INSPECTION',
    'DIRECTION_REGIONALE',
    'DIRECTION_PROVINCIALE_PREFECTORALE',
    'SOUS_DIRECTION',
    'DIVISION',
    'SERVICE',
  ]

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.getStructures()
      setStructures(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filteredStructures = structures.filter(s =>
    s.code?.toLowerCase().includes(search.toLowerCase()) ||
    s.libelleFr?.toLowerCase().includes(search.toLowerCase()) ||
    s.libelleAr?.includes(search)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = { ...formData }
      if (!payload.structureParenteId) delete payload.structureParenteId
      
      if (editingStructure) {
        await api.updateStructure(editingStructure.id, payload)
        toast.success('Structure modifiée')
      } else {
        await api.createStructure(payload)
        toast.success('Structure créée')
      }
      setShowModal(false)
      setEditingStructure(null)
      resetForm()
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleEdit = (structure: any) => {
    setEditingStructure(structure)
    setFormData({
      code: structure.code || '',
      libelleFr: structure.libelleFr || '',
      libelleAr: structure.libelleAr || '',
      type: structure.type || 'DIRECTION',
      niveau: structure.niveau || 1,
      structureParenteId: structure.structureParenteId || '',
      actif: structure.actif !== false,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string, libelle: string) => {
    if (!confirm(`Supprimer la structure "${libelle}" ?`)) return
    try {
      await api.deleteStructure(id)
      toast.success('Structure supprimée')
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
      type: 'DIRECTION',
      niveau: 1,
      structureParenteId: '',
      actif: true,
    })
  }

  const openCreateModal = () => {
    setEditingStructure(null)
    resetForm()
    setShowModal(true)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DIRECTION': return 'bg-purple-100 text-purple-700'
      case 'DIRECTION_ADJOINTE': return 'bg-fuchsia-100 text-fuchsia-700'
      case 'INSPECTION': return 'bg-amber-100 text-amber-700'
      case 'DIRECTION_REGIONALE': return 'bg-cyan-100 text-cyan-700'
      case 'DIRECTION_PROVINCIALE_PREFECTORALE': return 'bg-indigo-100 text-indigo-700'
      case 'SOUS_DIRECTION': return 'bg-orange-100 text-orange-700'
      case 'SERVICE': return 'bg-blue-100 text-blue-700'
      case 'DIVISION': return 'bg-green-100 text-green-700'
      case 'DEPARTEMENT': return 'bg-yellow-100 text-yellow-700'
      case 'UNITE': return 'bg-pink-100 text-pink-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hiérarchie des Structures</h1>
          <p className="text-gray-500 mt-1">{filteredStructures.length} structure{filteredStructures.length !== 1 ? 's' : ''}</p>
        </div>
        {user?.role !== 'EMPLOYEE' && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-purple-500/25"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvelle structure
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une structure..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredStructures.length === 0 ? (
          <div className="text-center py-20">
            <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Aucune structure trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Code</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Libellé FR</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Niveau</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Statut</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStructures.map((structure) => (
                  <tr key={structure.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">{structure.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {structure.niveau > 1 && (
                          <ChevronRightIcon className="h-4 w-4 text-gray-400" style={{ marginLeft: `${(structure.niveau - 1) * 12}px` }} />
                        )}
                        <span className="text-sm text-gray-700">{structure.libelleFr}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(structure.type)}`}>
                        {structure.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">Niveau {structure.niveau}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        structure.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {structure.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {user?.role !== 'EMPLOYEE' && (
                          <>
                            <button
                              onClick={() => handleEdit(structure)}
                              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                              title="Modifier"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(structure.id, structure.libelleFr)}
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
                {editingStructure ? 'Modifier la structure' : 'Nouvelle structure'}
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Libellé Français *</label>
                <input
                  type="text"
                  required
                  value={formData.libelleFr}
                  onChange={(e) => setFormData({ ...formData, libelleFr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Libellé Arabe</label>
                <input
                  type="text"
                  value={formData.libelleAr}
                  onChange={(e) => setFormData({ ...formData, libelleAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  dir="rtl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.niveau}
                    onChange={(e) => setFormData({ ...formData, niveau: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Structure Parente</label>
                  <select
                    value={formData.structureParenteId}
                    onChange={(e) => setFormData({ ...formData, structureParenteId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Aucune</option>
                    {structures.filter(s => s.id !== editingStructure?.id).map(s => (
                      <option key={s.id} value={s.id}>{s.libelleFr}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="actif"
                  checked={formData.actif}
                  onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <label htmlFor="actif" className="text-sm font-medium text-gray-700">Structure active</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingStructure(null); resetForm() }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition"
                >
                  {editingStructure ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
