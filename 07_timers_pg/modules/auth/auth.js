const express = require("express");
const bodyParser = require("body-parser");
const { hashString, createSession, createUser, auth, deleteSession, findUserByUsername } = require("./utils");

const router = express.Router();

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
    return res.redirect("/?authError=true");
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
