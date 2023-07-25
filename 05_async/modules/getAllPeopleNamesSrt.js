function getAllPeopleNamesSrt(people) {
  return people
    .map((person) => person.name)
    .toString()
    .replaceAll(",", ", ");
}
exports.getAllPeopleNamesSrt = getAllPeopleNamesSrt;
