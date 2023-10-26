require("dotenv").config();
const inquirer = require("inquirer");

if (!process.env.SERVER) {
  return console.log("Error: env SERVER is not found");
}

const argv = require("minimist")(process.argv.slice(2));
const { login } = require("./scripts/auth/login");
const { logout } = require("./scripts/auth/logout");
const { signup } = require("./scripts/auth/signup");
const { status } = require("./scripts/timers/status");
const { start } = require("./scripts/timers/start");
const { stop } = require("./scripts/timers/stop");

(async () => {
  switch (argv._[0]) {
    case "signup":
      await signup(inquirer);
      break;
    case "login":
      await login(inquirer);
      break;
    case "logout":
      await logout();
      break;
    case "status":
      status(argv._[1]);
      break;
    case "start":
      start(argv._[1]);
      break;
    case "stop":
      stop(argv._[1]);
      break;
    default:
      console.log(`Unknown command ${argv._[0]}`);
      break;
  }
})();
