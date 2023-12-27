const Lame = require("node-lame").Lame;
const path = require("path");

function wavToMp3(wavFilePath) {
  const fileInfo = path.parse(wavFilePath);
  delete fileInfo['base'];
  const encoder = new Lame({
    output: path.format({ ...fileInfo, ext: ".mp3" }),
    bitrate: 128,
  }).setFile(wavFilePath);
  return encoder.encode();
}

module.exports = wavToMp3;