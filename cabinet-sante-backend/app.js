require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql");
const crypto = require("crypto");

const parametersRoutes = require("./routes/parameters");
const patientsRoutes = require("./routes/patients");
const appointmentsRoutes = require("./routes/appointments");

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DB,
});

function updateTokenTime(connection, token) {
  connection.query(
    "UPDATE tokens SET time=? WHERE token=?",
    [Date.now(), token],
    (err, rows) => {
      if (err) throw err;
    }
  );
}

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

////////////////
//   CREATE   //
////////////////

app.use("/", parametersRoutes);
app.use("/", patientsRoutes);
app.use("/", appointmentsRoutes);

app.post("/AddNewPayement", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "SELECT userId FROM tokens WHERE token= ?",
      req.body.token,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        if (rows.length === 1) {
          const userId = rows[0].userId;
          // belongs to that user
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "INSERT INTO payements(userId, amount, patientId, date, method, eventId) VALUES (?,?,?,?,?,?)",
            [
              userId,
              req.body.amount,
              req.body.patientId,
              new Date(
                req.body.date !== undefined ? req.body.date : Date.now()
              ),
              req.body.method,
              req.body.eventId,
            ],
            (err, rows) => {
              if (err) throw err;

              if (req.body.eventId !== 0) {
                connection.query(
                  "UPDATE isInAppointment SET payed=1 WHERE id=?",
                  req.body.eventId,
                  (err, result) => {
                    if (err) throw err;
                  }
                );
              }
              res.status(201).json({ success: true, error: "" });
            }
          );
        } else {
          res.status(201).json({
            success: false,
            error: "userId and appointmentId do not match",
          });
        }
      }
    );
  });
});

app.post("/AddNewSubscription", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "SELECT userId FROM tokens WHERE token= ?",
      req.body.token,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        if (rows.length === 1) {
          const userId = rows[0].userId;
          // belongs to that user
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "INSERT INTO subscription(userId, packageId, date) VALUES (?,?,?)",
            [
              userId,
              req.body.packageId,
              new Date(
                req.body.date !== undefined ? req.body.date : Date.now()
              ),
            ],
            (err, rows) => {
              if (err) throw err;

              connection.query(
                "SELECT id FROM subscription WHERE userId=? AND packageId=? ORDER BY id DESC LIMIT 0,1",
                [userId, req.body.packageId],
                (err, rows) => {
                  if (err) throw err;
                  var subscriptionId = rows[0].id;

                  connection.query(
                    "INSERT INTO hasSubscribed(userId, patientId, subscriptionId) VALUES (?,?,?)",
                    [userId, req.body.patientId, subscriptionId],
                    (err, rows) => {
                      if (err) throw err;
                    }
                  );

                  connection.query(
                    "INSERT INTO payements(userId, amount, patientId, date, method, subscriptionId) VALUES (?,?,?,?,?,?)",
                    [
                      userId,
                      req.body.amount,
                      req.body.patientId,
                      new Date(
                        req.body.date !== undefined ? req.body.date : Date.now()
                      ),
                      req.body.method,
                      subscriptionId,
                    ],
                    (err, rows) => {
                      if (err) throw err;

                      res.status(201).json({ success: true, error: "" });
                    }
                  );
                }
              );
            }
          );
        } else {
          res.status(201).json({
            success: false,
            error: "userId and appointmentId do not match",
          });
        }
      }
    );
  });
});

// LOGIN

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
        if (rows.length === 1) {
          var userId = rows[0].id;
          var userPwd = rows[0].password;
          var userSalt = rows[0].salt;
          var hash = crypto
            .pbkdf2Sync(req.body.password, userSalt, 1000, 64, `sha512`)
            .toString(`hex`);
          if (userPwd === hash) {
            // right password, we generate a token a return it the the front-end
            var token = crypto.randomBytes(64).toString("hex");
            // we add a new token
            connection.query(
              "INSERT INTO tokens(userId,token,time) VALUES (?,?,?)",
              [userId, token, Date.now()],
              (err, result) => {
                if (err) throw err;
                res.status(201).json({ loggedIn: true, token: token });
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

app.post("/GetPayements", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "SELECT userId FROM tokens WHERE token= ?",
      req.body.token,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        if (rows.length === 1) {
          var userId = rows[0].userId;
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "SELECT payements.*, subscription.packageId, hasSubscribed.patientId as packagePatientId, isInAppointment.patientId as eventPatientId FROM payements LEFT JOIN subscription ON payements.subscriptionId = subscription.id LEFT JOIN hasSubscribed ON hasSubscribed.subscriptionId = subscription.id LEFT JOIN isInAppointment ON isInAppointment.id = payements.eventId WHERE payements.userId=? ORDER BY date DESC",
            userId,
            (err, rows) => {
              if (err) throw err;
              res.status(201).json({ success: true, data: rows });
            }
          );
          // we also update the time of the token
          updateTokenTime(connection, req.body.token);
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/GetPathologiesList", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "SELECT userId FROM tokens WHERE token= ?",
      req.body.token,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        if (rows.length === 1) {
          var userId = rows[0].userId;
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "SELECT pathologies.*, pathologyGroups.name FROM pathologies LEFT JOIN pathologyGroups ON pathologies.groupId = pathologyGroups.id WHERE pathologies.userId = ?",
            userId,
            (err, rows) => {
              if (err) throw err;
              res.status(201).json({ success: true, data: rows });
            }
          );
          // we also update the time of the token
          updateTokenTime(connection, req.body.token);
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/GetRelationshipsList", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "SELECT userId FROM tokens WHERE token= ?",
      req.body.token,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        if (rows.length === 1) {
          var userId = rows[0].userId;
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "SELECT * FROM relationships WHERE userId = ?",
            userId,
            (err, rows) => {
              if (err) throw err;
              res.status(201).json({ success: true, data: rows });
            }
          );
          // we also update the time of the token
          updateTokenTime(connection, req.body.token);
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/GetHistoricalData", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "SELECT userId FROM tokens WHERE token= ?",
      req.body.token,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        if (rows.length === 1) {
          var userId = rows[0].userId;
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "SELECT * FROM history WHERE userId = ?",
            userId,
            (err, rows) => {
              if (err) throw err;
              res.status(201).json({ success: true, data: rows });
            }
          );
          // we also update the time of the token
          updateTokenTime(connection, req.body.token);
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/UpdatePayement", (req, res, next) => {
  console.log(req.body);
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "SELECT * FROM tokens WHERE token= ?",
      req.body.token,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        if (rows.length === 1) {
          // Now connected and we have the user ID
          var userId = rows[0].userId;
          // so we do the update
          connection.query(
            "UPDATE payements SET method=?, amount=?, date=? WHERE id=? AND userId=?",
            [
              req.body.method,
              req.body.amount,
              req.body.date,
              req.body.id,
              userId,
            ],
            (err, result) => {
              if (err) throw err;
              res.status(201).json({ success: true, error: "" });
            }
          );
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/DeletePayement", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "SELECT * FROM tokens WHERE token= ?",
      req.body.token,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        if (rows.length === 1) {
          // Now connected and we have the user ID
          var userId = rows[0].userId;
          // so we do the update
          connection.query(
            "DELETE FROM payements WHERE id=? AND userId=? ",
            [req.body.id, userId],
            (err, result) => {
              if (err) throw err;
              res.status(201).json({ success: true, error: "" });
            }
          );
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/DeleteSubscription", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "SELECT * FROM tokens WHERE token= ?",
      req.body.token,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        if (rows.length === 1) {
          // Now connected and we have the user ID
          var userId = rows[0].userId;
          // so we do the update
          connection.query(
            "DELETE FROM hasSubscribed WHERE id=? AND userId=? AND patientId=? ",
            [req.body.id, userId, req.body.patientId],
            (err, result) => {
              if (err) throw err;
              res.status(201).json({ success: true, error: "" });
            }
          );
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/DeleteToken", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "DELETE FROM tokens WHERE token=?",
      req.body.token,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        res.status(201).json({ success: true });
      }
    );
  });
});

module.exports = app;
