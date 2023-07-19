const crypto = require("crypto");

const fs = require("fs");
const path = require("path");
const downloadFile = require("./downloadFile");
const hash = crypto.createHash("sha256");

let fileName;
let pathToFile;

(async () => {
  if (process.argv[2].includes("http://") || process.argv[2].includes("https://")) {
    fileName = process.argv[2].split("/")[process.argv[2].split("/").length - 1];
    await downloadFile(process.argv[2], fileName);
    pathToFile = fileName;
  } else {
    pathToFile = path.resolve(__dirname, process.argv[2]);
    fileName = path.basename(pathToFile);
  }

  // A
  try {
    if (!fs.existsSync(pathToFile)) {
      console.error(`Файл ${path.basename(pathToFile)} не существует`);
      process.exit(100);
    }

    if (path.extname(pathToFile) === ".txt") {
      fs.readFileSync(pathToFile, "utf-8");
    } else {
      fs.readFileSync(pathToFile, "binary");
    }
  } catch (error) {
    console.error(`Невозможно прочитать файл ${fileName}\n`, error);
    process.exit(100);
  }

  // B
  let sha256;
  try {
    sha256 = fs.readFileSync(pathToFile + ".sha256", "utf8").trim();
    console.log(fileName + ".sha256", sha256);
  } catch (error) {
    console.error(`Невозможно прочитать файл ${fileName + ".sha256"}\n`, error);
    process.exit(101);
  }

  // C
  hash.update(fs.readFileSync(pathToFile));
  const fileSha256 = hash.copy().digest("hex");
  console.log(fileName + "       ", fileSha256);

  // D
  if (fileSha256 !== sha256) {
    console.error(`Хеши не совпадают ${fileName}`);
    process.exit(102);
  }

  console.log(fileSha256 === sha256);
  console.log("Success!");
  process.exit(0);
})();
