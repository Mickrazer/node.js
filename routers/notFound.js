const router = require('express').Router();

router.get('*', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send({'message': 'Запрвшиваемый ресурс не найден'}, 404)
});

module.exports = router;