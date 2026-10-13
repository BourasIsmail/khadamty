// Modèle Excel / CSV pour la saisie en masse des bulletins de paie : génération et lecture.
// Aucune dépendance au navigateur hors exceljs (chargé à la demande), pour pouvoir être testé sous Node.

export interface FieldDef { key: string; label: string }

export interface TemplateRow {
  matricule: string
  nom: string
  echelon: string
  amounts: Record<string, string>
}

export interface ParsedEntry {
  matricule: string
  echelon: string
  amounts: Record<string, string>
}

export interface ParsedTable {
  entries: ParsedEntry[]
  unknownColumns: string[]
}

/** Une ligne de la feuille « Retenues » : une retenue d'un employé. */
export interface RetenueSheetRow {
  matricule: string
  nom: string
  type: string
  montant: string
  numeroDossier: string
  montantTotal: string
  montantRestant: string
  moisRestants: string
}

export interface ParsedRetenue {
  type: string
  montant: string
  numeroDossier: string
  montantTotal: string
  montantRestant: string
  moisRestants: string
}

export interface ParsedRetenues {
  /** matricule → lignes de retenue (liste éventuellement vide) */
  byMatricule: Map<string, ParsedRetenue[]>
  ignoredRows: number
}

const cleanLabel = (label: string) => label.replace(/\s*\*$/, '')

/** minuscules, sans accents ni ponctuation : « Indemnité de logement » → « indemnitedelogement » */
export const normalizeHeader = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')

/** « 8 000,50 », « 8.000,50 », « 8000.50 » → « 8000.50 » ; texte illisible → « » */
export function normalizeNumber(raw: string): string {
  let v = (raw ?? '').toString().replace(/[\s  ]/g, '').replace(/(dh|mad)$/i, '')
  if (v === '') return ''
  const lastComma = v.lastIndexOf(',')
  const lastDot = v.lastIndexOf('.')
  if (lastComma >= 0 && lastDot >= 0) {
    // Les deux présents : le dernier est le séparateur décimal, l'autre sépare les milliers
    v = lastComma > lastDot ? v.replace(/\./g, '').replace(',', '.') : v.replace(/,/g, '')
  } else if (lastComma >= 0) {
    v = v.replace(',', '.')
  }
  return /^-?\d+(\.\d+)?$/.test(v) ? v : ''
}

// ── CSV ─────────────────────────────────────────────────────────────────────

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

export function parseCsv(text: string): string[][] {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim() !== '')
  if (lines.length === 0) return []
  const count = (ch: string) => lines[0].split(ch).length - 1
  const sep = count(';') >= count(',') && count(';') >= count('\t') ? ';' : count('\t') > count(',') ? '\t' : ','
  return lines.map((l) => splitCsvLine(l, sep))
}

export function buildCsv(fields: FieldDef[], rows: TemplateRow[]): string {
  const header = ['Matricule', 'Nom et prénom', 'Échelon', ...fields.map((f) => cleanLabel(f.label))]
  const lines = [header.join(';')]
  for (const r of rows) {
    lines.push([
      r.matricule, r.nom.replace(/[;"\r\n]/g, ' '), r.echelon,
      ...fields.map((f) => r.amounts[f.key] ?? ''),
    ].join(';'))
  }
  return '﻿' + lines.join('\r\n')
}

// ── Lecture d'un tableau (CSV ou feuille Excel) ─────────────────────────────

export function mapTable(table: string[][], fields: FieldDef[]): ParsedTable {
  if (table.length < 2) throw new Error('Le fichier ne contient aucune ligne de données')
  const headers = table[0].map((h) => normalizeHeader(h))

  const byHeader = new Map<string, string>()
  for (const f of fields) {
    byHeader.set(normalizeHeader(f.key), f.key)
    byHeader.set(normalizeHeader(cleanLabel(f.label)), f.key)
  }
  const iMat = headers.findIndex((h) => h === 'matricule' || h === 'employeeid')
  if (iMat < 0) throw new Error('Colonne « Matricule » introuvable')
  const iEch = headers.findIndex((h) => h === 'echelon')

  const columns: { index: number; key: string }[] = []
  const unknownColumns: string[] = []
  headers.forEach((h, i) => {
    if (i === iMat || i === iEch || h === '' || h.startsWith('nom')) return
    const key = byHeader.get(h)
    if (key) columns.push({ index: i, key })
    else unknownColumns.push(table[0][i])
  })
  if (columns.length === 0) throw new Error('Aucune colonne de montant reconnue')

  const entries: ParsedEntry[] = []
  for (const cells of table.slice(1)) {
    const matricule = (cells[iMat] ?? '').toString().trim()
    if (!matricule) continue
    const amounts: Record<string, string> = {}
    for (const { index, key } of columns) amounts[key] = normalizeNumber((cells[index] ?? '').toString())
    entries.push({ matricule, echelon: iEch >= 0 ? (cells[iEch] ?? '').toString().trim() : '', amounts })
  }
  return { entries, unknownColumns }
}

// ── Feuille / fichier « Retenues » ──────────────────────────────────────────

export const RETENUE_HEADERS = [
  'Matricule', 'Nom et prénom', 'Type de retenue', 'Retenue mensuelle',
  'N° dossier', 'Montant total du prêt', 'Montant restant', 'Mois restants',
]

const retenueCells = (r: RetenueSheetRow) =>
  [r.matricule, r.nom, r.type, r.montant, r.numeroDossier, r.montantTotal, r.montantRestant, r.moisRestants]

export function buildRetenuesCsv(rows: RetenueSheetRow[]): string {
  const clean = (v: string) => (v ?? '').replace(/[;"\r\n]/g, ' ')
  const lines = [RETENUE_HEADERS.join(';')]
  for (const r of rows) lines.push(retenueCells(r).map(clean).join(';'))
  return '\uFEFF' + lines.join('\r\n')
}

/** « retenues » si le tableau a une colonne « Type de retenue », « bulletins » sinon. */
export function detectKind(table: string[][]): 'retenues' | 'bulletins' {
  const headers = (table[0] ?? []).map(normalizeHeader)
  return headers.includes('typederetenue') ? 'retenues' : 'bulletins'
}

export function mapRetenues(table: string[][]): ParsedRetenues {
  if (table.length < 1) throw new Error('La feuille « Retenues » est vide')
  const headers = table[0].map(normalizeHeader)
  const find = (...names: string[]) => headers.findIndex((h) => names.includes(h))
  const iMat = find('matricule', 'employeeid')
  const iType = find('typederetenue', 'type')
  const iMontant = find('retenuemensuelle', 'montant', 'retenue')
  if (iMat < 0 || iType < 0 || iMontant < 0)
    throw new Error('Colonnes « Matricule », « Type de retenue » et « Retenue mensuelle » obligatoires')
  const iDossier = find('ndossier', 'numerodossier', 'dossier', 'nodossier')
  const iTotal = find('montanttotaldupret', 'montanttotal')
  const iRestant = find('montantrestant')
  const iMois = find('moisrestants', 'nombredemoisrestants')

  const cell = (cells: string[], i: number) => (i >= 0 ? (cells[i] ?? '').toString().trim() : '')
  const byMatricule = new Map<string, ParsedRetenue[]>()
  let ignoredRows = 0
  for (const cells of table.slice(1)) {
    const matricule = cell(cells, iMat)
    if (!matricule) continue
    if (!byMatricule.has(matricule)) byMatricule.set(matricule, [])
    const type = cell(cells, iType)
    const montant = normalizeNumber(cell(cells, iMontant))
    if (type === '' && (montant === '' || Number(montant) === 0)) continue      // ligne vide laissée pour la saisie
    if (type === '') { ignoredRows++; continue }                                  // montant sans type : ignoré
    byMatricule.get(matricule)!.push({
      type, montant: montant || '0',
      numeroDossier: cell(cells, iDossier),
      montantTotal: normalizeNumber(cell(cells, iTotal)),
      montantRestant: normalizeNumber(cell(cells, iRestant)),
      moisRestants: normalizeNumber(cell(cells, iMois)).replace(/\..*$/, ''),
    })
  }
  return { byMatricule, ignoredRows }
}

// ── Excel ───────────────────────────────────────────────────────────────────

const cellText = (v: any): string => {
  if (v === null || v === undefined) return ''
  if (typeof v === 'object') {
    if ('result' in v) return cellText(v.result)                       // formule
    if ('richText' in v) return v.richText.map((t: any) => t.text).join('')
    if ('text' in v) return String(v.text)                            // lien hypertexte
    if (v instanceof Date) return ''
  }
  return String(v)
}

function sheetToTable(sheet: any): string[][] {
  const table: string[][] = []
  sheet.eachRow({ includeEmpty: false }, (row: any) => {
    const cells: string[] = []
    for (let c = 1; c <= row.cellCount; c++) cells.push(cellText(row.getCell(c).value))
    table.push(cells)
  })
  return table
}

/** Lit le classeur : feuille « Bulletins » (ou la première) et, si elle existe, la feuille « Retenues ». */
export async function readXlsxSheets(buffer: ArrayBuffer): Promise<{ bulletins: string[][]; retenues: string[][] | null }> {
  const ExcelJS: any = (await import('exceljs')).default ?? (await import('exceljs'))
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const bulletins = workbook.getWorksheet('Bulletins') ?? workbook.worksheets[0]
  if (!bulletins) throw new Error('Aucune feuille trouvée dans le fichier')
  const retenues = workbook.getWorksheet('Retenues')
  return { bulletins: sheetToTable(bulletins), retenues: retenues ? sheetToTable(retenues) : null }
}

export async function buildXlsx(
  fields: FieldDef[],
  rows: TemplateRow[],
  period: string,
  retenueRows: RetenueSheetRow[],
): Promise<ArrayBuffer> {
  const ExcelJS: any = (await import('exceljs')).default ?? (await import('exceljs'))
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Khadamati'

  const sheet = workbook.addWorksheet('Bulletins', { views: [{ state: 'frozen', xSplit: 2, ySplit: 1 }] })
  sheet.columns = [
    { header: 'Matricule', key: 'matricule', width: 14 },
    { header: 'Nom et prénom', key: 'nom', width: 30 },
    { header: 'Échelon', key: 'echelon', width: 10 },
    ...fields.map((f) => ({ header: cleanLabel(f.label), key: f.key, width: 18 })),
  ]
  const header = sheet.getRow(1)
  header.height = 32
  header.eachCell((cell: any, col: number) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: col <= 3 ? 'FF4B5563' : 'FF15803D' } }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  })

  for (const r of rows) {
    const values: Record<string, any> = { matricule: r.matricule, nom: r.nom, echelon: r.echelon }
    for (const f of fields) {
      const n = parseFloat(r.amounts[f.key] ?? '')
      values[f.key] = Number.isFinite(n) ? n : null
    }
    sheet.addRow(values)
  }
  // Format texte pour le matricule (évite que « 007 » devienne 7) et montants à 2 décimales
  sheet.getColumn('matricule').numFmt = '@'
  sheet.getColumn('echelon').numFmt = '@'
  for (const f of fields) sheet.getColumn(f.key).numFmt = '#,##0.00'

  // Feuille « Retenues » : une ligne par retenue (mutuelle, retraite, prêt…)
  const rs = workbook.addWorksheet('Retenues', { views: [{ state: 'frozen', xSplit: 2, ySplit: 1 }] })
  rs.columns = [
    { header: RETENUE_HEADERS[0], key: 'matricule', width: 14 },
    { header: RETENUE_HEADERS[1], key: 'nom', width: 30 },
    { header: RETENUE_HEADERS[2], key: 'type', width: 28 },
    { header: RETENUE_HEADERS[3], key: 'montant', width: 18 },
    { header: RETENUE_HEADERS[4], key: 'numeroDossier', width: 14 },
    { header: RETENUE_HEADERS[5], key: 'montantTotal', width: 20 },
    { header: RETENUE_HEADERS[6], key: 'montantRestant', width: 18 },
    { header: RETENUE_HEADERS[7], key: 'moisRestants', width: 14 },
  ]
  const rh = rs.getRow(1)
  rh.height = 32
  rh.eachCell((cell: any, col: number) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: col <= 2 ? 'FF4B5563' : 'FFB91C1C' } }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  })
  const asNumber = (v: string) => { const n = parseFloat(v); return Number.isFinite(n) ? n : null }
  for (const r of retenueRows) {
    rs.addRow({
      matricule: r.matricule, nom: r.nom, type: r.type, montant: asNumber(r.montant),
      numeroDossier: r.numeroDossier, montantTotal: asNumber(r.montantTotal),
      montantRestant: asNumber(r.montantRestant), moisRestants: asNumber(r.moisRestants),
    })
  }
  rs.getColumn('matricule').numFmt = '@'
  rs.getColumn('numeroDossier').numFmt = '@'
  for (const k of ['montant', 'montantTotal', 'montantRestant']) rs.getColumn(k).numFmt = '#,##0.00'

  const help = workbook.addWorksheet('Instructions')
  help.getColumn(1).width = 110
  const lines = [
    `Modèle de saisie en masse des bulletins de paie — période : ${period}`,
    '',
    'FEUILLE « Bulletins » — la rémunération : une ligne par employé.',
    '• Ne modifiez ni les titres de colonnes ni la colonne « Matricule » (elle identifie l’employé). « Nom et prénom » est indicatif.',
    '• Le « Salaire de base » est obligatoire ; les autres montants peuvent rester vides (= 0).',
    '',
    'FEUILLE « Retenues » — le détail des retenues : une ligne par retenue.',
    '• Mutuelle, retraite, AMO, impôt, prêt, avance… : saisissez le type dans « Type de retenue » et le montant du mois dans « Retenue mensuelle ».',
    '• Pour un prêt ou une avance, renseignez aussi le n° de dossier, le montant total, le montant restant et les mois restants APRÈS la retenue de ce mois.',
    '• Un employé peut avoir plusieurs lignes : recopiez son matricule sur chaque ligne (ajoutez des lignes en bas du tableau).',
    '• Les prêts en cours sont déjà reportés du mois précédent (mensualité décomptée, un mois de moins). Supprimez ou corrigez une ligne si besoin.',
    '• Une ligne sans type ni montant est ignorée. Un employé sans ligne n’a aucune retenue ce mois-ci.',
    '',
    'POUR TOUS',
    '• Montants en dirhams, sans le sigle ; le séparateur décimal peut être , ou .',
    '• Le net à payer est calculé automatiquement : total des gains moins total des retenues.',
    '• Enregistrez en .xlsx puis importez le fichier dans « Saisie en masse ». Un employé qui a déjà un bulletin pour la période est ignoré.',
  ]
  lines.forEach((l, i) => {
    const cell = help.getCell(i + 1, 1)
    cell.value = l
    cell.alignment = { wrapText: true, vertical: 'top' }
    if (i === 0) cell.font = { bold: true, size: 13 }
  })

  return workbook.xlsx.writeBuffer() as Promise<ArrayBuffer>
}
