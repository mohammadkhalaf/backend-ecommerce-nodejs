const dotenv = require('dotenv');
require('express-async-errors');
dotenv.config();
const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const connectDB = require('./db/db');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');

//middleware
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
app.use(morgan('tiny'));
app.use(cookieParser(process.env.SECRET));
app.use(express.json());

//routes
app.get('/api/v1/', (req, res) => {
  console.log('Cookies: ', req.signedCookies);
  res.send('hello ');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/products', productRouter);

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
