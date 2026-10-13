'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// La création de comptes est réservée à l'administrateur (Employés → Nouvel employé).
export default function RegisterPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/login') }, [router])
  return null
}
