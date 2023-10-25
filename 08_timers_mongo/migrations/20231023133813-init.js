const { createUser } = require("../modules/auth/utils");
const { createTimer } = require("../modules/timers/utils");

module.exports = {
  async up(db) {
    const user = await createUser(db, "admin", "pwd007");
    const activeTimer = await createTimer(db, {
      description: "Timer 0",
      ownerId: user._id,
      isActive: true,
      progress: 10000,
    });
    const oldTimer = await createTimer(db, {
      description: "Timer 1",
      ownerId: user._id,
      isActive: false,
      progress: 60000,
    });

    console.log("CREATE USER IN DB:");
    console.table([{ name: "admin", password: "pwd007" }]);
    console.log("CREATE TIMERS IN DB:");
    console.table([activeTimer, oldTimer]);
  },

  async down(db) {
    await db.collection("users").deleteMany({});
    await db.collection("sessions").deleteMany({});
    await db.collection("timers").deleteMany({});
  },
};
