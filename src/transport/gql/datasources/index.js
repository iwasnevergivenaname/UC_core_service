const makePricingApi = require("./pricing")
const makeBookingApi = require("./booking")
const makeTripApi = require("./trip")
const makeUserApi = require("./user")

module.exports = (app) => {
  return {
    bookingApi: new (makeBookingApi(app)),
    pricingApi: new (makePricingApi(app)),
    tripApi: new (makeTripApi(app)),
    userService: new (makeUserApi(app))
    // tripApi: new (makeTripApi(app))
  }
}