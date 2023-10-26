const { getSessionId } = require("../auth/utils");

const getTimers = async ({ isActive, id }) => {
  const url = new URL(process.env.SERVER + "/api/timers");
  if (isActive !== undefined) url.searchParams.append("isActive", isActive);
  if (id !== undefined) url.searchParams.append("id", id);

  try {
    const res = await fetch(url, {
      method: "get",
      headers: {
        "session-id": getSessionId(),
      },
    }).then((res) => res.json());
    if (res.error) throw res;
    return res;
  } catch (err) {
    if (err.message === "fetch failed") return console.log("No server connect!");
    return err;
  }
};

const createTimer = async (description) => {
  const url = new URL(process.env.SERVER + "/api/timers");
  url.searchParams.append("description", description);
  try {
    const res = await fetch(url, {
      method: "post",
      headers: {
        "session-id": getSessionId(),
      },
    }).then((res) => res.json());
    if (res.error) throw res.error;
    return res;
  } catch (err) {
    if (err.message === "fetch failed") return console.log("No server connect!");
    console.log(err);
  }
};

const stopTimerById = async (id) => {
  const url = new URL(process.env.SERVER + `/api/timers/${id}/stop`);
  try {
    const timer = await fetch(url, {
      method: "post",
      headers: {
        "session-id": getSessionId(),
      },
    }).then((res) => res.json());
    if (timer.error) throw timer;
    return timer;
  } catch (err) {
    if (err.message === "fetch failed") return console.log("No server connect!");
    return err;
  }
};

const formatDuration = (d) => {
  d = Math.floor(d / 1000);
  const s = d % 60;
  d = Math.floor(d / 60);
  const m = d % 60;
  const h = Math.floor(d / 60);
  return [h > 0 ? h : null, m, s]
    .filter((x) => x !== null)
    .map((x) => (x < 10 ? "0" : "") + x)
    .join(":");
};

module.exports = { getTimers, createTimer, stopTimerById, formatDuration };
