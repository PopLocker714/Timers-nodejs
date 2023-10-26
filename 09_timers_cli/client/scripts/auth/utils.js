const os = require("os");
const path = require("path");
const fs = require("fs");

const getSessionFileName = () => {
  const homeDir = os.homedir();
  const isWindows = os.type().match(/windows/i);
  return path.join(homeDir, `${isWindows ? "_" : "."}sb-timers-session`);
};

const createSession = (sessionId) => {
  try {
    fs.writeFile(getSessionFileName(), sessionId, (err) => {
      if (err) throw err;
    });
  } catch (err) {
    console.log(err);
  }
};

const getSessionId = async () => {
  try {
    return await fs.readFile(getSessionFileName(), "utf8", (err, data) => {
      if (err) throw err;
      return data;
    });
  } catch (err) {
    return false;
  }
};

const clearSessionId = async () => {
  try {
    await fs.unlink(getSessionFileName(), (err) => {
      if (err) throw err;
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getSessionFileName, createSession, getSessionId, clearSessionId };
