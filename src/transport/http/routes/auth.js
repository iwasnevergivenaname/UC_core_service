const express = require("express")
const bodyParser = require("body-parser")
const {v4: uuid} = require("uuid")
const jwtTokenCreation = require("../helper")

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

  authRoute.post("/register", async (req, res) => {
    try {
      const {body} = req
      const {email, password} = body

      const response = await UserModel.FindOne({email})
      if (!response) {
        try {
          const user = await UserModel.Insert({email})
          // if (user) {
          //   jwtTokenCreation(user, email, res)
          //
          // }
          if (user) {
            return res.sendStatus(201)
          }
        }
        catch (e) {
          console.log(e)
        }
      }
      return res.send("user already exists")
    }
    catch (e) {
      throw new Error(e)
    }

  })

  authRoute.post("/login", async (req, res) => {
    try {
      const {body} = req
      const {email, password} = body

      const user = await UserModel.FindOne({email})
      if (user) {
        const token = jwtTokenCreation(user, email, res)
        res.set("Authorization", token)
        return res.sendStatus(200)
      }
      else {
        // figure out status code other option might be 403
        res.sendStatus(401)

      }
    }
    catch (e) {
      throw new Error(e)
    }


  })

  server.use("/auth", authRoute)
}