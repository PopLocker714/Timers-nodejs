const express = require("express");
const { nanoid } = require("nanoid");
const { auth } = require("./functions");

const router = express.Router();

function createTimerInterval(timer) {
  const interval = setInterval(() => {
    timer.progress += 1000;
    if (timer.progress >= timer.duration) {
      timer.isActive = false;
      clearInterval(interval);
    }
  }, 1000);
}

router.get("/", auth(), (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  if (req.query.isActive === "true") {
    const activeTimers = req.timers.filter((timer) => timer.isActive);
    return res.json(activeTimers);
  }
  const oldTimers = req.timers.filter((timer) => !timer.isActive);
  res.json(oldTimers);
});

router.post("/", auth(), (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const timer = {
    start: Date.now() - 21000,
    end: Date.now() - 11000,
    duration: 10000,
    progress: 0,
    id: nanoid(),
    isActive: true,
    ...req.body,
  };
  req.timers.push(timer);
  createTimerInterval(req.timers[req.timers.length - 1]);
  res.json(timer);
});

router.post("/:id/stop", auth(), (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  const timerIndex = req.timers.findIndex((timer) => timer.id === req.params.id);
  if (timerIndex !== -1) {
    req.timers[timerIndex].isActive = false;
    res.json(req.timers[timerIndex]);
  } else {
    res.status(404).json({ error: "Таймер не найден" });
  }
});

module.exports = router;
