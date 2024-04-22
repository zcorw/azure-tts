const fs = require("fs");
module.exports = function moveFile(oldFile, newFile) {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(oldFile);
    const ws = fs.createWriteStream(newFile);
    rs.pipe(ws);
    rs.on('end', function() {
      fs.unlinkSync(oldFile);
      resolve();
    })
  })
}