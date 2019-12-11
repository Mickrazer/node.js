const key = require('../modul/key');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, key);
  }
  catch (err) {
    return res.status(401).send({ message: 'Авторизуйтесь!' });
  }
  req.user = payload;
  return next();
};