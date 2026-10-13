// Détail des retenues d'un bulletin : une ligne par retenue
// (type, montant du mois, n° de dossier, montant total du prêt, montant restant, mois restants).

export interface RetenueForm {
  type: string
  montant: string
  numeroDossier: string
  montantTotal: string
  montantRestant: string
  moisRestants: string
}

export const RETENUE_TYPES = [
  'Retraite',
  'Assurance maladie (AMO)',
  'Mutuelle',
  'Impôt sur le revenu (IR)',
  'Crédit bancaire',
  'Avance sur salaire',
  'Autres retenues',
]

/** Retenues « courantes » proposées en colonnes dans le modèle Excel/CSV de saisie en masse. */
export const STANDARD_RETENUES = [
  { key: 'retenueRetraite', type: 'Retraite', label: 'Retraite' },
  { key: 'retenueAmo', type: 'Assurance maladie (AMO)', label: 'Assurance maladie (AMO)' },
  { key: 'retenueMutuelle', type: 'Mutuelle', label: 'Mutuelle' },
  { key: 'retenueIr', type: 'Impôt sur le revenu (IR)', label: 'Impôt sur le revenu (IR)' },
  { key: 'autresRetenues', type: 'Autres retenues', label: 'Autres retenues' },
] as const

export const emptyRetenue = (): RetenueForm => ({
  type: '', montant: '', numeroDossier: '', montantTotal: '', montantRestant: '', moisRestants: '',
})

const str = (v: any) => (v === null || v === undefined ? '' : String(v))

export const retenueFromApi = (l: any): RetenueForm => ({
  type: str(l?.type),
  montant: str(l?.montant),
  numeroDossier: str(l?.numeroDossier),
  montantTotal: str(l?.montantTotal),
  montantRestant: str(l?.montantRestant),
  moisRestants: str(l?.moisRestants),
})

const toNumber = (v: string) => {
  const n = parseFloat((v || '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}
const toNullableNumber = (v: string) => (v.trim() === '' ? null : toNumber(v))

export const isBlankRetenue = (l: RetenueForm) => l.type.trim() === '' && toNumber(l.montant) === 0

/** Lignes prêtes à envoyer au serveur (les lignes entièrement vides sont ignorées). */
export const retenuesToPayload = (list: RetenueForm[]) =>
  list.filter((l) => !isBlankRetenue(l)).map((l) => ({
    type: l.type.trim(),
    montant: toNumber(l.montant),
    numeroDossier: l.numeroDossier.trim() || null,
    montantTotal: toNullableNumber(l.montantTotal),
    montantRestant: toNullableNumber(l.montantRestant),
    moisRestants: l.moisRestants.trim() === '' ? null : Math.max(0, Math.trunc(toNumber(l.moisRestants))),
  }))

export const retenuesTotal = (list: RetenueForm[]) =>
  list.reduce((sum, l) => sum + toNumber(l.montant), 0)

/** Message d'erreur si une ligne est incomplète, sinon null. */
export const retenuesError = (list: RetenueForm[]): string | null => {
  for (const l of list) {
    if (isBlankRetenue(l)) continue
    if (l.type.trim() === '') return 'Chaque retenue doit avoir un type'
    if (toNumber(l.montant) < 0) return 'Les montants ne peuvent pas être négatifs'
  }
  return null
}

/**
 * Reprise du bulletin du mois précédent. Un prêt (mois restants renseignés) avance d'un mois :
 * une mensualité est déduite du montant restant, et la ligne disparaît quand il est soldé.
 * Les autres retenues (mutuelle, retraite…) sont reprises telles quelles.
 */
export function carryOverRetenues(previous: RetenueForm[]): RetenueForm[] {
  const out: RetenueForm[] = []
  for (const l of previous) {
    if (l.moisRestants.trim() === '') { out.push({ ...l }); continue }
    const remainingMonths = Math.trunc(toNumber(l.moisRestants))
    if (remainingMonths <= 0) continue                      // prêt soldé le mois précédent
    out.push({
      ...l,
      moisRestants: String(remainingMonths - 1),
      montantRestant: l.montantRestant.trim() === ''
        ? ''
        : String(Math.max(0, Math.round((toNumber(l.montantRestant) - toNumber(l.montant)) * 100) / 100)),
    })
  }
  return out
}
