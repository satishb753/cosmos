const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const { pool } = require("../db/mysql");
const fs = require('fs');
const { authLog } = require("../log/authLog");

const loginUser = (req, res) => {
  const { email, password } = req.body;
  const token = jwt.sign({ email: email }, "SecretKey", (err, token) => {
    console.log(token);
    console.log("Token is parsed");
  });
  res.json({ email, password, token });
};

const signUpUser = (req, res) => {
  const { name, email, password } = req.body;
  authLog({name, email})

  console.log("name'", name, "'password'", password, "'email'", email,"'");
  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  pool.execute(
    'INSERT INTO `users` (`name`, `email`, `password`) VALUES (?, ?, ?)',
    [name, email, encryptedPassword],
    function (err, results, fields) {
      if(err && err.sqlState){
        let location = err.sqlState.search("Data too long for column");
        console.log(location);
        if(location>=0){
          console.log(err.sqlMessage);
        }
      }
      console.log(results);
      console.log(fields);
    }
  );

  let token;
  return new Promise((resolve, reject) => {
    token = jwt.sign({ email }, "sectretKey");
    if (token) {
      resolve(token);
      return res.json({ msg:"User successfully created.",token });
    } else {
      reject(token);
      return res.json({ token });
    }
  });
};

module.exports = { loginUser, signUpUser };