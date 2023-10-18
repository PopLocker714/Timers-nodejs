const express = require("express");
const { auth } = require("../auth/utils");
const { getActiveTimers, getOldTimers, findActiveTimerById, createTimer } = require("./utils");

const router = express.Router();

router.get("/", auth(), (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  if (req.query.isActive === "true") {
    return res.json(getActiveTimers(req.user.id));
  }
  res.json(getOldTimers(req.user.id));
});

// create timer
router.post("/", auth(), (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const timer = createTimer(req.body.description, req.user.id);

  res.json(timer);
});

router.post("/:id/stop", auth(), (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const timer = findActiveTimerById(req.params.id, req.user.id);

  if (!timer) {
    return res.status(404).json({ error: "Таймер не найден" });
  }

  const { start, progress } = timer;

  timer.isActive = false;
  timer.end = start + progress;
  timer.duration = progress;
  delete timer.progress;

  res.json(timer);
});

module.exports = router;
