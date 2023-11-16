const { getSessionId, clearSessionId } = require("./utils");

const logout = async () => {
  if (getSessionId()) {
    clearSessionId();
    return console.log("Logged out successfully!");
  }
  console.log("Nothing logout");
};

module.exports = { logout };
