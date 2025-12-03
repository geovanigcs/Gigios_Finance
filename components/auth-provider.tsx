'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const publicRoutes = ['/', '/register']

export function AuthProvider({ children }: { children: React.Node }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!token && !isPublicRoute) {
      router.push('/')
    } else if (token && isPublicRoute) {
      router.push('/dashboard')
    }
  }, [pathname, router])

  return <>{children}</>
}
