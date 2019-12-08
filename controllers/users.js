const User = require('../models/user');
const checkNull = require('../modul/checkNull');

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

const addUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
      .then(checkNull)
      .then((user) => res.send({ data: user }))
      .catch((err) => next(err));
};

module.exports = {
getUsers, getUser, addUser
};