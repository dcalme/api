// Modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('./queries');
const { port } = require('./config');

// Set-up express app
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.disable('x-powered-by');

app.get('/', (req, res) => { // Index Page
  mysql.getIndex().then((data) => {
    res.status(200);
    res.json(data);
  });
});

app.post('/', (req, res) => { // Insert Task
  console.log(req.body);
  mysql.insertData(req.body).then((data) => {
    console.log(data);
    res.status(201);
    res.send('Ok');
  });
});

app.get('/week', (req, res) => {
  mysql.tasksOverPeriod('week').then((data) => {
    console.log(data);
    res.status(200);
    res.json(data);
  });
});

app.get('/month', (req, res) => {
  mysql.getMonth().then((data) => {
    console.log(data);
    res.status(200);
    res.send('Ok');
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
