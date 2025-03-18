import { gql } from "@apollo/client"

// Mutation pour se connecter - simplifiée selon la structure de votre API
export const LOGIN_MUTATION = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      success
      message
      user {
        id
        email
        firstName
        lastName
        isActive
        createdAt
      }
      status {
        id
        userType
        driverVerified
        passengerVerified
      }
    }
  }
`

