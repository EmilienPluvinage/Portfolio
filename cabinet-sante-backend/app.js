require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql");
const crypto = require("crypto");

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DB,
});

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

// A utiliser lors de l'ajout d'un utilisateur
//var salt = crypto.randomBytes(16).toString("hex");

//////////////
//   READ   //
//////////////

// TEST SERVER

app.get("/Test", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query("SELECT * FROM users", (err, rows) => {
      connection.release(); // return the connection to pool
      if (err) throw err;
      console.log("The data from users table are: \n", rows);
    });
  });
});

app.post("/Login", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "SELECT id, password, salt FROM users WHERE email= ?",
      req.body.email,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        var userId = rows[0].id;
        var userPwd = rows[0].password;
        var userSalt = rows[0].salt;
        if (rows.length === 1) {
          var hash = crypto
            .pbkdf2Sync(req.body.password, userSalt, 1000, 64, `sha512`)
            .toString(`hex`);
          if (userPwd === hash) {
            // right password, we generate a token a return it the the front-end
            var token = crypto.randomBytes(64).toString("hex");
            // we check if there is already a token for that user
            connection.query(
              "SELECT COUNT(*) as n FROM tokens WHERE userId= ?",
              userId,
              (err, rows) => {
                if (err) throw err;
                if (rows[0].n > 0) {
                  // then we update the token
                  connection.query(
                    "UPDATE tokens SET token = ? WHERE userId=?",
                    [token, userId],
                    (err, result) => {
                      if (err) throw err;
                      res.status(201).json({ loggedIn: true, token: token });
                    }
                  );
                } else {
                  // then we add a new one
                  connection.query(
                    "INSERT INTO tokens(userId,token) VALUES (?,?)",
                    [userId, token],
                    (err, result) => {
                      if (err) throw err;
                      res.status(201).json({ loggedIn: true, token: token });
                    }
                  );
                }
              }
            );
          } else {
            // wrong password
            res
              .status(201)
              .json({ loggedIn: false, error: "incorrect password" });
          }
        } else if (rows.length === 0) {
          res.status(201).json({ loggedIn: false, error: "incorrect e-mail" });
        } else {
          res.status(201).json({
            loggedIn: false,
            error: "multiple users with same e-mail",
          });
        }
      }
    );
  });
});

module.exports = app;
