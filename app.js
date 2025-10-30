const express = require('express');

const app = express();
app.set('query parser', 'extended');

const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
//express does not send body data to the request for that we need middleware
//express.json() is middleware it can modidy incomig data

//middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//route handlers

////
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', creatTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//start server
module.exports = app;
