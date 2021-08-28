const {MongoClient} = require("mongodb")
const uri = process.env.NODE_MONGODB_URI

class Database {
  constructor() {
    this.client = new MongoClient(uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
  }

  async connect() {
    await this.client.connect()
  }

  collection(dbName, colName) {
    return this.client.db(dbName).collection(colName)
  }
}

module.exports = {
  Database
}