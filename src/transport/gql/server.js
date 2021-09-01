const {createServer} = require("http")
const {execute, subscribe} = require("graphql")
const {SubscriptionServer} = require("subscriptions-transport-ws")
const {makeExecutableSchema} = require("@graphql-tools/schema")
const {ApolloServer} = require("apollo-server-express")
const {PubSub} = require("graphql-subscriptions")

const express = require("express")

// authentication
const jwt = require("jsonwebtoken")

// internal imports
const typeDefs = require("./schema")
const makeResolvers = require("./resolvers")

const makeDataSources = require("./datasources")
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY


module.exports = (application) => {

  class GQLServer {
    constructor(app) {
      this.app = app
      this.exp = express()
      this.httpServer = createServer(this.exp)
      this.pubSub = new PubSub()
      this.schema = makeExecutableSchema({typeDefs, resolvers: makeResolvers(this.pubSub)})
      this.apolloServer = null
      this.subscriptionServer = null
    }

    init() {
      this.apolloServer = new ApolloServer({
        // authentication
        context: async ({req, res}) => {
          const token = req.headers.authorization || ""
          const {user} = jwt.verify(token, JWT_PRIVATE_KEY)
          if (token.length === 0) {
            res.sendStatus(401)
          }

          return {user}
        },

        // this is the schema
        schema: this.schema,
        dataSources: () => makeDataSources(application),
        plugins: [{
          async serverWillStart() {
            return {
              async drainServer() {
                this.subscriptionServer.close()
              }
            }
          }
        }]
      })

      this.subscriptionServer = new SubscriptionServer({
        schema: this.schema,
        execute,
        subscribe
      }, {
        server: this.httpServer,
        path: this.apolloServer.graphqlPath
      })
    }

    async listen(httpPort, callback) {
      await this.apolloServer.start()
      this.apolloServer.applyMiddleware({app: this.exp})
      return new Promise((resolve, reject) => {
        this.httpServer.listen(httpPort, async () => {
          try {
            await callback()
            resolve()
          }
          catch (e) {
            reject(e)
          }
        })
      })
    }
  }

  return new GQLServer(application)
}