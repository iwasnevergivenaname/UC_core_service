const jwt = require("jsonwebtoken")
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY


function jwtTokenCreation(user, email, res) {
  const token = jwt.sign({
    user: {
      // id: user.id,
      email
    }
  }, JWT_PRIVATE_KEY, {expiresIn: "12h"})
  // res.set("Authorization", token)
  // res.sendStatus(201)
  return token
}

module.exports = jwtTokenCreation