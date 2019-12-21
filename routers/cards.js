const router = require('express').Router();
const {
  getCards, addCard, deleteCard,
} = require('../controllers/cards');
const {celebrate, Joi } = require('celebrate');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}), addCard);
router.delete('/:cardId', deleteCard);

module.exports = router;