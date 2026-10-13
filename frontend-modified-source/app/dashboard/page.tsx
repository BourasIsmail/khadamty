'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import { api } from '@/lib/api'
import Link from 'next/link'
import EmployeeHome from './_components/EmployeeHome'
import {
  UserGroupIcon, UserIcon, ClockIcon, ChartBarIcon, ArrowTrendingUpIcon, BriefcaseIcon,
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [empStats, setEmpStats] = useState<any>(null)
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
  return <EmployeeHome />
}
