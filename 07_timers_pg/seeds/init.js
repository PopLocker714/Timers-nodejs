const { createUser, findUserByUsername } = require("../modules/auth/utils");
const { createTimer } = require("../modules/timers/utils");

exports.seed = async function () {
  const admin = await findUserByUsername("admin");

  if (!admin) {
    const user = await createUser("admin", "pwd007");
    const activeTimer = await createTimer("Timer 0", user.id, true, 10000);
    const oldTimer = await createTimer("Timer 1", user.id, false, 60000);

    console.log("CREATE USER IN DB:");
    console.table([{ name: "admin", password: "pwd007" }]);
    console.log("CREATE TIMERS IN DB:");
    console.table([activeTimer, oldTimer]);
  }
};
