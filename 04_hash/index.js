const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const hash = crypto.createHash("sha256");
// console.log("RESOLVE", path.resolve(__dirname, process.argv[2]));

const pathToFile = path.resolve(__dirname, process.argv[2]);
console.log("PATH TO FILE:", pathToFile);

// A
try {
  if (path.extname(pathToFile) === ".txt") {
    fs.readFileSync(pathToFile, "utf-8");
  } else {
    fs.readFileSync(pathToFile, "binary");
  }
} catch (error) {
  console.error(`Невозможно прочитать файл ${path.basename(pathToFile)}\n`, error);
  process.exit(100);
}

// B
let sha256;
try {
  sha256 = fs.readFileSync(pathToFile + ".sha256", "utf-8").trim();
  console.log(sha256);
} catch (error) {
  console.error(`Невозможно прочитать файл ${path.basename(pathToFile + ".sha256")}\n`, error);
  process.exit(101);
}

// C
hash.update(fs.readFileSync(pathToFile));
const fileSha256 = hash.copy().digest("hex");
console.log(fileSha256);

// D
if (fileSha256 !== sha256) {
  console.error(`Хеши не совпадают ${path.basename(pathToFile)}`);
  process.exit(102);
}

console.log(hash.copy().digest("hex") === sha256);
console.log("Success!");
process.exit(0);
