const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const path = require('path');
const fs = require('fs');
const speakText = require('./textToSpeak');
const { progressRate, getTitle } = require('./task');
const reponseMiddleWare = require('./middleware/response');
const readFile = require('./utils/readFile');
const audioFolder = require('./utils/audioFolder');

const app = new Koa();
const router = new Router();

// 自定义中间件，用于检查请求路径是否以 /public 开头
const publicFileMiddleware = async (ctx, next) => {
  const { path: filePath } = ctx;
  
  if (filePath.startsWith('/public')) {
    const publicPath = path.join(__dirname, 'public');
    const requestedFile = path.join(publicPath, filePath.replace('/public', ''));
    try {
      await readFile(requestedFile)
      .then(data => {
        ctx.type = data.type; // 设置 Content-Type
        ctx.body = data.body;
      });
      return;
    } catch (error) {
      // 处理文件不存在的情况
      console.error(error);
    }
  }

  // 如果路径不以 /public 开头或文件不存在，则交给下一个中间件处理
  await next();
};

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  ctx.set('Access-Control-Allow-Headers', '*');
  await next();
});
app.use(publicFileMiddleware);
// 使用 bodyParser 中间件来解析 POST 请求中的参数
app.use(bodyParser());
app.use(static(path.join(__dirname, 'public')));
app.use(reponseMiddleWare());
// 返回页面
router.get("/", (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
})

// 定义一个 POST 接口 '/split'，接收 text 参数，并返回切割后的数组
router.post('/api/tts', (ctx) => {
  const { text, title, lang } = ctx.request.body;

  if (!text || typeof text !== 'string') {
    ctx.fail(40101, {name: "内容"});
    return;
  }

  if (!title || typeof title !== 'string') {
    ctx.fail(40101, {name: "标题"});
    return;
  }

  const id = speakText(title, text, lang);

  ctx.success({ id: id });
});

router.get('/api/progress', (ctx) => {
  const id = ctx.query.id;
  try {
    if (!id) {
      ctx.fail(40202);
      return;
    }
    const {rate, completed} = progressRate(id);
    ctx.success({rate, completed});
  } catch(e) {
    console.error(e);
    ctx.fail(40201);
  }
  
})

router.get('/api/download/:id', async (ctx) => {
  try {
    const title = getTitle(ctx.params.id);
    const audioFolderPath = audioFolder();
    const data = await readFile(path.join(audioFolderPath, `${title}.mp3`));
    ctx.file(data);
  } catch(e) {
    console.error(e);
    ctx.fail(40201);
  }
  
})

app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务器监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
