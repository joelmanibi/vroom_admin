import { gql } from "@apollo/client"

// Mutation pour se connecter - simplifiée selon la structure de votre API
export const UPDATE_VERIFICATION_USER_MUTATION = gql`
  mutation UpdateUserVerification(
  $userId: ID!
  $driverVerified: VerificationStatus
) {
  updateUserVerification(
    userId: $userId
    driverVerified: $driverVerified
  ) {
    success
    message
    status {
      id
      userType
      driverVerified
      passengerVerified
    }
  }
}
`

