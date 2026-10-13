'use client'

import { formatDate, formatMoney } from '@/lib/format'

interface Props {
  engagements: any[]
  /** Montants remplacés par des points tant que l'utilisateur ne les affiche pas. */
  hidden?: boolean
}

// Crédits, prêts et avances en cours : mensualité, restant dû, mois restants et avancement du remboursement.
export default function EngagementsTable({ engagements, hidden = false }: Props) {
  const money = (v: any) => (v == null ? '' : hidden ? '••••' : `${formatMoney(v)} DH`)

  if (engagements.length === 0) {
    return <p className="py-6 text-center text-sm text-gray-400">Aucun crédit ni engagement en cours.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
            <th className="px-3 py-2">Engagement</th>
            <th className="px-3 py-2">N° dossier</th>
            <th className="px-3 py-2 text-right">Mensualité</th>
            <th className="px-3 py-2 text-right">Montant total</th>
            <th className="px-3 py-2 text-right">Montant restant</th>
            <th className="px-3 py-2 text-right">Mois restants</th>
            <th className="px-3 py-2 min-w-[8rem]">Remboursé</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {engagements.map((e, i) => (
            <tr key={i}>
              <td className="px-3 py-3">
                <p className="font-medium text-gray-900">{e.libelle}</p>
                <p className="text-xs text-gray-500">
                  {e.type !== e.libelle ? e.type : ''}
                  {e.dateDebut ? `${e.type !== e.libelle ? ' · ' : ''}depuis le ${formatDate(e.dateDebut)}` : ''}
                </p>
              </td>
              <td className="px-3 py-3 text-gray-600">{e.numeroDossier || ''}</td>
              <td className="px-3 py-3 text-right font-semibold text-red-600">{hidden ? '••••' : `-${formatMoney(e.mensualite)} DH`}</td>
              <td className="px-3 py-3 text-right text-gray-600">{money(e.montantTotal)}</td>
              <td className="px-3 py-3 text-right text-gray-600">{money(e.montantRestant)}</td>
              <td className="px-3 py-3 text-right text-gray-600">{e.moisRestants ?? ''}</td>
              <td className="px-3 py-3">
                {e.progression != null && (
                  <div title={`${e.progression} % remboursé`}>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: `${e.progression}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{e.progression} %</p>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
