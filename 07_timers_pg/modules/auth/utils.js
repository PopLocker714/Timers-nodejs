const { nanoid } = require("nanoid");
const { DB } = require("../../DB");
const { createHash } = require("crypto");

const findUserByUsername = (username) => DB.users.find((user) => user.username === username);

const findUserBySessionId = (sessionId) => {
  const userId = DB.sessions[sessionId];
  if (!userId) {
    return;
  }
  return DB.users.find((user) => user.id === userId);
};

const hashString = (str) => {
  const hash = createHash("sha256");
  return hash.update(str).digest("hex");
};

const createUser = (username, password) => {
  const user = { id: nanoid(), password: hashString(password), username };
  DB.users.push(user);
  return user;
};

const createSession = (userId) => {
  const sessionId = nanoid();
  DB.sessions[sessionId] = userId;
  return sessionId;
};

const deleteSession = (sessionId) => {
  delete DB.sessions[sessionId];
};

const auth = () => async (req, res, next) => {
  if (!req.cookies["sessionId"]) {
    return next();
  }

  const user = findUserBySessionId(req.cookies["sessionId"]);
  req.user = user;
  req.sessionId = req.cookies["sessionId"];
  next();
};

module.exports = {
  auth,
  deleteSession,
  createSession,
  createUser,
  hashString,
  findUserByUsername,
  // findUserBySessionId,
};
