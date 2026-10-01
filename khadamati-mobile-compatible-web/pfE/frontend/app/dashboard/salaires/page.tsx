'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon, BanknotesIcon, CalendarIcon,
  DocumentTextIcon, ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

export default function SalairesPage() {
  const { user } = useAuthStore()
  const [salaires, setSalaires] = useState<any[]>([])
  const [bulletins, setBulletins] = useState<any[]>([])
  const [selectedBulletinId, setSelectedBulletinId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [mois, setMois] = useState('')
  const [annee, setAnnee] = useState(new Date().getFullYear().toString())

  const formatMoney = (value: any) =>
    new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value || 0))

  const mapSalaireForAdminTable = (s: any) => {
    const net = Number(s?.salaireNet ?? 0)
    const retenue = Number(s?.retenueMutuelle ?? 0)
    return {
      id: s?.id,
      employeNom: s?.employee?.lastName ?? '',
      employePrenom: s?.employee?.firstName ?? '',
      employeMatricule: s?.employee?.employeeId ?? '',
      mois: s?.mois,
      annee: s?.annee,
      montantBrut: net + retenue,
      deductions: retenue,
      montantNet: net,
      statut: 'PAYE',
    }
  }

  const load = async () => {
    setLoading(true)
    try {
      if (user?.role === 'EMPLOYEE') {
        const params: any = {}
        if (mois) params.mois = parseInt(mois, 10)
        if (annee) params.annee = parseInt(annee, 10)
        const data = await api.getMyPaySlips(params)
        const list = Array.isArray(data) ? data : []
        setBulletins(list)
        if (list.length > 0 && !selectedBulletinId) {
          setSelectedBulletinId(list[0].id)
        } else if (list.length === 0) {
          setSelectedBulletinId(null)
        }
      } else {
        const params: any = {}
        if (mois) params.mois = parseInt(mois, 10)
        if (annee) params.annee = parseInt(annee, 10)
        const data = await api.getSalaires(params)
        const rows = (Array.isArray(data) ? data : []).map(mapSalaireForAdminTable)
        setSalaires(rows)
      }
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [mois, annee, user?.role])

  const filteredSalaires = salaires.filter(s =>
    s.employeNom?.toLowerCase().includes(search.toLowerCase()) ||
    s.employePrenom?.toLowerCase().includes(search.toLowerCase())
  )
  const filteredBulletins = bulletins.filter((b) =>
    (b?.periodeLabel || '').toLowerCase().includes(search.toLowerCase())
  )
  const selectedBulletin = filteredBulletins.find((b) => b.id === selectedBulletinId) || filteredBulletins[0] || null

  const safeFilePart = (value: any) => String(value || 'document').replace(/[^a-zA-Z0-9._-]/g, '_')

  const handleDownloadMyBulletin = async (bulletin: any) => {
    try {
      await api.downloadMyPaySlipPdf(
        bulletin.id,
        `bulletin-paie-${safeFilePart(bulletin.employeeMatricule)}-${bulletin.annee}-${bulletin.mois}.pdf`
      )
    } catch (e: any) {
      toast.error(e.message || 'Erreur de téléchargement')
    }
  }

  const handleDownloadSalaire = async (salaire: any) => {
    try {
      await api.downloadSalaireBulletinPdf(
        salaire.id,
        `bulletin-paie-${safeFilePart(salaire.employeMatricule)}-${salaire.annee}-${salaire.mois}.pdf`
      )
    } catch (e: any) {
      toast.error(e.message || 'Erreur de téléchargement')
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'PAYE': return 'bg-green-100 text-green-700'
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-700'
      case 'EN_COURS': return 'bg-blue-100 text-blue-700'
      case 'ANNULE': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const totalSalaires = filteredSalaires.reduce((sum, s) => sum + (s.montantNet || 0), 0)
  const isEmployee = user?.role === 'EMPLOYEE'

  if (isEmployee) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes Bulletins de Paie</h1>
            <p className="text-gray-500 mt-1">{filteredBulletins.length} bulletin{filteredBulletins.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par période..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={mois}
              onChange={(e) => setMois(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="">Tous les mois</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleDateString('fr-FR', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={annee}
              onChange={(e) => setAnnee(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const y = new Date().getFullYear() - i
                return <option key={y} value={y}>{y}</option>
              })}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredBulletins.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Aucun bulletin trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden xl:col-span-1">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                <p className="text-sm font-semibold text-gray-700">Périodes</p>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredBulletins.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBulletinId(b.id)}
                    className={`w-full text-left px-4 py-3 transition ${selectedBulletin?.id === b.id ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                  >
                    <p className="text-sm font-semibold text-gray-900">{b.periodeLabel}</p>
                    <p className="text-xs text-gray-500 mt-1">Net a payer: {formatMoney(b.netAPayer)} DH</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedBulletin && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm xl:col-span-2">
                <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Bulletin de paie</h2>
                    <p className="text-sm text-gray-500 mt-1">{selectedBulletin.periodeLabel}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadMyBulletin(selectedBulletin)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    PDF
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Employé</p>
                      <p className="font-semibold text-gray-900">{selectedBulletin.employeeName || '-'}</p>
                      <p className="text-gray-600">{selectedBulletin.employeeMatricule || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Affectation</p>
                      <p className="font-semibold text-gray-900">{selectedBulletin.position || '-'}</p>
                      <p className="text-gray-600">{selectedBulletin.department || '-'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-sm font-semibold text-gray-800 mb-3">Elements de remuneration</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between"><span className="text-gray-600">Salaire de base</span><span className="font-semibold">{formatMoney(selectedBulletin.remuneration?.salaireBase)} DH</span></div>
                        <div className="flex items-center justify-between"><span className="text-gray-600">Allocation familiale</span><span className="font-semibold">{formatMoney(selectedBulletin.remuneration?.allocFamiliale)} DH</span></div>
                        <div className="flex items-center justify-between"><span className="text-gray-600">Rappel</span><span className="font-semibold">{formatMoney(selectedBulletin.remuneration?.rappel)} DH</span></div>
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between"><span className="font-semibold text-gray-900">Total gains</span><span className="font-bold text-green-700">{formatMoney(selectedBulletin.remuneration?.totalGains)} DH</span></div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-sm font-semibold text-gray-800 mb-3">Retenues</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between"><span className="text-gray-600">Mutuelle</span><span className="font-semibold text-red-600">-{formatMoney(selectedBulletin.deductions?.mutuelle)} DH</span></div>
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between"><span className="font-semibold text-gray-900">Total retenues</span><span className="font-bold text-red-600">-{formatMoney(selectedBulletin.deductions?.totalDeductions)} DH</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-green-50 border border-green-100 p-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">NET A PAYER</span>
                    <span className="text-2xl font-bold text-green-700">{formatMoney(selectedBulletin.netAPayer)} DH</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultation des Salaires</h1>
          <p className="text-gray-500 mt-1">{filteredSalaires.length} salaire{filteredSalaires.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Salaires</p>
              <p className="text-3xl font-bold mt-1">{totalSalaires.toLocaleString('fr-FR')} DH</p>
            </div>
            <BanknotesIcon className="h-12 w-12 text-green-200 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Nombre d'Employés</p>
              <p className="text-3xl font-bold mt-1">{filteredSalaires.length}</p>
            </div>
            <CalendarIcon className="h-12 w-12 text-blue-200 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Salaire Moyen</p>
              <p className="text-3xl font-bold mt-1">
                {filteredSalaires.length > 0 ? (totalSalaires / filteredSalaires.length).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) : 0} DH
              </p>
            </div>
            <BanknotesIcon className="h-12 w-12 text-purple-200 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={mois}
            onChange={(e) => setMois(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Tous les mois</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleDateString('fr-FR', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={annee}
            onChange={(e) => setAnnee(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = new Date().getFullYear() - i
              return <option key={y} value={y}>{y}</option>
            })}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredSalaires.length === 0 ? (
          <div className="text-center py-20">
            <BanknotesIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Aucun salaire trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Employé</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Période</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Salaire Brut</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Déductions</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Salaire Net</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Statut</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSalaires.map((salaire) => (
                  <tr key={salaire.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {salaire.employeNom} {salaire.employePrenom}
                        </p>
                        <p className="text-xs text-gray-500">{salaire.employeMatricule}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {salaire.mois}/{salaire.annee}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {salaire.montantBrut?.toLocaleString('fr-FR')} DH
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600">
                      -{salaire.deductions?.toLocaleString('fr-FR')} DH
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      {salaire.montantNet?.toLocaleString('fr-FR')} DH
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(salaire.statut)}`}>
                        {salaire.statut?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDownloadSalaire(salaire)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition"
                        title="Télécharger le bulletin PDF"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
