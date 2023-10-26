const { getTimers, formatDuration } = require("./utils");
const Table = require("cli-table");

const status = async (arg) => {
  if (arg === undefined) {
    const timers = await getTimers({ isActive: true });
    if (timers.length === 0) return console.log("You have no active timers.");

    const table = new Table({
      head: ["ID", "Task", "Time"],
      colWidths: [30, 20, 10],
    });

    timers.forEach((timer) => {
      table.push([timer.id, timer.description, formatDuration(timer.progress)]);
    });

    console.log(table.toString());
  } else {
    if (arg === "old") {
      const timers = await getTimers({ isActive: false });
      if (timers.length === 0) return console.log("You have no old timers.");

      const table = new Table({
        head: ["ID", "Task", "Time"],
        colWidths: [30, 20, 10],
      });

      timers.forEach((timer) => {
        table.push([timer.id, timer.description, formatDuration(timer.progress)]);
      });

      return console.log(table.toString());
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
