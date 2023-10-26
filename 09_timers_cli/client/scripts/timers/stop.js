const { stopTimerById } = require("./utils");

const stop = async (timerId) => {
  if (timerId === undefined) {
    return console.log("Error: timer ID is undefined");
  }

  const { error, id } = await stopTimerById(timerId);

  if (error) return console.log(error, `ID ${timerId}`);

  console.log(`Timer ${id} stopped.`);
};

module.exports = { stop };
