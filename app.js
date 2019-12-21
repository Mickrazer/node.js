const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const usersRouter = require(path.join(__dirname, 'routers/users.js'));
const cardsRouter = require(path.join(__dirname, 'routers/cards.js'));
const { error, someNotFound } = require(path.join(__dirname, 'routers/notFound.js'));
const { PORT = 3000 } = process.env;
const { createUser, login } = require('./controllers/users');
const auth = require('./middleweres/auth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {celebrate, Joi } = require('celebrate');
const celebrateErorrs = require('celebrate').errors;
require('dotenv').config();
const { requestLogger, errorLogger } = require('./middleweres/logger');


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cors({
  orirgin: ['http://mestoekbmik.site', 'https://mestoekbmik.site', 'http://www.mestoekbmik.site', 'https://www.mestoekbmik.site'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: false,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.get('/crash-test', () =>{
  setTimeout(() => {
    throw new Error('Внимание! Проблемы с сервером!');
  }, 0);
});
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(8).max(30),
    avatar: Joi.string().required().uri(),
    about: Joi.string().required().min(2).max(30),
  }),
}), createUser);
app.use(errorLogger);
app.use(celebrateErorrs());
app.use('*', error);
app.use('*', someNotFound);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});