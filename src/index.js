const {ApolloServer} = require("apollo-server")
const typeDefs = require("./schema")
const {createStore} = require("./utils")
const resolvers = require("./resolvers")
const isEmail = require("isemail")

const PriceEstimateAPI = require("./datasources/priceEstimate")
const RouteSuggestionAPI = require("./datasources/routeSuggestion")
const RideExperienceAPI = require("./datasources/rideExperience")
const RiderAPI = require("./datasources/rider")

const store = createStore()

const server = new ApolloServer({
  context: async ({req}) => {
    // auth check
    const auth = req.headers && req.headers.authorization ||''
    const email = Buffer.from(auth, 'base64').toString('ascii')
    if (!isEmail.validate(email)) {
      return {rider: null}
    }
  //   find rider
    const riders = await store.riders.findOrCreate({where: {email}})
    const rider = riders && riders[0] || null
    return {rider: {...rider.dataValues}}
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    priceEstimateAPI: new PriceEstimateAPI(),
    routeSuggestionAPI: new RouteSuggestionAPI(),
    rideExperienceAPI: new RideExperienceAPI(),
    riderAPI: new RiderAPI({store})
  })
})

server.listen().then(() => {
  console.log(`
    listening to port 4000
  `)
})