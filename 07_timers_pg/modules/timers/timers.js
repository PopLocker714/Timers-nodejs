const express = require("express");
const { auth } = require("../auth/utils");
const { createTimer, getTimers, stopTimer } = require("./utils");

const router = express.Router();

// get timers
router.get("/", auth(), async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  res.json(await getTimers({ ownerId: req.user.id, ...req.query }));
});

// create timer
router.post("/", auth(), async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const timer = await createTimer(req.body.description, req.user.id);

  res.json(timer);
});

// stop timer by id
router.post("/:id/stop", auth(), async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const timer = await stopTimer(req.params.id, req.user.id);

  if (!timer) {
    return res.status(404).json({ error: "Таймер не найден" });
  }

  res.json(timer);
});

module.exports = router;
