const {DataSource} = require("apollo-datasource")
const {v4: uuid} = require("uuid")
const {isEmail} = require("isemail")

module.exports = function (app) {
  return class UserApi extends DataSource {
    constructor() {
      super()
      this.client = app.db.mongo.model.UserModel
    }

    initialize(config) {
      this.context = config.context
    }

    // async insert(params={email}) {
    //   try {
    //     const res = await this.client.FindOne({email: params})
    //     console.log("!@#@!@#@!@#@!@@@!@#@!@!", res)
    //     if (!res) {
    //       const id = uuid()
    //       console.log("!!!!!!!!!!!!!!!!!!!!!", id)
    //       const user = await this.client.Insert({id, email: params})
    //       delete user._id
    //       this.context.user.id = id
    //       console.log("089765434567890765435678", user)
    //
    //       return user
    //     }
    //   } catch (e) {
    //     throw new Error(e)
    //   }
    // }

    async findUser(params={}) {
      const {email} = this.context.user
      const res = await this.client.FindOne({email, ...params})
      delete res._id

      return res
    }



    async bookTrip({booking}) {

    }
  }
}

