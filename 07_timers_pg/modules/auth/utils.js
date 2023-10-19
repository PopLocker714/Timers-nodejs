const { nanoid } = require("nanoid");
const { createHash } = require("crypto");
const { knex } = require("../knex-setup");

const findUserByUsername = async (username) =>
  knex("users")
    .select()
    .where({ username })
    .limit(1)
    .then((res) => res[0]);

const findUserBySessionId = async (sessionId) => {
  const session = await knex("sessions")
    .select("user_id")
    .where({ session_id: sessionId })
    .limit(1)
    .then((res) => res[0]);

  if (!session) {
    return;
  }

  return await knex("users")
    .select()
    .where({ id: session.user_id })
    .limit(1)
    .then((res) => res[0]);
};

const createSession = async (userId) => {
  const sessionId = nanoid();
  await knex("sessions").insert({ user_id: userId, session_id: sessionId });
  return sessionId;
};

const deleteSession = async (sessionId) => {
  await knex("sessions").where({ session_id: sessionId }).delete();
};

const hashString = (str) => {
  const hash = createHash("sha256");
  return hash.update(str).digest("hex");
};

const createUser = async (username, password) => {
  const user = { id: nanoid(), password: hashString(password), username };
  await knex("users").insert(user);
  return user;
};

const auth = () => async (req, res, next) => {
  if (!req.cookies["sessionId"]) {
    return next();
  }

  const user = await findUserBySessionId(req.cookies["sessionId"]);
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
};
