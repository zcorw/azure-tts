const fs = require("fs");
module.exports = function moveFile(oldFile, newFile) {
  return new Promise((resolve, reject) => {
    fs.rename(oldFile, newFile, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  })
}