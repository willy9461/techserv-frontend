'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'

export default function Home() {
  const router = useRouter()
  const { user, token } = useAuthStore()

  useEffect(() => {
    if (!token || !user) {
      router.replace('/login')
      return
    }

    switch (user.role) {
      case 'cliente':
        router.replace('/tickets')
        break
      case 'tecnico':
        router.replace('/agenda')
        break
      case 'supervisor':
      case 'administrador':
        router.replace('/dashboard')
        break
      case 'area_administrativa':
        router.replace('/facturacion')
        break
      default:
        router.replace('/login')
    }
  }, [user, token, router])

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
}