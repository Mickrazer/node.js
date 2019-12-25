require('dotenv').config();
const User = require('../models/user');
const checkNull = require('../modul/checkNull');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../modul/key');
const { NODE_ENV, JWT_SECRET } = process.env;


const getUsers = (req, res, next) => {
  User.find({})
    .then(checkNull)
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then(checkNull)
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  if(password) {
    return bcryptjs.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then(checkNull)
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => next(err));
  }
  return res.status(400).send({ error: 'Неверные e-mail или пароль'});
};

const login = (req, res) =>{
  const {email, password} = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({_id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : key, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 9000000,
        httpOnly: true,
      })
        .send({
          name: user.name,
          email: user.email,
        });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    })
}

module.exports = {
getUsers, getUser, createUser, login
};