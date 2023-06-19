const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const { notFound, errorHandler } = require("./api/middleware/errorHandler");

dotenv.config();

// return console.log(process.env.MONGO_USER)
const db_url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gu0drla.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(cookieParser());

require("./router")(app);

app.use(notFound);
app.use(errorHandler);

app.use((req, res, next) => {
  res.json('Hello Word')
});

const port = process.env.PORT || 6000;

mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
        console.log('DB connected');
      console.log(`server runing in this ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
