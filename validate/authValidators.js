const {check, body, validationResult} = require('express-validator');
const validator = require('validator');

const validateSignUpInput = (req, res, next) => {
  let { email, password } = req.body
  email = check("email").normalizeEmail()
  if( validator.isEmail(email) )
  {
    console.log("Email is: ", email);
  }
  next();
}

module.exports = { validateSignUpInput }