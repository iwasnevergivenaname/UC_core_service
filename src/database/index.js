const {Database} = require("./db")
const makeBaseModel = require("./model/base")

const makeUserModel = require("./model/user")
const makeModels = [makeUserModel]

module.exports = {
  async connect() {
    const db = new Database()
    await db.connect()

    const BaseModel = makeBaseModel(db)

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
}