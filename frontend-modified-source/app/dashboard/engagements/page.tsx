'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { formatMoney } from '@/lib/format'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import EngagementsTable from '../_components/EngagementsTable'

export default function EngagementsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAmounts, setShowAmounts] = useState(true)

  useEffect(() => {
    api.getMyEngagements()
      .then(setData)
      .catch((e: any) => toast.error(e.message || 'Impossible de charger vos engagements'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes engagements et crédits</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Crédits, prêts et avances en cours, avec le restant dû et les mois restants.
          </p>
        </div>
        <button type="button" onClick={() => setShowAmounts((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
          {showAmounts ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          {showAmounts ? 'Masquer les montants' : 'Afficher les montants'}
        </button>
      </div>

      {data && data.nombre > 0 && (
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <div className="rounded-2xl bg-white border border-gray-100 shadow-card p-4">
            <p className="text-xs text-gray-400">Engagements en cours</p>
            <p className="text-2xl font-bold text-gray-900">{data.nombre}</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-card p-4">
            <p className="text-xs text-gray-400">Prélevé chaque mois</p>
            <p className="text-2xl font-bold text-red-600">{showAmounts ? `${formatMoney(data.totalMensualites)} DH` : '••••••'}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
        {loading
          ? <div className="h-24 rounded-xl bg-gray-100 animate-pulse" />
          : <EngagementsTable engagements={data?.engagements ?? []} hidden={!showAmounts} />}
      </div>

      <p className="text-xs text-gray-400">
        Ces informations proviennent des crédits enregistrés par le service RH et de votre dernier bulletin de paie.
        En cas d’écart, contactez le service RH.
      </p>
    </div>
  )
}
