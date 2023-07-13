console.log("OK");

const http = require("http");

const visits = new Map();
const search = new Map();

const PORT = 8000;
const serverName = `http://localhost:${PORT}`;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, serverName);
  const key = parsedUrl.pathname;

  console.log(key);
  for (const paramName of parsedUrl.searchParams.keys()) {
    search.set(paramName, (search.get(paramName) || 0) + 1);
  }

  const count = (visits.get(key) || 0) + 1;
  visits.set(key, count);
  res.end(`Visit to ${key} #${count}

    Search params count:
    ${[...search.entries()].map(([key, value]) => `${key} => ${value}`).join("\n")}

  `);
});

server.listen(PORT, () => {
  console.log(`Listening to ${serverName}`);
});
