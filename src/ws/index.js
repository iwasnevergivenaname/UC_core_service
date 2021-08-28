const WebSocket = require("ws")

const ws = new WebSocket("ws://localhost:8081")

ws.on("open", function open() {
  // ws.send("OI")
  ws.on("message", (message) => {
    console.log(message.toString())
  })
})
