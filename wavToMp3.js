const Lame = require("node-lame").Lame;
const path = require("path");

function wavToMp3(wavFilePath) {
  const fileInfo = path.parse(wavFilePath);
  delete fileInfo['base'];
  const mp3Path = path.format({ ...fileInfo, ext: ".mp3" });
  const encoder = new Lame({
    output: mp3Path,
    bitrate: 128,
  }).setFile(wavFilePath);
  return encoder.encode().then(() => mp3Path);
}

module.exports = wavToMp3;