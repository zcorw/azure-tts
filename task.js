
const crypto = require('crypto');
const tasks = {};
exports.tasks = tasks;
exports.add = function(taskLen, title) {
  const uuid = crypto.randomBytes(8).toString('hex');
  tasks[uuid] = {
    total: taskLen + 1,
    completed: 0,
    allCompleted: false,
    title,
  };
  return uuid;
}
exports.progressRate = function(uuid) {
  if (!tasks[uuid]) {
    throw new Error("任务不存在");
  }
  return { rate: parseInt(tasks[uuid].completed / tasks[uuid].total * 100), completed: tasks[uuid].allCompleted };
}
exports.oneStep = function(uuid) {
  tasks[uuid].completed++;
  console.log("执行" + tasks[uuid].completed);
  const allCompleted = tasks[uuid].completed === tasks[uuid].total;
  tasks[uuid].allCompleted = allCompleted;
  return allCompleted;
}

exports.getTitle = function(id) {
  try {
    return tasks[id].title;
  } catch(e) {
    throw new Error("任务不存在");
  }
}