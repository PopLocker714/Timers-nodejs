const { nanoid } = require("nanoid");
const { DB } = require("../../DB");

const getActiveTimers = (ownerId) =>
  DB.timers.filter((timer) => {
    if (!ownerId) {
      return timer.isActive;
    } else {
      return timer.owner_id === ownerId && timer.isActive;
    }
  });

const getOldTimers = (ownerId) =>
  DB.timers.filter((timer) => {
    if (!ownerId) {
      return !timer.isActive;
    } else {
      return timer.owner_id === ownerId && !timer.isActive;
    }
  });
const createTimer = (description, owner_id, isActive = true, progress = 0) => {
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

  DB.timers.push(timer);
  return timer;
};

const findActiveTimerById = (id, owner_id) => {
  const activeTimers = getActiveTimers(owner_id);
  const timerIndex = activeTimers.findIndex((timer) => timer.id === id);
  return activeTimers[timerIndex];
};

module.exports = { getActiveTimers, getOldTimers, findActiveTimerById, createTimer };
