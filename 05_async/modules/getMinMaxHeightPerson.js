function getMinMaxHeightPerson(people) {
  people.sort((a, b) => a.height - b.height);
  return {
    minName: people.at(0).name,
    maxName: people.at(-1).name,
    min: people.at(0).height,
    max: people.at(-1).height,
  };
}
exports.getMinMaxHeightPerson = getMinMaxHeightPerson;
