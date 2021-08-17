module.exports = {
  Query: {
    rider: async (_, __, {dataSources}) => dataSources.riderAPI.findOrCreateRider(),
    trip: async (_, __, {dataSources}) => dataSources.tripAPI.findOrCreateTrip(),
    // trip: async (_, {id}, {dataSources}) => dataSources.routeSuggestionAPI.getTripById({id: id}),
    price: async (_, __, {dataSources}) => dataSources.priceEstimateAPI.getPriceEstimate(),
    route: async (_, __, {dataSources}) => dataSources.routeSuggestionAPI.getRoute(),
    ride: async (_, __, {dataSources}) => dataSources.rideExperienceAPI.getRide()
  },

  Rider: {
    trips: async (_, __, {dataSources}) => {
      console.log("hello")
      const tripIds = await dataSources.riderAPI.getTripsByRider()
      // const tripIds = await dataSources.tripAPI.findAllRiderTrips()
      if (!tripIds.length) {
        return []
      }

      console.log("🌱", tripIds)
      return tripIds
      // return (dataSources.routeSuggestionAPI.getTripById({
      //   tripIds
      // }) || [])
    }
  },

  Mutation: {
    login: async (_, {email}, {dataSources}) => {
      const rider = await dataSources.riderAPI.findOrCreateRider({email})
      if (rider) {
        rider.token = Buffer.from(email).toString("base64")
        return rider
      }
    },

    createTrip: async (_, {riderId}, {dataSources}) => {
      const res = await dataSources.tripAPI.findOrCreateTrip({riderId})
      console.log("*************", res)

      if (!res) {
        return {
          success: false,
          message: "failed to create trip"
        }
      }

      return {
        success: true,
        message: "trip successfully created",
        trip: res
      }

    },

    startTrip: async (_, {tripId}, {dataSources}) => {
      const res = await dataSources.riderAPI.orderTrip({tripId})
      const trip = await dataSources.tripAPI.findOrCreateTrip({tripId})

      return {
        success: res && res.length === tripId.length,
        message: res.length === tripId.length
          ? "trip successfully started" : "something went wrong with this trip",
        res
      }
    },

    cancelTrip: async (_, {tripId}, {dataSources}) => {
      const res = await dataSources.riderAPI.cancelTrip({tripId})

      if (!res) {
        return {
          success: false,
          message: "failed to cancel trip"
        }
      }

      const trip = await dataSources.routeSuggestionAPI({tripId})
      return {
        success: true,
        message: "trip canceled",
        trip: trip
      }
    }

    // updateRider: async (_, {riderId}, {dataSources}) => {
    //
    // },
    //
    // removeRider: async (_, {riderId}, {dataSources}) => {
    //
    // },
  }
}
