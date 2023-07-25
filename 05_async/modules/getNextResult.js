const { default: axios } = require("axios");

async function getNextResult(next, count) {
  const url = new URL(next);

  let countRequest = 0;
  if (count > 9) {
    countRequest += Math.ceil((count - 10) / 10);
  } else {
    countRequest = 1;
  }

  let arrCountRequest = [];
  for (let i = 0; i < countRequest; i++) {
    arrCountRequest.push(i);
  }

  const result = await Promise.all(
    arrCountRequest.map(async (count) => {
      !(count >= 1)
        ? url.searchParams.set("page", (+url.searchParams.get("page")).toString())
        : url.searchParams.set("page", (+url.searchParams.get("page") + 1).toString());

      return await axios.get(url).then((res) => {
        return res.data.results;
      });
    })
  );
  return result.reduce((accumulator, arr) => accumulator.concat(arr), []);
}
exports.getNextResult = getNextResult;
