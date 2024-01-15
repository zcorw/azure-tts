const tts = require("./azureTts");
const wavToMp3 = require("./wavToMp3");
const { add, oneStep } = require("./task");
const createTxtFile = require('./createTxtFile');
const path = require("path");
const audioFolder = require("./utils/audioFolder");

const folderPath = audioFolder();

function textToMp3(title, text, lang) {
  createTxtFile(path.join(folderPath, `${title}.txt`), text);
  const result = text.replace(/[。！？；]/g, (t) => `${t}\u200b`).split(/\u200b/);
  const finalResult = result.map(t => t.trim()).filter((item) => item !== '');
  const filePath = path.join(folderPath, `${title}.wav`);
  const id = add(finalResult.length, title);
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


