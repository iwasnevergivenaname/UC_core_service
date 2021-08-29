const {DataSource} = require("apollo-datasource")

module.exports = function (app) {
  return class UserApi extends DataSource {
    constructor() {
      super()
      this.client = app.db.mongo.model.UserModel
    }

    initialize(config) {
      this.context = config.context
    }

    async findUser(params={}) {
      const {id} = this.context.user
      const res = await this.client.FindOne({id, ...params})
      delete res._id

      return res
    }


    async bookTrip({booking}) {

    }
  }
}

