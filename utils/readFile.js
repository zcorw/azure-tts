const fs = require("fs");
const path = require("path");

module.exports = function readFile(filePath) {
  return new Promise((resolve, reject) => fs.stat(filePath, (err, stats) => {
    if (err) {
      reject(err)
    } else {
      resolve(stats)
    }
  }))
  .then(stats => {
    if (stats.isFile()) {
      return {
        type: path.extname(filePath),
        body: fs.readFileSync(filePath),
      }
    } else {
      throw new Error("文件不存在");
    }
  });
}