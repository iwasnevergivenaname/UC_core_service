const {ObjectId} = require("bson")

const {MongoClient} = require("mongodb")

console.log("boop")

//  const Op = SQL.Op
//   const operatorsAliases = {
//     $in: Op.in
//   }
//
//   const db = new SQL("database", "username", "password", {
//     dialect: "sqlite",
//     storage: path.resolve(__dirname, "../store.sqlite"),
//     operatorsAliases,
//     logging: false
//   })

// module.exports.openConnection = ()  => {
const uri = process.env.NODE_MONGODB_URI

const client = new MongoClient(uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

// client.connect(async err => {
//   try {
//
//     const collection = client.db("uber_clone").collection("riders")
//     // perform actions on the collection object
//     // console.log("🔵", collection)
//
//     /*******
//      *
//      * create a new rider
//      * or update existing rider
//      * return confirmation
//      *
//      * *******/
//     const createRider = async (client, newRider) => {
//       try {
//
//         await collection.updateOne(
//           {email: newRider.email},
//           {$set: {email: newRider.email}},
//           {upsert: true})
//
//         console.log(`rider created`)
//
//       }
//       catch (e) {
//         console.log(`error in createRider function ---`, e)
//       }
//
//     }
//
//     // await createRider(client, {email: "ladygaGA@gmail.com"})
//
//     /******
//      *
//      * find rider with given email
//      * returns if rider exists or not
//      *
//      * ********/
//     const findRiderByEmail = async (client, riderEmail) => {
//       try {
//         const res = await collection.findOne({email: riderEmail})
//
//         if (res) {
//           console.log(`found a rider with email '${riderEmail}'`)
//           // console.log(res)
//         }
//         else {
//           console.log(`no rider found with email '${riderEmail}'`)
//         }
//       }
//       catch (e) {
//         console.log(`error in findRiderByEmail ---`, e)
//       }
//
//     }
//
//     // await findRiderByEmail(client, "lilnasx@gmail.com")
//     // await findRiderByEmail(client, "girlygirl@gmail.com")
//
//     const findAllRiders = async (client) => {
//       try {
//         const res = await collection
//         // console.log("⛈", res.s)
//       }
//       catch (e) {
//         console.log("error in findAllRiders ---", e)
//       }
//     }
//     // await findAllRiders()
//
//     /****
//      *
//      * remove a rider with given email
//      * returns nothing
//      *
//      * ****/
//     const removeRider = async (client, riderEmail) => {
//       try {
//         await collection.deleteOne({email: riderEmail})
//       }
//       catch (e) {
//         console.log(`error in removeRider ----`, e)
//       }
//     }
//
//     // await removeRider(client, "6127ef4641f3619ff5dbb8e3")
//     return {createRider, removeRider, findRiderByEmail, collection}
//   }
//   finally {
//
//     // client.close()
//   }
// })
// return {client}
// }

// openConnection()

// console.log("💖", client)
module.exports = {client}


const SQL = require("sequelize")
const path = require("path")

module.exports.createStore = () => {
  const Op = SQL.Op
  const operatorsAliases = {
    $in: Op.in
  }

  const db = new SQL("database", "username", "password", {
    dialect: "sqlite",
    storage: path.resolve(__dirname, "../store.sqlite"),
    operatorsAliases,
    logging: false
  })

  const riders = db.define("rider", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    email: SQL.STRING,
    token: SQL.STRING
  })

  const trips = db.define("trip", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    // tripId: SQL.INTEGER,
    riderId: SQL.INTEGER,
    driverId: SQL.INTEGER
    // pickup: SQL.ARRAY,
    // dropoff: SQL.ARRAY
  })

  riders.sync().catch((e) => {
    console.log(e)
    process.exit()
  })

  trips.sync().catch((e) => {
    console.log(e)
    process.exit()
  })

  return {db, riders, trips}
}