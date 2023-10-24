require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const nunjucksSetup = require("./modules/nunjucks-setup");
const { incrementTimer } = require("./modules/timers/utils");
const { auth } = require("./modules/auth/utils");

const app = express();
app.use(cookieParser());

nunjucksSetup.setupNunjucks(app);

app.use(express.json());
app.use(express.static("public"));

app.use("/", require("./modules/mongo-setup"));
app.use("/", require("./modules/auth/auth"));
app.use("/api/timers", require("./modules/timers/timers"));

let isTimerIncStart = false;

app.get("/", auth(), (req, res) => {
  if (!isTimerIncStart) {
    setInterval(() => {
      incrementTimer(req.db);
    }, 1000);
    isTimerIncStart = true;
  }

  res.render("index", {
    user: req.user,
    authError: req.query.authError === "true" ? "Wrong username or password" : req.query.authError,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
