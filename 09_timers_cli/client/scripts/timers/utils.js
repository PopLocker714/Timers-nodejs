const { getSessionId } = require("../auth/utils");
const Table = require("cli-table");

const displayTimers = async (filter) => {
  try {
    const timers = await getTimers({ isActive: filter.isActive });
    if (!timers) return;

    if (timers.length === 0) return console.log(filter.log);

    const table = new Table({
      head: ["ID", "Task", "Time"],
      colWidths: [30, 20, 10],
    });

    timers.forEach((timer) => {
      table.push([timer.id, timer.description, formatDuration(timer.progress)]);
    });
    console.log(table.toString());
  } catch (err) {
    console.log(err);
  }
};

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
    if (err.message === `Unexpected token 'U', "Unauthorized" is not valid JSON`)
      return console.log("You not unauthorized!");
    return { error: err.message };
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
    if (err.message === `Unexpected token 'U', "Unauthorized" is not valid JSON`)
      return console.log("You not unauthorized!");
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
    if (err.message === `Unexpected token 'U', "Unauthorized" is not valid JSON`)
      return console.log("You not unauthorized!");
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

module.exports = { getTimers, createTimer, stopTimerById, formatDuration, displayTimers };
