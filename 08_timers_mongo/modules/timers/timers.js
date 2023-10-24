const express = require("express");
const { auth, isAuth } = require("../auth/utils");
const { createTimer, getTimers, stopTimer } = require("./utils");

const router = express.Router();

// get timers
router.get("/", auth(), isAuth(), async (req, res) => {
  res.json(await getTimers(req.db, { ownerId: req.user._id, ...req.query }));
});

// create timer
router.post("/", auth(), isAuth(), async (req, res) => {
  const timer = await createTimer(req.db, { description: req.body.description, ownerId: req.user._id });
  timer.id = timer._id.toString();
  res.json(timer);
});

// stop timer by id
router.post("/:id/stop", auth(), isAuth(), async (req, res) => {
  const timer = await stopTimer(req.db, { id: req.params.id, ownerId: req.user._id });

  if (!timer) {
    return res.status(404).json({ error: "Таймер не найден" });
  }

  res.json(timer);
});

module.exports = router;
