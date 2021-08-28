const WebSocket = require("ws")
const {PubSub} = require("graphql-subscriptions")


//process.env.TRIP_SERVICE_WS_URL/events
  class WSClient {
    static init(url, baseChannel, pubSub) {
      this.client = new WebSocket(`${url}/events`)
      this.chanel = baseChannel
      this.pubSub = pubSub
    }

    static async OnOpen() {
      return new Promise((resolve) => {
        this.client.on("open", () => {

          resolve()
        })
      })
    }


    static async OnMessageHook() {
      this.client.on("message", (data) => {
        const {id, topic, reqId} = data
        this.pubSub.publish("TRIP_EVENT", {
          postCreated: {
            author: "Ali Baba",
            comment: "Open sesame"
          }
        })
      })
    }
  }
