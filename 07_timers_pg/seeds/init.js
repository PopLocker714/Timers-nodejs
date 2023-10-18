const { createUser } = require("../modules/auth/utils");
const { createTimer } = require("../modules/timers/utils");

exports.seed = async function (knex) {
  const admin = await knex("users").where("username", "admin");
  const isHaveAdmin = admin.length !== 0;

  if (!isHaveAdmin) {
    const user = createUser("admin", "pwd007");
    const activeTimer = createTimer("Timer 0", user.id, true, 10000);
    const oldTimer = createTimer("Timer 1", user.id, false, 60000);
    await knex("users").insert(user);
    await knex("timers").insert([activeTimer, oldTimer]);

    console.log("CREATE USER IN DB:");
    console.table([{ name: "admin", password: "pwd007" }]);
    console.log("CREATE TIMERS IN DB:");
    console.table([activeTimer, oldTimer]);
  }
};
