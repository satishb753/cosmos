const fs = require('fs')
const https = require('https')
const express = require('express');
const path = require('path');
const helmet = require('helmet');

const certificate = fs.readFileSync('./cert.pem');
const privateKey = fs.readFileSync('./key.pem');
const PORT = 8443;

const app = express();
app.use(helmet());

const config = {
  CLIENT_ID: '468398194208-f9bebfbmp57e1e6g5g4232aschivhsa5.apps.googleusercontent.com',
  CLIENT_SECRET: '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',
}

function checkLoggedIn(req, res, next) {
  const isLoggedIn = true;  //TODO
  if (!isLoggedIn)  {
    return res.status(401).json({
      error: 'You must log in!',
    })
  }
  next();
}

app.get('/auth/google', (req, res) => {});

app.get('/auth/google/callback', (req, res) => {});

app.get('/auth/logout', (req, res) => {});

app.get('/secret', checkLoggedIn, (req, res) => {
  return res.status(200).json({
    message: 'You are past the Oauth client! Congrats!',
  })
})

function delay(duration) {
  const startTime = Date.now();
  while(Date.now() - startTime < duration) {
    //event loop is blocked...
  }
}

app.get('/', (req, res) => {
  res.send(`Performance example: ${process.pid}`);
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
