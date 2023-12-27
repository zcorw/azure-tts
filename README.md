# 文章转音频
> 利用azure的tts服务将文章转为mp3
## quick start
项目使用了 [node-lame](https://github.com/devowlio/node-lame)，需要先安装 lame，安装方式看 [node-lame](https://github.com/devowlio/node-lame) 的 README。
```shell
npm install
node index
```
## environment
`SPEECH_KEY` Azure SpeechServices 的 key<br/>
`SPEECH_REGION` Azure SpeechServices 的服务地区<br/>
`AUDIOFOLDER` 保存音频地址(绝对路径)<br/>
`PORT` 服务监听端口<br/>
`PROXY_IP` 如果访问不到 Azure， 设置代理 ip<br/>
`PROXY_PORT` 如果访问不到 Azure， 设置代理端口