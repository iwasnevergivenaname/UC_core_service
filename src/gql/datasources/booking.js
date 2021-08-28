const {RESTDataSource} = require("apollo-datasource-rest")

const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL
module.exports = function (app) {
  return class BookingService extends RESTDataSource {
    constructor() {
      super()
      this.baseURL = "http://localhost:9000/booking"
    }

    initialize(config) {
      super.initialize(config)
    }

    async bookTrip({pickup, dropoff}) {
      const {id} = this.context.user
      const bookingConf = await this.post("/", {
        userId: id, pickup, dropoff, token: ""
      })

      console.log(bookingConf)

      return {}
    }
  }
}


