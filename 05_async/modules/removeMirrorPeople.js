module.exports = function removeMirrorPeople(people) {
  const names = people.map((person) => person.name);
  const newSet = new Set(names);
  return Array.from(newSet);
};
