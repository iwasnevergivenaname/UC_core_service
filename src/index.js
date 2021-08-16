const {ApolloServer} = require("apollo-server")
const typeDefs = require("./schema")

const server = new ApolloServer({typeDefs})

server.listen().then(() => {
  console.log(`
    listening to port 4000
  `)
})