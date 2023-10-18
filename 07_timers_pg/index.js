require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const nunjucksSetup = require("./modules/nunjucks-setup");
const { getActiveTimers } = require("./modules/timers/utils");
const { auth } = require("./modules/auth/utils");
// const knex = require("knex")({
//   client: "pg",
//   connection: {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 5432,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//   },
// });

const app = express();
app.use(cookieParser());

nunjucksSetup.setupNunjucks(app);

app.use(express.json());
app.use(express.static("public"));

app.use("/", require("./modules/auth/auth"));
app.use("/api/timers", require("./modules/timers/timers"));

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
