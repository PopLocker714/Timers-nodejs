const express = require("express");
const { hashString, createSession, createUser, auth, deleteSession, findUserByUsername, isAuth } = require("./utils");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.query;
  const user = await findUserByUsername(req.db, username);
  if (!user || user.password !== hashString(password)) {
    return res.json({ error: "Wrong login or password" });
  }

  const sessionId = await createSession(req.db, user._id);
  res.json({ sessionId });
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.query;

  if (username.length === 0 || password.length === 0) {
    return res.json({ error: "Wrong login or password" });
  }

  try {
    const userIsHave = await findUserByUsername(req.db, username);
    if (userIsHave) {
      return res.json({ error: "A user with the same name already exists" });
    }

    const user = await createUser(req.db, username, password);
    const sessionId = await createSession(req.db, user._id);
    res.json({ sessionId });
  } catch (err) {
    console.log(err.message);
    return res.json({ error: err.message });
  }
});

router.get("/logout", auth(), isAuth(true), async (req, res) => {
  await deleteSession(req.db, req.sessionId);
  res.json({});
});

module.exports = router;
