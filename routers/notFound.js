const error = (err, req, res, next) => {
  if(!err.message) {
    next();
  }
  const failedError = err.message.indexOf('ObjectId Failed');
  const notFound = err.message.indexOf('Not Found');
  if (notFound || failedError) {
    return res.status(404).json({ error: err.message });
  }
  return res.status(500).json({ error: err.message });
}

const someNotFound = (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(404).send('{"message": "Ресурс не найден" }')ж
}

module.exports = { error, someNotFound };