require("dotenv").config();
const express = require("express");
const { startTimer } = require("./modules/timers/utils");
const { auth } = require("./modules/auth/utils");

const app = express();

app.use(express.json());

app.use("/", require("./modules/mongo-setup"));
app.use("/", require("./modules/auth/auth"));
app.use("/api/timers", require("./modules/timers/timers"));

app.get("/", auth(), (req, res) => {
  startTimer(req.db);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
