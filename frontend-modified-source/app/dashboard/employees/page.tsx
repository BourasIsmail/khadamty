'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, PlusIcon, PencilSquareIcon,
  TrashIcon, EyeIcon, FunnelIcon,
} from '@heroicons/react/24/outline'

const STATUSES = [
  { value: 'active', label: 'Actif', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'inactive', label: 'Inactif', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'terminated', label: 'Terminé', color: 'bg-red-100 text-red-700' },
]

export default function EmployeesPage() {
  const { user } = useAuthStore()
  const [employees, setEmployees] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.getEmployees({ page, limit: 10, search, department, status }) as any
      setEmployees(data.employees)
      setTotal(data.total)
      setTotalPages(data.total_pages)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, search, department, status])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer ${name} ? Cette action est irréversible.`)) return
    setDeleting(id)
    try {
      await api.deleteEmployee(id)
      toast.success('Employé supprimé')
      load()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setDeleting(null)
    }
  }

  const statusBadge = (s: string) => {
    const found = STATUSES.find((x) => x.value === s)
    return found ? (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${found.color}`}>
        {found.label}
      </span>
    ) : null
  }

  const structureLabel = (emp: any) =>
    emp.structurePath || emp.structureLibelle || emp.department || 'Sans structure'

  const structureGroups = employees.reduce((groups: Record<string, number>, emp) => {
    const label = structureLabel(emp)
    groups[label] = (groups[label] || 0) + 1
    return groups
  }, {})

  const departmentOptions = Array.from(new Set(employees.map(structureLabel))).filter(Boolean)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employés</h1>
          <p className="text-gray-500 mt-1">{total} employé{total !== 1 ? 's' : ''} au total</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Link
            href="/dashboard/employees/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-500/25"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvel employé
          </Link>
        )}
      </div>

      {!loading && employees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {(Object.entries(structureGroups) as [string, number][]).slice(0, 8).map(([label, count]) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Equipe</p>
              <p className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">{label}</p>
              <p className="text-2xl font-bold text-blue-600 mt-3">{count}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, poste..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={department}
            onChange={(e) => { setDepartment(e.target.value); setPage(1) }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Toutes les structures</option>
            {departmentOptions.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Tous les statuts</option>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <UserGroupIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Aucun employé trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Employé</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Poste</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Structure</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Statut</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Embauche</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-semibold">
                            {(emp.firstName || emp.first_name)?.[0]}{(emp.lastName || emp.last_name)?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {emp.firstName || emp.first_name} {emp.lastName || emp.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{emp.position}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {structureLabel(emp)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{statusBadge(emp.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {emp.hireDate || emp.hire_date
                        ? new Date(emp.hireDate || emp.hire_date).toLocaleDateString('fr-FR')
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/dashboard/employees/${emp.id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Voir"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        {user?.role === 'ADMIN' && (
                          <>
                            <Link
                              href={`/dashboard/employees/${emp.id}/edit`}
                              className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                              title="Modifier"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(
                                emp.id,
                                `${emp.firstName || emp.first_name} ${emp.lastName || emp.last_name}`
                              )}
                              disabled={deleting === emp.id}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} sur {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function UserGroupIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  )
}
