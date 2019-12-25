const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const jwt = require('jsonwebtoken');
const { ErrorUnauthorized } = require('../modul/errors');
const { NODE_ENV, JWT_SECRET } = process.env;
const key = require('../modul/key');


module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : key);
  }
  catch (err) {
    return next(new ErrorUnauthorized('Авторизутесь!'))
  }
  req.user = payload;
  return next();
};