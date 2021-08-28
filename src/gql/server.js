const {ApolloServer} = require("apollo-server")
const jwt = require("jsonwebtoken")
const typeDefs = require("./schema")
const resolvers = require("./resolvers")
const makeDataSources = require("./datasources")
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY


module.exports = (app) => {
  const dataSources = makeDataSources(app)

  return new ApolloServer({

    // authentication
    context: async ({req, res}) => {
      const token = req.headers.authorization || ""

      const {user} = jwt.verify(token, JWT_PRIVATE_KEY)
      if (token.length == 0) {
        res.sendStatus(401)
      }

      return {user}
    },

    // this is the schema
    typeDefs,

    // resolvers
    resolvers,

    dataSources: () => dataSources
  })

}