const Card = require('../models/card');
const checkNull = require('../modul/checkNull');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then(checkNull)
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};
const addCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then(checkNull)
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then(checkNull)
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        return Card.findByIdAndRemove(req.params.cardId)
          .then((trueCard) => res.send({ data: trueCard }))
          .catch((err) => next(err));
      }
      throw new Error('У вас недостаточно прав для данного действия');
    })
    .catch((err) => next(err));
};

module.exports = {
  getCards, addCard, deleteCard,
};