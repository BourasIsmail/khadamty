'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { ArrowLeftIcon, PencilSquareIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  active: { label: 'Actif', cls: 'bg-emerald-100 text-emerald-700' },
  inactive: { label: 'Inactif', cls: 'bg-yellow-100 text-yellow-700' },
  terminated: { label: 'Terminé', cls: 'bg-red-100 text-red-700' },
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 break-words">{value || '—'}</dd>
    </div>
  )
}

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuthStore()
  const [employee, setEmployee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [salary, setSalary] = useState<number | null>(null)
  const [salaryLoading, setSalaryLoading] = useState(false)

  useEffect(() => {
    api.getEmployee(params.id)
      .then(setEmployee)
      .catch((e: any) => {
        toast.error(e.message || 'Employé introuvable')
        router.push('/dashboard/employees')
      })
      .finally(() => setLoading(false))
  }, [params.id, router])

  const toggleSalary = async () => {
    if (salary !== null) { setSalary(null); return }
    setSalaryLoading(true)
    try {
      const data = await api.getEmployeeSalary(params.id)
      setSalary(Number(data.salary ?? 0))
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSalaryLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!employee) return null

  const status = STATUS_LABELS[employee.status] ?? { label: employee.status || '—', cls: 'bg-gray-100 text-gray-600' }
  const fullName = `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim()
  const hireDate = employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('fr-FR') : ''

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/dashboard/employees"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{fullName}</h1>
            <p className="text-gray-500 text-sm mt-0.5 truncate">{employee.position || 'Poste non renseigné'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.cls}`}>
            {status.label}
          </span>
          {user?.role === 'ADMIN' && (
            <Link href={`/dashboard/employees/${employee.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition">
              <PencilSquareIcon className="h-4 w-4" /> Modifier
            </Link>
          )}
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Informations personnelles</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Field label="Matricule" value={employee.employeeId} />
          <Field label="Email" value={employee.email} />
          <Field label="Téléphone" value={employee.phone} />
          <Field label="Adresse" value={employee.address} />
          <Field label="Date d'embauche" value={hireDate} />
          <Field label="Poste" value={employee.position} />
        </dl>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Structure</h2>
        <dl className="grid grid-cols-1 gap-4">
          <Field label="Structure" value={employee.structureLibelle || employee.department} />
          <Field label="Chemin hiérarchique" value={employee.structurePath} />
        </dl>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Autorisations</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Annuelle" value={employee.annualLeaveBalance != null ? `${employee.annualLeaveBalance} j` : ''} />
        </dl>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Contact d'urgence</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nom" value={employee.emergencyContact} />
          <Field label="Téléphone" value={employee.emergencyPhone} />
        </dl>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Rémunération</h2>
          <button onClick={toggleSalary} disabled={salaryLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-xl transition disabled:opacity-50">
            {salary !== null ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            {salary !== null ? 'Masquer' : 'Afficher le salaire'}
          </button>
        </div>
        <p className="mt-3 text-2xl font-bold text-gray-900">
          {salary !== null ? `${salary.toLocaleString('fr-FR')} MAD` : '••••••'}
        </p>
      </section>
    </div>
  )
}
