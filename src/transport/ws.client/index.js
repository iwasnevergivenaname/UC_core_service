const WebSocket = require("ws")

module.exports = function (app) {
  return class WSClient {
    static Config(url, baseChannel) {
      this.client = new WebSocket(`${url}/${baseChannel}`)
    }

    static async OnOpen() {
      return new Promise((resolve) => {
        this.client.on("open", () => {
          resolve()
        })
      })
    }

    static async OnMessageHook(cb) {
      this.client.on("message", cb)
    }

    static async Begin(cb) {
      await this.OnOpen()
      await this.OnMessageHook(cb)
    }
  }

}