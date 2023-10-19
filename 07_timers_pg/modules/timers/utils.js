const { nanoid } = require("nanoid");
const { knex } = require("../knex-setup");

const getTimers = async ({ ownerId, isActive, timerId }) => {
  const whereReq = { isActive, owner_id: ownerId, id: timerId };

  for (const key in whereReq) {
    if (whereReq[key] === undefined) {
      delete whereReq[key];
    }
  }

  const timers = await knex("timers").where(whereReq);
  timers.forEach((timer) => {
    timer.start = parseInt(timer.start);
    timer.end = parseInt(timer.end);
  });

  if (timerId) {
    return timers[0];
  } else {
    return timers;
  }
};

const createTimer = async (description, owner_id, isActive = true, progress = 0) => {
  const timer = {
    start: Date.now(),
    progress,
    end: Date.now() + progress,
    duration: progress,
    id: nanoid(),
    isActive,
    owner_id,
    description,
  };

  await knex("timers").insert(timer);

  return timer;
};

const incrementTimer = async () => {
  await knex("timers")
    .where({ isActive: true })
    .update({ progress: knex.raw("progress + 1000") });
};

const stopTimer = async (timerId, ownerId) => {
  const timer = await knex("timers")
    .where({ isActive: true, id: timerId, owner_id: ownerId })
    .update({ isActive: false, duration: knex.raw("progress"), end: knex.raw("start + progress") })
    .returning("*");
  return timer[0];
};

module.exports = { createTimer, getTimers, incrementTimer, stopTimer };
