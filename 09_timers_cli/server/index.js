require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

app.use("/", require("./modules/mongo-setup"));
app.use("/", require("./modules/auth/auth"));
app.use("/api/timers", require("./modules/timers/timers"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
