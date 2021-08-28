const {RESTDataSource} = require("apollo-datasource-rest")


module.exports = function(app) {
  return class BookingApi extends RESTDataSource {
    constructor() {
      super()
      this.baseURL = "http://localhost:3003/ride"
    }

    // this is subscriptions

  }

}