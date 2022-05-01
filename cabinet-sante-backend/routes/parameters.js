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

router.post("/UpdateAppointmentType", (req, res, next) => {
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

router.post("/UpdatePriceSchemeRule", (req, res, next) => {
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

router.post("/UpdatePatientType", (req, res, next) => {
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

router.post("/UpdatePackage", (req, res, next) => {
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

router.post("/DeletePriceSchemeRule", (req, res, next) => {
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

router.post("/AddAppointmentType", (req, res, next) => {
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

router.post("/AddPatientType", (req, res, next) => {
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

router.post("/AddParameter", (req, res, next) => {
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
            "INSERT INTO parameters(name, value, userId) VALUES (?,?, ?)",
            [req.body.name, req.body.value, userId],
            (err, result) => {
              if (err) throw err;
              connection.query(
                "SELECT id FROM parameters WHERE userId= ? ORDER BY id DESC LIMIT 0,1",
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

router.post("/AddPackage", (req, res, next) => {
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

router.post("/AddPriceSchemeRule", (req, res, next) => {
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

// Get all config data

router.post("/GetConfigData", (req, res, next) => {
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
                          connection.query(
                            "SELECT * FROM parameters WHERE userId=?",
                            userId,
                            (err, rows) => {
                              if (err) throw err;

                              var parameters = rows;
                              res.status(201).json({
                                success: true,
                                data: {
                                  appointmentTypes: appointmentsTypes,
                                  patientTypes: patientTypes,
                                  packages: packages,
                                  priceScheme: priceScheme,
                                  parameters: parameters,
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

router.post("/UpdateParameter", (req, res, next) => {
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
            "UPDATE parameters SET value=? WHERE id=? and userId=?",
            [req.body.value, req.body.id, userId],
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

router.post("/UpdateParameterByName", (req, res, next) => {
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
            "UPDATE parameters SET value=? WHERE name=? and userId=?",
            [req.body.value, req.body.name, userId],
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

// DELETE APPOINTMENT TYPE PARAMETER

router.post("/DeleteAppointmentType", (req, res, next) => {
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

// DELETE PATIENT TYPE PARAMETER

router.post("/DeletePatientType", (req, res, next) => {
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

router.post("/DeleteParameter", (req, res, next) => {
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
            "DELETE FROM parameters WHERE userId=? AND id=?",
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

router.post("/DeletePackage", (req, res, next) => {
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

module.exports = router;
