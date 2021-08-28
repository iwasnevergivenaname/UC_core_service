const {RESTDataSource} = require("apollo-datasource-rest")


module.exports = function (app) {
  return class PricingApi extends RESTDataSource {
    constructor() {
      super()
      this.baseURL = "http://localhost:3001/estimation"
    }

    async getPriceEstimate({pickup, dropoff}) {
      const res = await this.post("/", {
        pickup, dropoff
      })
      return res.estimate
    }
  }
}