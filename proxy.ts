import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { parse } from 'cookie'
import { checkSession } from './lib/api/serverApi'

const PRIVATE_ROUTES = ['/notes', '/profile']
const AUTH_ROUTES = ['/sign-in', '/sign-up']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value
  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession(cookieStore.toString())
      const setCookie = sessionResponse.headers['set-cookie']

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie]

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr)
          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: Number(parsed['Max-Age']),
          }

          if (parsed.accessToken) {
            cookieStore.set('accessToken', parsed.accessToken, options)
          }

          if (parsed.refreshToken) {
            cookieStore.set('refreshToken', parsed.refreshToken, options)
          }
        }
      }
    } catch {
      cookieStore.delete('accessToken')
      cookieStore.delete('refreshToken')
    }
  }

  const updatedAccessToken = cookieStore.get('accessToken')?.value
  const updatedRefreshToken = cookieStore.get('refreshToken')?.value
  const isAuthenticated = Boolean(updatedAccessToken || updatedRefreshToken)

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
}
