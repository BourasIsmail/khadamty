'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { generatePassword } from '@/lib/password'
import CredentialsDialog from '../../_components/CredentialsDialog'

// ── Définis EN DEHORS du composant pour éviter le re-render à chaque frappe ──
const inputCls = 'w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition bg-gray-50 focus:bg-white'

const generateEmployeeCode = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000)
  return `EMP-${year}-${random}`
}

export default function NewEmployeePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [structures, setStructures] = useState<any[]>([])
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [created, setCreated] = useState<{ email: string; matricule: string; password: string | null; message: string; emailSent: boolean } | null>(null)
  const [form, setForm] = useState({
    employee_id: generateEmployeeCode(), first_name: '', last_name: '', email: '', phone: '',
    position: '', department: '', structure_id: '', salary: '', hire_date: '',
    street: '', city: '', ec_name: '', ec_phone: '',
    user_role: 'employee', // 'employee' ou 'user' (RH)
  })

  const set = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }))

  useEffect(() => {
    api.getStructures({ active: true })
      .then((data) => setStructures(Array.isArray(data) ? data : []))
      .catch(() => setStructures([]))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.createEmployee({
        employee_id:  form.employee_id,
        first_name:   form.first_name,
        last_name:    form.last_name,
        email:        form.email,
        phone:        form.phone,
        position:     form.position,
        department:   form.department,
        structure_id:  form.structure_id,
        salary:       parseFloat(form.salary),
        hire_date:    form.hire_date,
        street:       form.street,
        ec_name:      form.ec_name,
        ec_phone:     form.ec_phone,
        create_user_account: true,
        user_role: form.user_role,
        ...(password.trim() ? { password: password.trim() } : {}),
      })
      // Mot de passe à communiquer : celui saisi, sinon celui généré par le serveur (montré une seule fois)
      const shown = res.temporaryPassword || (res.accountCreated && password.trim() ? password.trim() : null)
      setCreated({
        email: form.email,
        matricule: form.employee_id,
        password: shown,
        message: res.message || 'Employé créé',
        emailSent: !!res.emailSent,
      })
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/employees"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvel employé</h1>
          <p className="text-gray-500 text-sm mt-0.5">Remplissez les informations de l'employé</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Informations personnelles */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Informations personnelles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ID Employé</label>
              <div className="flex gap-2">
                <input type="text" value={form.employee_id}
                  onChange={e => set('employee_id', e.target.value)}
                  className={inputCls} placeholder="Auto si vide" />
                <button
                  type="button"
                  onClick={() => set('employee_id', generateEmployeeCode())}
                  className="px-3 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Generer
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prénom *</label>
              <input type="text" required value={form.first_name}
                onChange={e => set('first_name', e.target.value)}
                className={inputCls} placeholder="Mohamed" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom *</label>
              <input type="text" required value={form.last_name}
                onChange={e => set('last_name', e.target.value)}
                className={inputCls} placeholder="Alami" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
              <input type="email" required value={form.email}
                onChange={e => set('email', e.target.value)}
                className={inputCls} placeholder="m.alami@entraide.ma" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone *</label>
              <input type="tel" required value={form.phone}
                onChange={e => set('phone', e.target.value)}
                className={inputCls} placeholder="+212 6XX XXX XXX" />
            </div>

          </div>
        </div>

        {/* Informations professionnelles */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Informations professionnelles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Poste / Fonction *</label>
              <input type="text" required value={form.position}
                onChange={e => set('position', e.target.value)}
                className={inputCls} placeholder="Ingénieur, Technicien..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Structure *</label>
              <select required value={form.structure_id}
                onChange={e => {
                  const selected = structures.find((s) => s.id === e.target.value)
                  setForm(prev => ({
                    ...prev,
                    structure_id: e.target.value,
                    department: selected?.libelleFr || selected?.nomFr || '',
                  }))
                }}
                className={inputCls}>
                <option value="">Sélectionner...</option>
                {structures.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.structurePath || `${'--'.repeat(Math.max((s.niveau || 1) - 1, 0))} ${s.libelleFr || s.nomFr || s.code}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Salaire mensuel (DH) *</label>
              <input type="number" required min="0" value={form.salary}
                onChange={e => set('salary', e.target.value)}
                className={inputCls} placeholder="8000" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date d'embauche *</label>
              <input type="date" required value={form.hire_date}
                onChange={e => set('hire_date', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={inputCls} />
            </div>

          </div>
        </div>

        {/* Adresse */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Adresse</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Adresse complète</label>
              <input type="text" value={form.street}
                onChange={e => set('street', e.target.value)}
                className={inputCls} placeholder="N° rue, quartier, ville..." />
            </div>

          </div>
        </div>

        {/* Contact d'urgence */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Contact d'urgence</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom du contact</label>
              <input type="text" value={form.ec_name}
                onChange={e => set('ec_name', e.target.value)}
                className={inputCls} placeholder="Nom complet" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone du contact</label>
              <input type="tel" value={form.ec_phone}
                onChange={e => set('ec_phone', e.target.value)}
                className={inputCls} placeholder="+212 6XX XXX XXX" />
            </div>

          </div>
        </div>

        {/* Compte utilisateur — OBLIGATOIRE */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Compte de connexion</h2>
          <p className="text-sm text-gray-400 mb-4">Définissez le mot de passe initial, ou laissez le champ vide pour en générer un automatiquement.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type de compte *</label>
              <select required value={form.user_role}
                onChange={e => set('user_role', e.target.value)}
                className={inputCls}>
                <option value="employee">Employé (accès limité)</option>
                <option value="user">RH (gestion des employés)</option>
              </select>
              <p className="text-xs text-gray-400 mt-1.5">
                {form.user_role === 'employee' 
                  ? '👤 Employé : peut consulter son profil, demander des autorisations et attestations'
                  : '👔 RH : peut gérer les employés, valider les demandes et consulter les statistiques'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe initial</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} minLength={8}
                    autoComplete="new-password" className={inputCls + ' pr-10'}
                    placeholder="8 caractères minimum — vide = généré automatiquement" />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Masquer' : 'Afficher'}>
                    {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                <button type="button" onClick={() => { setPassword(generatePassword()); setShowPassword(true) }}
                  className="px-3 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50">
                  Générer
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Le mot de passe vous sera affiché après la création pour le transmettre à l'employé.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs text-blue-700">
                Email de connexion : <span className="font-semibold">{form.email || 'à renseigner ci-dessus'}</span>. 
                A la première connexion, l'employé sera obligé de changer son mot de passe.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <Link href="/dashboard/employees"
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
            Annuler
          </Link>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 text-sm font-bold text-white bg-brand-green hover:bg-primary-700 disabled:opacity-60 rounded-xl transition shadow-green flex items-center gap-2">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Création...</>
              : "Créer l'employé"}
          </button>
        </div>

      </form>

      {created && (
        <CredentialsDialog
          title="Employé créé"
          rows={[
            { label: 'Matricule', value: created.matricule },
            { label: 'Email de connexion', value: created.email },
            ...(created.password ? [{ label: 'Mot de passe temporaire', value: created.password, secret: true }] : []),
          ]}
          note={created.password
            ? `${created.message} Ce mot de passe n'est affiché qu'une seule fois : transmettez-le à l'employé, qui devra le changer à sa première connexion.`
            : created.message}
          onClose={() => router.push('/dashboard/employees')}
        />
      )}
    </div>
  )
}
