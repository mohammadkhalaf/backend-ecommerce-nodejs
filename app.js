const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const connectDB = require('./db/db');
const authRoute = require('./routes/authRoutes');

//middleware
const morgan = require('morgan');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
app.use(morgan('tiny'));
app.use(express.json());

//routes
app.get('/api/v1/', (req, res) => {
  res.send('hello');
});
app.use('/api/v1/auth', authRoute);

app.use(notFound);
app.use(errorHandler);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log('is running ' + port);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
