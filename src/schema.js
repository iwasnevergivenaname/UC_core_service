const {gql} = require("apollo-server")

const typeDefs = gql`
    #    schema
    type Rider {
        id: ID!
        email: String!
        password: String!
        firstName: String
        lastName: String
    }

    type Driver {
        id: ID!
        name: String
    }

    type Trip {
        id: ID!
        rider: Rider!
        driver: Driver!
        #      date: Datetime
        pickup: [Float]!
        dropoff: [Float]!
    }

    type Query {
        #        return logged in rider
        rider: Rider
        trip(id: ID!): Trip
        ridersTrips(riderId: ID!): [Trip]!
        driversTrips(driverId: ID!): [Trip]!
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
        startTrip(tripId: ID!): TripUpdateResponse!
        updateRider(riderId: ID!): RiderUpdateResponse!
        removeRider(riderId: ID!): RiderUpdateResponse!
        login(email: String): Rider
    }


`

module.exports = typeDefs