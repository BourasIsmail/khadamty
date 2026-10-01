'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import {
  UserGroupIcon, UserIcon, ChartBarIcon, ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'

export default function AnalyticsPage() {
  const { user } = useAuthStore()
  const [empStats, setEmpStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getEmployeeStats()
        setEmpStats(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const cards = [
    { label: 'Total Employés', value: empStats?.total_employees ?? 0, icon: UserGroupIcon, color: 'blue' },
    { label: 'Actifs', value: empStats?.active_employees ?? 0, icon: UserIcon, color: 'green' },
    { label: 'Inactifs', value: empStats?.inactive_employees ?? 0, icon: UserIcon, color: 'yellow' },
    { label: 'Nouveaux ce mois', value: empStats?.new_this_month ?? 0, icon: ArrowTrendingUpIcon, color: 'purple' },
  ]

  const colorMap: Record<string, { bg: string; text: string; bar: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', bar: 'bg-yellow-500' },
    purple: { bg: 'bg-violet-50', text: 'text-violet-600', bar: 'bg-violet-500' },
  }

  const maxDept = Math.max(...(empStats?.department_stats?.map((d: any) => d.count) ?? [1]))

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de votre effectif</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const c = colorMap[card.color]
          return (
            <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
                <card.icon className={`h-5 w-5 ${c.text}`} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* Department chart */}
      {empStats?.department_stats?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Effectif par département</h2>
          <div className="space-y-4">
            {empStats.department_stats.map((dept: any, i: number) => {
              const pct = Math.round((dept.count / maxDept) * 100)
              const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500']
              return (
                <div key={dept.department} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 w-40 truncate">{dept.department}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-700 ${colors[i % colors.length]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{dept.count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Status breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Actifs', value: empStats?.active_employees ?? 0, total: empStats?.total_employees ?? 1, color: 'emerald' },
          { label: 'Inactifs', value: empStats?.inactive_employees ?? 0, total: empStats?.total_employees ?? 1, color: 'yellow' },
          { label: 'Terminés', value: empStats?.terminated_employees ?? 0, total: empStats?.total_employees ?? 1, color: 'red' },
        ].map((item) => {
          const pct = Math.round((item.value / item.total) * 100)
          const ringColor: Record<string, string> = {
            emerald: 'stroke-emerald-500', yellow: 'stroke-yellow-500', red: 'stroke-red-500',
          }
          const textColor: Record<string, string> = {
            emerald: 'text-emerald-600', yellow: 'text-yellow-600', red: 'text-red-600',
          }
          const circumference = 2 * Math.PI * 36
          const offset = circumference - (pct / 100) * circumference

          return (
            <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="36" fill="none" strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`transition-all duration-700 ${ringColor[item.color]}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold ${textColor[item.color]}`}>{pct}%</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
