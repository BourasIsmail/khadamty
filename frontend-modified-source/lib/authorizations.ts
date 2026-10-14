// Types d'autorisations (le backend porte les mêmes valeurs et applique les mêmes plafonds).

export interface AuthorizationType {
  value: string
  label: string
  maxDays?: number
  note?: string
}

export interface AuthorizationGroup {
  title: string
  types: AuthorizationType[]
}

export const AUTHORIZATION_GROUPS: AuthorizationGroup[] = [
  {
    title: 'Autorisations administratives',
    types: [
      { value: 'ANNUAL_LEAVE', label: 'Autorisation annuelle', maxDays: 22, note: '22 jours ouvrables par an, après 12 mois de service' },
      { value: 'EXCEPTIONAL_LEAVE', label: 'Autorisation exceptionnelle / absence', maxDays: 10, note: 'Raisons personnelles ou familiales graves, 10 jours maximum' },
      { value: 'HAJJ_LEAVE', label: 'Autorisation de pèlerinage (Hajj)', maxDays: 60, note: 'Une seule fois dans la carrière, 2 mois' },
    ],
  },
  {
    title: 'Autorisations pour raisons de santé',
    types: [
      { value: 'SICK_SHORT_TERM', label: 'Maladie de courte durée', maxDays: 180, note: "6 mois maximum par an" },
      { value: 'SICK_MEDIUM_TERM', label: 'Maladie de moyenne durée', maxDays: 1095, note: "Jusqu'à 3 ans" },
      { value: 'SICK_LONG_TERM', label: 'Maladie de longue durée', maxDays: 1825, note: "Jusqu'à 5 ans, maladies fixées par la loi" },
      { value: 'WORK_ACCIDENT', label: 'Maladie ou accident du travail', note: "Jusqu'à la reprise du travail ou la mise à la retraite" },
    ],
  },
  {
    title: 'Maternité, paternité, kafala, allaitement',
    types: [
      { value: 'MATERNITY', label: 'Autorisation de maternité', maxDays: 98, note: '14 semaines' },
      { value: 'PATERNITY', label: 'Autorisation de paternité', maxDays: 15, note: '15 jours' },
      { value: 'ADOPTION', label: 'Autorisation de kafala', maxDays: 98, note: '14 semaines' },
      { value: 'NURSING', label: "Heure d'allaitement", note: "1 heure par jour jusqu'aux 24 mois de l'enfant" },
    ],
  },
  {
    title: 'Autorisations sans traitement',
    types: [
      { value: 'UNPAID_LEAVE', label: 'Autorisation sans traitement', maxDays: 30, note: 'Sur demande, un mois maximum tous les deux ans' },
    ],
  },
]

// Anciennes valeurs encore présentes dans l'historique des demandes.
const LEGACY_LABELS: Record<string, string> = {
  SICK_LEAVE: 'Autorisation maladie',
  PERSONAL_LEAVE: 'Autorisation personnelle',
  MATERNITY_LEAVE: 'Autorisation de maternité',
  PATERNITY_LEAVE: 'Autorisation de paternité',
  EMERGENCY_LEAVE: "Autorisation d'urgence",
}

export const AUTHORIZATION_LABELS: Record<string, string> = {
  ...LEGACY_LABELS,
  ...Object.fromEntries(AUTHORIZATION_GROUPS.flatMap((g) => g.types.map((t) => [t.value, t.label]))),
}

export function findAuthorizationType(value: string): AuthorizationType | undefined {
  return AUTHORIZATION_GROUPS.flatMap((g) => g.types).find((t) => t.value === value)
}
