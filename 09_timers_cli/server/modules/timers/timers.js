const express = require("express");
const { auth, isAuth } = require("../auth/utils");
const { createTimer, getTimers, stopTimer } = require("./utils");

const router = express.Router();

// get timers
router.get("/", auth(), isAuth(), async (req, res) => {
  try {
    res.json(await getTimers(req.db, { ownerId: req.user._id, ...req.query }));
  } catch (err) {

    if (err.message === "input must be a 24 character hex string, 12 byte Uint8Array, or an integer") return res.status(400).json({ error: "Timer is not found" });
    return res.status(400).json({ error: err.message });
  }
});

// create timer
router.post("/", auth(), isAuth(), async (req, res) => {
  try {
    if (!req.query?.description) {
      console.log("error", req.query?.description);
      return res.status(400).json({ error: "Description is empty" });
    }
    const timer = await createTimer(req.db, { description: req.query.description, ownerId: req.user._id });
    timer.id = timer._id.toString();
    res.json(timer);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// stop timer by id
router.post("/:id/stop", auth(), isAuth(), async (req, res) => {
  try {
    const timer = await stopTimer(req.db, { id: req.params.id, ownerId: req.user._id });
    res.json(timer);
  } catch (err) {
    if (err.message === "input must be a 24 character hex string, 12 byte Uint8Array, or an integer") {
      return res.status(404).json({ error: "Unknown timer" });
    }
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
