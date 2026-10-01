'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { api } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'
import {
  EyeIcon, EyeSlashIcon, ArrowRightIcon,
  EnvelopeIcon, ArrowPathIcon,
} from '@heroicons/react/24/outline'

type Mode = 'login' | 'otp'

const inputCls = 'w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 outline-none transition-all bg-gray-50 focus:bg-white text-sm'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [mode, setMode]       = useState<Mode>('login')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpEmail, setOtpEmail] = useState('')
  const [otp, setOtp]         = useState(['','','','','',''])
  const [loadingOtp, setLoadingOtp] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Timer OTP
  useEffect(() => {
    if (mode !== 'otp') return
    setResendTimer(60); setCanResend(false)
    const iv = setInterval(() => {
      setResendTimer(t => { if (t <= 1) { clearInterval(iv); setCanResend(true); return 0 } return t - 1 })
    }, 1000)
    return () => clearInterval(iv)
  }, [mode])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await api.login({ email, password }) as any
      if (data.requireOtp) {
        // Première connexion : OTP requis
        setOtpEmail(data.email)
        setMode('otp')
        toast.success('Code de vérification envoyé sur votre email !')
      } else if (data.token) {
        // Connexion directe (email déjà vérifié)
        login({ id: data.id, email: data.email, firstName: data.firstName, lastName: data.lastName, role: data.role, passwordChangeRequired: data.passwordChangeRequired }, data.token)
        toast.success(`Bienvenue ${data.firstName} !`)
        router.push(data.passwordChangeRequired ? '/dashboard/profile' : '/dashboard')
      }
    } catch (err: any) {
      toast.error(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return
    const n = [...otp]; n[i] = v.slice(-1); setOtp(n)
    if (v && i < 5) inputRefs.current[i + 1]?.focus()
    if (n.every(d => d) && n.join('').length === 6) handleVerifyOtp(n.join(''))
  }

  const handleVerifyOtp = async (code?: string) => {
    const c = code || otp.join('')
    if (c.length !== 6) { toast.error('Entrez les 6 chiffres'); return }
    setLoadingOtp(true)
    try {
      const data = await api.verifyOtp({ email: otpEmail, code: c }) as any
      login({ id: data.id, email: data.email, firstName: data.firstName, lastName: data.lastName, role: data.role, passwordChangeRequired: data.passwordChangeRequired }, data.token)
      toast.success(`Bienvenue ${data.firstName} !`)
      router.push(data.passwordChangeRequired ? '/dashboard/profile' : '/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Code incorrect ou expiré')
      setOtp(['','','','','','']); inputRefs.current[0]?.focus()
    } finally {
      setLoadingOtp(false)
    }
  }

  const handleResend = async () => {
    try {
      await api.resendOtp(otpEmail)
      toast.success('Nouveau code envoyé !')
      setOtp(['','','','','','']); setResendTimer(60); setCanResend(false)
    } catch (err: any) { toast.error(err.message || 'Erreur') }
  }

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-center" />

      {/* ── Panneau gauche ── */}
      <div className="hidden lg:flex lg:w-5/12 gradient-brand flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-2xl font-black text-primary-600">K</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Khadamati</h1>
              <p className="text-white/60 text-sm">خدماتي · Portail RH</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Bienvenue sur<br />votre espace RH
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Plateforme sécurisée de gestion des ressources humaines de l'Entraide Nationale.
          </p>
        </div>

        {/* Info accès */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15">
          <p className="text-white font-semibold text-sm mb-3">Accès à la plateforme</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-danger-500" />
              <span className="text-white/70 text-sm">Administrateur</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-600" />
              <span className="text-white/70 text-sm">Ressources Humaines</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <span className="text-white/70 text-sm">Employé</span>
            </div>
          </div>
          <p className="text-white/50 text-xs mt-3">
            Votre rôle est détecté automatiquement lors de la connexion.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">EN</span>
            </div>
            <p className="text-white/50 text-sm">Entraide Nationale · Royaume du Maroc</p>
          </div>
        </div>
      </div>

      {/* ── Panneau droit ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-14 bg-white overflow-y-auto">
        <div className="max-w-md w-full mx-auto">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">K</span>
            </div>
            <div>
              <p className="font-black text-gray-900 text-xl">Khadamati</p>
              <p className="text-gray-400 text-xs">خدماتي</p>
            </div>
          </div>

          {/* ══ FORMULAIRE DE CONNEXION ══ */}
          {mode === 'login' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h2>
                <p className="text-gray-400 text-sm">Connectez-vous à votre espace Khadamati</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse email</label>
                  <input type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={inputCls} placeholder="votre@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} required value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={inputCls + ' pr-11'} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-brand-green hover:bg-primary-700 text-white font-bold rounded-xl shadow-green transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading
                    ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Connexion...</>
                    : <><span>Se connecter</span><ArrowRightIcon className="w-5 h-5" /></>}
                </button>
              </form>

              <p className="text-center text-xs text-gray-300 mt-8">
                © {new Date().getFullYear()} Khadamati · Entraide Nationale · Maroc
              </p>
            </div>
          )}

          {/* ══ VÉRIFICATION OTP ══ */}
          {mode === 'otp' && (
            <div className="animate-fade-in">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-5">
                <EnvelopeIcon className="w-7 h-7 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Vérification</h2>
              <p className="text-gray-400 text-sm mb-8">
                Code envoyé à <span className="font-semibold text-gray-700">{otpEmail}</span>
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Code à 6 chiffres</label>
                <div className="flex gap-2 justify-between">
                  {otp.map((d, i) => (
                    <input key={i} ref={el => { inputRefs.current[i] = el }}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => { if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i-1]?.focus() }}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
                        ${d ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 bg-gray-50'}
                        focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10`}
                    />
                  ))}
                </div>
              </div>

              <button onClick={() => handleVerifyOtp()} disabled={loadingOtp || otp.some(d => !d)}
                className="w-full py-3.5 bg-brand-green hover:bg-primary-700 text-white font-bold rounded-xl shadow-green transition flex items-center justify-center gap-2 disabled:opacity-60">
                {loadingOtp
                  ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Vérification...</>
                  : <><span>Confirmer</span><ArrowRightIcon className="w-5 h-5" /></>}
              </button>

              <div className="text-center mt-5">
                {canResend
                  ? <button onClick={handleResend} className="flex items-center gap-2 mx-auto text-sm font-semibold text-primary-600 hover:text-primary-700">
                      <ArrowPathIcon className="w-4 h-4" /> Renvoyer le code
                    </button>
                  : <p className="text-sm text-gray-400">Renvoyer dans <span className="font-semibold text-gray-600">{resendTimer}s</span></p>
                }
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-5">
                <p className="text-xs text-amber-700">
                  💡 Le code s'affiche aussi dans les logs du backend si l'email n'est pas configuré.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
