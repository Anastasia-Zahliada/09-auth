'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { checkSession, getMe, logout } from '@/lib/api/clientApi'
import { useAuthStore } from '@/lib/store/authStore'

interface AuthProviderProps {
  children: React.ReactNode
}

const PRIVATE_ROUTES = ['/notes', '/profile']

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  )
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isChecking, setIsChecking] = useState(true)
  const hasLoadedUser = useRef(false)
  const isFirstCheck = useRef(true)
  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  useEffect(() => {
    const fetchUser = async () => {
      const shouldBlockRendering =
        isPrivateRoute && (isFirstCheck.current || !hasLoadedUser.current)

      if (shouldBlockRendering) {
        setIsChecking(true)
      }

      try {
        const hasSession = await checkSession()

        if (hasSession) {
          if (!hasLoadedUser.current || isPrivateRoute) {
            const user = await getMe()
            if (user) {
              setUser(user)
              hasLoadedUser.current = true
            }
          }
        } else {
          clearIsAuthenticated()
          hasLoadedUser.current = false

          if (isPrivateRoute) {
            await logout().catch(() => undefined)
            router.replace('/sign-in')
            return
          }
        }
      } catch {
        clearIsAuthenticated()
        hasLoadedUser.current = false

        if (isPrivateRoute) {
          await logout().catch(() => undefined)
          router.replace('/sign-in')
          return
        }
      } finally {
        isFirstCheck.current = false

        if (shouldBlockRendering) {
          setIsChecking(false)
        }
      }
    }

    void fetchUser()
  }, [clearIsAuthenticated, isPrivateRoute, pathname, router, setUser])

  if (isPrivateRoute && isChecking) {
    return <p>Loading, please wait...</p>
  }

  if (isPrivateRoute && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}
