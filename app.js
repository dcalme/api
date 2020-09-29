// Modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./queries');

// Set-up express app
const app = express();
app.use(bodyParser.json());
app.disable('x-powered-by');

app.get('/', (req, res) => { // Index Page
  mysql.getIndex().then((data) => {
    res.status(200);
    res.json(data);
  });
});

app.post('/lol', (req, res) => {
  // console.log(Object.keys(req));
  // console.log(req.headers);
  // console.log(req.body);
  res.status(201);
  res.send('Ok');
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${3000}`);
});
