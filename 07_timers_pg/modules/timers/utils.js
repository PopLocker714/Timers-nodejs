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

const findActiveTimerById = (id, owner_id) => {
  const activeTimers = getActiveTimers(owner_id);
  const timerIndex = activeTimers.findIndex((timer) => timer.id === id);
  return activeTimers[timerIndex];
};

module.exports = { getActiveTimers, getOldTimers, findActiveTimerById };
