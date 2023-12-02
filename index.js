require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { startTimer } = require("./modules/timers/utils");
const { auth } = require("./modules/auth/utils");
const path = require("path");

const nunjucksSetup = require("./modules/nunjucks-setup");

const app = express();

nunjucksSetup.setupNunjucks(__dirname, app);

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./modules/mongo-setup"));
app.use("/", require("./modules/auth/auth"));
app.use("/api/timers", require("./modules/timers/timers"));

app.get("/", auth(), (req, res) => {
  startTimer(req.db);
  res.render(__dirname + "/views/index.njk", {
    user: req.user,
    authError: req.query.authError === "true" ? "Wrong username or password" : req.query.authError,
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
