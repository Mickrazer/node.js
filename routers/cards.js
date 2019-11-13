const path = require('path');
const router = require('express').Router();
const fsPromises = require('fs').promises;

const cards = fsPromises.readFile(path.join(__dirname, '../data/cards.json'), {encoding: 'utf8'})
  .catch((err) => {
    console.log(err);
  })

router.get('/', (req, res) => {
  cards.then((data) => {
    res.set('Content-Type', 'application/json');
  });
});

module.exports = router;