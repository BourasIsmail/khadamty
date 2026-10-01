'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import { api } from '@/lib/api'
import Link from 'next/link'
import {
  UserGroupIcon, UserIcon, ClockIcon, ChartBarIcon,
  ArrowUpIcon, ArrowTrendingUpIcon, CalendarDaysIcon,
  BanknotesIcon, SunIcon, DocumentTextIcon, HeartIcon,
  BriefcaseIcon, EyeIcon, EyeSlashIcon,
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [empStats, setEmpStats] = useState<any>(null)
  const [employeeProfile, setEmployeeProfile] = useState<any>(null)
  const [salaryInfo, setSalaryInfo] = useState<any>(null)
  const [salaryVisible, setSalaryVisible] = useState(false)
  const [leaveBalance, setLeaveBalance] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (user?.role === 'ADMIN') {
          const [dash, emp] = await Promise.all([api.getDashboardStats(), api.getEmployeeStats()])
          setStats(dash)
          setEmpStats(emp)
        } else if (user?.role === 'RH') {
          const emp = await api.getEmployeeStats()
          setEmpStats(emp)
        } else if (user?.role === 'EMPLOYEE') {
          const [profile, balance] = await Promise.all([api.getEmployeeProfile(), api.getLeaveBalance()])
          setEmployeeProfile(profile)
          setLeaveBalance(balance)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bonjour'
    if (h < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }

  const revealSalary = async () => {
    if (salaryVisible) {
      setSalaryVisible(false)
      return
    }
    try {
      const data = await api.getMySalary()
      setSalaryInfo(data)
      setSalaryVisible(true)
    } catch (e) {
      console.error(e)
    }
  }

  // ── ADMIN / RH ──────────────────────────────────────────────────────────
  if (user?.role === 'ADMIN' || user?.role === 'RH') {
    const cards = [
      { label: 'Total Employés',      value: empStats?.total_employees  ?? 0, icon: UserGroupIcon,     color: 'green',  change: '' },
      { label: 'Employés actifs',     value: empStats?.active_employees ?? 0, icon: UserIcon,          color: 'green',  change: '' },
      { label: 'Présents aujourd\'hui', value: stats?.presentToday      ?? 0, icon: ClockIcon,         color: 'red',    change: '' },
      { label: 'Nouveaux ce mois',    value: empStats?.new_this_month   ?? 0, icon: ArrowTrendingUpIcon, color: 'green', change: '' },
    ]

    const colorMap: Record<string, { icon: string; bg: string }> = {
      green: { icon: 'bg-primary-600 shadow-green',  bg: 'bg-primary-50' },
      red:   { icon: 'bg-danger-500 shadow-red',     bg: 'bg-red-50' },
    }

    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {greeting()}, {user?.firstName} 👋
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Tableau de bord — Khadamati</p>
          </div>
          {user?.role === 'ADMIN' && (
            <Link
              href="/dashboard/employees/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-green hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition shadow-green"
            >
              <UserIcon className="h-4 w-4" />
              Ajouter un employé
            </Link>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {loading
                      ? <span className="inline-block w-12 h-8 bg-gray-100 rounded animate-pulse" />
                      : card.value}
                  </p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg ${colorMap[card.color].icon}`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Répartition départements */}
          {empStats?.department_stats?.length > 0 && (
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
              <h3 className="text-base font-semibold text-gray-900 mb-5">Répartition par département</h3>
              <div className="space-y-3">
                {empStats.department_stats.slice(0, 6).map((dept: any) => {
                  const pct = Math.round((dept.count / (empStats.total_employees || 1)) * 100)
                  return (
                    <div key={dept.department} className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 w-36 truncate font-medium">{dept.department}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm text-gray-500 w-8 text-right font-medium">{dept.count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Actions rapides */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-2">
              {user?.role === 'ADMIN' && (
                <Link href="/dashboard/employees/new"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition group">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition">
                    <UserIcon className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Ajouter un employé</span>
                </Link>
              )}
              <Link href="/dashboard/rh"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition group">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition">
                  <BriefcaseIcon className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Gestion RH</span>
              </Link>
              <Link href="/dashboard/attendance"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition group">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition">
                  <ClockIcon className="h-4 w-4 text-danger-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Présences</span>
              </Link>
              <Link href="/dashboard/analytics"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition group">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition">
                  <ChartBarIcon className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Statistiques</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── EMPLOYEE ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting()}, {user?.firstName} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Votre espace personnel — Khadamati</p>
      </div>

      {/* Salaire mensuel */}
      <div className="gradient-green rounded-2xl p-6 text-white shadow-green relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-green-100 text-sm font-medium mb-1">Salaire mensuel net</p>
            {loading ? (
              <div className="w-44 h-10 bg-white/20 rounded-xl animate-pulse" />
            ) : (
              <p className="text-4xl font-black tracking-tight">
                {salaryVisible && salaryInfo?.salary
                  ? new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(salaryInfo.salary)
                  : '••••••'}
                {salaryVisible && <span className="text-2xl ml-2 font-semibold text-green-200">DH</span>}
              </p>
            )}
            {employeeProfile && (
              <p className="text-green-200 text-sm mt-2 font-medium">
                {employeeProfile.position} · {employeeProfile.department}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={revealSalary}
            className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm transition"
            title={salaryVisible ? 'Masquer le salaire' : 'Voir le salaire'}
          >
            {salaryVisible ? <EyeSlashIcon className="h-8 w-8 text-white" /> : <EyeIcon className="h-8 w-8 text-white" />}
          </button>
        </div>
      </div>

      {/* Solde de congés */}
      {!loading && leaveBalance && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Solde de congés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Congés annuels',    value: leaveBalance.annualLeave,   icon: SunIcon,       color: 'text-primary-600', bg: 'bg-primary-50',  bar: 'bg-primary-600', max: 25 },
              { label: 'Congés maladie',    value: leaveBalance.sickLeave,     icon: HeartIcon,     color: 'text-danger-500',  bg: 'bg-red-50',      bar: 'bg-danger-500',  max: 10 },
              { label: 'Congés personnels', value: leaveBalance.personalLeave, icon: UserIcon,      color: 'text-primary-500', bg: 'bg-primary-50',  bar: 'bg-primary-500', max: 5  },
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
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/dashboard/leave-request',   icon: CalendarDaysIcon, label: 'Demander un congé',    bg: 'bg-primary-50  hover:bg-primary-100', color: 'text-primary-600' },
            { href: '/dashboard/document-request', icon: DocumentTextIcon, label: 'Demander attestation', bg: 'bg-red-50      hover:bg-red-100',      color: 'text-danger-500' },
            { href: '/dashboard/leave-balance',    icon: SunIcon,          label: 'Mes congés',           bg: 'bg-primary-50  hover:bg-primary-100', color: 'text-primary-600' },
            { href: '/dashboard/profile',          icon: UserIcon,         label: 'Mon profil',           bg: 'bg-gray-50     hover:bg-gray-100',     color: 'text-gray-600' },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl ${a.bg} transition text-center`}>
              <a.icon className={`h-6 w-6 ${a.color}`} />
              <span className={`text-xs font-semibold ${a.color}`}>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
