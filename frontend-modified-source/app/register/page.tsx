'use client'

import { useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  MapPinIcon,
  IdentificationIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'

// ── Constants ─────────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  'Direction Générale',
  'Ressources Humaines',
  'Finance & Comptabilité',
  'Informatique',
  'Marketing & Communication',
  'Formation & Développement',
  'Action Sociale',
  'Logistique',
  'Juridique',
  'Audit & Contrôle',
]

const POSITIONS = [
  'Directeur',
  'Chef de département',
  'Chef de service',
  'Responsable',
  'Ingénieur',
  'Technicien',
  'Assistant',
  'Chargé de mission',
  'Conseiller',
  'Agent administratif',
  'Stagiaire',
]

const CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kenitra',
  'Tétouan',
  'Safi',
  'El Jadida',
]

// ── Shared UI helpers (defined OUTSIDE component functions) ───────────────────

const inputCls =
  'w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 outline-none transition-all bg-gray-50 focus:bg-white text-sm'

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
        <Icon className="w-4 h-4 text-gray-400" />
        {label}
      </label>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-700">{value || '—'}</span>
    </div>
  )
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4

interface FormData {
  // Step 1 — Identity
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  cin: string
  gender: string
  birthDate: string
  // Step 2 — Professional
  phone: string
  department: string
  position: string
  hireDate: string
  // Step 3 — Address
  address: string
  city: string
  emergencyContactName: string
  emergencyContactPhone: string
}

const INITIAL: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  cin: '',
  gender: '',
  birthDate: '',
  phone: '',
  department: '',
  position: '',
  hireDate: '',
  address: '',
  city: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
}

// ── RegisterForm ──────────────────────────────────────────────────────────────

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role') || 'EMPLOYEE'

  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = useCallback(
    (field: keyof FormData, value: string) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    []
  )

  const validateStep = (s: Step): string | null => {
    if (s === 1) {
      if (!form.firstName.trim()) return 'Le prénom est requis'
      if (!form.lastName.trim()) return 'Le nom est requis'
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
        return 'Email invalide'
      if (form.password.length < 8)
        return 'Mot de passe : 8 caractères minimum'
      if (form.password !== form.confirmPassword)
        return 'Les mots de passe ne correspondent pas'
      if (!form.cin.trim()) return 'Le CIN est requis'
    }
    if (s === 2) {
      if (!form.phone.trim()) return 'Le téléphone est requis'
      if (!form.department) return 'Le département est requis'
      if (!form.position) return 'Le poste est requis'
      if (!form.hireDate) return "La date d'embauche est requise"
    }
    if (s === 3) {
      if (!form.city) return 'La ville est requise'
    }
    return null
  }

  const next = () => {
    const err = validateStep(step)
    if (err) {
      toast.error(err)
      return
    }
    setStep(((step as number) + 1) as Step)
  }

  const prev = () => setStep(((step as number) - 1) as Step)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        department: form.department,
        position: form.position,
        hireDate: form.hireDate,
        address: form.address,
        city: form.city,
        cin: form.cin,
        birthDate: form.birthDate,
        gender: form.gender,
        emergencyContactName: form.emergencyContactName,
        emergencyContactPhone: form.emergencyContactPhone,
        role: roleParam,
      })
      setStep(4)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de l'inscription"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { n: 1, label: 'Identité' },
    { n: 2, label: 'Profil' },
    { n: 3, label: 'Coordonnées' },
  ]

  return (
    <div className="min-h-screen bg-surface flex">
      <Toaster position="top-center" />

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-2/5 bg-primary-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <Link href="/login" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl font-black text-primary-600">K</span>
            </div>
            <div>
              <p className="font-black text-white text-xl">Khadamati</p>
              <p className="text-white/60 text-xs">خدماتي · Entraide Nationale</p>
            </div>
          </Link>

          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Rejoignez
            <br />
            Khadamati
          </h2>
          <p className="text-white/70 leading-relaxed">
            Créez votre compte pour accéder à tous les services RH de
            l&apos;Entraide Nationale.
          </p>
        </div>

        {/* Visual steps */}
        <div className="relative z-10 space-y-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                step === s.n
                  ? 'bg-white/20 backdrop-blur-sm'
                  : step > s.n
                  ? 'bg-white/10'
                  : 'opacity-50'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                  step > s.n || step === s.n
                    ? 'bg-white text-primary-600'
                    : 'bg-white/20 text-white'
                }`}
              >
                {step > s.n ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  s.n
                )}
              </div>
              <span className="text-white font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        <p className="relative z-10 text-white/40 text-xs">
          © {new Date().getFullYear()} Khadamati · Royaume du Maroc
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 lg:px-12 overflow-y-auto">
        <div className="max-w-xl w-full mx-auto">

          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black">K</span>
            </div>
            <p className="font-black text-gray-900 text-lg">Khadamati</p>
          </div>

          {/* Mobile progress bar */}
          {step < 4 && (
            <div className="lg:hidden mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Étape {step} sur 3</span>
                <span>{steps[step - 1]?.label}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${((step as number) / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* ── STEP 1: Identity ── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Informations personnelles
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Renseignez vos informations d&apos;identité
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Prénom *" icon={UserIcon}>
                    <input
                      value={form.firstName}
                      onChange={(e) => set('firstName', e.target.value)}
                      placeholder="Mohamed"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Nom *" icon={UserIcon}>
                    <input
                      value={form.lastName}
                      onChange={(e) => set('lastName', e.target.value)}
                      placeholder="Alami"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label="Adresse email *" icon={EnvelopeIcon}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="m.alami@entraide.ma"
                    className={inputCls}
                  />
                </Field>

                <Field label="CIN (Carte d'identité nationale) *" icon={IdentificationIcon}>
                  <input
                    value={form.cin}
                    onChange={(e) => set('cin', e.target.value)}
                    placeholder="AB123456"
                    className={inputCls}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Genre" icon={UserGroupIcon}>
                    <select
                      value={form.gender}
                      onChange={(e) => set('gender', e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Sélectionner</option>
                      <option value="M">Homme</option>
                      <option value="F">Femme</option>
                    </select>
                  </Field>
                  <Field label="Date de naissance" icon={CalendarIcon}>
                    <input
                      type="date"
                      value={form.birthDate}
                      onChange={(e) => set('birthDate', e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label="Mot de passe *" icon={LockClosedIcon}>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => set('password', e.target.value)}
                      placeholder="8 caractères minimum"
                      className={inputCls + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPass ? (
                        <EyeSlashIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </Field>

                <Field label="Confirmer le mot de passe *" icon={LockClosedIcon}>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => set('confirmPassword', e.target.value)}
                      placeholder="Répétez le mot de passe"
                      className={inputCls + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirm ? (
                        <EyeSlashIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {form.confirmPassword &&
                    form.password !== form.confirmPassword && (
                      <p className="text-xs text-danger-500 mt-1">
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                </Field>
              </div>
            </div>
          )}

          {/* ── STEP 2: Professional ── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Profil professionnel
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Vos informations au sein de l&apos;Entraide Nationale
                </p>
              </div>

              <div className="space-y-4">
                <Field label="Téléphone *" icon={PhoneIcon}>
                  <input
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="+212 6XX XXX XXX"
                    className={inputCls}
                  />
                </Field>

                <Field label="Département *" icon={BuildingOfficeIcon}>
                  <select
                    value={form.department}
                    onChange={(e) => set('department', e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Sélectionner un département</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Poste / Fonction *" icon={BriefcaseIcon}>
                  <select
                    value={form.position}
                    onChange={(e) => set('position', e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Sélectionner un poste</option>
                    {POSITIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Date d'embauche *" icon={CalendarIcon}>
                  <input
                    type="date"
                    value={form.hireDate}
                    onChange={(e) => set('hireDate', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={inputCls}
                  />
                </Field>

                <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                  <p className="text-sm text-primary-700 font-medium">
                    ℹ️ Information
                  </p>
                  <p className="text-xs text-primary-600 mt-1">
                    Votre compte sera créé avec le rôle{' '}
                    <strong>
                      {roleParam === 'RH' ? 'Responsable RH' : 'Employé'}
                    </strong>
                    . Un administrateur pourra modifier votre profil si
                    nécessaire.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Address + recap ── */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Coordonnées
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Adresse et contact d&apos;urgence
                </p>
              </div>

              <div className="space-y-4">
                <Field label="Adresse" icon={MapPinIcon}>
                  <input
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    placeholder="N° rue, quartier..."
                    className={inputCls}
                  />
                </Field>

                <Field label="Ville *" icon={MapPinIcon}>
                  <select
                    value={form.city}
                    onChange={(e) => set('city', e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Sélectionner une ville</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Contact d&apos;urgence
                  </p>
                  <div className="space-y-4">
                    <Field label="Nom du contact" icon={UserIcon}>
                      <input
                        value={form.emergencyContactName}
                        onChange={(e) =>
                          set('emergencyContactName', e.target.value)
                        }
                        placeholder="Nom complet"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Téléphone du contact" icon={PhoneIcon}>
                      <input
                        value={form.emergencyContactPhone}
                        onChange={(e) =>
                          set('emergencyContactPhone', e.target.value)
                        }
                        placeholder="+212 6XX XXX XXX"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </div>

                {/* Recap */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Récapitulatif
                  </p>
                  <div className="space-y-1.5 text-sm">
                    <Row
                      label="Nom"
                      value={`${form.firstName} ${form.lastName}`}
                    />
                    <Row label="Email" value={form.email} />
                    <Row label="Département" value={form.department} />
                    <Row label="Poste" value={form.position} />
                    <Row label="Téléphone" value={form.phone} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Success ── */}
          {step === 4 && (
            <div className="animate-fade-in text-center py-8">
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-10 h-10 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Inscription réussie !
              </h1>
              <p className="text-gray-500 mb-2">
                Bienvenue dans Khadamati,{' '}
                <strong>{form.firstName}</strong> !
              </p>
              <p className="text-gray-400 text-sm mb-8">
                Votre compte a été créé. Vous pouvez maintenant vous
                connecter.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-green transition-all"
              >
                Se connecter
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* ── Navigation ── */}
          {step < 4 && (
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prev}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Retour
                </button>
              )}
              <button
                type="button"
                onClick={step === 3 ? handleSubmit : next}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-green transition-all disabled:opacity-60 text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Inscription...
                  </>
                ) : step === 3 ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Créer mon compte
                  </>
                ) : (
                  <>
                    Continuer
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {step < 4 && (
            <p className="text-center text-sm text-gray-400 mt-6">
              Déjà un compte ?{' '}
              <Link
                href="/login"
                className="text-primary-600 font-semibold hover:underline"
              >
                Se connecter
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Default export ─────────────────────────────────────────────────────────────

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
