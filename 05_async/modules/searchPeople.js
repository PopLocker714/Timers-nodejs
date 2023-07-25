const { default: axios } = require("axios");
const { getNextResult } = require("./getNextResult");

module.exports = async function searchPeople(peoples) {
  return await Promise.all(
    peoples.map(async (pearson) =>
      axios
        .get(`https://swapi.dev/api/people/`, {
          params: { search: pearson },
        })
        .then(async (res) => {
          if (res.data.count === 0) {
            res.data.searchRequest = pearson;
            return res.data;
          }

          let nextResult;
          if (res.data.next) {
            nextResult = await getNextResult(res.data.next, res.data.count);
            res.data.results = res.data.results.concat(nextResult);
          }

          return res.data;
        })
        .catch((e) => {
          return { error: e.message, count: 0, searchRequest: pearson };
        })
    )
  );
};
