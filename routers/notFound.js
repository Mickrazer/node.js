const error = (err, req, res, next) => {
  if(!err.message) {
    next();
  }
  const notFound = err.message.indexOf('not found');
  const failedError = err.message.indexOf('Cast to ObjectId failed');
  if (notFound || failedError) {
    return res.status(404).json({ error: err.message });
  }
  return res.status(500).json({ error: err.message });
};

const someNotFound = (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(404).send('{ "message": "Ресурс не найден" }');
};

module.exports = { error, someNotFound };