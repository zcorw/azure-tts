const tts = require("./azureTts");
const wavToMp3 = require("./wavToMp3");
const { add, oneStep } = require("./task");
const createTxtFile = require('./createTxtFile');
const path = require("path");
const createFolder = require("./utils/audioFolder");
const moveFile = require("./utils/moveFile");
const fs = require("fs");

const folderPath = createFolder(path.join(__dirname, "audios"));
const date = new Date()
const year = date.getFullYear()
const month = String(date.getMonth() + 1).padStart(2, '0')
const day = String(date.getDate()).padStart(2, '0')
const audioFolder = createFolder(path.join(process.env.AUDIOFOLDER, `${year}${month}${day}`));

function textToMp3(title, text, lang) {
  const textPath = path.join(folderPath, `${title}.txt`)
  createTxtFile(textPath, text);
  const result = text.replace(/[。！？；]/g, (t) => `${t}\u200b`).split(/\u200b/);
  const finalResult = result.map(t => t.trim()).filter((item) => item !== '');
  const filePath = path.join(folderPath, `${title}.wav`);
  const id = add(finalResult.length, title);
  tts(finalResult, lang, filePath, () => {
    oneStep(id);
  })
  .then(() => wavToMp3(filePath))
  .then(async (mp3Path) => {
    oneStep(id);
    console.log("成功");
    await moveFile(mp3Path, path.join(audioFolder, `${title}.mp3`));
    await moveFile(textPath, path.join(audioFolder, `${title}.txt`));
    // 删除wav文件
    fs.unlink(filePath, (err) => {
      if (err)  console.error(err);
    });
  });
  return id;
}

module.exports = textToMp3;


