module.exports = {
  Query: {
    rider: (_, __, {dataSources}) => dataSources.riderAPI.findOrCreateRider(),
    trip: (_, {id}, {dataSources}) => dataSources.routeSuggestionAPI.getTripById({id: id}),
    price: (_, __, {dataSources}) => dataSources.priceEstimateAPI.getPriceEstimate(),
    route: (_, __, {dataSources}) => dataSources.routeSuggestionAPI.getRoute(),
    ride: (_, __, {dataSources}) => dataSources.rideExperienceAPI.getRide()
  },

  Rider: {
    trips: async (_, __, {dataSources}) => {
      const tripIds = await dataSources.riderAPI.getTripsByRider()
      if (!tripIds.length) {
        return []
      }
      return (dataSources.routeSuggestionAPI.getTripById({
        tripIds
      }) || [])
    }
  },

  Mutation: {
    login: async (_, {email}, {dataSources}) => {
      const rider = await dataSources.riderAPI.findOrCreateRider({email})
      if (rider) {
        rider.token = Buffer.from(email).toString('base64')
        return rider
      }
    },

    startTrip: async (_, {tripId}, {dataSources}) => {
      const res = await dataSources.riderAPI.orderTrip()
      const trip = await dataSources.routeSuggestionAPI.getTripById({tripId})

      return {
        success: res && res.length === tripId.length,
        message: res.length === tripId.length
        ? 'trip successfully booked' : 'something went wrong with this booking',
        trip
      }
    },

    cancelTrip: async (_, {tripId}, {dataSources}) => {
      const res = await dataSources.riderAPI.cancelTrip({tripId})

      if (!res) {
        return {
          success: false,
          message: 'failed to cancel trip'
        }
      }

      const trip = await dataSources.routeSuggestionAPI({tripId})
      return {
        success: true,
        message: 'trip canceled',
        trip: trip
      }
    },

    // updateRider: async (_, {riderId}, {dataSources}) => {
    //
    // },
    //
    // removeRider: async (_, {riderId}, {dataSources}) => {
    //
    // },
  },
}
