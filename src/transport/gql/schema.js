const {gql} = require("apollo-server")

const typeDefs = gql`
    input Coordinate {
        lat: Float
        lng: Float
    }

    input BookTrip {
        pickup: Coordinate!
        dropoff: Coordinate!
        token: String!
    }

    #    schema

    type Error {
        message: String!
        status : Int!
    }

    type UserInformation {
        firstName: String
        lastName: String
    }

    type Driver {
        id: ID!
        name: String
    }

    type Trip {
        i: Int!
        id: ID!
        userId: ID!
        driver: Driver!
        date: String
        price: Float!
        pickup: String!
        dropoff: String!
    }

    type BookingStatus {
        token: String!
        ETA: String!
    }

    type User {
        id: ID!
        email: String!
        password: String!
        information: UserInformation
        trips: [Trip]!

        getTripEstimate(pickup: Coordinate!, dropoff: Coordinate!):Float!
        getBookingStatus(token: String!): BookingStatus!
    }


    type RouteConfirmation {
        statusCode: Int!
        requestId: String!
    }

    type TripUpdateResponse {
        success: Boolean!
        message: String
        trip: Trip
    }

    type TripBookingResponseSuccess {
        token: String!
    }

    type BookingResponse {
        success: TripBookingResponseSuccess
        error: Error
    }

    type UserUpdateResponse {
        success: Boolean!
        messgae: String
        rider: User
    }
    
    type TripSubscriptionUpdate {
        Age: Int
    }

    type Query {
        health: String
        user: User
    }

    type Mutation {
        bookTrip(booking: BookTrip!): BookingResponse!
    }
    
    type Subscription {
        trip(tripId: String!): TripSubscriptionUpdate
        numberIncremented: Int
    }
`

module.exports = typeDefs