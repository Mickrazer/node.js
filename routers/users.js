const path = require('path');
const router = require('express').Router();
const fsPromises = require('fs').promises;
const users = fsPromises.readFile(path.join(__dirname, '../data/users.json'), {encoding: 'utf8'})
  .catch((err) => {
    console.log(err);
  })

router.get('/', (req, res) => {
  users.then((arrUsers) => {
    res.set('Content-Type', 'application/json');
    res.send(arrUsers)
  });
});

router.get('/:id', (req, res) => {
    users.then((arrUsers) => {
    res.set('Content-Type', 'application/json');
    const user = JSON.parse(arrUsers).find((item) => item._id === req.params.id);
    if(user){
      res.send(user);
    } else {
      res.status(404).send({ 'message': 'Нет пользователя с таким id' })
    }
  })
});

module.exports = router;