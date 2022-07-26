const { passwordStrength } = require('check-password-strength')


module.exports = (req, res, next) => {
  const password_strength = passwordStrength(req.body.password)

  if (password_strength.id < 2){
    res.status(411).json({message: "Votre mot de passe doit contenir: minuscules/majuscules, chiffres, symboles sur 8 caractères minimum. "})
  } else{
    next()
  }}