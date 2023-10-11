const express = require("express");

const bodyParser = require("body-parser");
const router = express.Router();

const { auth, createSession, deleteSession, findUserByUsername, createUser, hashString } = require("./functions");

router.post("/login", bodyParser.urlencoded({ extended: false }), (req, res) => {
  const { username, password } = req.body;

  const user = findUserByUsername(username);
  if (!user || user.password !== hashString(password)) {
    return res.redirect("/?authError=true");
  }

  const sessionId = createSession(user.id);

  res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
});

router.post("/signup", bodyParser.urlencoded({ extended: false }), (req, res) => {
  const { username, password } = req.body;

  if (!username.length && !password.length) {
    return res.sendStatus(400);
  }

  const user = createUser(username, password);

  const sessionId = createSession(user.id);
  res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
});

router.get("/logout", auth(), (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  deleteSession(req.sessionId);
  res.clearCookie("sessionId").redirect("/");
});

module.exports = router;
