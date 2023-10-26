const { createTimer } = require("./utils");

const start = async (name) => {
  if (name === undefined) {
    return console.log("Error: type timer description");
  }

  if (typeof name === "string") {
    const { error, id } = await createTimer(name);
    if (error) return console.log(error);
    return console.log(`Started timer "${name}", ID: ${id}.`);
  }
  console.log("Error: unknown argument: ", name);
};

module.exports = { start };
