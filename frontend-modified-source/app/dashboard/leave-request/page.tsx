'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeftIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

const LEAVE_TYPES = [
  { value: 'ANNUAL_LEAVE', label: 'Congé annuel' },
  { value: 'SICK_LEAVE', label: 'Congé maladie' },
  { value: 'PERSONAL_LEAVE', label: 'Congé personnel' },
  { value: 'MATERNITY_LEAVE', label: 'Congé maternité' },
  { value: 'PATERNITY_LEAVE', label: 'Congé paternité' },
  { value: 'EMERGENCY_LEAVE', label: "Congé d'urgence" },
]

export default function LeaveRequestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [availability, setAvailability] = useState<any>(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [form, setForm] = useState({
    leaveType: 'ANNUAL_LEAVE',
    startDate: '',
    endDate: '',
    reason: '',
  })

  const daysRequested = (() => {
    if (!form.startDate || !form.endDate) return 0
    const start = new Date(form.startDate)
    const end = new Date(form.endDate)
    if (end < start) return 0
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return diff
  })()

  useEffect(() => {
    if (!form.startDate || !form.endDate || new Date(form.endDate) < new Date(form.startDate)) {
      setAvailability(null)
      return
    }

    let cancelled = false
    setCheckingAvailability(true)
    const timeout = window.setTimeout(async () => {
      try {
        const data = await api.checkLeaveAvailability(form.startDate, form.endDate)
        if (!cancelled) setAvailability(data)
      } catch (e: any) {
        if (!cancelled) {
          setAvailability(null)
          toast.error(e.message || 'Planning conges indisponible')
        }
      } finally {
        if (!cancelled) setCheckingAvailability(false)
      }
    }, 350)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [form.startDate, form.endDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.startDate || !form.endDate) {
      toast.error('Veuillez renseigner les dates')
      return
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error('La date de fin doit être après la date de début')
      return
    }

    if (availability && availability.available === false) {
      toast.error('Deux employes sont deja en conge sur cette periode')
      return
    }

    setLoading(true)
    try {
      await api.requestLeave({
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        daysRequested,
        reason: form.reason.trim() || undefined,
      })
      toast.success('Demande de congé envoyée avec succès !')
      router.push('/dashboard/leave-balance')
    } catch (e: any) {
      toast.error(e.message || 'Erreur lors de la demande')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/leave-balance"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demande de congé</h1>
          <p className="text-gray-500 mt-1">Remplissez le formulaire ci-dessous</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* Type de congé */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type de congé <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LEAVE_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setForm({ ...form, leaveType: type.value })}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition text-left ${
                  form.leaveType === type.value
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date de début <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date de fin <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              min={form.startDate || new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Durée calculée */}
        {daysRequested > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl">
            <CalendarDaysIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div className="text-sm font-medium text-blue-700">
              <p>Duree : <strong>{daysRequested} jour{daysRequested > 1 ? 's' : ''}</strong></p>
              {checkingAvailability && <p className="text-xs text-blue-500 mt-0.5">Verification du planning...</p>}
              {!checkingAvailability && availability && (
                <p className={`text-xs mt-0.5 ${availability.available ? 'text-emerald-700' : 'text-red-700'}`}>
                  {availability.available
                    ? `${availability.remainingSlots} place${availability.remainingSlots > 1 ? 's' : ''} disponible${availability.remainingSlots > 1 ? 's' : ''} sur cette periode`
                    : 'Periode bloquee: deux employes sont deja en conge'}
                </p>
              )}
            </div>
          </div>
        )}

        {availability?.conflicts?.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800 mb-2">Employes deja absents sur cette periode</p>
            <div className="space-y-1">
              {availability.conflicts.map((item: any) => (
                <p key={item.id} className="text-xs text-amber-700">
                  {item.employeeName} - {new Date(item.startDate).toLocaleDateString('fr-FR')} au {new Date(item.endDate).toLocaleDateString('fr-FR')} ({item.status})
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Motif */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Motif (optionnel)
          </label>
          <textarea
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            rows={3}
            placeholder="Décrivez brièvement la raison de votre demande..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/dashboard/leave-balance"
            className="flex-1 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading || checkingAvailability || daysRequested === 0 || availability?.available === false}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition shadow-lg shadow-blue-500/25"
          >
            {loading ? 'Envoi...' : 'Envoyer la demande'}
          </button>
        </div>
      </form>
    </div>
  )
}
