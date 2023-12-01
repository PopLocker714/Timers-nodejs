require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const nunjucksSetup = require("./modules/nunjucks-setup");
const { startTimer } = require("./modules/timers/utils");
const { auth, authWs } = require("./modules/auth/utils");

const { getTimers } = require("./modules/timers/utils");

const app = express();
require("express-ws")(app);
app.use(cookieParser());

nunjucksSetup.setupNunjucks(__dirname, app);

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.use("/", require("./modules/mongo-setup"));
app.use("/", require("./modules/auth/auth"));
app.use("/api/timers", require("./modules/timers/timers"));

app.get("/", auth(), (req, res) => {
  startTimer(req.db);
  res.render(__dirname + "/views/index.njk", {
    user: req.user,
    path: { public: "/public" },
    authError: req.query.authError === "true" ? "Wrong username or password" : req.query.authError,
  });
});

app.ws("/", authWs(), (ws, req) => {
  ws.on("message", async function (msg) {
    const messages = JSON.parse(msg);
    if (messages.type === "ACTIVE_TIMERS") {
      ws.send(
        JSON.stringify({
          type: "ACTIVE_TIMERS",
          timers: await getTimers(req.db, { ownerId: req.user._id, isActive: "true" }),
        })
      );
    }

    if (messages.type === "OLD_TIMERS") {
      ws.send(
        JSON.stringify({
          type: "OLD_TIMERS",
          timers: await getTimers(req.db, { ownerId: req.user._id, isActive: "false" }),
        })
      );
    }
  });
});

if (process.env.IS_DEV === "true") {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`  Listening on ${process.env.IS_HTTP === "true" ? "http" : "https"}://localhost:${port}`);
  });
} else {
  module.exports = app;
}
