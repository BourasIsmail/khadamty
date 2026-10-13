'use client'

import { formatDate, seniority } from '@/lib/format'

interface Props {
  profile: any
  /** Dernier bulletin, pour le grade et l'échelon (facultatif). */
  bulletin?: any
}

// Données personnelles et professionnelles de l'employé.
export default function PersonalInfo({ profile, bulletin }: Props) {
  const fields: [string, any][] = [
    ['Nom complet', `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()],
    ['Matricule', profile.employeeId],
    ['Email', profile.email],
    ['Téléphone', profile.phone],
    ['Adresse', profile.address],
    ['Poste', profile.position],
    ['Structure', profile.structurePath || profile.structureLibelle || profile.department],
    ['Grade', bulletin?.grade],
    ['Échelon', bulletin?.echelon],
    ["Date d'embauche", formatDate(profile.hireDate)],
    ['Ancienneté', seniority(profile.hireDate)],
    ['Statut', profile.status === 'active' ? 'Actif' : profile.status === 'inactive' ? 'Inactif' : profile.status],
    ["Contact d'urgence", [profile.emergencyContact, profile.emergencyPhone].filter(Boolean).join(' · ')],
  ]
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {fields.map(([label, value]) => (
        <div key={label} className="bg-gray-50 rounded-xl p-3 min-w-0">
          <dt className="text-xs text-gray-400 font-medium">{label}</dt>
          <dd className="text-sm font-semibold text-gray-900 mt-0.5 break-words">{value || '—'}</dd>
        </div>
      ))}
    </dl>
  )
}
