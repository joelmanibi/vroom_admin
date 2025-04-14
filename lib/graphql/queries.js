import { gql } from "@apollo/client"

export const GET_DRIVERS = gql`
  query GetUsers($userType: UsersUserStatusUserTypeChoices) {
    users(status_UserType: $userType, isDeleted: false) {
      edges {
        node {
          id
          firstName
          lastName
          phoneNumber
          email
          isActive
          isOnline
          createdAt
          driverJourneys(isDeleted:false){
          edges{
            node{
              id
            }
          }
        }
          vehicles(isDeleted: false) {
            edges {
              node {
                vehicleBrand
                vehicleRegistration
                vehicleModel
                vehicleColor
                documents {
                  edges {
                    node {
                      rectoPath
                      versoPath
                    }
                  }
                }
              }
            }
          }
          status {
            id
            userType
            driverVerified
            passengerVerified
          }
          documents {
            edges {
              node {
                rectoPath
                versoPath
              }
            }
          }
        }
      }
    }
  }
`

