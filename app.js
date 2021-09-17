require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

const url = process.env.URL;
mongoose
  .connect(url)
  .then(() => {
    console.log("connection succeeded");
  })
  .catch((error) => {
    console.log(error.name);
  });
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/products", productRoutes);
app.use("/orders", ordersRoutes);

module.exports = app;
