const express = require("express")
const authRoute = require("./routes/auth")

module.exports = function (app) {
  const server = express()


  authRoute(app, server)

  return {
    server,
    async listen(port) {
      // todo remove this later
      port = process.env.HTTP_PORT || 8080
      return new Promise((resolve) => {
        server.listen(port, function () {
          console.log(`${process.env.APP_NAME} HTTP running on ${process.env.HTTP_PORT}`)
          resolve()
        })
      })
    },
    async close() {
      server.close()
    }
  }
}
