const Lame = require("node-lame").Lame;
const path = require("path");

function wavToMp3(wavFilePath) {
  const fileInfo = path.parse(wavFilePath);
  const mp3Path = path.format({ ...fileInfo, ext: ".mp3" });
  delete fileInfo['base'];
  const encoder = new Lame({
    output: mp3Path,
    bitrate: 128,
  }).setFile(wavFilePath);
  encoder.encode();
  return mp3Path;
}

module.exports = wavToMp3;