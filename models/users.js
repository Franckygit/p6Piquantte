// Importe le module Mongoose
const mongoose = require('mongoose');
// ------------------------------------------------------

// Schéma décrivant un utilisateur
const userSchema = mongoose.Schema({
   email : {type: String, unique : true},
   password : String,
});
// ------------------------------------------------------

module.exports = mongoose.model('User', userSchema);