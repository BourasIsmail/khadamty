'use client'

import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { RETENUE_TYPES, RetenueForm, emptyRetenue, retenuesTotal } from '@/lib/retenues'
import { fmt } from './BulletinForm'

interface Props {
  value: RetenueForm[]
  onChange: (next: RetenueForm[]) => void
}

const cell = 'w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-600 bg-white'

// Tableau de saisie du détail des retenues du mois : une ligne par retenue.
export default function RetenuesEditor({ value, onChange }: Props) {
  const update = (index: number, patch: Partial<RetenueForm>) =>
    onChange(value.map((l, i) => (i === index ? { ...l, ...patch } : l)))

  return (
    <div>
      <datalist id="retenue-types">
        {RETENUE_TYPES.map((t) => <option key={t} value={t} />)}
      </datalist>

      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
              <th className="px-2 py-2 min-w-[11rem]">Type de retenue</th>
              <th className="px-2 py-2 min-w-[7rem]">Retenue mensuelle</th>
              <th className="px-2 py-2 min-w-[6rem]">N° dossier</th>
              <th className="px-2 py-2 min-w-[7rem]">Montant total du prêt</th>
              <th className="px-2 py-2 min-w-[7rem]">Montant restant</th>
              <th className="px-2 py-2 min-w-[5rem]">Mois restants</th>
              <th className="px-2 py-2 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {value.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-4 text-center text-gray-400">Aucune retenue ce mois-ci</td></tr>
            )}
            {value.map((l, i) => (
              <tr key={i}>
                <td className="px-2 py-1">
                  <input list="retenue-types" value={l.type} placeholder="ex. Mutuelle"
                    onChange={(e) => update(i, { type: e.target.value })} className={cell} />
                </td>
                <td className="px-2 py-1">
                  <input type="number" min="0" step="0.01" inputMode="decimal" value={l.montant}
                    onChange={(e) => update(i, { montant: e.target.value })} className={cell} />
                </td>
                <td className="px-2 py-1">
                  <input value={l.numeroDossier} maxLength={50}
                    onChange={(e) => update(i, { numeroDossier: e.target.value })} className={cell} />
                </td>
                <td className="px-2 py-1">
                  <input type="number" min="0" step="0.01" inputMode="decimal" value={l.montantTotal}
                    onChange={(e) => update(i, { montantTotal: e.target.value })} className={cell} />
                </td>
                <td className="px-2 py-1">
                  <input type="number" min="0" step="0.01" inputMode="decimal" value={l.montantRestant}
                    onChange={(e) => update(i, { montantRestant: e.target.value })} className={cell} />
                </td>
                <td className="px-2 py-1">
                  <input type="number" min="0" step="1" inputMode="numeric" value={l.moisRestants}
                    onChange={(e) => update(i, { moisRestants: e.target.value })} className={cell} />
                </td>
                <td className="px-2 py-1 text-right">
                  <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer la ligne">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={() => onChange([...value, emptyRetenue()])}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 rounded-lg border border-green-200 hover:bg-green-50">
          <PlusIcon className="h-4 w-4" /> Ajouter une retenue
        </button>
        <p className="text-sm text-gray-600">Total des retenues : <strong className="text-red-600">{fmt(retenuesTotal(value))} DH</strong></p>
      </div>
      <p className="mt-1 text-xs text-gray-400">
        Pour un prêt ou une avance : renseignez le n° de dossier, le montant total, le montant restant et les mois restants
        <em> après</em> la retenue de ce mois (repris automatiquement le mois suivant).
      </p>
    </div>
  )
}
