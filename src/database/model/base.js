module.exports = function (db) {
  return class Model {
    static db = db
    static dbName = "uber_clone"
    static collection = "riders"


    static getCollection(dbName, colName) {
      return db.collection(dbName, colName)
    }

    // static async Insert(...params) {
    //
    // }

    static async FindOne(...params) {
      return this.getCollection(this.dbName, this.collection).findOne(...params)
    }

    static async Find(...params) {
      return this.getCollection(this.dbName, this.collection).find(...params)
    }

    static async UpdateOne(...params) {
      return this.getCollection(this.dbName, this.collection).updateOne(...params)
    }

    static async DeleteOne(...params) {
      return this.getCollection(this.dbName, this.collection).deleteOne(...params)
    }
  }
}

