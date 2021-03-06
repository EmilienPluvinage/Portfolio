const express = require("express");
const router = express.Router();
const mysql = require("mysql");

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

router.post("/DeleteEvent", (req, res, next) => {
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

router.post("/DeleteAllParticipants", (req, res, next) => {
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
                    connection.query(
                      "DELETE FROM isNotInAppointment WHERE appointmentId=?",
                      [req.body.appointmentId],
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

router.post("/UpdateEventTime", (req, res, next) => {
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

router.post("/UpdateEvent", (req, res, next) => {
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
                    new Date(req.body.start),
                    new Date(req.body.end),
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

router.post("/DuplicateEvent", (req, res, next) => {
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
                // so we do the duplicate
                // Now connected and we have the user ID so we do the update
                connection.query(
                  "INSERT INTO appointments(userId, important, idType, start, end) VALUES(?,?,?,?,?)",
                  [
                    userId,
                    rows[0].important,
                    rows[0].idType,
                    req.body.start,
                    req.body.end,
                  ],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      res.status(201).json({ success: false, error: err });
                    } else {
                      // we get the appointment id
                      connection.query(
                        "SELECT id FROM appointments WHERE userId=? ORDER BY id DESC LIMIT 0,1",
                        userId,
                        (err, result) => {
                          if (err) throw err;
                          var newAppointmentId = result[0].id;

                          // We we get the values from isInAppointment (on the old appointment id)
                          connection.query(
                            "SELECT * FROM isInAppointment WHERE appointmentId = ?",
                            req.body.appointmentId,
                            (err, result) => {
                              if (err) throw err;

                              // we go through all of them and duplicate them one by one
                              for (let i = 0; i < result.length; i++) {
                                let origin = result[i];
                                connection.query(
                                  "INSERT INTO isInAppointment(patientId, appointmentId, size, weight, patientType, price, priceSetByUser) VALUES(?,?,?,?,?,?,?)",
                                  [
                                    origin.patientId,
                                    newAppointmentId,
                                    origin.size,
                                    origin.weight,
                                    origin.patientType,
                                    origin.price,
                                    origin.priceSetByUser,
                                  ],
                                  (err, rows) => {
                                    if (err) throw err;
                                  }
                                );
                              }
                              // all done
                            }
                          );
                          res.status(201).json({ success: true, error: "" });
                        }
                      );
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

router.post("/UpdateParticipant", (req, res, next) => {
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
                  "UPDATE isInAppointment SET size =?, weight=?, EVAbefore=?, EVAafter=?, reasonDetails=?, tests=?, treatment=?, remarks=?, drawing=?, patientType=?, price=?, priceSetByUser=?, payed=? WHERE appointmentId=? AND patientId=?",
                  [
                    req.body.size,
                    req.body.weight,
                    req.body.EVAbefore,
                    req.body.EVAafter,
                    req.body.reasonDetails,
                    req.body.tests,
                    req.body.treatment,
                    req.body.remarks,
                    req.body.drawing,
                    req.body.patientType,
                    req.body.price,
                    req.body.priceSetByUser,
                    req.body.payed !== undefined ? req.body.payed : 0,
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

router.post("/UpdatePrice", (req, res, next) => {
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
          let table = req.body.missed
            ? "isNotInAppointment"
            : "isInAppointment";
          connection.query(
            `SELECT * FROM ${table} LEFT JOIN appointments ON ${table}.appointmentId = appointments.id WHERE ${table}.id=? AND appointments.userId=?`,
            [req.body.id, userId],
            (err, result) => {
              if (rows.length === 1) {
                connection.query(
                  `UPDATE ${table} SET price=?, priceSetByUser=? WHERE id=?`,
                  [req.body.price, req.body.priceSetByUser, req.body.id],
                  (err, result) => {
                    if (err) throw err;
                    res.status(201).json({ success: true, error: "" });
                  }
                );
              } else {
                res.status(201).json({
                  success: false,
                  error: `${table} id and user id do not match`,
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

// Update the payed status

router.post("/UpdatePayed", (req, res, next) => {
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
          // Now connected and we have the user ID`
          var userId = rows[0].userId;
          let table = "";
          if (req.body.missed) {
            table = "isNotInAppointment";
          } else {
            table = "isInAppointment";
          }
          connection.query(
            `UPDATE ${table} SET payed=? WHERE appointmentId=? AND patientId=?`,
            [req.body.payed, req.body.id, req.body.patientId],
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

// ADD A NEW APPOINTMENT

router.post("/NewEvent", (req, res, next) => {
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
              new Date(req.body.start),
              new Date(req.body.end),
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

// ADD A NEW PARTICIPANT TO AN APPOINTMENT

router.post("/NewParticipant", (req, res, next) => {
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
                  "INSERT INTO isInAppointment(patientId, appointmentId, size, weight, EVAbefore, EVAafter, reasonDetails, tests, treatment, remarks, drawing, patientType, price, priceSetByUser, payed) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?)",
                  [
                    req.body.patientId,
                    req.body.appointmentId,
                    req.body.size,
                    req.body.weight,
                    req.body.EVAbefore,
                    req.body.EVAafter,
                    req.body.reasonDetails,
                    req.body.tests,
                    req.body.treatment,
                    req.body.remarks,
                    req.body.drawing,
                    req.body.patientType !== undefined
                      ? req.body.patientType
                      : 0,
                    req.body.price,
                    req.body.priceSetByUser,
                    req.body.payed !== undefined ? req.body.payed : 0,
                  ],
                  (err, result) => {
                    if (err) throw err;

                    connection.query(
                      "SELECT id FROM isInAppointment WHERE patientId=? AND appointmentId=? ORDER BY id LIMIT 0,1",
                      [req.body.patientId, req.body.appointmentId],
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

// ADD A LIST OF PARTICIPANTS TO AN APPOINTMENT

router.post("/NewListOfParticipants", (req, res, next) => {
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
                for (let i = 0; i < req.body.patientId.length; i++) {
                  connection.query(
                    "INSERT INTO isInAppointment(patientId, appointmentId, size, weight, EVAbefore, EVAafter, reasonDetails, tests, treatment, remarks, drawing, patientType, price, priceSetByUser, payed) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                      req.body.patientId[i],
                      req.body.appointmentId,
                      0,
                      0,
                      0,
                      0,
                      "",
                      "",
                      "",
                      "",
                      "",
                      0,
                      req.body.price[i],
                      false,
                      0,
                    ],
                    (err, result) => {
                      if (err) throw err;
                    }
                  );
                }
                res.status(201).json({
                  success: true,
                  error: "",
                });
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

// ADD A NEW ABSENT PARTICIPANT TO AN APPOINTMENT

router.post("/NewAbsent", (req, res, next) => {
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
                  "INSERT INTO isNotInAppointment(userId, patientId, appointmentId, price, priceSetByUser, payed) VALUES (?,?,?,?,?,?)",
                  [
                    userId,
                    req.body.patientId,
                    req.body.appointmentId,
                    req.body.price,
                    req.body.priceSetByUser,
                    req.body.payed !== undefined ? req.body.payed : 0,
                  ],
                  (err, result) => {
                    if (err) throw err;

                    connection.query(
                      "SELECT id FROM isNotInAppointment WHERE patientId=? AND appointmentId=? ORDER BY id LIMIT 0,1",
                      [req.body.patientId, req.body.appointmentId],
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

// LIST OF APPOINTMENTS FOR ONE PARTICULAR PATIENT

router.post("/GetHistory", (req, res, next) => {
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

// missed appointment history

router.post("/GetMissedAppointments", (req, res, next) => {
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
            "SELECT * FROM appointments LEFT JOIN isNotInAppointment ON appointments.id = isNotInAppointment.appointmentId WHERE appointments.userId = ? ORDER BY appointments.start DESC",
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

router.post("/GetEvents", (req, res, next) => {
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

module.exports = router;
