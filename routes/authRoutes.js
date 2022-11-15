const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const { loginUser, signUpUser } = require("../controllers/authController");
const { validateSignUpInput } = require("../validate/authValidators");

// const signUpUser = require('../controllers/authController')

router.post("/login", loginUser);
router.post(
  "/signup",
  [
    check("email").isEmpty().trim().normalizeEmail().isEmail(),
    check("password").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }).withMessage('Please select a strong password.'),
    check("name").isAlpha(),
  ],
  // validateSignUpInput,
  signUpUser
);

module.exports = router;
