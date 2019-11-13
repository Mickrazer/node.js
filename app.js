const express = require('express');
const app = express();
const path = require('path');
const usersRouter = require(path.join(__dirname, 'routers/users.js'));
const cardsRouter = require(path.join(__dirname, 'routers/cards.js'));
const notFoundRouter = require(path.join(__dirname, 'routers/notFound.js'));


const { PORT = 3000 } = process.env;

app.use(express.static('public'));
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', usersRouter);




app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})