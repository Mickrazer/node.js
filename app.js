const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const usersRouter = require(path.join(__dirname, 'routers/users.js'));
const cardsRouter = require(path.join(__dirname, 'routers/cards.js'));
const { error, someNotFound } = require(path.join(__dirname, 'routers/notFound.js'));
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '5de511589242026f5f417885',
  };
  next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', error);
app.use('*', someNotFound);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});