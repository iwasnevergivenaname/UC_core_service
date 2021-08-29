const {Mongo} = require("./db")
const makeRedis = require("./redis")
const makeBaseModel = require("./model/base")
const makeUserModel = require("./model/user")
const makeModels = [makeUserModel]

module.exports = function (app) {
  return {
    mongoDb: {
      async connect() {
        const mongoDb = new Mongo()
        await mongoDb.connect()

        const BaseModel = makeBaseModel(mongoDb)

        this.model[BaseModel.name] = BaseModel

        makeModels.forEach(makeModel => {
          const model = makeModel(BaseModel)
          this.model[model.name] = model
        })
      },
      async close() {
        // leave for you to impolement
      },
      model: {}
    },
    redis: makeRedis(app)
  }
}