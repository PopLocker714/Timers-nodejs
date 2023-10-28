const { getTimers, formatDuration, displayTimers } = require("./utils");
const Table = require("cli-table");

const status = async (arg) => {
  if (arg === undefined) {
    displayTimers({ isActive: true, log: "You have no active timers." });
  } else {
    if (arg === "old") {
      displayTimers({ isActive: true, log: "You have no old timers." });
      return;
    }

    const timers = await getTimers({ id: arg });
    if (!timers) return console.log("Timer is not found");
    if (timers.length === 0) return console.log("Timer is not found");
    if (timers.error) return console.log("Timer is not found");

    const table = new Table({
      head: ["ID", "Task", "Time"],
      colWidths: [30, 20, 10],
    });

    timers.forEach((timer) => {
      table.push([timer.id, timer.description, formatDuration(timer.progress)]);
    });

    console.log(table.toString());
  }
};

module.exports = { status };
