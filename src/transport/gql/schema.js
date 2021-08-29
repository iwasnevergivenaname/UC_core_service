const {gql} = require("apollo-server")

const typeDefs = gql`
    input Coordinate {
        lat: Float
        lng: Float
    }

    input BookTrip {
        pickup: Coordinate!
        dropoff: Coordinate!
    }

    input TripSession {
        token: String!
    }

    #    schema
    type Error {
        message: String!
        status : Int!
    }

    type TCoordinate {
        lat: Float
        lng: Float
    }


    type UserInformation {
        firstName: String
        lastName: String
    }

    type Driver {
        id: ID!
        name: String
    }

    type TripSessionMeta {
        id: String
    }

    type BeginTripSession {
        success: TripSessionMeta
        error: Error
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
        getTripEstimate(pickup: Coordinate!, dropoff: Coordinate!):GetTripEstimateResponse!
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

    type GetTripEstimateResponseSuccess {
        estimate: Float!
    }
    type GetTripEstimateResponse {
        success: GetTripEstimateResponseSuccess
        error: Error
    }

    type TripBookingResponseSuccess {
        status: String!
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

    type TripSubscriptionUpdateSuccess {
        tripId: String!
        message: String!
        location: TCoordinate!
    }
    
    type TripSubscriptionUpdate {
        success: TripSubscriptionUpdateSuccess
        error: Error
    }

    type Query {
        health: String
        user: User
    }

    type Mutation {
        beginTripSession: BeginTripSession
        bookTrip(booking: BookTrip!): BookingResponse!
    }

    type Subscription {
        tripSub(tripId: String!): TripSubscriptionUpdate!
    }
`

module.exports = typeDefs