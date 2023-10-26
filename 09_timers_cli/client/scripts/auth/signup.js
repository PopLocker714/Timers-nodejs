const { getSessionId } = require("./utils");

const signup = async (inquirer) => {
  if (getSessionId()) {
    return console.log("You are already logged in!");
  }

  const { username, password } = await inquirer
    .prompt([
      { type: "input", message: "Enter login:", name: "username" },
      { type: "password", message: "Enter password:", name: "password" },
    ])
    .then((answers) => answers)
    .catch((error) => {
      if (error.isTtyError) {
        console.log("Prompt couldn't be rendered in the current environment");
      } else {
        console.log(error);
      }
    });

  if (username.length === 0 || password.length === 0) {
    return console.log("Error: Empty login or password");
  }

  const url = new URL(process.env.SERVER + "/signup");
  url.searchParams.append("username", username);
  url.searchParams.append("password", password);

  try {
    const res = await fetch(url, { method: "post" }).then((res) => res.json());
    if (res.error) throw res.error;
    console.log("Signed up successfully!");
  } catch (err) {
    if (err.message === "fetch failed") return console.log("No server connect!");
    console.log(err);
  }
};

module.exports = { signup };
