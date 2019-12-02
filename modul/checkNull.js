module.export = function (data) {
  if (data) {
    return Promise.resolve(data);
  }
  return Promise.reject(new Error('Документ не найден'))
};