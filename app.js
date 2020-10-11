// Modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('./queries');
const utils = require('./utils');
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
  const params = utils.prepareQueryParams(req.body);
  mysql.insertData(params).then((data) => {
    res.status(201);
    res.send(data);
  });
});

app.get('/week', (req, res) => {
  mysql.tasksOverWeek().then((data) => {
    mysql.pointsOverWeek().then((score) => {
      res.status(200);
      res.json([data, score]);
    });
  });
});

app.get('/month', (req, res) => {
  mysql.tasksOverMonth().then((data) => {
    mysql.pointsOverMonth().then((score) => {
      res.status(200);
      res.json([data, score]);
    });
  });
});

app.get('/start', (req, res) => {
  mysql.tasksOverStart().then((data) => {
    mysql.pointsOverStart().then((score) => {
      res.status(200);
      res.json([data, score]);
    });
  });
});

app.get('/tasks', (req, res) => {
 mysql.getTasks().then((data) => {
  res.status(200);
  res.json(data);
 });
});

app.get('/profils', (req, res) => {
 mysql.getProfils().then((data) => {
  res.status(200);
  res.json(data);
 });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
