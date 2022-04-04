require("dotenv").config();
var mysql = require("mysql");

var con = mysql.createConnection({
  host: process.ENV.MYSQL_DB,
  user: process.ENV.MYSQL_USER,
  password: process.ENV.MYSQL_PWD,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const express = require("express");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//////////////
//   READ   //
//////////////

// TEST SERVER

app.get("/Test", (req, res, next) => {
  console.log("Get request received");
  res.end("Hello World\n");
});
//

module.exports = app;
