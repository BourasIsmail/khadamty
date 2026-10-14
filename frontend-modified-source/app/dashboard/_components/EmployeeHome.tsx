'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { formatMoney } from '@/lib/format'
import toast from 'react-hot-toast'
import {
  ArrowDownTrayIcon, CalendarDaysIcon, DocumentTextIcon, EyeIcon, EyeSlashIcon,
  SunIcon, UserIcon,
} from '@heroicons/react/24/outline'
import PayslipDetail from './PayslipDetail'
import EngagementsTable from './EngagementsTable'
import PersonalInfo from './PersonalInfo'

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir'
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-card">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

// Accueil de l'employé : salaire du mois avec détail, engagements et crédits, données personnelles, autorisations.
export default function EmployeeHome() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<any>(null)
  const [latest, setLatest] = useState<any>(null)
  const [engagements, setEngagements] = useState<any>(null)
  const [leave, setLeave] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAmounts, setShowAmounts] = useState(false)

  useEffect(() => {
    // Chaque bloc se charge indépendamment : une erreur n'empêche pas d'afficher les autres
    Promise.allSettled([
      api.getEmployeeProfile(), api.getMyLatestPaySlip(), api.getMyEngagements(), api.getLeaveBalance(),
    ]).then(([p, l, e, b]) => {
      if (p.status === 'fulfilled') setProfile(p.value)
      if (l.status === 'fulfilled') setLatest(l.value)
      if (e.status === 'fulfilled') setEngagements(e.value)
      if (b.status === 'fulfilled') setLeave(b.value)
      setLoading(false)
    })
  }, [])

  const bulletin = latest?.bulletin
  const mask = (text: string) => (showAmounts ? text : '••••••')

  const downloadPdf = async () => {
    if (!bulletin) return
    try {
      await api.downloadMyPaySlipPdf(bulletin.id, `bulletin-paie-${bulletin.annee}-${bulletin.mois}.pdf`)
    } catch (e: any) {
      toast.error(e.message || 'Erreur de téléchargement')
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-slide-up">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting()}, {user?.firstName} 👋</h1>
          <p className="text-gray-500 mt-1 text-sm">Votre espace personnel — Khadamati</p>
        </div>
        <button type="button" onClick={() => setShowAmounts((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
          {showAmounts ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          {showAmounts ? 'Masquer les montants' : 'Afficher les montants'}
        </button>
      </div>

      {/* Salaire du mois */}
      <div className="gradient-green rounded-2xl p-6 text-white shadow-green relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="relative z-10">
          {loading ? (
            <div className="w-44 h-10 bg-white/20 rounded-xl animate-pulse" />
          ) : bulletin ? (
            <>
              <p className="text-green-100 text-sm font-medium">
                Net à payer — {bulletin.periodeLabel}
              </p>
              <p className="text-4xl font-black tracking-tight mt-1">
                {mask(formatMoney(bulletin.netAPayer))}
                {showAmounts && <span className="text-2xl ml-2 font-semibold text-green-200">DH</span>}
              </p>
              <p className="text-green-100 text-sm mt-3">
                {latest.courant
                  ? 'Bulletin du mois en cours'
                  : `Le bulletin de ${latest.periodeCourante} n’est pas encore publié — dernier bulletin disponible affiché.`}
              </p>
            </>
          ) : (
            <>
              <p className="text-green-100 text-sm font-medium">Salaire</p>
              <p className="text-xl font-semibold mt-1">Aucun bulletin de paie pour le moment</p>
            </>
          )}
        </div>
      </div>

      {bulletin && (
        <Card
          title={`Mon bulletin — ${bulletin.periodeLabel}`}
          action={
            <div className="flex gap-2">
              <button type="button" onClick={downloadPdf}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50">
                <ArrowDownTrayIcon className="h-4 w-4" /> PDF
              </button>
              <Link href="/dashboard/salaires"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50">
                Tous mes bulletins
              </Link>
            </div>
          }
        >
          {showAmounts ? (
            <PayslipDetail bulletin={bulletin} />
          ) : (
            <p className="py-6 text-center text-sm text-gray-400">
              Le détail est masqué. Cliquez sur « Afficher les montants » pour le voir.
            </p>
          )}
        </Card>
      )}

      {/* Engagements et crédits */}
      <Card
        title="Mes engagements et crédits"
        action={<Link href="/dashboard/engagements" className="text-sm font-medium text-green-700 hover:underline">Voir le détail</Link>}
      >
        {engagements && engagements.nombre > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-3 max-w-md">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-400">En cours</p>
              <p className="text-xl font-bold text-gray-900">{engagements.nombre}</p>
            </div>
            <div className="rounded-xl bg-red-50 p-3">
              <p className="text-xs text-gray-400">Prélevé chaque mois</p>
              <p className="text-xl font-bold text-red-600">{showAmounts ? `${formatMoney(engagements.totalMensualites)} DH` : '••••••'}</p>
            </div>
          </div>
        )}
        {loading ? <div className="h-16 rounded-xl bg-gray-100 animate-pulse" />
          : <EngagementsTable engagements={engagements?.engagements ?? []} hidden={!showAmounts} />}
      </Card>

      {/* Données personnelles */}
      <Card title="Mes informations personnelles"
        action={<Link href="/dashboard/profile" className="text-sm font-medium text-green-700 hover:underline">Mon profil</Link>}>
        {loading ? <div className="h-24 rounded-xl bg-gray-100 animate-pulse" />
          : profile ? <PersonalInfo profile={profile} bulletin={bulletin} />
          : <p className="text-sm text-gray-400">Informations indisponibles.</p>}
      </Card>

      {/* Solde d'autorisations */}
      {leave && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Solde d'autorisations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Autorisation annuelle', value: leave.annualLeave, icon: SunIcon, color: 'text-primary-600', bg: 'bg-primary-50', bar: 'bg-primary-600', max: 22 },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center`}>
                    <c.icon className={`h-5 w-5 ${c.color}`} />
                  </div>
                  <p className="text-sm font-medium text-gray-600">{c.label}</p>
                </div>
                <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
                <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`${c.bar} h-1.5 rounded-full`} style={{ width: `${Math.min(100, (c.value / c.max) * 100)}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{c.value} / {c.max} jours</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <Card title="Actions rapides">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/dashboard/leave-request',    icon: CalendarDaysIcon, label: 'Demander une autorisation',    bg: 'bg-primary-50 hover:bg-primary-100', color: 'text-primary-600' },
            { href: '/dashboard/document-request', icon: DocumentTextIcon, label: 'Demander attestation', bg: 'bg-red-50 hover:bg-red-100',         color: 'text-danger-500' },
            { href: '/dashboard/leave-balance',    icon: SunIcon,          label: 'Mes autorisations',           bg: 'bg-primary-50 hover:bg-primary-100', color: 'text-primary-600' },
            { href: '/dashboard/profile',          icon: UserIcon,         label: 'Mon profil',           bg: 'bg-gray-50 hover:bg-gray-100',       color: 'text-gray-600' },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl ${a.bg} transition text-center`}>
              <a.icon className={`h-6 w-6 ${a.color}`} />
              <span className={`text-xs font-semibold ${a.color}`}>{a.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
