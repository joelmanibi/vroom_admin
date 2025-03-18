import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes protégées qui nécessitent une authentification
const protectedRoutes = ["/dashboard", "/profile", "/settings"]
// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ["/auth", "/login"]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Vérifier si l'utilisateur est authentifié via le cookie
  const token = request.cookies.get("auth_token")?.value
  const isAuthenticated = !!token

  // Vérifier si la route actuelle est protégée
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  // Vérifier si la route actuelle est publique
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route))

  // Si l'utilisateur accède à une route protégée sans être authentifié
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  // Si l'utilisateur accède à une page d'authentification alors qu'il est déjà authentifié
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Appliquer le middleware à toutes les routes sauf les ressources statiques
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
}

