const { createTimer } = require("./utils");

const start = async (name) => {
  if (name === undefined) {
    return console.log("Error: type timer description");
  }

  if (typeof name === "string") {
    const timer = await createTimer(name);
    if (!timer) {
      return;
    }

    // if (error) return console.log(error);
    return console.log(`Started timer "${name}", ID: ${timer}.`);
  }
  console.log("Error: unknown argument: ", name);
};

module.exports = { start };
