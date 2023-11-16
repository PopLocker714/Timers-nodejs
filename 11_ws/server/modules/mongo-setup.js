const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const { startTimer } = require("./timers/utils");
const clientPromise = MongoClient.connect(process.env.DB_URI, {
  minPoolSize: 10,
});

let db;

(async () => {
  try {
    const client = await clientPromise;
    db = client.db("timers");
    startTimer(db);
  } catch (err) {
    console.log(err);
  }
})();

router.use(async (req, res, next) => {
  req.db = db;
  next();
});

module.exports = router;
