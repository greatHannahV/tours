const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitizeHtml = require('sanitize-html');
const hpp = require('hpp');

const app = express();
// app.set('query parser', 'extended');

const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewsRouter = require('./routes/reviewsRoutes');
//express does not send body data to the request for that we need middleware
//express.json() is middleware it can modidy incomig data

//middlewares
//security http headers
app.use(helmet());

//reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//data sanitisation against noSQL query injection
// app.use(mongoSanitize());
// Prevent NoSQL injection
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        const sanitizedKey = key.replace(/\$/g, '').replace(/\./g, '');
        if (sanitizedKey !== key) {
          obj[sanitizedKey] = obj[key];
          delete obj[key];
        }

        if (typeof obj[sanitizedKey] === 'object') {
          sanitize(obj[sanitizedKey]);
        }
      });
    }
  };

  sanitize(req.body);
  sanitize(req.params);
  // req.query is read-only in Express 5.x, libreries were abandoned

  next();
});

// againts XSS
// app.use(xss());
app.use((req, res, next) => {
  if (req.body && req.body.comment) {
    req.body.comment = sanitizeHtml(req.body.comment);
  }
  next();
});

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'maxGroupSize',
      'price',
    ],
  }),
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//limit requests
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in 1 hour!',
});

app.use('/api', limiter);

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
app.use('/api/v1/reviews', reviewsRouter);

app.all(/.*/, (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  // next();

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
//start server
module.exports = app;
