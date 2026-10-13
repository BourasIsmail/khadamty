'use client'

import { useState } from 'react'
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline'

interface Props {
  title: string
  rows: { label: string; value: string; secret?: boolean }[]
  note?: string
  onClose: () => void
}

// Affiche des identifiants une seule fois (mot de passe temporaire) avec un bouton « Copier ».
export default function CredentialsDialog({ title, rows, note, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const text = rows.map((r) => `${r.label} : ${r.value}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const area = document.createElement('textarea')
      area.value = text
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <dl className="mt-4 space-y-3 rounded-xl bg-gray-50 border border-gray-100 p-4">
          {rows.map((r) => (
            <div key={r.label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{r.label}</dt>
              <dd className={`mt-0.5 break-all text-sm ${r.secret ? 'font-mono font-bold text-gray-900 select-all' : 'text-gray-800'}`}>
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
        {note && <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3">{note}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={copy}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50">
            {copied ? <CheckIcon className="h-4 w-4 text-green-600" /> : <ClipboardDocumentIcon className="h-4 w-4" />}
            {copied ? 'Copié' : 'Copier'}
          </button>
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl">
            Terminé
          </button>
        </div>
      </div>
    </div>
  )
}
