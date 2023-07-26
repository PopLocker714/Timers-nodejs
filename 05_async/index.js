const { getAllPeopleNamesSrt } = require("./modules/getAllPeopleNamesSrt");
const { getMinMaxHeightPerson } = require("./modules/getMinMaxHeightPerson");
const getSearchRequests = require("./modules/getSearchRequests");
const removeMirrorPeople = require("./modules/removeMirrorPeople");
const searchPeople = require("./modules/searchPeople");

const searchRequests = getSearchRequests();
if (searchRequests.length === 0) {
  console.warn("No search arguments");
  process.exit();
}

(async () => {
  const result = await searchPeople(searchRequests);
  let allPeople = [];
  let isEmptyResults = true;
  result.forEach((res) => {
    if (res.count >= 1) {
      isEmptyResults = false;
      allPeople = allPeople.concat(res.results).sort((a, b) => a.name.localeCompare(b.name));
    }
  });

  if (isEmptyResults) {
    console.log(`Total results: 0.`);
    return;
  } else {
    result.forEach((res) => {
      if (res.error) {
        console.log(`Request "${res.searchRequest}" complete with error:`);
        console.log(res.error);
      }

      if (res.count === 0) {
        console.log(`No results found for ${res.searchRequest}`);
      }
    });
  }

  const peopleNames = removeMirrorPeople(allPeople);
  console.log(peopleNames);

  console.log(`Total results: ${peopleNames.length}.`);
  console.log();
  console.log(`All: ${getAllPeopleNamesSrt(peopleNames)}.`);
  console.log();
  const { min, max, maxName, minName } = getMinMaxHeightPerson(allPeople);
  console.log(`Min height: ${minName}, ${min}`);
  console.log();
  console.log(`Max height: ${maxName}, ${max}`);
})();
