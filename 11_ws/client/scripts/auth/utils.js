const os = require("os");
const path = require("path");
const fs = require("fs");
const WebSocket = require("ws");

const getSessionFileName = () => {
  const homeDir = os.homedir();
  const isWindows = os.type().match(/windows/i);
  return path.join(homeDir, `${isWindows ? "_" : "."}sb-timers-session`);
};

const getTimersFileName = () => {
  const homeDir = os.homedir();
  const isWindows = os.type().match(/windows/i);
  return path.join(homeDir, `${isWindows ? "_" : "."}timers.json`);
};

const getActiveTimersFileName = () => {
  const homeDir = os.homedir();
  const isWindows = os.type().match(/windows/i);
  return path.join(homeDir, `${isWindows ? "_" : "."}activeTimers.json`);
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

const getSessionId = () => {
  try {
    return fs.readFileSync(getSessionFileName(), "utf8", (err, data) => {
      if (err) throw err;
      return data;
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      return;
    }
    console.log(err);
  }
};

const clearSessionId = () => {
  try {
    fs.unlinkSync(getSessionFileName(), (err) => {
      if (err) throw err;
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      return;
    }
    console.log(err);
  }
};

const isLogin = () => {
  try {
    return fs.readFileSync(getSessionFileName(), "utf8", (err, data) => {
      if (err) throw err;
      if (!data) return false;
    });
  } catch (err) {
    return false;
  }
};

const createWs = (sessionId) => {
  try {
    const ws = new WebSocket(`ws://localhost:3000?sessionId=${sessionId}`, {});

    ws.addEventListener("open", () => {
      console.log("Connected");
    });

    ws.addEventListener("message", async (message) => {
      let data;
      try {
        data = JSON.parse(message.data);
      } catch (err) {
        return;
      }

      console.log(data);

      if (data.type === "all_timers") {
        try {
          await fs.promises.writeFile(getTimersFileName(), JSON.stringify(data.allTimers));
        } catch (err) {
          console.log(err);
        }
      }

      if (data.type === "active_timers") {
        try {
          await fs.promises.writeFile(getActiveTimersFileName(), JSON.stringify(data.activeTimers));
        } catch (err) {
          console.log(err);
        }
      }
    });

    ws.addEventListener("error", (err) => {
      console.log("WebSocket error: ", err.message);
    });

    ws.addEventListener("close", () => {
      console.log("Connection closed");
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getSessionFileName, createSession, getSessionId, clearSessionId, isLogin, createWs };
