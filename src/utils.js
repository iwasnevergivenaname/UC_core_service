const {MongoClient} = require("mongodb")

console.log("boop")

const uri = process.env.NODE_MONGODB_URI

const client = new MongoClient(uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })


module.exports = {client}
