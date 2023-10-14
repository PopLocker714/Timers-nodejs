const express = require("express");
const { nanoid } = require("nanoid");
const { auth } = require("./functions");

const router = express.Router();

function createTimerInterval(timer) {
  const interval = setInterval(() => {
    timer.progress += 1000;
  }, 1000);
  return interval;
}

router.get("/", auth(), (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  if (req.query.isActive === "true") {
    const activeTimers = req.timers.filter((timer) => timer[0].isActive);
    return res.json(activeTimers.map((item) => item[0]));
  }
  const oldTimers = req.timers.filter((timer) => !timer[0].isActive);
  res.json(oldTimers.map((item) => item[0]));
});

router.post("/", auth(), (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  const timer = {
    start: Date.now(),
    progress: 0,
    id: nanoid(),
    isActive: true,
    ...req.body,
  };
  req.timers.push([timer, createTimerInterval(timer)]);
  res.json(req.timers[req.timers.length - 1][0]);
});

router.post("/:id/stop", auth(), (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  const timerIndex = req.timers.findIndex((timer) => timer[0].id === req.params.id);
  if (timerIndex !== -1) {
    const timer = req.timers[timerIndex];
    const { start, progress, isActive } = timer[0];
    timer[0].isActive = !isActive;
    clearTimeout(timer[1]);
    delete timer[1];
    timer.pop();
    timer[0].end = start + progress;
    timer[0].duration = progress;
    res.json(timer[0]);
  } else {
    res.status(404).json({ error: "Таймер не найден" });
  }
});

module.exports = router;
