module.exports = {
  Query: {
    health: async (_, __, ___) => "Hey",
    user: async (parent, args, {dataSources}, info) => dataSources.userService.findUser()
  },

  Mutation: {
    bookTrip: async (_, {booking}, {dataSources}) => {
      return dataSources.bookingApi.bookTrip(booking)
    },
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
