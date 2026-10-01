'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  CalendarDaysIcon, SunIcon, HeartIcon, UserIcon,
  PlusIcon, ClockIcon, CheckCircleIcon, XCircleIcon,
} from '@heroicons/react/24/outline'

const LEAVE_TYPE_LABELS: Record<string, string> = {
  ANNUAL_LEAVE: 'Congé annuel',
  SICK_LEAVE: 'Congé maladie',
  PERSONAL_LEAVE: 'Congé personnel',
  MATERNITY_LEAVE: 'Congé maternité',
  PATERNITY_LEAVE: 'Congé paternité',
  EMERGENCY_LEAVE: "Congé d'urgence",
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  CANCELLED: 'Annulé',
}

export default function LeaveBalancePage() {
  const { user } = useAuthStore()
  const [balance, setBalance] = useState<any>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [bal, reqs] = await Promise.all([
          api.getLeaveBalance(),
          api.getMyLeaveRequests(),
        ])
        setBalance(bal)
        setRequests(Array.isArray(reqs) ? reqs : [])
      } catch (e: any) {
        toast.error(e.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const balanceCards = balance
    ? [
        { label: 'Congés annuels', value: balance.annualLeave, icon: SunIcon, color: 'blue', max: 30 },
        { label: 'Congés maladie', value: balance.sickLeave, icon: HeartIcon, color: 'red', max: 15 },
        { label: 'Congés personnels', value: balance.personalLeave, icon: UserIcon, color: 'purple', max: 5 },
        { label: 'Total disponible', value: balance.totalLeave, icon: CalendarDaysIcon, color: 'emerald', max: 50 },
      ]
    : []

  const colorMap: Record<string, { bg: string; text: string; bar: string; shadow: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
    red: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500', shadow: 'shadow-red-500/20' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500', shadow: 'shadow-purple-500/20' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500', shadow: 'shadow-emerald-500/20' },
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes congés</h1>
          <p className="text-gray-500 mt-1">Consultez votre solde et vos demandes</p>
        </div>
        <Link
          href="/dashboard/leave-request"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-500/25"
        >
          <PlusIcon className="h-4 w-4" />
          Nouvelle demande
        </Link>
      </div>

      {/* Solde cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {balanceCards.map((card) => {
            const c = colorMap[card.color]
            const pct = Math.min(100, Math.round((card.value / card.max) * 100))
            return (
              <div key={card.label} className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center`}>
                    <card.icon className={`h-5 w-5 ${c.text}`} />
                  </div>
                  <span className={`text-3xl font-bold ${c.text}`}>{card.value}</span>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">{card.label}</p>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`${c.bar} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{card.value} jours restants</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Historique des demandes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Mes demandes de congés</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <CalendarDaysIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Aucune demande de congé</p>
            <p className="text-sm mt-1">Cliquez sur "Nouvelle demande" pour commencer</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {requests.map((req: any) => (
              <div key={req.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {LEAVE_TYPE_LABELS[req.leaveType] || req.leaveType}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {req.startDate && new Date(req.startDate).toLocaleDateString('fr-FR')}
                      {' → '}
                      {req.endDate && new Date(req.endDate).toLocaleDateString('fr-FR')}
                      {req.daysRequested && ` · ${req.daysRequested} jour${req.daysRequested > 1 ? 's' : ''}`}
                    </p>
                    {req.reason && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{req.reason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {req.status === 'APPROVED' && <CheckCircleIcon className="h-4 w-4 text-emerald-500" />}
                  {req.status === 'REJECTED' && <XCircleIcon className="h-4 w-4 text-red-500" />}
                  {req.status === 'PENDING' && <ClockIcon className="h-4 w-4 text-yellow-500" />}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[req.status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[req.status] || req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
