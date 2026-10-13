'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { XMarkIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { GAINS, RETENUES, AMOUNT_KEYS, AmountKey, emptyAmounts, num, fmt, toField } from './BulletinForm'

interface Row {
  emp: any
  exists: boolean          // un bulletin existe déjà pour cette période
  include: boolean
  echelon: string
  amounts: Record<AmountKey, string>
  error?: string
}

interface Props {
  defaultMois: number
  defaultAnnee: number
  onClose: () => void
  onSaved: () => void
}

const inputCls = 'w-24 px-2 py-1 rounded-lg border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-600 bg-white disabled:bg-gray-100'
const FIELDS = [...GAINS, ...RETENUES]

const netOf = (amounts: Record<AmountKey, string>) =>
  GAINS.reduce((s, f) => s + num(amounts[f.key]), 0) - RETENUES.reduce((s, f) => s + num(amounts[f.key]), 0)

// Découpe une ligne CSV (séparateur ; ou ,) en gérant les guillemets
function splitCsvLine(line: string, sep: string): string[] {
  const out: string[] = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (quoted && line[i + 1] === '"') { cur += '"'; i++ } else quoted = !quoted
    } else if (c === sep && !quoted) { out.push(cur); cur = '' }
    else cur += c
  }
  out.push(cur)
  return out.map((v) => v.trim())
}

export default function BulkBulletins({ defaultMois, defaultAnnee, onClose, onSaved }: Props) {
  const [mois, setMois] = useState(defaultMois)
  const [annee, setAnnee] = useState(defaultAnnee)
  const [employees, setEmployees] = useState<any[]>([])
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [summary, setSummary] = useState<{ created: number; failed: number } | null>(null)
  const [dirty, setDirty] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.getEmployees({ page: 1, limit: 1000 } as any)
      .then((data: any) => {
        const list: any[] = Array.isArray(data) ? data : data?.employees || []
        setEmployees(list.filter((e) => !e.status || e.status === 'active'))
      })
      .catch((e: any) => toast.error(e.message || 'Impossible de charger les employés'))
  }, [])

  // Recharge la grille quand la période change : bulletins existants + reprise du mois précédent
  useEffect(() => {
    if (employees.length === 0) return
    let cancelled = false
    setLoading(true)
    setSummary(null)
    const prevMois = mois === 1 ? 12 : mois - 1
    const prevAnnee = mois === 1 ? annee - 1 : annee
    Promise.all([
      api.getSalaires({ annee, mois } as any),
      api.getSalaires({ annee: prevAnnee, mois: prevMois } as any),
    ])
      .then(([current, previous]: any[]) => {
        if (cancelled) return
        const existing = new Set((Array.isArray(current) ? current : []).map((s: any) => String(s.employee?.id)))
        const prevByEmp = new Map<string, any>(
          (Array.isArray(previous) ? previous : []).map((s: any) => [String(s.employee?.id), s])
        )
        setRows(employees.map((emp) => {
          const exists = existing.has(String(emp.id))
          const prev = prevByEmp.get(String(emp.id))
          const amounts = emptyAmounts()
          if (prev && !exists) {
            for (const k of AMOUNT_KEYS) amounts[k] = toField(prev[k])
            if (!amounts.salaireBase) amounts.salaireBase = toField(prev.salaireBaseEffectif)
          }
          return { emp, exists, include: !exists && !!prev, echelon: prev?.echelon ?? '', amounts }
        }))
      })
      .catch((e: any) => toast.error(e.message || 'Erreur de chargement'))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [employees, mois, annee])

  const updateRow = (id: any, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.emp.id === id ? { ...r, ...patch, error: undefined } : r)))

  const setAmount = (id: any, key: AmountKey, value: string) =>
    setRows((prev) => prev.map((r) =>
      r.emp.id === id
        ? { ...r, amounts: { ...r.amounts, [key]: value }, include: r.exists ? false : true, error: undefined }
        : r))

  const selectable = rows.filter((r) => !r.exists)
  const selected = rows.filter((r) => r.include && !r.exists)
  const totalNet = useMemo(() => selected.reduce((s, r) => s + netOf(r.amounts), 0), [selected])

  const setAll = (value: boolean) =>
    setRows((prev) => prev.map((r) => (r.exists ? r : { ...r, include: value })))

  // ── CSV ───────────────────────────────────────────────────────────────────
  const downloadTemplate = () => {
    const header = ['matricule', 'nom', 'echelon', ...AMOUNT_KEYS]
    const lines = [header.join(';')]
    for (const r of rows) {
      lines.push([
        r.emp.employeeId, `${r.emp.lastName} ${r.emp.firstName}`.replace(/;/g, ' '), r.echelon,
        ...AMOUNT_KEYS.map((k) => r.amounts[k]),
      ].join(';'))
    }
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bulletins-${annee}-${String(mois).padStart(2, '0')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importCsv = async (file: File) => {
    const text = (await file.text()).replace(/^﻿/, '')
    const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '')
    if (lines.length < 2) return toast.error('Fichier vide')
    const sep = (lines[0].match(/;/g)?.length ?? 0) >= (lines[0].match(/,/g)?.length ?? 0) ? ';' : ','
    const header = splitCsvLine(lines[0], sep).map((h) => h.toLowerCase())
    const col = (name: string) => header.indexOf(name.toLowerCase())
    const iMat = col('matricule')
    if (iMat < 0) return toast.error('Colonne « matricule » introuvable')
    const iEch = col('echelon')
    const iAmounts = AMOUNT_KEYS.map((k) => ({ k, i: col(k) }))

    const byMat = new Map(rows.map((r) => [r.emp.employeeId, r.emp.id]))
    const updates = new Map<any, Partial<Row>>()
    let unknown = 0
    let skipped = 0
    for (const line of lines.slice(1)) {
      const cells = splitCsvLine(line, sep)
      const id = byMat.get(cells[iMat])
      if (id === undefined) { unknown++; continue }
      if (rows.find((r) => r.emp.id === id)?.exists) { skipped++; continue }
      const amounts = emptyAmounts()
      for (const { k, i } of iAmounts) if (i >= 0) amounts[k] = (cells[i] || '').replace(/\s/g, '').replace(',', '.')
      updates.set(id, { amounts, echelon: iEch >= 0 ? cells[iEch] || '' : '', include: true })
    }
    setRows((prev) => prev.map((r) => (updates.has(r.emp.id) ? { ...r, ...updates.get(r.emp.id), error: undefined } : r)))
    toast.success(`${updates.size} ligne(s) importée(s)`)
    if (unknown) toast.error(`${unknown} matricule(s) inconnu(s) ignoré(s)`)
    if (skipped) toast(`${skipped} employé(s) déjà saisi(s) ignoré(s)`)
  }

  // ── Envoi ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const invalid = selected.filter((r) => num(r.amounts.salaireBase) <= 0 || netOf(r.amounts) < 0)
    if (invalid.length > 0) {
      const ids = new Set(invalid.map((r) => r.emp.id))
      setRows((prev) => prev.map((r) => ids.has(r.emp.id)
        ? { ...r, error: num(r.amounts.salaireBase) <= 0 ? 'Salaire de base requis' : 'Net négatif' }
        : r))
      return toast.error(`${invalid.length} ligne(s) à corriger`)
    }
    if (selected.length === 0) return toast.error('Aucun bulletin sélectionné')
    if (!confirm(`Enregistrer ${selected.length} bulletin(s) pour ${String(mois).padStart(2, '0')}/${annee} ?`)) return

    const payload = selected.map((r) => {
      const item: Record<string, any> = {
        employee: { id: r.emp.id }, annee, mois, echelon: r.echelon.trim() || null, grade: null,
      }
      for (const k of AMOUNT_KEYS) item[k] = num(r.amounts[k])
      return item
    })

    setSending(true)
    try {
      const res = await api.createSalairesBulk(payload)
      const failedByIndex = new Map<number, string>((res.failed || []).map((f: any) => [f.index, f.message]))
      const doneIds = new Set<any>()
      selected.forEach((r, i) => { if (!failedByIndex.has(i)) doneIds.add(r.emp.id) })
      setRows((prev) => prev.map((r) => {
        if (doneIds.has(r.emp.id)) return { ...r, exists: true, include: false, error: undefined }
        const idx = selected.findIndex((s) => s.emp.id === r.emp.id)
        return idx >= 0 && failedByIndex.has(idx) ? { ...r, error: failedByIndex.get(idx) } : r
      }))
      setSummary({ created: res.created, failed: (res.failed || []).length })
      if (res.created > 0) setDirty(true)
      if ((res.failed || []).length === 0) toast.success(`${res.created} bulletin(s) enregistré(s)`)
      else toast.error(`${res.created} enregistré(s), ${res.failed.length} en erreur`)
    } catch (e: any) {
      toast.error(e.message || 'Erreur lors de l’enregistrement')
    } finally {
      setSending(false)
    }
  }

  const close = () => (dirty ? onSaved() : onClose())

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="w-full max-w-[96rem] bg-white rounded-2xl shadow-2xl my-6">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Saisie en masse des bulletins</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Les montants sont repris du mois précédent. Modifiez les lignes concernées, puis enregistrez le mois en une fois.
            </p>
          </div>
          <button onClick={close} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100" aria-label="Fermer">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
          <select value={mois} onChange={(e) => setMois(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleDateString('fr-FR', { month: 'long' })}</option>
            ))}
          </select>
          <input type="number" min={2000} max={2100} value={annee} onChange={(e) => setAnnee(Number(e.target.value))}
            className="w-24 px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white" />
          <button type="button" onClick={() => setAll(true)} className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50">Tout sélectionner</button>
          <button type="button" onClick={() => setAll(false)} className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50">Aucun</button>
          <div className="flex-1" />
          <button type="button" onClick={downloadTemplate} className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
            <ArrowDownTrayIcon className="h-4 w-4" /> Modèle CSV
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
            <ArrowUpTrayIcon className="h-4 w-4" /> Importer un CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) importCsv(f); e.target.value = '' }} />
        </div>

        {summary && (
          <div className={`mx-6 mt-4 rounded-xl px-4 py-3 text-sm ${summary.failed ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'}`}>
            {summary.created} bulletin(s) enregistré(s){summary.failed ? `, ${summary.failed} en erreur (voir les lignes en rouge).` : '.'}
          </div>
        )}

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <p className="text-center text-gray-500 py-12">Aucun employé actif.</p>
          ) : (
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <th className="sticky left-0 z-10 bg-gray-50 px-3 py-2 text-left min-w-[14rem]">Employé</th>
                    <th className="px-2 py-2">Échelon</th>
                    {FIELDS.map((f) => (
                      <th key={f.key} className={`px-2 py-2 text-right whitespace-nowrap ${RETENUES.some((r) => r.key === f.key) ? 'text-red-500' : ''}`}>
                        {f.label.replace(' *', '')}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-right">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rows.map((r) => {
                    const net = netOf(r.amounts)
                    return (
                      <tr key={r.emp.id} className={r.error ? 'bg-red-50' : r.exists ? 'bg-gray-50/70 text-gray-400' : ''}>
                        <td className="sticky left-0 z-10 bg-inherit px-3 py-2">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={r.include} disabled={r.exists}
                              onChange={(e) => updateRow(r.emp.id, { include: e.target.checked })} />
                            <span>
                              <span className="font-medium text-gray-900 block">{r.emp.lastName} {r.emp.firstName}</span>
                              <span className="text-xs text-gray-500">
                                {r.emp.employeeId}
                                {r.exists && <span className="ml-2 text-green-600 font-medium">Déjà saisi</span>}
                                {r.error && <span className="ml-2 text-red-600 font-medium">{r.error}</span>}
                              </span>
                            </span>
                          </label>
                        </td>
                        <td className="px-2 py-1">
                          <input type="text" value={r.echelon} disabled={r.exists} maxLength={10}
                            onChange={(e) => updateRow(r.emp.id, { echelon: e.target.value })}
                            className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-sm bg-white disabled:bg-gray-100" />
                        </td>
                        {FIELDS.map((f) => (
                          <td key={f.key} className="px-2 py-1">
                            <input type="number" min="0" step="0.01" inputMode="decimal" disabled={r.exists}
                              value={r.amounts[f.key]} onChange={(e) => setAmount(r.emp.id, f.key, e.target.value)}
                              className={inputCls} />
                          </td>
                        ))}
                        <td className={`px-3 py-2 text-right font-semibold whitespace-nowrap ${net < 0 ? 'text-red-600' : 'text-green-700'}`}>
                          {r.exists ? '' : fmt(net)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <strong>{selected.length}</strong> / {selectable.length} sélectionné(s) — total net <strong>{fmt(totalNet)} DH</strong>
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={close}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Fermer
            </button>
            <button type="button" onClick={handleSubmit} disabled={sending || selected.length === 0}
              className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold disabled:opacity-50">
              {sending ? 'Enregistrement…' : `Enregistrer ${selected.length} bulletin(s)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
