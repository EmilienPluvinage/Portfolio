require("dotenv").config();

const express = require("express");
var mongoose = require("mongoose");
var nodemailer = require("nodemailer");

const User = require("./models/users");
const Item = require("./models/items");
const Receipt = require("./models/receipts");
const Contact = require("./models/contacts");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "emilien.pluvinage@gmail.com",
    pass: process.env.GMAIL_PWD,
  },
});

const app = express();
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.MONGODB_PWD +
      "@" +
      process.env.MONGODB_CLUSTER +
      ".iszrn.mongodb.net/" +
      process.env.MONGODB_COLLECTION +
      "?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_DOMAIN);
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

////////////////
//   CREATE   //
////////////////

app.post("/Staff/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    const user = new User({
      ...req.body,
    });
    user
      .save()
      .then(() => res.status(201).json({ message: "Utilisateur enregistré !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

app.post("/Receipt/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    const receipt = new Receipt({
      ...req.body,
    });
    receipt
      .save()
      .then(() => res.status(201).json({ message: "Utilisateur enregistré !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

app.post("/Item/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    const item = new Item({
      ...req.body,
    });
    item
      .save()
      .then(() => res.status(201).json({ message: "Objet enregistré !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

app.post("/Email/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    var mailOptions = {
      from: req.body.address,
      to: req.body.address,
      subject: req.body.subject,
      text: req.body.textcontent,
      html: req.body.htmlcontent,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(400).json({ error });
      } else {
        res.status(201).json({ message: "E-mail envoyé !" });
      }
    });
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

//////////////
//   READ   //
//////////////

app.get("/Staff/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    User.find()
      .then((users) => res.status(200).json(users))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

app.get("/Items/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    Item.find()
      .then((items) => res.status(200).json(items))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

app.get("/Contact/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    Contact.find()
      .then((items) => res.status(200).json(items))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

app.get("/Receipts/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    Receipt.find()
      .then((receipts) => res.status(200).json(receipts))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

////////////////
//   UPDATE   //
////////////////

app.put("/Staff/:id/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: "Utilisateur modifié !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

app.put("/Contact/:id/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    Contact.updateOne(
      { _id: req.params.id },
      { ...req.body, _id: req.params.id }
    )
      .then(() =>
        res.status(200).json({ message: "Données de contact modifié !" })
      )
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

app.put("/Item/:id/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    Item.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: "Objet modifié !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

app.put("/Category/Update/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    Item.updateMany(
      { category: req.body.oldCategory },
      { category: req.body.newCategory }
    )
      .then(() => res.status(200).json({ message: "Catégorie modifiée !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

app.put("/Receipt/Payement/:id/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    Receipt.updateOne({ _id: req.params.id }, { payement: req.body.payement })
      .then(() => res.status(200).json({ message: "Ticket modifié !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

////////////////
//   DELETE   //
////////////////

app.delete("/Staff-:id/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    User.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "User removed !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

app.delete("/Item-:id/:key", (req, res, next) => {
  if (req.params.key === process.env.API_KEY) {
    Item.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "Item removed !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error: "Incorrect Key" });
  }
});

module.exports = app;
