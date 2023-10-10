const express = require("express");
const nunjucks = require("nunjucks");
const { nanoid } = require("nanoid");

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  tags: {
    blockStart: "[%",
    blockEnd: "%]",
    variableStart: "[[",
    variableEnd: "]]",
    commentStart: "[#",
    commentEnd: "#]",
  },
});

app.set("view engine", "njk");

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

const TIMERS = [
  {
    start: Date.now() - 11000,
    end: Date.now() - 6000,
    description: "Timer 1",
    duration: 5000,
    progress: 0,
    isActive: true,
    id: nanoid(),
  },
  {
    start: Date.now() - 17000,
    end: Date.now() - 9000,
    duration: 8000,
    progress: 3000,
    description: "Timer 2",
    isActive: true,
    id: nanoid(),
  },
  {
    start: Date.now() - 5000,
    end: Date.now() - 3000,
    duration: 2000,
    description: "Timer 0",
    isActive: false,
    id: nanoid(),
  },
];

function createTimerInterval(timer) {
  const interval = setInterval(() => {
    timer.progress += 1000;
    if (timer.progress >= timer.duration) {
      timer.isActive = false;
      clearInterval(interval);
    }
  }, 1000);
}

for (let i = 0; i < TIMERS.length; i++) {
  const el = TIMERS[i];
  if (el.isActive) {
    createTimerInterval(TIMERS[i]);
  }
}

app.get("/api/timers", (req, res) => {
  if (req.query.isActive === "true") {
    const activeTimers = TIMERS.filter((timer) => timer.isActive);
    return res.json(activeTimers);
  }
  const oldTimers = TIMERS.filter((timer) => !timer.isActive);
  res.json(oldTimers);
});

app.post("/api/timers", (req, res) => {
  const timer = {
    start: Date.now() - 21000,
    end: Date.now() - 11000,
    duration: 10000,
    progress: 0,
    id: nanoid(),
    isActive: true,
    ...req.body,
  };
  TIMERS.push(timer);
  createTimerInterval(TIMERS[TIMERS.length - 1]);
  res.json(timer);
});

app.post("/api/timers/:id/stop", (req, res) => {
  const timerIndex = TIMERS.findIndex((timer) => timer.id === req.params.id);
  if (timerIndex !== -1) {
    TIMERS[timerIndex].isActive = false;
    res.json(TIMERS[timerIndex]);
  } else {
    res.status(404).json({ error: "Таймер не найден" });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
