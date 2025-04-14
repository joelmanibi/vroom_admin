import { client } from "./appoloClient"
import { LOGIN_MUTATION } from "./auth-graphql"
import Cookies from "js-cookie"

// Clés pour le localStorage et les cookies
const TOKEN_KEY = "auth_token"
const USER_KEY = "user_data"
// Durée de validité du cookie en jours (7 jours par défaut)
const COOKIE_EXPIRY = 7

// Fonction pour se connecter
export async function login(email: string, password: string) {
  try {
    const { data } = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    })

    // Vérifier si la connexion a réussi et si l'utilisateur est un STAFF
    if (data.loginUser.success && data.loginUser.status.userType === "STAFF") {
      // Créer un token simple basé sur l'email et l'horodatage
      const token = btoa(`${email}:${new Date().getTime()}`)

      // Stocker les données dans le localStorage
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.loginUser))

      // Stocker également le token dans un cookie pour le middleware
      Cookies.set(TOKEN_KEY, token, { expires: COOKIE_EXPIRY, path: "/" })

      return { success: true, data: data.loginUser }
    } else if (!data.loginUser.success) {
      return { success: false, error: "Échec de l'authentification" }
    } else {
      return { success: false, error: "Accès non autorisé. Seul le personnel peut se connecter." }
    }
  } catch (error: any) {
    console.error("Erreur de connexion:", error)
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return { success: false, error: error.graphQLErrors[0].message }
    }
    return { success: false, error: error.message || "Une erreur est survenue" }
  }
}

// Vérifier si l'utilisateur est authentifié
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem(TOKEN_KEY)
}

// Déconnexion
export function logout(): void {
  if (typeof window === "undefined") return

  // Supprimer du localStorage
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)

  // Supprimer également le cookie
  Cookies.remove(TOKEN_KEY, { path: "/" })

  window.location.href = "/auth"
}

// Récupérer les données utilisateur
export function getUserData() {
  if (typeof window === "undefined") return null

  try {
    const userData = localStorage.getItem(USER_KEY)
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error("Erreur lors de la récupération des données utilisateur:", error)
    return null
  }
}

// Synchroniser le localStorage avec les cookies (à appeler au chargement de l'application)
export function syncAuthState() {
  if (typeof window === "undefined") return

  try {
    const tokenFromLocalStorage = localStorage.getItem(TOKEN_KEY)
    const tokenFromCookie = Cookies.get(TOKEN_KEY)

    if (tokenFromLocalStorage && !tokenFromCookie) {
      // Si le token existe dans localStorage mais pas dans les cookies, le synchroniser
      Cookies.set(TOKEN_KEY, tokenFromLocalStorage, { expires: COOKIE_EXPIRY, path: "/" })
    } else if (!tokenFromLocalStorage && tokenFromCookie) {
      // Si le token existe dans les cookies mais pas dans localStorage, le synchroniser
      localStorage.setItem(TOKEN_KEY, tokenFromCookie)
    }
  } catch (error) {
    console.error("Erreur lors de la synchronisation de l'état d'authentification:", error)
  }
}

