const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/users")

//On sécurise le mdp en le hachant avec bcrypt
exports.signup = (req,res,next) =>{
    const { email, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
      const user = new User({ email: req.body.email, password: hash });
      user.save();
      return res.status(201).json({ message: "La création de votre compte est une réussite." });
    });
  }
  exports.login =  (req,res,next) => {
    const { email, password } = req.body;
    User.findOne({ email: req.body.email })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((valid) => {
            
  //Si accepté, on donne un token en choisissant son expiration
            return res.status(201).json({
              message: "Connecté",
              userId: user._id,
              token: jwt.sign({ userId: user._id }, process.env.SECRETKEY, {
                expiresIn: "24h",
              }),
            });
          })
          .catch((err) => res.status(401).json({ message: "Unauthorized", err }));
      })
      .catch(() => res.status(404).send("Not found"));
      
  }