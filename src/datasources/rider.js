const {DataSource} = require("apollo-datasource")
const isEmail = require("isemail")

class RiderAPI extends DataSource {
  constructor({store}) {
    super()
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  async findOrCreateRider({email: emailArg} = {}) {
    const email = this.context && this.context.rider ? this.context.rider.email : emailArg

    if (!email || !isEmail.validate(email)) {
      return null
    }

    const riders = await this.store.riders.findOrCreate({where: {email}})

    return riders && riders[0] ? riders[0] : null
  }

  async orderTrip({tripId}) {
    const riderId = this.context.rider.id
    const res = await this.store.trips.findOrCreate({
      where: {tripId, riderId}
    })
    return res && res.length ? res[0].get() : false
  }

  async cancelTrip({tripId}) {
    const riderId = this.context.rider.id
    return !!this.store.trips.destroy({where: {riderId, tripId}})
  }

  async getTripsByRider() {
    const riderId = this.context.rider.id
    const found = await this.store.trips.findAll({where: {riderId}})
    return found && found.length ? found.map(t => t.dataValues.riderId).filter(t => !!t)
      : []

  }

  async removeRider() {
    const riderId = this.context.rider.id
    return !!this.store.riders.destroy({where: {riderId}})
  }

}

module.exports = RiderAPI