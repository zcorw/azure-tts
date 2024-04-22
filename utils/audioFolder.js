const path = require("path");
const fs = require("fs");

module.exports = function audioFolder(folderPath) {
  fs.stat(folderPath, (err, stats) => {
    if (err) {
      fs.mkdirSync(folderPath);
    } else {
      if (!stats.isDirectory()) {
        fs.mkdirSync(folderPath);
      }
    }
  });
  return folderPath;
}