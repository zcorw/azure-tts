const ERRORCODEMSG = {
  // 40100-40199 表单错误
  40101: '${name}不能为空',
  // 40200-40299 进度任务错误
  40201: "任务不存在",
  40202: "任务id不能为空",
}

module.exports = () => {
  return function(ctx, next) {
    ctx.success = function(data) {
      ctx.status = 200;
      ctx.body = {
        code: 20000,
        message: "请求成功",
        data,
      }
    };
    ctx.fail = function(code, options = {}, status = 200) {
      ctx.status = status;
      let message = ERRORCODEMSG[code] || '请求失败';
      if (Object.keys(options).length > 0) {
        Object.keys(options).forEach(key => {
          message = message.replace(new RegExp('\\${' + key + '}', 'g'), options[key]);
        });
      }
      ctx.body = {
        code,
        message,
      }
    }
    ctx.file = function(fileData) {
      ctx.status = 200;
      ctx.type = fileData.type;
      ctx.body = fileData.body;
    }
    next();
  }
}