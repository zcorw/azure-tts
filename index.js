const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const path = require('path');
const fs = require('fs');
const speakText = require('./textToSpeak');
const { progressRate } = require('./task');

const app = new Koa();
const router = new Router();

// 自定义中间件，用于检查请求路径是否以 /public 开头
const publicFileMiddleware = async (ctx, next) => {
  const { path: filePath } = ctx;
  
  if (filePath.startsWith('/public')) {
    const publicPath = path.join(__dirname, 'public');
    const requestedFile = path.join(publicPath, filePath.replace('/public', ''));
    try {
      await new Promise((resolve, reject) => fs.stat(requestedFile, (err, stats) => {
        if (err) {
          reject(err)
        } else {
          resolve(stats)
        }
      }))
      .then(stats => {
        if (stats.isFile()) {
          ctx.type = path.extname(requestedFile); // 设置 Content-Type
          ctx.body = fs.readFileSync(requestedFile);
        }
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

app.use(publicFileMiddleware);
// 使用 bodyParser 中间件来解析 POST 请求中的参数
app.use(bodyParser());
app.use(static(path.join(__dirname, 'public')));
// 返回页面
router.get("/", (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
})

// 定义一个 POST 接口 '/split'，接收 text 参数，并返回切割后的数组
router.post('/api/tts', async (ctx) => {
  const { text, title, lang } = ctx.request.body;

  if (!text || typeof text !== 'string') {
    ctx.status = 400;
    ctx.body = { error: 'Invalid input. Please provide a valid string in the "text" parameter.' };
    return;
  }

  const id = await speakText(title, text, lang);

  ctx.body = { data: { id: id } };
});

router.get('/api/progress', (ctx) => {
  const id = ctx.query.id;
  const {rate, allCompleted} = progressRate(id);
  ctx.body = { data: {rate, completed: allCompleted} };
})

app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务器监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
