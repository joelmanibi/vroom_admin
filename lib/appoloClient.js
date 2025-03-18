import { ApolloClient, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { createHttpLink } from "@apollo/client/link/http"

// Créer un lien HTTP
const httpLink = createHttpLink({
  uri: "https://dev-api.vroomcar.net/vroom/",
})

// Ajouter le token d'authentification aux en-têtes
const authLink = setContext((_, { headers }) => {
  // Récupérer le token depuis le localStorage
  let token = null
  if (typeof window !== "undefined") {
    token = localStorage.getItem("auth_token")
  }

  // Retourner les en-têtes au contexte
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

