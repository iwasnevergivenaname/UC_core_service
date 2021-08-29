const {withFilter} = require("graphql-subscriptions")

module.exports = (pubSub) => {
  return {
    Query: {
      health: async (_, __, ___) => "Health",
      user: async (parent, args, {dataSources}, info) => dataSources.userService.findUser()
    },

    Mutation: {
      beginTripSession: async (_, {booking}, {dataSources}) => {
        return dataSources.bookingApi.beginTripSession()
      },
      bookTrip: async (_, {booking}, {dataSources}) => {
        return dataSources.bookingApi.bookTrip(booking)
      }
    },
    Subscription: {
      tripSub: {
        subscribe: withFilter(
          () => pubSub.asyncIterator(["TRIP_SUB"]),
          (payload, variables) => {
            console.log(payload, variables)
            // Only push an update if the comment is on
            // the correct repository for this operation
            return payload.tripSub && payload.tripSub.success && payload.tripSub.success.tripId === variables.tripId
          }
        )
      }
    },
    User: {
      getTripEstimate: async (parent, {pickup, dropoff}, {dataSources}) => {
        return dataSources.pricingApi.getPriceEstimate({pickup, dropoff})
      },
      trips: async (parent, __, {dataSources}) => {
        return parent.trips
      }
    }
  }

}