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

////////////////
//   CREATE   //
////////////////

// ADD A NEW PATIENT WITH FULL DETAILS

app.post("/NewPatient", (req, res, next) => {
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
            "INSERT INTO patients(userId, firstname, lastname, birthday, sex, mobilephone, landline, email, address, city, country, comments, maritalStatus, numberOfChildren, job, GP, hobbies, SSNumber, healthInsurance, sentBy, hand) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              userId,
              req.body.firstname,
              req.body.lastname,
              req.body.birthday,
              req.body.sex,
              req.body.mobilephone,
              req.body.landline,
              req.body.email,
              req.body.address,
              req.body.city,
              req.body.country,
              req.body.comments,
              req.body.maritalStatus,
              req.body.numberOfChildren,
              req.body.job,
              req.body.GP,
              req.body.hobbies,
              req.body.SSNumber,
              req.body.healthInsurance,
              req.body.sentBy,
              req.body.hand,
            ],
            (err, result) => {
              if (err) throw err;

              // we finally get the id of the newly added patient an return it to our front end
              connection.query(
                "SELECT id FROM patients WHERE userId=? AND firstname=? AND lastname=? ORDER BY id DESC LIMIT 0,1",
                [userId, req.body.firstname, req.body.lastname],
                (err, result) => {
                  if (err) throw err;

                  res
                    .status(201)
                    .json({ success: true, error: "", id: result[0].id });
                }
              );
            }
          );
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

// ADDS A NEW PATIENT WITH FIRST NAME AND LAST NAME ONLY

app.post("/NewPatientSimplified", (req, res, next) => {
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
            "INSERT INTO patients(userId, firstname, lastname) VALUES (?,?,?)",
            [userId, req.body.firstname, req.body.lastname],
            (err, result) => {
              if (err) throw err;

              // we finally get the id of the newly added patient an return it to our front end
              connection.query(
                "SELECT id FROM patients WHERE userId=? AND firstname=? AND lastname=? ORDER BY id DESC LIMIT 0,1",
                [userId, req.body.firstname, req.body.lastname],
                (err, result) => {
                  if (err) throw err;

                  res
                    .status(201)
                    .json({ success: true, error: "", id: result[0].id });
                }
              );
            }
          );
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

// ADD A NEW APPOINTMENT

app.post("/NewEvent", (req, res, next) => {
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
          // belongs to that user
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "INSERT INTO appointments(userId, start, end, title, important, comments, idType) VALUES (?,?,?,?,?,?,?)",
            [
              userId,
              req.body.start,
              req.body.end,
              req.body.title,
              req.body.important,
              req.body.comments,
              req.body.idType,
            ],
            (err, result) => {
              if (err) throw err;
              connection.query(
                "SELECT id FROM appointments WHERE userId= ? ORDER BY id DESC LIMIT 0,1",
                userId,
                (err, rows) => {
                  if (err) throw err;
                  res
                    .status(201)
                    .json({ success: true, error: "", id: rows[0].id });
                }
              );
            }
          );
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

// ADD A NEW APPOINTMENT TYPE PARAMETER

app.post("/AddAppointmentType", (req, res, next) => {
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
          // belongs to that user
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "INSERT INTO appointmentTypes(type, userId, multi, color) VALUES (?,?,?,?)",
            [req.body.type, userId, req.body.multi, req.body.color],
            (err, result) => {
              if (err) throw err;
              connection.query(
                "SELECT id FROM appointmentTypes WHERE userId= ? ORDER BY id DESC LIMIT 0,1",
                userId,
                (err, rows) => {
                  if (err) throw err;
                  res
                    .status(201)
                    .json({ success: true, error: "", id: rows[0].id });
                }
              );
            }
          );
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

// ADD A NEW PATIENT TYPE PARAMETER

app.post("/AddPatientType", (req, res, next) => {
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
          // belongs to that user
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "INSERT INTO patientTypes(type, userId) VALUES (?,?)",
            [req.body.type, userId],
            (err, result) => {
              if (err) throw err;
              connection.query(
                "SELECT id FROM patientTypes WHERE userId= ? ORDER BY id DESC LIMIT 0,1",
                userId,
                (err, rows) => {
                  if (err) throw err;
                  res
                    .status(201)
                    .json({ success: true, error: "", id: rows[0].id });
                }
              );
            }
          );
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/AddPackage", (req, res, next) => {
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
          // belongs to that user
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "INSERT INTO packages(package, price, userId) VALUES (?,?,?)",
            [req.body.package, req.body.price, userId],
            (err, result) => {
              if (err) throw err;
              connection.query(
                "SELECT id FROM packages WHERE userId= ? ORDER BY id DESC LIMIT 0,1",
                userId,
                (err, rows) => {
                  if (err) throw err;
                  res
                    .status(201)
                    .json({ success: true, error: "", id: rows[0].id });
                }
              );
            }
          );
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/AddPriceSchemeRule", (req, res, next) => {
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
          // belongs to that user
          // Now connected and we have the user ID so we do the insert
          // but first we make sure there isn't already a rule with the same ids

          connection.query(
            "SELECT price FROM priceScheme WHERE userId=? AND packageId=? AND appointmentTypeId=? AND patientTypeId=?",
            [
              userId,
              req.body.packageId !== undefined ? req.body.packageId : 0,
              req.body.appointmentTypeId !== undefined
                ? req.body.appointmentTypeId
                : 0,
              req.body.patientTypeId !== undefined ? req.body.patientTypeId : 0,
            ],
            (err, result) => {
              if (err) throw err;

              console.log(result);
              if (result.length > 0) {
                res.status(201).json({
                  success: false,
                  error: "already exists",
                  price: result[0].price,
                });
              } else {
                connection.query(
                  "INSERT INTO priceScheme(userId,packageId, appointmentTypeId, patientTypeId, price) VALUES (?,?,?,?,?)",
                  [
                    userId,
                    req.body.packageId !== undefined ? req.body.packageId : 0,
                    req.body.appointmentTypeId !== undefined
                      ? req.body.appointmentTypeId
                      : 0,
                    req.body.patientTypeId !== undefined
                      ? req.body.patientTypeId
                      : 0,
                    req.body.price !== undefined ? req.body.price : 0,
                    ,
                  ],
                  (err, result) => {
                    if (err) throw err;
                    connection.query(
                      "SELECT id FROM priceScheme WHERE userId= ? ORDER BY id DESC LIMIT 0,1",
                      userId,
                      (err, rows) => {
                        if (err) throw err;
                        res
                          .status(201)
                          .json({ success: true, error: "", id: rows[0].id });
                      }
                    );
                  }
                );
              }
            }
          );
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

// ADD A NEW PARTICIPANT TO AN APPOINTMENT

app.post("/NewParticipant", (req, res, next) => {
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
            "SELECT * FROM appointments WHERE id = ? AND userId=?",
            [req.body.appointmentId, userId],
            (err, rows) => {
              if (err) throw err;
              if (rows.length === 1) {
                connection.query(
                  "INSERT INTO isInAppointment(patientId, appointmentId, size, weight, EVAbefore, EVAafter, reasonDetails, patientType, price, priceSetByUser) VALUES (?,?,?,?,?,?,?,?,?,?)",
                  [
                    req.body.patientId,
                    req.body.appointmentId,
                    req.body.size,
                    req.body.weight,
                    req.body.EVAbefore,
                    req.body.EVAafter,
                    req.body.reasonDetails,
                    req.body.patientType !== undefined
                      ? req.body.patientType
                      : 0,
                    req.body.price,
                    req.body.priceSetByUser,
                  ],
                  (err, result) => {
                    if (err) throw err;
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
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

//////////////
//   READ   //
//////////////

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

// LIST OF PATIENTS

app.post("/GetPatients", (req, res, next) => {
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
            "SELECT patients.*, subscription.packageId FROM patients LEFT JOIN hasSubscribed ON patients.id = hasSubscribed.patientId LEFT JOIN subscription ON hasSubscribed.subscriptionId = subscription.id WHERE patients.userId = 1",
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

// LIST OF APPOINTMENTS FOR ONE PARTICULAR PATIENT

app.post("/GetHistory", (req, res, next) => {
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
            "SELECT * FROM appointments LEFT JOIN isInAppointment ON appointments.id = isInAppointment.appointmentId WHERE userId = ? ORDER BY appointments.start DESC",
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

// LIST OF EVENTS BETWEEN TWO DATES (INCLUDED) // TO FINISH TO CODE

app.post("/GetEvents", (req, res, next) => {
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
          connection.query("SELECT * FROM appointments", (err, rows) => {
            if (err) throw err;
            res.status(201).json({ success: true, data: rows });
          });
          // we also update the time of the token
          updateTokenTime(connection, req.body.token);
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

// LIST OF ALL EVENTS

app.post("/GetAllEvents", (req, res, next) => {
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
          connection.query("SELECT * FROM appointments", (err, rows) => {
            if (err) throw err;
            res.status(201).json({ success: true, data: rows });
          });
          // we also update the time of the token
          updateTokenTime(connection, req.body.token);
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

// Get all config data

app.post("/GetConfigData", (req, res, next) => {
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
            "SELECT * FROM appointmentTypes WHERE userId=?",
            userId,
            (err, rows) => {
              if (err) throw err;

              var appointmentsTypes = rows;
              connection.query(
                "SELECT * FROM patientTypes WHERE userId=?",
                userId,
                (err, rows) => {
                  if (err) throw err;

                  var patientTypes = rows;
                  connection.query(
                    "SELECT * FROM packages WHERE userId=?",
                    userId,
                    (err, rows) => {
                      if (err) throw err;

                      var packages = rows;
                      connection.query(
                        "SELECT * FROM priceScheme WHERE userId=?",
                        userId,
                        (err, rows) => {
                          if (err) throw err;

                          var priceScheme = rows;
                          res.status(201).json({
                            success: true,
                            data: {
                              appointmentTypes: appointmentsTypes,
                              patientTypes: patientTypes,
                              packages: packages,
                              priceScheme: priceScheme,
                            },
                          });
                        }
                      );
                    }
                  );
                }
              );
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

// Get Latests Events

app.post("/GetLatestEvents", (req, res, next) => {
  console.log("test");
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
          // Now connected and we have the select
          connection.query(
            "SELECT patientId, max(start) as latest FROM isInAppointment LEFT JOIN appointments ON appointments.id = isInAppointment.appointmentId GROUP BY patientId",
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

function updateTokenTime(connection, token) {
  connection.query(
    "UPDATE tokens SET time=? WHERE token=?",
    [Date.now(), token],
    (err, rows) => {
      if (err) throw err;
    }
  );
}

async function doesTokenExist(connection, token) {
  console.log(token);
  connection.query("SELECT * FROM tokens WHERE token=?", token, (err, rows) => {
    if (err) throw err;
    console.log(rows.length);
    return rows.length > 0;
  });
}

//GET DETAILS OF ONE PARTICULAR EVENT

app.post("/GetEventDetails", (req, res, next) => {
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
          connection.query(
            "SELECT * FROM isInAppointment LEFT JOIN appointments ON isInAppointment.appointmentId = appointments.id RIGHT JOIN patients ON isInAppointment.patientId = patients.id WHERE appointments.id=? AND patients.userId=?",
            [req.body.id, userId],
            (err, rows) => {
              if (err) throw err;

              // we also update the time of the token
              updateTokenTime(connection, req.body.token);

              res.status(201).json({ success: true, data: rows });
            }
          );
        }
      }
    );
  });
});

////////////////
//   UPDATE   //
////////////////

app.post("/UpdatePatient", (req, res, next) => {
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
          // we first need to check that the patients corresponds to that user.
          connection.query(
            "SELECT * FROM patients WHERE id=? AND userId=?",
            [req.body.id, userId],
            (err, rows) => {
              if (rows.length === 1) {
                // so we do the update
                connection.query(
                  "UPDATE patients SET firstname=?, lastname=?, birthday=?, sex=?, mobilephone=?, landline=?, email=?, address=?, city=?, country=?,comments=?, maritalStatus=?,numberofChildren=?,job=?,GP=?,hobbies=?,SSNumber=?,healthInsurance=?,sentBy=?,hand=? WHERE id=?",
                  [
                    req.body.firstname,
                    req.body.lastname,
                    req.body.birthday,
                    req.body.sex,
                    req.body.mobilephone,
                    req.body.landline,
                    req.body.email,
                    req.body.address,
                    req.body.city,
                    req.body.country,
                    req.body.comments,
                    req.body.maritalStatus,
                    req.body.numberOfChildren,
                    req.body.job,
                    req.body.GP,
                    req.body.hobbies,
                    req.body.SSNumber,
                    req.body.healthInsurance,
                    req.body.sentBy,
                    req.body.hand,
                    req.body.id,
                  ],
                  (err, result) => {
                    if (err) throw err;
                    res
                      .status(201)
                      .json({ success: true, error: "", id: req.body.id });
                  }
                );
              } else {
                res.status(201).json({
                  success: false,
                  error: "user id and patient id don't match",
                });
              }
            }
          );
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/UpdateAppointmentType", (req, res, next) => {
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
            "UPDATE appointmentTypes SET type=?, multi=?, color=? WHERE id=? and userId=?",
            [
              req.body.type,
              req.body.multi,
              req.body.color,
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

app.post("/UpdatePrice", (req, res, next) => {
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

          // check that this appointments corresponds to the right userId
          connection.query(
            "SELECT * FROM isInAppointment LEFT JOIN appointments ON inInAppointment.appointmentId = appointments.id WHERE isInAppointment.id=? AND appointments.userId=?",
            [req.body.id, userId],
            (err, result) => {
              if (rows.length === 1) {
                connection.query(
                  "UPDATE isInAppointment SET price=?, priceSetByUser=? WHERE id=?",
                  [req.body.price, req.body.priceSetByUser, req.body.id],
                  (err, result) => {
                    if (err) throw err;
                    res.status(201).json({ success: true, error: "" });
                  }
                );
              } else {
                res.status(201).json({
                  success: false,
                  error: "isInAppointment id and user id do not match",
                });
              }
            }
          );
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/UpdatePriceSchemeRule", (req, res, next) => {
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
            "UPDATE priceScheme SET packageId=?, appointmentTypeId=?, patientTypeId=?, price=? WHERE id=? and userId=?",
            [
              req.body.packageId,
              req.body.appointmentTypeId,
              req.body.patientTypeId,
              req.body.price,
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

app.post("/UpdatePatientType", (req, res, next) => {
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
            "UPDATE patientTypes SET type=? WHERE id=? and userId=?",
            [req.body.type, req.body.id, userId],
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

app.post("/UpdatePackage", (req, res, next) => {
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
            "UPDATE packages SET package=?, price=? WHERE id=? and userId=?",
            [req.body.package, req.body.price, req.body.id, userId],
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

app.post("/UpdateEventTime", (req, res, next) => {
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
          connection.query(
            "SELECT * FROM appointments WHERE id = ? AND userId=?",
            [req.body.id, userId],
            (err, rows) => {
              if (err) throw err;
              if (rows.length === 1) {
                // so we do the update
                // Now connected and we have the user ID so we do the update
                connection.query(
                  "UPDATE appointments SET start=?, end=? WHERE id=?",
                  [req.body.start, req.body.end, req.body.id],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      res.status(201).json({ success: false, error: err });
                    } else {
                      res.status(201).json({ success: true, error: "" });
                    }
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
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/UpdateEvent", (req, res, next) => {
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
          connection.query(
            "SELECT * FROM appointments WHERE id = ? AND userId=?",
            [req.body.appointmentId, userId],
            (err, rows) => {
              if (err) throw err;
              if (rows.length === 1) {
                // so we do the update
                // Now connected and we have the user ID so we do the update
                connection.query(
                  "UPDATE appointments SET important =?, start=?, end=?, title=?, comments=?, idType=? WHERE id=?",
                  [
                    req.body.important,
                    req.body.start,
                    req.body.end,
                    req.body.title,
                    req.body.comments,
                    req.body.idType,
                    req.body.appointmentId,
                  ],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      res.status(201).json({ success: false, error: err });
                    } else {
                      res.status(201).json({ success: true, error: "" });
                    }
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
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

app.post("/UpdateParticipant", (req, res, next) => {
  console.log(req.body);
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
          connection.query(
            "SELECT * FROM appointments WHERE id = ? AND userId=?",
            [req.body.appointmentId, userId],
            (err, rows) => {
              if (err) throw err;
              if (rows.length === 1) {
                // so we do the update
                // Now connected and we have the user ID so we do the update
                connection.query(
                  "UPDATE isInAppointment SET size =?, weight=?, EVAbefore=?, EVAafter=?, reasonDetails=?, patientType=?, price=?, priceSetByUser=? WHERE appointmentId=? AND patientId=?",
                  [
                    req.body.size,
                    req.body.weight,
                    req.body.EVAbefore,
                    req.body.EVAafter,
                    req.body.reasonDetails,
                    req.body.patientType,
                    req.body.price,
                    req.body.priceSetByUser,
                    req.body.appointmentId,
                    req.body.patientId,
                  ],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      res.status(201).json({ success: false, error: err });
                    } else {
                      res.status(201).json({ success: true, error: "" });
                    }
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
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

////////////////
//   DELETE   //
////////////////

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

// DELETE EVENT

app.post("/DeleteEvent", (req, res, next) => {
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
          connection.query(
            "SELECT * FROM appointments WHERE id = ? AND userId=?",
            [req.body.id, userId],
            (err, rows) => {
              if (err) throw err;
              if (rows.length === 1) {
                // Now connected and we have the user ID so we do the update
                connection.query(
                  "DELETE FROM appointments WHERE id=?",
                  req.body.id,
                  (err, result) => {
                    if (err) throw err;
                    connection.query(
                      "DELETE FROM isInAppointment WHERE appointmentId=?",
                      req.body.id,
                      (err, result) => {
                        if (err) throw err;
                        res.status(201).json({ success: true, error: "" });
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
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

// CLEAR EVENT PARTICIPANTS

app.post("/DeleteAllParticipants", (req, res, next) => {
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
          connection.query(
            "SELECT * FROM appointments WHERE id = ? AND userId=?",
            [req.body.appointmentId, userId],
            (err, rows) => {
              if (err) throw err;
              if (rows.length === 1) {
                connection.query(
                  "DELETE FROM isInAppointment WHERE appointmentId=?",
                  [req.body.appointmentId],
                  (err, result) => {
                    if (err) throw err;
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
        } else {
          res.status(201).json({ success: false, error: "not connected" });
        }
      }
    );
  });
});

// DELETE APPOINTMENT TYPE PARAMETER

app.post("/DeleteAppointmentType", (req, res, next) => {
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
          // belongs to that user
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "DELETE FROM appointmentTypes WHERE userId=? AND id=?",
            [userId, req.body.id],
            (err, result) => {
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

// DELETE PRICE SCHEME RULE

app.post("/DeletePriceSchemeRule", (req, res, next) => {
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
          // belongs to that user
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "DELETE FROM priceScheme WHERE userId=? AND id=?",
            [userId, req.body.id],
            (err, result) => {
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

// DELETE PATIENT TYPE PARAMETER

app.post("/DeletePatientType", (req, res, next) => {
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
          // belongs to that user
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "DELETE FROM patientTypes WHERE userId=? AND id=?",
            [userId, req.body.id],
            (err, result) => {
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

app.post("/DeletePackage", (req, res, next) => {
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
          // belongs to that user
          // Now connected and we have the user ID so we do the insert
          connection.query(
            "DELETE FROM packages WHERE userId=? AND id=?",
            [userId, req.body.id],
            (err, result) => {
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

module.exports = app;
