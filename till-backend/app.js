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

////////////////
//   CREATE   //
////////////////

app.post("/Staff", (req, res, next) => {
  const user = new User({
    ...req.body,
  });
  user
    .save()
    .then(() => res.status(201).json({ message: "Utilisateur enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.post("/Receipt", (req, res, next) => {
  const receipt = new Receipt({
    ...req.body,
  });
  receipt
    .save()
    .then(() => res.status(201).json({ message: "Utilisateur enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.post("/Item", (req, res, next) => {
  const item = new Item({
    ...req.body,
  });
  item
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.post("/Email", (req, res, next) => {
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
});

//////////////
//   READ   //
//////////////

app.get("/Staff", (req, res, next) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/Staff-:name", (req, res, next) => {
  User.findOne({ name: req.params.name })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
});

app.get("/Items", (req, res, next) => {
  Item.find()
    .then((items) => res.status(200).json(items))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/Contact", (req, res, next) => {
  Contact.find()
    .then((items) => res.status(200).json(items))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/Receipts", (req, res, next) => {
  Receipt.find()
    .then((receipts) => res.status(200).json(receipts))
    .catch((error) => res.status(400).json({ error }));
});

////////////////
//   UPDATE   //
////////////////

app.put("/Staff/:id", (req, res, next) => {
  User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Utilisateur modifié !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.put("/Contact/:id", (req, res, next) => {
  Contact.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() =>
      res.status(200).json({ message: "Données de contact modifié !" })
    )
    .catch((error) => res.status(400).json({ error }));
});

app.put("/Item/:id", (req, res, next) => {
  Item.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.put("/Category/Update", (req, res, next) => {
  Item.updateMany(
    { category: req.body.oldCategory },
    { category: req.body.newCategory }
  )
    .then(() => res.status(200).json({ message: "Catégorie modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.put("/Receipt/Payement/:id", (req, res, next) => {
  Receipt.updateOne({ _id: req.params.id }, { payement: req.body.payement })
    .then(() => res.status(200).json({ message: "Ticket modifié !" }))
    .catch((error) => res.status(400).json({ error }));
});

////////////////
//   DELETE   //
////////////////

app.delete("/Staff-:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "User removed !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.delete("/Item-:id", (req, res, next) => {
  Item.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "User removed !" }))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
