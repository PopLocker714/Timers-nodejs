require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const nunjucksSetup = require("./modules/nunjucks-setup");
const { getActiveTimers } = require("./modules/timers/utils");
const { auth } = require("./modules/auth/utils");

const app = express();
app.use(cookieParser());

nunjucksSetup.setupNunjucks(app);

app.use(express.json());
app.use(express.static("public"));

app.use("/", require("./modules/auth/auth"));
app.use("/api/timers", require("./modules/timers/timers"));

// console.log(knex)
// knex("users").del().then((res) => console.log(res))

// get active timer and increment these
(() => {
  setInterval(() => {
    const timers = getActiveTimers();
    timers.forEach((timer) => (timer.progress += 1000));
  }, 1000);
})();

app.get("/", auth(), (req, res) => {
  res.render("index", {
    user: req.user,
    authError: req.query.authError === "true" ? "Wrong username or password" : req.query.authError,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
