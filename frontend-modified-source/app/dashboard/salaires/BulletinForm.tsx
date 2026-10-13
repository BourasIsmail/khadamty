'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { XMarkIcon } from '@heroicons/react/24/outline'

const inputCls = 'w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition bg-gray-50 focus:bg-white'
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1'

const GAINS = [
  { key: 'salaireBase', label: 'Salaire de base *' },
  { key: 'indemniteLogement', label: 'Indemnité de logement' },
  { key: 'indemniteTransport', label: 'Indemnité de transport' },
  { key: 'indemniteFonction', label: 'Indemnité de fonction' },
  { key: 'primes', label: 'Primes' },
  { key: 'allocFamiliale', label: 'Allocations familiales' },
  { key: 'rappel', label: 'Rappel' },
] as const

const RETENUES = [
  { key: 'retenueRetraite', label: 'Retraite' },
  { key: 'retenueAmo', label: 'Assurance maladie (AMO)' },
  { key: 'retenueMutuelle', label: 'Mutuelle' },
  { key: 'retenueIr', label: 'Impôt sur le revenu (IR)' },
  { key: 'autresRetenues', label: 'Autres retenues' },
] as const

type AmountKey = typeof GAINS[number]['key'] | typeof RETENUES[number]['key']
const AMOUNT_KEYS: AmountKey[] = [...GAINS, ...RETENUES].map((f) => f.key)

const emptyAmounts = () =>
  Object.fromEntries(AMOUNT_KEYS.map((k) => [k, ''])) as Record<AmountKey, string>

const num = (v: string) => {
  const n = parseFloat((v || '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

const toField = (v: any) => (v === null || v === undefined || Number(v) === 0 ? '' : String(v))

interface Props {
  initial: any | null
  defaultMois: number
  defaultAnnee: number
  onClose: () => void
  onSaved: () => void
}

export default function BulletinForm({ initial, defaultMois, defaultAnnee, onClose, onSaved }: Props) {
  const editing = !!initial
  const [employees, setEmployees] = useState<any[]>([])
  const [employeeId, setEmployeeId] = useState<string>(initial?.employee?.id ? String(initial.employee.id) : '')
  const [mois, setMois] = useState<number>(initial?.mois ?? defaultMois)
  const [annee, setAnnee] = useState<number>(initial?.annee ?? defaultAnnee)
  const [echelon, setEchelon] = useState<string>(initial?.echelon ?? '')
  const [amounts, setAmounts] = useState<Record<AmountKey, string>>(() => {
    const base = emptyAmounts()
    if (initial) {
      for (const k of AMOUNT_KEYS) base[k] = toField(initial[k])
      // Ancien bulletin sans détail : le salaire de base estimé vient du serveur
      if (!base.salaireBase) base.salaireBase = toField(initial.salaireBaseEffectif)
    }
    return base
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editing) return
    api.getEmployees({ page: 1, limit: 500 } as any)
      .then((data: any) => setEmployees(Array.isArray(data) ? data : data?.employees || []))
      .catch((e: any) => toast.error(e.message || 'Impossible de charger les employés'))
  }, [editing])

  // Nouvelle saisie : reprendre les montants du dernier bulletin de l'employé (à ajuster ensuite)
  const handleEmployee = async (id: string) => {
    setEmployeeId(id)
    if (!id || editing) return
    try {
      const list = await api.getSalaires({ employeeId: id } as any)
      const rows: any[] = Array.isArray(list) ? list : []
      if (rows.length === 0) return
      const last = rows.reduce((a, b) => (b.annee * 12 + b.mois > a.annee * 12 + a.mois ? b : a))
      const next = emptyAmounts()
      for (const k of AMOUNT_KEYS) next[k] = toField(last[k])
      if (!next.salaireBase) next.salaireBase = toField(last.salaireBaseEffectif)
      setAmounts(next)
      setEchelon(last.echelon ?? '')
      toast.success(`Montants repris du bulletin ${last.mois}/${last.annee}`)
    } catch {
      /* la reprise est facultative */
    }
  }

  const totals = useMemo(() => {
    const gains = GAINS.reduce((sum, f) => sum + num(amounts[f.key]), 0)
    const retenues = RETENUES.reduce((sum, f) => sum + num(amounts[f.key]), 0)
    return { gains, retenues, net: gains - retenues }
  }, [amounts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employeeId) return toast.error('Choisissez un employé')
    if (num(amounts.salaireBase) <= 0) return toast.error('Le salaire de base est obligatoire')
    if (totals.net < 0) return toast.error('Les retenues dépassent la rémunération')

    const payload: Record<string, any> = {
      employee: { id: Number(employeeId) },
      annee,
      mois,
      echelon: echelon.trim() || null,
      grade: initial?.grade?.id ? { id: initial.grade.id } : null,
    }
    for (const k of AMOUNT_KEYS) payload[k] = num(amounts[k])

    setSaving(true)
    try {
      if (editing) {
        await api.updateSalaire(initial.id, payload)
        toast.success('Bulletin mis à jour')
      } else {
        await api.createSalaire(payload)
        toast.success('Bulletin enregistré')
      }
      onSaved()
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l’enregistrement')
    } finally {
      setSaving(false)
    }
  }

  const field = (f: { key: AmountKey; label: string }) => (
    <div key={f.key}>
      <label className={labelCls}>{f.label}</label>
      <input
        type="number" min="0" step="0.01" inputMode="decimal"
        value={amounts[f.key]}
        onChange={(e) => setAmounts((prev) => ({ ...prev, [f.key]: e.target.value }))}
        className={inputCls} placeholder="0,00"
      />
    </div>
  )

  const employee = initial?.employee

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {editing ? 'Modifier le bulletin' : 'Nouveau bulletin de paie'}
          </h2>
          <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Employé et période</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className={labelCls}>Employé *</label>
                {editing ? (
                  <p className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-xl border-2 border-gray-100">
                    {employee?.firstName} {employee?.lastName} ({employee?.employeeId})
                  </p>
                ) : (
                  <select value={employeeId} onChange={(e) => handleEmployee(e.target.value)} className={inputCls} required>
                    <option value="">Sélectionner…</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.lastName} {emp.firstName} — {emp.employeeId}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className={labelCls}>Mois *</label>
                {editing ? (
                  <p className="px-3 py-2 text-sm font-medium bg-gray-50 rounded-xl border-2 border-gray-100">{mois}</p>
                ) : (
                  <select value={mois} onChange={(e) => setMois(Number(e.target.value))} className={inputCls}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i).toLocaleDateString('fr-FR', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className={labelCls}>Année *</label>
                {editing ? (
                  <p className="px-3 py-2 text-sm font-medium bg-gray-50 rounded-xl border-2 border-gray-100">{annee}</p>
                ) : (
                  <input type="number" min={2000} max={2100} value={annee}
                    onChange={(e) => setAnnee(Number(e.target.value))} className={inputCls} />
                )}
              </div>
              <div>
                <label className={labelCls}>Échelon</label>
                <input type="text" value={echelon} onChange={(e) => setEchelon(e.target.value)}
                  className={inputCls} placeholder="ex. E3" maxLength={10} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Rémunération (MAD)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{GAINS.map(field)}</div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Retenues (MAD)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{RETENUES.map(field)}</div>
          </section>

          <section className="rounded-xl bg-green-50 border border-green-100 p-4 grid grid-cols-3 gap-3 text-sm">
            <div><p className="text-gray-500">Total gains</p><p className="font-bold text-gray-900">{fmt(totals.gains)} DH</p></div>
            <div><p className="text-gray-500">Total retenues</p><p className="font-bold text-red-600">-{fmt(totals.retenues)} DH</p></div>
            <div><p className="text-gray-500">Net à payer</p>
              <p className={`text-lg font-bold ${totals.net < 0 ? 'text-red-600' : 'text-green-700'}`}>{fmt(totals.net)} DH</p></div>
          </section>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Annuler
          </button>
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition disabled:opacity-50">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}
