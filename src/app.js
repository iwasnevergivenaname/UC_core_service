const makeDb = require("./database")
const {
  makeGql,
  makeHttp,
  makeWsClient
} = require("./transport")

module.exports = class App {
  constructor() {
    const dbs = makeDb(this)

    this.db = {}
    this.db.redis = dbs.redis
    this.db.mongo = dbs.mongoDb
    this.gql = null
    this.http = null
  }

  async start() {
    // start up the con to the db first
    await this.db.mongo.connect()
    await this.db.redis.connect()

    // next we are ready to take in connections
    this.gql = makeGql(this)
    await this.gql.listen(async () => {
      const tripWsClient = makeWsClient(this)
      tripWsClient.Config(process.env.TRIP_SERVICE_WS_URL, "/events")
      await tripWsClient.Begin((data) => {
        const {id, topic, reqId} = data
        app.gql.pubSub.publish("TRIP_EVENT", {
          postCreated: {
            author: "Ali Baba",
            comment: "Open sesame"
          }
        })
      })
    })

    this.http = makeHttp(this)
    await this.http.listen()
  }

  async stop() {
    // first we stop getting connections
    // this.gql.

    //then we shut down db connection
  }

}