const makeServer = require("./server")
module.exports = function (app) {
  const server = makeServer(app)

  return {
    server,
    async listen() {
      await server.listen({port: process.env.GQL_PORT})
      console.log(`${process.env.APP_NAME} GQL running on ${process.env.GQL_PORT}`)
    },

    async close() {
      server.close()
    }
  }
}