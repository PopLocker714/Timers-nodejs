require("dotenv").config();
const inquirer = require("inquirer");
const { controller } = require("./scripts/controller");
const { isLogin, createWs, getSessionId } = require("./scripts/auth/utils");

if (!process.env.SERVER) {
  return console.error("Error: env SERVER is not found");
}


if (isLogin()) {
  createWs(getSessionId());
}

process.on("beforeExit", () => {
  (async () => {
    const { command } = await inquirer
      .prompt([{ type: "input", message: "Enter command:", name: "command" }])
      .then((answers) => answers)
      .catch((error) => {
        if (error.isTtyError) {
          console.log("Prompt couldn't be rendered in the current environment");
        } else {
          console.log(error);
        }
      });

    await controller(command);
  })();
});
