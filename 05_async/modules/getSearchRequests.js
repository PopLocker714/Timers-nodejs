module.exports = function getSearchRequests() {
  const argv = process.argv;
  argv.shift();
  argv.shift();
  return argv;
};
