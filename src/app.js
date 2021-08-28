const Mongo = require("./database")
const Gql = require("./gql")
const Http = require("./http")

module.exports = class App {
  constructor() {
    this.db = Mongo
    this.gql = null
    this.http = null
  }

  async start() {
    // start up the con to the db first
    await this.db.connect()

    // next we are ready to take in connections
    this.gql = Gql(this)
    await this.gql.listen()

    this.http = Http(this)
    await this.http.listen()
  }

  async stop() {
    // first we stop getting connections
    // this.gql.

    //then we shut down db connection
  }

}