'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { UserCircleIcon, KeyIcon, CheckIcon, BuildingOfficeIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [empProfile, setEmpProfile] = useState<any>(null)
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [changingPwd, setChangingPwd] = useState(false)

  const [form, setForm] = useState({ firstName: '', lastName: '' })
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  })

  useEffect(() => {
    const load = async () => {
      try {
        // Charger le profil employé si rôle EMPLOYEE
        if (user?.role === 'EMPLOYEE') {
          const data = await api.getEmployeeProfile() as any
          setEmpProfile(data)
        }
      } catch (e) {
        // Pas grave si pas de profil employé
      } finally {
        setLoading(false)
      }
    }
    // Pré-remplir avec les données du store
    setForm({ firstName: user?.firstName || '', lastName: user?.lastName || '' })
    load()
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await api.updateProfile({
        firstName: form.firstName,
        lastName:  form.lastName,
      }) as any
      updateUser({ firstName: updated.firstName, lastName: updated.lastName })
      toast.success('Profil mis à jour !')
    } catch (err: any) {
      toast.error(err.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePwd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    if (pwdForm.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    setChangingPwd(true)
    try {
      await api.changePassword({
        currentPassword: pwdForm.currentPassword,
        newPassword:     pwdForm.newPassword,
      })
      updateUser({ passwordChangeRequired: false })
      toast.success('Mot de passe modifié !')
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      toast.error(err.message || 'Erreur')
    } finally {
      setChangingPwd(false)
    }
  }

  const roleLabel = (r: string) => ({ ADMIN: 'Administrateur', RH: 'Ressources Humaines', EMPLOYEE: 'Employé' }[r] || r)
  const roleColor = (r: string) => ({ ADMIN: 'bg-red-100 text-red-700', RH: 'bg-blue-100 text-blue-700', EMPLOYEE: 'bg-emerald-100 text-emerald-700' }[r] || 'bg-gray-100 text-gray-600')

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-500 mt-1 text-sm">Gérez vos informations personnelles</p>
      </div>

      {user?.passwordChangeRequired && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-amber-800">
            Pour sécuriser votre compte, vous devez modifier le mot de passe temporaire reçu par email.
          </p>
        </div>
      )}

      {/* Avatar + infos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0 shadow-green">
            <span className="text-white text-2xl font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${roleColor(user?.role || '')}`}>
              {roleLabel(user?.role || '')}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prénom</label>
              <input type="text" required value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 outline-none text-sm transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom</label>
              <input type="text" required value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 outline-none text-sm transition-all" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-green hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition shadow-green">
              {saving
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enregistrement...</>
                : <><CheckIcon className="h-4 w-4" />Enregistrer</>}
            </button>
          </div>
        </form>
      </div>

      {/* Infos employé */}
      {user?.role === 'EMPLOYEE' && !loading && empProfile && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5 text-primary-600" />
            Informations professionnelles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: 'ID Employé',    value: empProfile.employeeId },
              { label: 'Poste',         value: empProfile.position },
              { label: 'Département',   value: empProfile.department },
              { label: 'Téléphone',     value: empProfile.phone },
              { label: "Date d'embauche", value: empProfile.hireDate ? new Date(empProfile.hireDate).toLocaleDateString('fr-FR') : '—' },
              { label: 'Statut',        value: empProfile.status === 'active' ? 'Actif' : 'Inactif' },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                <p className="font-semibold text-gray-900 mt-0.5">{item.value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Changer mot de passe */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <KeyIcon className="h-5 w-5 text-gray-400" />
          Changer le mot de passe
        </h3>
        <form onSubmit={handleChangePwd} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe actuel</label>
            <input type="password" required value={pwdForm.currentPassword}
              onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 outline-none text-sm transition-all" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nouveau mot de passe</label>
              <input type="password" required minLength={6} value={pwdForm.newPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 outline-none text-sm transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmer</label>
              <input type="password" required value={pwdForm.confirmPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 outline-none text-sm transition-all" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={changingPwd}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition">
              {changingPwd
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Modification...</>
                : <><KeyIcon className="h-4 w-4" />Modifier le mot de passe</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
