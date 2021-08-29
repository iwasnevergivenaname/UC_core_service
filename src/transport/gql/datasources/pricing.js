const {RESTDataSource} = require("apollo-datasource-rest")


module.exports = function (app) {
  return class PricingApi extends RESTDataSource {
    constructor() {
      super()
      this.baseURL = "http://localhost:3001/estimation"
      this.models = app.db.mongo.model
      this.redis = app.db.redis
    }

    initialize(config) {
      super.initialize(config)
    }

    async getPriceEstimate({pickup, dropoff}) {
      try {
        console.log(1, this.context.user.id)
        const cache = await this.redis.get(this.context.user.id)
        console.log(cache)
        if (!cache) {
          return {
            error: "No trip session was found"
          }
        }

        const tripId = cache.tripId

        const userDoc = await this.models.UserModel.FindOne({id: this.context.user.id}, {trips: {$elemMatch: {id: tripId}}})
        if (!userDoc.trips.length) {
          throw Error("No trip was found")
        }

        let res
        try {
          res = await this.post("/", {pickup, dropoff})
        }
        catch (error) {
          throw new Error("Unable to estimate trip price")
        }

        await this.models.UserModel.UpdateOne({
          id: this.context.user.id, trips: {
            $elemMatch: {
              id: tripId
            }
          }
        }, {
          $set: {"trips.$.estimate": res.estimate}
        }, {upsert: true})

        return {
          success: {
            estimate: res.estimate
          }
        }
      }
      catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    }
  }
}