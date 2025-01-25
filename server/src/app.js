const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

const user = require("../src/routes/userRoutes");
const product = require("../src/routes/productRoutes");
const order = require("../src/routes/orderRoutes");
const payment = require("../src/routes/PaymentRoute");

app.use("/api", user);
app.use("/api", product);
app.use("/api", order);
app.use("/api", payment);

// middleware to show error response in json send to client
// comment it when developing backend to trace error

// app.use((error, req, res, next) => {
//   error.statusCode = error.statusCode || 500;
//   error.statusCode = error.statusCode || "error";
//   res.status(error.statusCode).json({
//     statusCode: error.statusCode,
//     message: error.message,
//   });
// });

module.exports = { app };
