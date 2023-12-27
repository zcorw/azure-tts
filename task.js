
const crypto = require('crypto');
const tasks = {};
exports.tasks = tasks;
exports.add = function(taskLen) {
  const uuid = crypto.randomUUID();
  tasks[uuid] = {
    total: taskLen + 1,
    completed: 0,
    allCompleted: false,
  };
  return uuid;
}
exports.progressRate = function(uuid) {
  return { rate: parseInt(tasks[uuid].completed / tasks[uuid].total * 100), completed: tasks[uuid].allCompleted };
}
exports.oneStep = function(uuid) {
  tasks[uuid].completed++;
  const allCompleted = tasks[uuid].completed === tasks[uuid].total;
  tasks[uuid].allCompleted = allCompleted;
  return allCompleted;
}