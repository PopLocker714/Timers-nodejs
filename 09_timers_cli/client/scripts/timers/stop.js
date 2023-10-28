const { stopTimerById } = require("./utils");

const stop = async (timerId) => {
  if (timerId === undefined) {
    return console.log("Error: timer ID is undefined");
  }

  const timer = await stopTimerById(timerId);

  if (!timer) {
    return;
  }

  if (timer.error) return console.log(timer.error, `ID ${timerId}`);

  console.log(`Timer ${timer.id} stopped.`);
};

module.exports = { stop };
