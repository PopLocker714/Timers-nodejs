const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const clientPromise = MongoClient.connect(process.env.DB_URI, {
  useNewUrlParser: true, // removes a deprecation warning when connecting
  useUnifiedTopology: true, // removes a deprecating warning when connecting
  minPoolSize: 10,
});

router.use(async (req, res, next) => {
  try {
    const client = await clientPromise;
    req.db = client.db("timers");
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
