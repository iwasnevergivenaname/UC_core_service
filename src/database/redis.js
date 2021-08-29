const IORedis = require("ioredis")

class Redis {
  constructor() {
    this.connection = new IORedis()
  }

  getConnection() {
    const conn = this.connection
    return {
      get(...args) {
        return conn.get(...args)
      },
      set(...args) {
        return conn.set(...args)
      }
    }
  }

  async connect() {
  }

  async close() {
  }

  async get(key) {
    const res = await this.connection.get(key)
    console.log(res)
    try {
      return JSON.parse(res)
    }
    catch {
      return res
    }
  }

  async set(key, value) {
    console.log(value)
    return this.connection.set(key, JSON.stringify(value))
  }
}


module.exports = function (app) {
  return new Redis()
}

