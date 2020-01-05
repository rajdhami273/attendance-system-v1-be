const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const auth = require('./app/middleware/auth.middleware');

app.use(cors({ credentials: true }));
app.use('/downloads', express.static("public"));

app.get("/", (req, res) => {
  res.send("So you are here today!");
});

mongoose
  .connect("mongodb://127.0.0.1:27017/attendanceSystem", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to Database");
    app.use(
      "/api/v1",
      bodyParser.urlencoded({ extended: true }),
      bodyParser.json(),
      require("./route-group")(mongoose)
    );
  })
  .catch(err => {
    console.log('Error connecting to database: ', err);
    process.exit();
  });

module.exports = server;
