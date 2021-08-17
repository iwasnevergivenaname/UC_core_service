const {RESTDataSource} = require("apollo-datasource-rest")

class RouteSuggestionAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:3002/routing"
  }

  async getTripById({tripId}) {
    const res = await this.get('trip', {id: id})
    return res[0]
  }

  async getAllRidersTrips({riderId}) {
    const res = await this.get('ridersTrips', {riderId: riderId})
    return Array.isArray(res) ? res.map(t => this.tripReducer(t)) : []
  }

  async getAllDriversTrips({riderId}) {
    const res = await this.get('driversTrips', {driverId: riderId})
    return Array.isArray(res) ? res.map(t => this.tripReducer(t)) : []
  }

//  get the route suggestion
  async getRoute() {

  }

  tripReducer(trip) {
    return {
      id: trip.id,
      rider: trip.riderId,
      driver: trip.driverId,
      pickup: trip.pickup,
      dropoff: trip.dropoff
    }
  }
}

module.exports = RouteSuggestionAPI
