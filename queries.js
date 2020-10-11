// const mysql = require('mysql2');
const mysql = require('mysql2/promise');
const { db } = require('./config.json');

const table = 'dev_records';

async function getDbInstance() {
  try {
    return await mysql.createConnection({
      host: db.host,
      user: db.user,
      password: db.password,
      database: db.database,
    });
  } catch (error) {
    console.error(`Error getDbInstance function ${error.message}`);
    return false;
  }
}

// Insert task checked
async function insertData(data) {
  try {
    const connection = await getDbInstance();
    const query = await connection.query('INSERT INTO dev_records(profil, tasks, date) VALUES ? ',[value]);
    return query;
  } catch (error) {
    console.log('Error from insertData', error);
  }
}

async function getIndex() { // Get all tasks + last time and who made it
  try {
    const connection = await getDbInstance();
    const [rows, fields] = await connection.execute('SELECT task_name, profil, svg, DATE_FORMAT(date, "%d/%c/%Y") as date FROM `tasks` ORDER BY task_name ASC');
    await connection.end();
    return rows;
  } catch (error) {
    console.log('Error from lastTime function', error);
    return false;
  }
}

async function getProfils() {
  try { // return all profils
    let res = []
    const connection = await getDbInstance();
    const [profils, fields] = await connection.execute("SELECT name from profils");
    profils.forEach(element => {
      res.push(element.name);
    });
    await connection.end();
    return res;
  } catch (error) {
    console.log(`Error from getProfils function : ${error}`);
  }
}

async function getTasks() {
  try {
    const connection = await getDbInstance();
    let res = [];
    const [rows, fields] = await connection.execute("SELECT task_name from tasks ORDER BY task_name ASC");
    await connection.end();
    rows.map(element => {
      res.push(element.task_name);
    });
    return res;
  } catch(error) {
    console.log(`Error from getTasks function : ${error}`);
  }
}

async function tasksOverWeek() { 
  try {
    const connection = await getDbInstance();
    const tasks = await getTasks();
    let res = [];
    for (const task of tasks) {
      const [row, field] = await connection.query("SELECT profil, count(id) as nb from records WHERE tasks LIKE ? AND date >= DATE(NOW()) - INTERVAL 7 DAY GROUP BY profil", [task]);
      res.push({
        name: task,
        score: row,
      });
    }    
    return res;
  }
  catch(error) {
    console.log(`Error from tasksOverWeek function : ${error}`)
  }
}

async function tasksOverMonth() { 
  try {
    const connection = await getDbInstance();
    const tasks = await getTasks();
    let res = [];
    for (const task of tasks) {
      const [row, field] = await connection.query("SELECT profil, count(id) as nb from records WHERE tasks LIKE ? AND date >= DATE(NOW()) - INTERVAL 30 DAY GROUP BY profil", [task]);
      res.push({
        name: task,
        score: row,
      });
    }    
    return res;
  }
  catch(error) {
    console.log(`Error from tasksOverMonth function : ${error}`)
  }
}

async function tasksOverStart() { 
  try {
    const connection = await getDbInstance();
    const tasks = await getTasks();
    let res = [];
    for (const task of tasks) {
      const [row, field] = await connection.query("SELECT profil, count(id) as nb from records WHERE tasks LIKE ? GROUP BY profil", [task]);
      res.push({
        name: task,
        score: row,
      });
    }    
    return res;
  }
  catch(error) {
    console.log(`Error from tasksOverSart function : ${error}`)
  }
}

async function pointsOverWeek() {
  try { // Points by profil over a week
    const profils = await getProfils();
    const connection = await getDbInstance();
    let res = [];
    for(const profil of profils) {
      let [score, fields] = await connection.execute("SELECT IFNULL(SUM(tasks.points),0) as score FROM records INNER JOIN tasks ON records.tasks = tasks.task_name WHERE records.date >= DATE(NOW()) - INTERVAL 7 DAY AND records.profil = ?", [profil]);
      res.push(score);
    }
    return res;
  }
  catch(error) {
    console.log(`Error from pointsOverWeek function : ${error}`)
  }
}

async function pointsOverMonth() {
  try { 
    const profils = await getProfils();
    const connection = await getDbInstance();
    let res = [];
    for(const profil of profils) {
      let [score, fields] = await connection.execute("SELECT IFNULL(SUM(tasks.points),0) as score FROM records INNER JOIN tasks ON records.tasks = tasks.task_name WHERE records.date >= DATE(NOW()) - INTERVAL 30 DAY AND records.profil = ?", [profil]);
      res.push(score);
    }
    return res;
  }
  catch(error) {
    console.log(`Error from pointsOverMonth function : ${error}`)
  }
}

async function pointsOverStart() {
  try {
    const profils = await getProfils();
    const connection = await getDbInstance();
    let res = [];
    for(const profil of profils) {
      let [score, fields] = await connection.execute("SELECT IFNULL(SUM(tasks.points),0) as score FROM records INNER JOIN tasks ON records.tasks = tasks.task_name WHERE records.profil = ?", [profil]);
      res.push(score);
    }
    return res;
  }
  catch(error) {
    console.log(`Error from pointsOverStart function : ${error}`)
  }
}

module.exports = {
  insertData,
  getIndex,
  tasksOverWeek,
  pointsOverWeek,
  tasksOverMonth,
  pointsOverMonth,
  tasksOverStart,
  pointsOverStart,
  getTasks,
  getProfils,

};
