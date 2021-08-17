const {DataSource} = require("apollo-datasource")

class TripAPI extends DataSource {
  constructor({store}) {
    super();
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  async findOrCreateTrip() {
    const trip = this.context && this.context.trip ? this.context.trip.id : null
    const rider = this.context && this.context.rider ? this.context.rider.id : null
    // const rider = this.context && this.context.rider ? this.context.rider.id : null

    // console.log("in trip api", trip, rider)
    // if (!trip) {
    //   console.log("bbbbbooooooppppp")
    //   return null
    // }
    const trips = await this.store.trips.findOrCreate({where: {id: trip, riderId: rider}})
    // console.log("!!!!!!!!", trips[0].dataValues)

    return trips[0].dataValues
  }

  async findAllRiderTrips({riderId}) {
    const trips = await this.store.trips.filterBy(riderId, riderId)
    console.log("!!!!!!!!!!!!!", trips)
    return trips
  }

}

module.exports = TripAPI