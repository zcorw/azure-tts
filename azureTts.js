var sdk = require("microsoft-cognitiveservices-speech-sdk");
var fs = require("fs");
require('dotenv').config();
// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);

const voiceList = {
    "zh-cn": "zh-CN-XiaochenNeural",
    "jp": "ja-JP-DaichiNeural",
    "en-US": "en-US-AriaNeural",
}

function speakText(speechSynthesizer, text, path) {
  return new Promise((resolve, reject) => {
    speechSynthesizer.speakTextAsync(
      text,
      result => {
          if (result) {
            resolve(result);
            return fs.createReadStream(path, { flags: 'a', encoding: 'binary', highWaterMark: 16 * 1024 });
          } else {
            reject({message: "无数据"});
          }
      },
      error => {
          reject(error);
      });
  })
}

async function tts(list, lang, filename, onProgress) {
    speechConfig.speechSynthesisVoiceName = voiceList[lang];
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Riff48Khz16BitMonoPcm;
    if (process.env.PROXY_IP && process.env.PROXY_PORT) {
      speechConfig.setProxy(process.env.PROXY_IP, process.env.PROXY_PORT);
    }
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    
    for (let i = 0; i < list.length; i++) {
      try {
        await speakText(speechSynthesizer, list[i], filename);
        console.log("执行" + i);
        onProgress(i);
      } catch(e) {
        console.error(e);
        throw new Error(e.message);
      }
    }
    speechSynthesizer.close();
}

module.exports = tts;