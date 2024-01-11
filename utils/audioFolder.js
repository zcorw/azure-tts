const path = require("path");
const fs = require("fs");

const folderPath = process.env.AUDIOFOLDER || path.join(__dirname, "audios");

module.exports = function audioFolder() {
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