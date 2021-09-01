const {RESTDataSource} = require("apollo-datasource-rest")
const {v4} = require("uuid")
const WebSocket = require("ws")

const TRIP_SERVICE_WS_URL = process.env.TRIP_SERVICE_WS_URL
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL

const TripStatus = {
  "Created": "Created",
  "Pending": "Pending",
  "OnGoing": "OnGoing",
  "Completed": "Completed"
}

class WSClient {
  constructor(tripId, url) {
    this.tripId = tripId
    this.client = new WebSocket(url)
  }

  async onOpen() {
    return new Promise((resolve) => {
      this.client.on("open", () => {
        resolve()
      })
    })
  }

  async onMessageHook(cb) {
    this.client.on("message", (data) => {
      console.log("onMessageHook")
      console.log(data)
      console.log("onMessageHook")
      if (data) {
        data = data.toString("utf8")
        console.log("----")
        console.log(data)
        console.log("----")
        let r = data
        try {
          r = JSON.parse(data)
        }
        catch {
        }
        cb(r)
      }
    })
  }

  async send(data) {
    const str = JSON.stringify(data)
    console.log(str)
    this.client.send(str)
  }

  async init() {
    await this.onOpen()

    console.log("sending tripId")
    await this.send({id: this.tripId})
    return new Promise((resolve, reject) => {
      this.client.once("message", (ok) => {
        console.log(ok.toString("utf8"))
        if (!(+ok)) {
          return reject("error with socket connection")
        }
        resolve()
      })
    })
  }

  async begin(cb) {
    await this.onOpen()
    await this.init()
    await this.onMessageHook(cb)
  }
}


module.exports = function (app) {
  const pubSub = app.gql.server.pubSub
  return class BookingService extends RESTDataSource {
    constructor() {
      super()
      this.models = app.db.mongo.model
      this.redis = app.db.redis
      this.baseURL = BOOKING_SERVICE_URL
    }

    initialize(config) {
      super.initialize(config)
    }

    async beginTripSession() {
      try {
        const id = v4()

        //fetch the user
        const user = await this.models.UserModel.FindOne({
          email: this.context.user.email
        })

        if (!user) {
          return {
            error: {
              message: "user not found"
            }
          }
        }

        const incompleteTrips = user.trips.filter(trip => {
          return trip !== "Completed"
        })

        if (incompleteTrips.length) {
          return {success: incompleteTrips[0]}
        }

        const trip = {
          id, status: TripStatus.Created
        }

        user.trips.push(trip)

        await Promise.all([
          this.redis.set(this.context.user.email, {
            status: TripStatus.Created,
            tripId: id
          }),
          this.models.UserModel.UpdateOne({email: this.context.user.email}, {$set: {trips: user.trips}}, {upsert: true})
        ])

        return {success: {id: id}}
      }
      catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    }

    async bookTrip({pickup, dropoff}) {
      try {
        const {email} = this.context.user
        let cache = await this.redis.get(email)
        if (!cache) {
          throw Error("No trip session found")
        }

        const bookingConf = await this.post("/", {
          userEmail: email, pickup, dropoff, tripId: cache.tripId
        })

        // await this.models.UserModel.UpdateOne({
        //   id: this.context.user.id, trips: {
        //     $elemMatch: {
        //       id: cache.tripId
        //     }
        //   }
        // }, {
        //   $set: {
        //     "trips.$.status": TripStatus.Pending,
        //     "trips.$.pickup": pickup,
        //     "trips.$.dropoff": dropoff
        //   }
        // }, {upsert: true})

        cache = await this.redis.get(email)
        BookingService.TripUpdates(cache.tripId, async () => {
          await this.models.UserModel.UpdateOne({
            email: this.context.user.email, trips: {
              $elemMatch: {
                id: cache.tripId
              }
            }
          }, {
            $set: {
              "trips.$.status": TripStatus.Completed
            }
          }, {upsert: true})

        })
        return {
          success: {
            status: cache.status
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

    static TripUpdates(tripId, cb) {
      setTimeout(async () => {
        try {
          const client = new WSClient(tripId, TRIP_SERVICE_WS_URL)
          await client.init()
          await client.onMessageHook(async (data) => {
            if (typeof data !== "object") {
              return
            }
            console.log("***")
            console.log(data)
            pubSub.publish("TRIP_SUB", {
              tripSub: {
                success: {
                  tripId,
                  message: data.message,
                  location: data.location
                }
              }
            })
            if (data.tripEnded) {
              setTimeout(async () => {
                await cb()
              }, 0)
            }
          })
        }
        catch (error) {
          console.log(error)
        }
      }, 0)
    }
  }
}



