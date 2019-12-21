const { ErrorNotFound } = require('../modul/errors');

module.exports = function (data) {
  if (data) {
    return Promise.resolve(data);
  }
  return Promise.reject(new ErrorNotFound('Документ не найден'));
};