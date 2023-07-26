function getAllPeopleNamesSrt(people) {
  return people
    .map((person) => person)
    .toString()
    .replaceAll(",", ", ");
}
exports.getAllPeopleNamesSrt = getAllPeopleNamesSrt;
