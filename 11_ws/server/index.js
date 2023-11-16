require("dotenv").config();
const express = require("express");

// const WebSocket = require("ws");
// const http = require("http");
// const { getTimers } = require("./modules/timers/utils");
const { findUserBySessionId } = require("./modules/auth/utils");
// const { ClientSession } = require("mongodb");
const app = express();
require("express-ws")(app);
app.use(express.json());

app.use("/", require("./modules/mongo-setup"));
app.use("/", require("./modules/auth/auth"));
app.use("/api/timers", require("./modules/timers/timers"));

app.ws("/", async (ws, req) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const sessionId = searchParams.get("sessionId");
  const user = await findUserBySessionId(req.db, sessionId);
  if (!user) {
    // socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    // socket.destroy();
    return;
  }
  req.userId = user.id;
  console.log(user);
});

// const server = http.createServer(app);
/* const users = new Map();

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });
server.on("upgrade", (req, socket, head) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const sessionId = searchParams.get("sessionId");
  const user = findUserBySessionId(req.db, sessionId);

  if (!user) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  req.userId = user.id;

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws, req) => {
  const { userId } = req;
  users.set(userId, ws);

  const activeTimers = getTimers(req.db, { isActive: true, ownerId: userId });

  ws.on("close", () => {
    users.delete(userId);
  });

  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      return;
    }

    if (data.type === "all_timers") {
      const allTimers = getTimers(req.db, { ownerId: userId });
      const fullMessage = JSON.stringify({
        type: "all_timers",
        allTimers,
      });
      const ws = users.get(userId)
      ws.send(fullMessage)
    }

  });
} );
*/

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
