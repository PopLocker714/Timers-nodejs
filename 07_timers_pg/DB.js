const { nanoid } = require("nanoid");

const adminTimerId = nanoid();

const DB = {
  users: [
    {
      id: adminTimerId,
      username: "admin",
      password: "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5", // 12345
    },
  ],
  timers: [
    {
      start: Date.now() - 5000,
      progress: 54000,
      duration: 2000,
      description: "Timer 222",
      isActive: true,
      id: nanoid(),
      owner_id: adminTimerId,
    },
    {
      start: Date.now() - 5000,
      progress: 1000,
      duration: 2000,
      description: "Timer 333",
      isActive: true,
      id: nanoid(),
      owner_id: adminTimerId,
    },
    {
      start: Date.now() - 5000,
      end: Date.now() - 3000,
      duration: 2000,
      description: "Timer 0",
      isActive: false,
      id: nanoid(),
      owner_id: adminTimerId,
    },
    {
      start: Date.now() - 6000,
      end: Date.now() - 4000,
      duration: 3000,
      description: "Timer 1",
      isActive: false,
      id: nanoid(),
      owner_id: adminTimerId,
    },
  ],
  sessions: [{}],
};

module.exports = { DB };
