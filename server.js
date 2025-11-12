const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('uncaught exception');
  console.log(err);

  process.exit(1);
});

dotenv.config({
  path: './config.env',
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => {
  console.log('Successful conection');
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandled rejection');
  server.close(() => {
    process.exit(1);
  });
});
