const makeServer = require("./server")
module.exports = function (app) {
  const server = makeServer(app)

  return {
    server,
    async listen(callback) {
      await server.init()
      await server.listen(process.env.GQL_PORT, callback)
      console.log(`${process.env.APP_NAME} GQL running on ${process.env.GQL_PORT}`)
    },

    async close() {
      server.close()
    }
  }
}