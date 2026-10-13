'use client'

import { formatMoney } from '@/lib/format'

// Détail d'un bulletin : rémunération, tableau des retenues mensuelles et net à payer.
export default function PayslipDetail({ bulletin }: { bulletin: any }) {
  const gains: [string, any, boolean?][] = [
    ['Salaire de base', bulletin.remuneration?.salaireBase, true],
    ['Indemnité de logement', bulletin.remuneration?.indemniteLogement],
    ['Indemnité de transport', bulletin.remuneration?.indemniteTransport],
    ['Indemnité de fonction', bulletin.remuneration?.indemniteFonction],
    ['Primes', bulletin.remuneration?.primes],
    ['Allocation familiale', bulletin.remuneration?.allocFamiliale],
    ['Rappel', bulletin.remuneration?.rappel],
  ]
  const lignes: any[] = bulletin.deductions?.lignes ?? []

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">Éléments de rémunération</p>
        <div className="space-y-2 text-sm">
          {gains.filter(([, v, always]) => always || Number(v || 0) > 0).map(([label, v]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-gray-600">{label}</span>
              <span className="font-semibold">{formatMoney(v)} DH</span>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-900">Total gains</span>
            <span className="font-bold text-green-700">{formatMoney(bulletin.remuneration?.totalGains)} DH</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Détail des retenues mensuelles{bulletin.periodeLabel ? ` — ${bulletin.periodeLabel}` : ''}
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
                <th className="px-3 py-2">Type de retenue</th>
                <th className="px-3 py-2 text-right">Retenue mensuelle</th>
                <th className="px-3 py-2">N° dossier</th>
                <th className="px-3 py-2 text-right">Montant total du prêt</th>
                <th className="px-3 py-2 text-right">Montant restant</th>
                <th className="px-3 py-2 text-right">Mois restants</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lignes.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-4 text-center text-gray-400">Aucune retenue ce mois-ci</td></tr>
              )}
              {lignes.map((l, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-gray-800">{l.type}</td>
                  <td className="px-3 py-2 text-right font-semibold text-red-600">-{formatMoney(l.montant)} DH</td>
                  <td className="px-3 py-2 text-gray-600">{l.numeroDossier || ''}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{l.montantTotal != null ? `${formatMoney(l.montantTotal)} DH` : ''}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{l.montantRestant != null ? `${formatMoney(l.montantRestant)} DH` : ''}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{l.moisRestants ?? ''}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200">
                <td className="px-3 py-2 font-semibold text-gray-900">Total retenues</td>
                <td className="px-3 py-2 text-right font-bold text-red-600">-{formatMoney(bulletin.deductions?.totalDeductions)} DH</td>
                <td colSpan={4} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-green-50 border border-green-100 p-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">NET À PAYER</span>
        <span className="text-2xl font-bold text-green-700">{formatMoney(bulletin.netAPayer)} DH</span>
      </div>
    </div>
  )
}
