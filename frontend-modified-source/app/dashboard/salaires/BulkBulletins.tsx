'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { XMarkIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { GAINS, AMOUNT_KEYS, AmountKey, emptyAmounts, num, fmt, toField } from './BulletinForm'
import RetenuesEditor from './RetenuesEditor'
import {
  RetenueForm, STANDARD_RETENUES, carryOverRetenues, emptyRetenue, retenueFromApi, retenuesError,
  retenuesToPayload, retenuesTotal,
} from '@/lib/retenues'
import { buildCsv, buildXlsx, mapTable, parseCsv, readXlsx, TemplateRow } from '@/lib/bulletinSheet'

interface Row {
  emp: any
  exists: boolean          // un bulletin existe déjà pour cette période
  include: boolean
  echelon: string
  amounts: Record<AmountKey, string>
  retenues: RetenueForm[]
  error?: string
}

interface Props {
  defaultMois: number
  defaultAnnee: number
  onClose: () => void
  onSaved: () => void
}

const inputCls = 'w-24 px-2 py-1 rounded-lg border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-600 bg-white disabled:bg-gray-100'
// Colonnes du modèle Excel/CSV : rémunération + retenues courantes (les prêts se règlent via « Détail »)
const SHEET_FIELDS = [...GAINS, ...STANDARD_RETENUES.map((r) => ({ key: r.key, label: r.label }))]

const netOf = (r: { amounts: Record<AmountKey, string>; retenues: RetenueForm[] }) =>
  GAINS.reduce((sum, f) => sum + num(r.amounts[f.key]), 0) - retenuesTotal(r.retenues)

/** Montant de la première ligne d'un type donné (pour remplir une colonne du modèle). */
const standardAmount = (lines: RetenueForm[], type: string) => toField(lines.find((l) => l.type === type)?.montant)

export default function BulkBulletins({ defaultMois, defaultAnnee, onClose, onSaved }: Props) {
  const [mois, setMois] = useState(defaultMois)
  const [annee, setAnnee] = useState(defaultAnnee)
  const [employees, setEmployees] = useState<any[]>([])
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [summary, setSummary] = useState<{ created: number; failed: number } | null>(null)
  const [dirty, setDirty] = useState(false)
  const [editRetenuesFor, setEditRetenuesFor] = useState<any>(null)
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
          let retenues: RetenueForm[] = []
          if (prev && !exists) {
            for (const k of AMOUNT_KEYS) amounts[k] = toField(prev[k])
            if (!amounts.salaireBase) amounts.salaireBase = toField(prev.salaireBaseEffectif)
            retenues = carryOverRetenues((prev.retenues ?? []).map(retenueFromApi))
          }
          return { emp, exists, include: !exists && !!prev, echelon: prev?.echelon ?? '', amounts, retenues }
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
  const totalNet = useMemo(() => selected.reduce((sum, r) => sum + netOf(r), 0), [selected])

  const setAll = (value: boolean) =>
    setRows((prev) => prev.map((r) => (r.exists ? r : { ...r, include: value })))

  // ── Modèle et import (Excel ou CSV) ───────────────────────────────────────
  const periodLabel = `${new Date(2000, mois - 1).toLocaleDateString('fr-FR', { month: 'long' })} ${annee}`
  const fileBase = `bulletins-${annee}-${String(mois).padStart(2, '0')}`

  const templateRows = (): TemplateRow[] =>
    rows.filter((r) => !r.exists).map((r) => {
      const amounts: Record<string, string> = { ...r.amounts }
      for (const st of STANDARD_RETENUES) amounts[st.key] = standardAmount(r.retenues, st.type)
      return { matricule: r.emp.employeeId, nom: `${r.emp.lastName} ${r.emp.firstName}`, echelon: r.echelon, amounts }
    })

  const saveBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const downloadXlsx = async () => {
    try {
      const buffer = await buildXlsx(SHEET_FIELDS, templateRows(), periodLabel, STANDARD_RETENUES.map((f) => f.key))
      saveBlob(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${fileBase}.xlsx`)
    } catch (e: any) {
      toast.error(e.message || 'Impossible de générer le modèle Excel')
    }
  }

  const downloadCsv = () =>
    saveBlob(new Blob([buildCsv(SHEET_FIELDS, templateRows())], { type: 'text/csv;charset=utf-8' }), `${fileBase}.csv`)

  const importFile = async (file: File) => {
    try {
      const isExcel = /\.xlsx$/i.test(file.name)
      if (/\.xls$/i.test(file.name)) throw new Error('Ancien format .xls non pris en charge : enregistrez le fichier en .xlsx')
      const table = isExcel ? await readXlsx(await file.arrayBuffer()) : parseCsv(await file.text())
      const { entries, unknownColumns } = mapTable(table, SHEET_FIELDS)

      const byMat = new Map(rows.map((r) => [r.emp.employeeId, r]))
      const updates = new Map<any, Partial<Row>>()
      let unknown = 0
      let skipped = 0
      for (const entry of entries) {
        const row = byMat.get(entry.matricule)
        if (!row) { unknown++; continue }
        if (row.exists) { skipped++; continue }
        const amounts = emptyAmounts()
        for (const k of AMOUNT_KEYS) amounts[k] = entry.amounts[k] ?? ''
        // Retenues courantes présentes dans le fichier : elles remplacent les lignes du même type ;
        // les autres lignes (prêts, avances…) déjà préparées sont conservées.
        const present = STANDARD_RETENUES.filter((st) => entry.amounts[st.key] !== undefined)
        const types = new Set<string>(present.map((st) => st.type))
        const retenues = [
          ...row.retenues.filter((l) => !types.has(l.type)),
          ...present
            .filter((st) => num(entry.amounts[st.key]) > 0)
            .map((st) => ({ ...emptyRetenue(), type: st.type, montant: entry.amounts[st.key] })),
        ]
        updates.set(row.emp.id, { amounts, retenues, echelon: entry.echelon, include: true })
      }
      setRows((prev) => prev.map((r) => (updates.has(r.emp.id) ? { ...r, ...updates.get(r.emp.id), error: undefined } : r)))
      toast.success(`${updates.size} ligne(s) importée(s)`)
      if (unknown) toast.error(`${unknown} matricule(s) inconnu(s) ignoré(s)`)
      if (skipped) toast(`${skipped} employé(s) déjà saisi(s) ignoré(s)`)
      if (unknownColumns.length) toast(`Colonnes ignorées : ${unknownColumns.join(', ')}`)
    } catch (e: any) {
      toast.error(e.message || 'Fichier illisible')
    }
  }

  // ── Envoi ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const invalid = selected.filter((r) => num(r.amounts.salaireBase) <= 0 || netOf(r) < 0 || retenuesError(r.retenues) !== null)
    if (invalid.length > 0) {
      const ids = new Set(invalid.map((r) => r.emp.id))
      setRows((prev) => prev.map((r) => ids.has(r.emp.id)
        ? { ...r, error: num(r.amounts.salaireBase) <= 0 ? 'Salaire de base requis' : retenuesError(r.retenues) ?? 'Net négatif' }
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
      item.retenues = retenuesToPayload(r.retenues)
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
          <button type="button" onClick={downloadXlsx} className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-green-200 bg-green-50 text-green-800 hover:bg-green-100">
            <ArrowDownTrayIcon className="h-4 w-4" /> Modèle Excel
          </button>
          <button type="button" onClick={downloadCsv} className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
            <ArrowDownTrayIcon className="h-4 w-4" /> Modèle CSV
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
            <ArrowUpTrayIcon className="h-4 w-4" /> Importer un fichier
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.csv,text/csv" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = '' }} />
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
                    {GAINS.map((f) => (
                      <th key={f.key} className="px-2 py-2 text-right whitespace-nowrap">{f.label.replace(' *', '')}</th>
                    ))}
                    <th className="px-2 py-2 text-right whitespace-nowrap text-red-500">Retenues</th>
                    <th className="px-3 py-2 text-right">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rows.map((r) => {
                    const net = netOf(r)
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
                        {GAINS.map((f) => (
                          <td key={f.key} className="px-2 py-1">
                            <input type="number" min="0" step="0.01" inputMode="decimal" disabled={r.exists}
                              value={r.amounts[f.key]} onChange={(e) => setAmount(r.emp.id, f.key, e.target.value)}
                              className={inputCls} />
                          </td>
                        ))}
                        <td className="px-2 py-1 text-right whitespace-nowrap">
                          {!r.exists && (
                            <button type="button" onClick={() => setEditRetenuesFor(r.emp.id)}
                              className="text-red-600 hover:underline text-sm" title="Modifier le détail des retenues">
                              {fmt(retenuesTotal(r.retenues))}
                              <span className="ml-1 text-xs text-gray-400">({r.retenues.length}) Détail</span>
                            </button>
                          )}
                        </td>
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

      {editRetenuesFor !== null && (() => {
        const row = rows.find((r) => r.emp.id === editRetenuesFor)
        if (!row) return null
        return (
          <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl my-10 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-1">Détail des retenues</h3>
              <p className="text-sm text-gray-500 mb-4">{row.emp.lastName} {row.emp.firstName} — {row.emp.employeeId}</p>
              <RetenuesEditor
                value={row.retenues}
                onChange={(next) => updateRow(row.emp.id, { retenues: next, include: true })}
              />
              <div className="mt-5 flex justify-end">
                <button type="button" onClick={() => setEditRetenuesFor(null)}
                  className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold">Terminé</button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
