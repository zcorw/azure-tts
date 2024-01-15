const fs = require("node:fs");
const path = require("node:path");

module.exports = function createTxtFile(folderPath, text) {
  return fs.writeFileSync(folderPath, text, {encoding: "utf8"});
}