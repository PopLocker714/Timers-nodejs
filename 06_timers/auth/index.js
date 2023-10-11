const express = require("express");
const cookieParser = require("cookie-parser");
const nunjucksSetup = require("./modules/nunjucks-setup");

const { auth } = require("./modules/functions");

const app = express();
app.use(cookieParser());

nunjucksSetup.setupNunjucks(app);

app.use(express.json());
app.use(express.static("public"));

app.use("/", require("./modules/auth"));
app.use("/api/timers", require("./modules/timers"));

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
