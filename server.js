const fs = require('fs')
const https = require('https')
const express = require('express');
const path = require('path')

const certificate = fs.readFileSync('./cert.pem');
const privateKey = fs.readFileSync('./key.pem');

const app = express();
const PORT = 8443;

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
