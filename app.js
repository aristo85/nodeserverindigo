const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// environment setting
dotenv.config({ path: "./.env" });
const { config } = require("./config");
const authRoutes = require("./routes/authRoutes");
const privateRoutes = require("./routes/privateRoutes");

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELET, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/private", privateRoutes);
app.use("/auth", authRoutes);

// error handling
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

const start = async (port) => {
  try {
    const isConnected = mongoose.connect(config.mongoUrl);
    if (isConnected)
      app.listen(port, () => {
        console.log(`starting server at ${port}`);
      });
  } catch (err) {
    console.error(err);
    process.exit();
  }
};
start(8080);

module.exports = app;
