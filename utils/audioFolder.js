const path = require("path");
const fs = require("fs");

const _path =  path.join(__dirname, "audios");

module.exports = function audioFolder(folderPath = _path) {
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