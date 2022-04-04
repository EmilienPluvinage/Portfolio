require("dotenv").config();
var mysql = require("mysql");

var con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DB,
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
  con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});
//

module.exports = app;
