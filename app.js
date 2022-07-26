// Importe les modules installés au préalable
const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const userRoutes = require("./routes/users")
const sauceRoutes = require("./routes/sauces")
const path = require("path")
require('dotenv').config()


const app = express();
app.use(express.json());
// ------------------------------------------------------------------------

// Pour se connecter à la BDD
mongoose
  .connect(process.env.MONGOOSE_CONNECT)
  .then(() => console.log("Connecté à MongoDB"))
  .catch(() => console.log("Échec de la connexion à MongoDB"));
// ------------------------------------------------------------------------

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// ------------------------------------------------------------------------

// Routes d'API
app.use("/api/auth",userRoutes);
app.use("/api/sauces",sauceRoutes);
app.use("/images",express.static(path.join(__dirname,"images"))); //chemin statique images
// -------------------------------------------------------------------------

module.exports = app;