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

export async function readXlsx(buffer: ArrayBuffer): Promise<string[][]> {
  const ExcelJS: any = (await import('exceljs')).default ?? (await import('exceljs'))
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const sheet = workbook.getWorksheet('Bulletins') ?? workbook.worksheets[0]
  if (!sheet) throw new Error('Aucune feuille trouvée dans le fichier')
  const table: string[][] = []
  sheet.eachRow({ includeEmpty: false }, (row: any) => {
    const cells: string[] = []
    for (let c = 1; c <= row.cellCount; c++) cells.push(cellText(row.getCell(c).value))
    table.push(cells)
  })
  return table
}

export async function buildXlsx(
  fields: FieldDef[],
  rows: TemplateRow[],
  period: string,
  retenueKeys: string[],
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
    const isRetenue = col > 3 && retenueKeys.includes(fields[col - 4].key)
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isRetenue ? 'FFB91C1C' : col <= 3 ? 'FF4B5563' : 'FF15803D' } }
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

  const help = workbook.addWorksheet('Instructions')
  help.getColumn(1).width = 110
  const lines = [
    `Modèle de saisie en masse des bulletins de paie — période : ${period}`,
    '',
    '1. Remplissez la feuille « Bulletins » : une ligne par employé.',
    '2. Ne modifiez ni les titres de colonnes ni la colonne « Matricule » (c’est elle qui identifie l’employé).',
    '3. La colonne « Nom et prénom » est indicative et n’est pas lue à l’import.',
    '4. Le « Salaire de base » est obligatoire ; les autres montants peuvent rester vides (= 0).',
    '5. Saisissez les montants en dirhams, sans le sigle. Le séparateur décimal peut être , ou .',
    '6. Les colonnes vertes sont des éléments de rémunération, les rouges des retenues courantes.',
    '   Les prêts et avances (n° de dossier, montant restant, mois restants) ne figurent pas ici : ils sont repris automatiquement du mois précédent, avec la mensualité décomptée. Modifiez-les avec le bouton « Détail » de la saisie en masse.',
    '7. Le net à payer est calculé automatiquement : total des gains moins total des retenues.',
    '8. Enregistrez le fichier en .xlsx (ou .csv), puis importez-le dans « Saisie en masse ».',
    '9. Un employé qui a déjà un bulletin pour la période est ignoré à l’import.',
  ]
  lines.forEach((l, i) => {
    const cell = help.getCell(i + 1, 1)
    cell.value = l
    cell.alignment = { wrapText: true, vertical: 'top' }
    if (i === 0) cell.font = { bold: true, size: 13 }
  })

  return workbook.xlsx.writeBuffer() as Promise<ArrayBuffer>
}
