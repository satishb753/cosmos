const fs = require('fs')
const https = require('https')
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const { verify } = require('crypto');
const { fileURLToPath } = require('url');

require('dotenv').config();

const certificate = fs.readFileSync('./cert.pem');
const privateKey = fs.readFileSync('./key.pem');
const PORT = 8443;
const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
}

const AUTH_OPTIONS = {
  callbackURL:"/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))

const app = express();

app.use(helmet());
app.use(passport.initialize());


function checkLoggedIn(req, res, next) {
  const isLoggedIn = true;  //TODO
  if (!isLoggedIn)  {
    return res.status(401).json({
      error: 'You must log in!',
    })
  }
  next();
}

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log('Google Profile', profile);
  done(null, profile);
}

app.get('/auth/google', 
  passport.authenticate('google', {
    scope: ['email'],
  })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/',
    session:false,
  }), 
  (req, res) => {
    console.log("Google called back!")
  }
);

app.get('/auth/logout', (req, res) => {});

app.get('/secret', checkLoggedIn, (req, res) => {
  return res.status(200).json({
    message: 'You are past the Oauth client! Congrats!',
  })
})

app.get('/failure', (req, res) => {
  return res.send('Failed to log in!');
})

function delay(duration) {
  const startTime = Date.now();
  while(Date.now() - startTime < duration) {
    //event loop is blocked...
  }
}

app.get('/', (req, res) => {
  const options = {
    root: path.join(__dirname)
  }
  // res.send(`Performance example: ${process.pid}`);
  res.sendFile('/public/index.html',options, (err) => {
    if(err) next(err)
    else console.log("Sent: index.html")
  });
});

app.get('/timer', (req, res) => {
  delay(4000);
  res.send(`Beep beep beep! ${process.pid}`);
});

https.createServer({
  key: privateKey,
  cert: certificate
}, app).listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}`)
})
