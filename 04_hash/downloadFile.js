const https = require("https");
const http = require("http");
const fs = require("fs");
const crypto = require("crypto");
const hash = crypto.createHash("sha256");

module.exports = async function downloadFile(url, fileName) {
  let protocol;

  if (process.argv[2].includes("http://")) {
    protocol = http;
  } else {
    protocol = https;
  }

  let fileData1 = [];
  let fileData2 = [];

  const result = await Promise.all([
    new Promise((resolve, reject) => {
      protocol.get(url, (response) => {
        const { statusCode } = response;
        if (statusCode !== 200) {
          reject(new Error(statusCode));
        }

        response.on("data", (data) => {
          fileData1.push(data);
          hash.update(data);
        });

        response.on("end", () => {
          fs.writeFileSync(fileName, Buffer.concat(fileData1));
          const fileHash = hash.digest("hex");
          console.log(fileHash);
          resolve({ hash: fileHash });
        });
      });
    }),
    new Promise((resolve, reject) => {
      protocol.get(url + ".sha256", (response) => {
        const { statusCode } = response;
        if (statusCode !== 200) {
          if (statusCode === 404) {
            reject(new Error(statusCode));
            process.exit(101);
          }
          reject(new Error(statusCode));
        }

        response.on("data", (data) => {
          fileData2.push(data);
        });

        response.on("end", () => {
          const dat = fs.writeFileSync(fileName + ".sha256", Buffer.concat(fileData2));
          console.log(dat);
          resolve({ hash: fs.readFileSync(fileName + ".sha256", "binary").trim() });
        });
      });
    }),
  ])
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
  return result;
};
