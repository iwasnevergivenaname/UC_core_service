const SQL = require("sequelize")
const path = require("path")


module.exports.createStore = () => {
  const Op = SQL.Op
  const operatorsAliases = {
    $in: Op.in
  }

  const db = new SQL("database", "username", "password", {
    dialect: "sqlite",
    storage: path.resolve(__dirname, '../store.sqlite'),
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