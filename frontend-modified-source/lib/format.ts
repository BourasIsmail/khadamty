export const formatMoney = (value: any) =>
  new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value || 0))

export const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('fr-FR') : '—'

/** « 2 ans et 3 mois » depuis la date d'embauche. */
export function seniority(hireDate?: string | null): string {
  if (!hireDate) return '—'
  const start = new Date(hireDate)
  const now = new Date()
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  if (now.getDate() < start.getDate()) months--
  if (months < 1) return 'Moins d’un mois'
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = []
  if (years) parts.push(`${years} an${years > 1 ? 's' : ''}`)
  if (rest) parts.push(`${rest} mois`)
  return parts.join(' et ')
}
