const inquirer = require("inquirer");
const { login } = require("./auth/login");
const { logout } = require("./auth/logout");
const { signup } = require("./auth/signup");
const { status } = require("./timers/status");
const { start } = require("./timers/start");
const { stop } = require("./timers/stop");
const { isLogin, createWs, getSessionId } = require("./auth/utils");

const controller = async (input) => {
  if (!input) return;

  const [command, arg] = input.split(" ");

  console.table({
    command,
    arg,
    isLogin: isLogin(),
  });

  /* if (isLogin()) {
    if (command === "login" || command === "signup" || command === "exit") {
      createWs(getSessionId());
      console.log("Create ws");
    } else {
      return console.log("You need to login first");
    }
  } */

  switch (command) {
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
      await status(arg);
      break;
    case "start":
      await start(arg);
      break;
    case "stop":
      await stop(arg);
      break;
    case "exit":
      process.exit(0);
      break;
    default:
      console.error(`Unknown command ${command}`);
      console.info("Available commands: signup, login, logout, status, start, stop, exit");
      break;
  }
};

module.exports = { controller };
