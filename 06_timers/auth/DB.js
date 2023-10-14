const { nanoid } = require("nanoid");

const DB = {
  users: [
    {
      id: nanoid(),
      username: "admin",
      password: "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5", // 12345
      timers: [
        [
          {
            start: Date.now() - 5000,
            end: Date.now() - 3000,
            duration: 2000,
            description: "Timer 0",
            isActive: false,
            id: nanoid(),
          },
        ],
        [
          {
            start: Date.now() - 6000,
            end: Date.now() - 4000,
            duration: 3000,
            description: "Timer 1",
            isActive: false,
            id: nanoid(),
          },
        ],
      ],
    },
  ],
  sessions: [{}],
};

module.exports = { DB };
