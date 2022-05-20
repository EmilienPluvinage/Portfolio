const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const crypto = require("crypto");

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

// ADD A NEW PATIENT WITH FULL DETAILS

router.post("/NewPatient", (req, res, next) => {
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

router.post("/NewPatientSimplified", (req, res, next) => {
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

// ADDS A NEW RELATIVE
router.post("/NewRelative", (req, res, next) => {
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
            "INSERT INTO IsRelatedWith(userId, patientId, childId, relationshipId) VALUES (?,?,?,?)",
            [
              userId,
              req.body.patientId,
              req.body.childId,
              req.body.relationshipId,
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

router.post("/LinkPatients", (req, res, next) => {
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
          // Now connected and we have the user ID so we do the insert, but we check that it doesn't already exist
          connection.query(
            "SELECT * FROM sharedBalance WHERE ((patientId1=? AND patientId2=?) OR (patientId1=? AND patientId2=?)) AND userId=?",
            [
              req.body.patientId1,
              req.body.patientId2,
              req.body.patientId2,
              req.body.patientId1,
              userId,
            ],
            (err, result) => {
              if (err) throw err;
              if (result.length === 0) {
                connection.query(
                  "INSERT INTO sharedBalance(userId,patientId1,patientId2) VALUES(?,?,?)",
                  [userId, req.body.patientId1, req.body.patientId2],
                  (err, rows) => {
                    if (err) throw err;
                    res.status(201).json({ success: true, error: "" });
                  }
                );
              } else {
                res.status(201).json({
                  success: false,
                  error: "Ces deux patients sont déjà liés.",
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

router.post("/GetPatients", (req, res, next) => {
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
            "SELECT patients.* FROM patients WHERE patients.userId = ?",
            userId,
            (err, rows) => {
              if (err) throw err;

              // we also need to get the latest package id and merge it with rows
              connection.query(
                "SELECT subscription.packageId, subscription.date, hasSubscribed.patientId FROM subscription LEFT JOIN hasSubscribed ON hasSubscribed.subscriptionId = subscription.id WHERE hasSubscribed.userId = ? ORDER BY subscription.date DESC",
                userId,
                (err, result) => {
                  if (err) throw err;

                  // now we need to go through rows, and for each rows, add a field "packageId" with the latest packageId from result
                  rows.forEach((element) => {
                    element.packageId = result.find(
                      (package) => package.patientId === element.id
                    )?.packageId;
                  });
                  res.status(201).json({ success: true, data: rows });
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

router.post("/GetSharedBalance", (req, res, next) => {
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
            "SELECT * FROM sharedBalance WHERE userId=?",
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

router.post("/UpdatePatient", (req, res, next) => {
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

// DELETE A PATIENT AND ALL ITS DATA

router.post("/DeletePatient", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "SELECT userId, password, salt FROM `tokens` LEFT JOIN users ON users.id = tokens.userId WHERE token=?",
      req.body.token,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        if (rows.length === 1) {
          // we check the password
          const userId = rows[0].userId;
          var userPwd = rows[0].password;
          var userSalt = rows[0].salt;
          var hash = crypto
            .pbkdf2Sync(req.body.password, userSalt, 1000, 64, `sha512`)
            .toString(`hex`);
          if (userPwd === hash) {
            // right password
            connection.query(
              "SELECT * FROM patients WHERE id = ? AND userId=?",
              [req.body.id, userId],
              (err, rows) => {
                if (err) throw err;
                if (rows.length === 1) {
                  // Now we start deleting
                  connection.query(
                    "DELETE FROM sharedBalance WHERE patientId1=? OR patientId2=?",
                    [req.body.id, req.body.id],
                    (err, result) => {
                      if (err) throw err;
                      connection.query(
                        "UPDATE payements SET patientId=0 WHERE patientId=?",
                        [req.body.id],
                        (err, result) => {
                          if (err) throw err;
                          connection.query(
                            "DELETE FROM isInAppointment  WHERE patientId=?",
                            [req.body.id],
                            (err, result) => {
                              if (err) throw err;
                              connection.query(
                                "DELETE FROM hasSubscribed WHERE patientId=?",
                                [req.body.id],
                                (err, result) => {
                                  if (err) throw err;
                                  connection.query(
                                    "DELETE FROM patients WHERE id=?",
                                    [req.body.id],
                                    (err, result) => {
                                      if (err) throw err;
                                      res.status(201).json({
                                        success: true,
                                        error: "",
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
                } else {
                  res.status(201).json({
                    success: false,
                    error: "userId and patientId do not match",
                  });
                }
              }
            );
          } else {
            res
              .status(201)
              .json({ success: false, error: "Mot de passe incorrect." });
          }
        } else {
          res.status(201).json({ success: false, error: "User not connected" });
        }
      }
    );
  });
});

router.post("/DelinkPatients", (req, res, next) => {
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
            "DELETE FROM sharedBalance WHERE ((patientId1=? AND patientId2=?) OR (patientId1=? AND patientId2=?)) AND userId=?",
            [
              req.body.patientId1,
              req.body.patientId2,
              req.body.patientId2,
              req.body.patientId1,
              userId,
            ],
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
