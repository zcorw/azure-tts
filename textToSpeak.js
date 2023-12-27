const tts = require("./azureTts");
const wavToMp3 = require("./wavToMp3");
const { add, oneStep } = require("./task");
const path = require("path");
const fs = require("fs");

const folderPath = process.env.AUDIOFOLDER;
fs.stat(folderPath, (err, stats) => {
  if (err) {
    fs.mkdirSync(folderPath);
  } else {
    if (!stats.isDirectory()) {
      fs.mkdirSync(folderPath);
    }
  }
});

async function textToMp3(title, text, lang) {
  const result = text.replace(/[。！？；]/g, (t) => `${t}\u200b`).split(/\u200b/);
  const finalResult = result.map(t => t.trim()).filter((item) => item !== '');
  const filePath = path.join(__dirname, "audios", `${title}.wav`);
  const id = add(finalResult.length);
  tts(finalResult, lang, filePath, () => {
    oneStep(id);
  })
  .then(() => wavToMp3(filePath))
  .then(() => {
    oneStep(id);
    console.log("成功");
  });
  return id;
}

module.exports = textToMp3;


