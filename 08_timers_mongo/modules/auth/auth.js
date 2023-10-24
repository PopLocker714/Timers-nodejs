const express = require("express");
const bodyParser = require("body-parser");
const { hashString, createSession, createUser, auth, deleteSession, findUserByUsername, isAuth } = require("./utils");

const router = express.Router();

router.post("/login", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(req.db, username);
  if (!user || user.password !== hashString(password)) {
    return res.redirect("/?authError=true");
  }

  const sessionId = await createSession(req.db, user._id);
  res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
});

router.post("/signup", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;

  if (username.length === 0 || password.length === 0) {
    return res.redirect("/?authError=true");
  }

  try {
    const user = await createUser(req.db, username, password);
    const sessionId = await createSession(req.db, user._id);
    res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
  } catch (error) {
    console.log(error.message);
    return res.redirect("/?authError=true");
  }
});

router.get("/logout", auth(), isAuth(true), async (req, res) => {
  await deleteSession(req.db, req.sessionId);
  res.clearCookie("sessionId").redirect("/");
});

module.exports = router;
