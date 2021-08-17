const {gql} = require("apollo-server")

const typeDefs = gql`
    #    schema
    type Rider {
        id: ID!
        email: String!
        password: String!
        firstName: String
        lastName: String
        trips: [Trip]
        token: String
    }

    type Driver {
        id: ID!
        name: String
    }

    type Trip {
        id: ID!
        riderId: ID!
        driverId: Driver
        # date: Datetime
        pickup: [Float]
        dropoff: [Float]
    }

    type RouteConfirmation {
        statusCode: Int!
        requestId: String!
    }

    type Query {
        # return logged in rider
        rider: Rider
        trip: Trip
#        ridersTrips(riderId: ID!): [Trip]!
#        driversTrips(driverId: ID!): [Trip]!
        # micro services 
        price: Float
        route: RouteConfirmation
        ride: Trip
    }

    type TripUpdateResponse {
        success: Boolean!
        message: String
        trip: Trip
    }

    type RiderUpdateResponse {
        success: Boolean!
        messgae: String
        rider: Rider
    }

    type Mutation {
        createTrip(riderId: ID!): TripUpdateResponse!
        startTrip(tripId: ID!): TripUpdateResponse!
        cancelTrip(tripId: ID!): TripUpdateResponse!
#        updateRider(riderId: ID!): RiderUpdateResponse!
#        removeRider(riderId: ID!): RiderUpdateResponse!
        login(email: String): Rider
    }
`

module.exports = typeDefs