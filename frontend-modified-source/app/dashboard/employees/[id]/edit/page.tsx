'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const inputCls = 'w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition bg-gray-50 focus:bg-white'
const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5'

export default function EditEmployeePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [structures, setStructures] = useState<any[]>([])
  const [originalEmail, setOriginalEmail] = useState('')
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', position: '',
    structure_id: '', salary: '', hire_date: '', street: '',
    ec_name: '', ec_phone: '', status: 'active',
  })

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  useEffect(() => {
    Promise.all([
      api.getEmployee(params.id),
      api.getStructures({ active: true }).catch(() => []),
    ])
      .then(([emp, structs]: any[]) => {
        setStructures(Array.isArray(structs) ? structs : [])
        setOriginalEmail(emp.email || '')
        setForm({
          first_name: emp.firstName || '',
          last_name: emp.lastName || '',
          email: emp.email || '',
          phone: emp.phone || '',
          position: emp.position || '',
          structure_id: emp.structureId || '',
          salary: '',
          hire_date: emp.hireDate ? String(emp.hireDate).slice(0, 10) : '',
          street: emp.address || '',
          ec_name: emp.emergencyContact || '',
          ec_phone: emp.emergencyPhone || '',
          status: emp.status || 'active',
        })
      })
      .catch((e: any) => {
        toast.error(e.message || 'Employé introuvable')
        router.push('/dashboard/employees')
      })
      .finally(() => setLoading(false))
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload: Record<string, any> = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        position: form.position,
        hire_date: form.hire_date,
        street: form.street,
        ec_name: form.ec_name,
        ec_phone: form.ec_phone,
        status: form.status,
      }
      if (form.structure_id) payload.structure_id = form.structure_id
      // Salaire laissé vide = inchangé
      if (form.salary.trim() !== '') payload.salary = parseFloat(form.salary)
      await api.updateEmployee(params.id, payload)
      toast.success('Employé mis à jour')
      router.push(`/dashboard/employees/${params.id}`)
    } catch (err: any) {
      toast.error((err.message || 'Erreur lors de la mise à jour').replace(/^Error:\s*/, ''))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const emailChanged = form.email.trim().toLowerCase() !== originalEmail.toLowerCase()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/employees/${params.id}`}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier l'employé</h1>
          <p className="text-gray-500 text-sm mt-0.5">{originalEmail}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Informations personnelles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Prénom *</label>
              <input type="text" required value={form.first_name} onChange={e => set('first_name', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Nom *</label>
              <input type="text" required value={form.last_name} onChange={e => set('last_name', e.target.value)} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Email (identifiant de connexion) *</label>
              <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
              {emailChanged && (
                <p className="text-xs text-amber-600 mt-1.5">
                  L'email de connexion sera aussi modifié : l'employé devra se reconnecter avec la nouvelle adresse.
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>Téléphone</label>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Adresse</label>
              <input type="text" value={form.street} onChange={e => set('street', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Poste</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Poste *</label>
              <input type="text" required value={form.position} onChange={e => set('position', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Date d'embauche</label>
              <input type="date" value={form.hire_date} onChange={e => set('hire_date', e.target.value)} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Structure</label>
              <select value={form.structure_id} onChange={e => set('structure_id', e.target.value)} className={inputCls}>
                <option value="">Inchangée</option>
                {structures.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.structurePath || s.libelleFr || s.nomFr || s.code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Statut</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="terminated">Terminé</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Salaire (MAD)</label>
              <input type="number" min="0" step="0.01" value={form.salary}
                onChange={e => set('salary', e.target.value)} className={inputCls}
                placeholder="Laisser vide pour ne pas changer" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Contact d'urgence</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nom</label>
              <input type="text" value={form.ec_name} onChange={e => set('ec_name', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Téléphone</label>
              <input type="tel" value={form.ec_phone} onChange={e => set('ec_phone', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href={`/dashboard/employees/${params.id}`}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Annuler
          </Link>
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-50">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}
