const express = require("express")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
/**
 *
 * @param app -- the actual instance of the application
 * @param server -- the instacne of express that we attach middleware onto
 */
module.exports = function (app, server) {
  const UserModel = app.db.mongo.model.UserModel
  const authRoute = express.Router()
  authRoute.use(bodyParser.json())

  authRoute.get("/health", (_, res) => {
    res.sendStatus(200)
  })

  authRoute.post("/", async (req, res) => {
    const {body} = req
    const {email, password} = body

    const user = await UserModel.FindOne({email})
    if (user) {

      const token = jwt.sign({
        user: {
          id: user.id,
          email
        }
      }, JWT_PRIVATE_KEY, {expiresIn: "12h"})
      res.set("Authorization", token)
      return res.sendStatus(201)
    }

    // figure out status code other option might be 403
    res.sendStatus(401)
  })

  server.use("/auth", authRoute)
}