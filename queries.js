// Modules
const mysql = require('mysql2/promise');

// Config
const { table, db } = require('./config.json');

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
    const query = await connection.query(`INSERT INTO ${table}(profil, tasks, date) VALUES ? `, [data]);
    await connection.end();
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
  try { // return all user profils
    const res = [];
    const connection = await getDbInstance();
    const [profils, fields] = await connection.execute('SELECT name from profils');
    profils.forEach((element) => {
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
    const res = [];
    const [rows, fields] = await connection.execute('SELECT task_name from tasks ORDER BY task_name ASC');
    await connection.end();
    rows.map((element) => {
      res.push(element.task_name);
    });
    return res;
  } catch (error) {
    console.log(`Error from getTasks function : ${error}`);
  }
}

async function tasksOverWeek() {
  try {
    const connection = await getDbInstance();
    const tasks = await getTasks();
    const res = [];
    for (const task of tasks) {
      const [row, field] = await connection.query(`SELECT profil, count(id) as nb from ${table} WHERE tasks LIKE ? AND date >= DATE(NOW()) - INTERVAL 7 DAY GROUP BY profil`, [task]);
      res.push({
        name: task,
        score: row,
      });
    }
    await connection.end();
    return res;
  } catch (error) {
    console.log(`Error from tasksOverWeek function : ${error}`);
  }
}

async function tasksOverMonth() {
  try {
    const connection = await getDbInstance();
    const tasks = await getTasks();
    const res = [];
    for (const task of tasks) {
      const [row, field] = await connection.query(`SELECT profil, count(id) as nb from ${table} WHERE tasks LIKE ? AND date >= DATE(NOW()) - INTERVAL 30 DAY GROUP BY profil`, [task]);
      res.push({
        name: task,
        score: row,
      });
    }
    await connection.end();
    return res;
  } catch (error) {
    console.log(`Error from tasksOverMonth function : ${error}`);
  }
}

async function tasksOverStart() {
  try {
    const connection = await getDbInstance();
    const tasks = await getTasks();
    const res = [];
    for (const task of tasks) {
      const [row, field] = await connection.query(`SELECT profil, count(id) as nb from ${table} WHERE tasks LIKE ? GROUP BY profil`, [task]);
      res.push({
        name: task,
        score: row,
      });
    }
    await connection.end();
    return res;
  } catch (error) {
    console.log(`Error from tasksOverSart function : ${error}`);
  }
}

async function pointsOverWeek() {
  try { // Points by profil over a week
    const profils = await getProfils();
    const connection = await getDbInstance();
    const res = [];
    for (const profil of profils) {
      const [row, field] = await connection.execute('SELECT IFNULL(SUM(tasks.points),0) as score FROM records INNER JOIN tasks ON records.tasks = tasks.task_name WHERE records.date >= DATE(NOW()) - INTERVAL 7 DAY AND records.profil = ?', [profil]);
      res.push(row[0].score);
    }
    await connection.end();
    return res;
  } catch (error) {
    console.log(`Error from pointsOverWeek function : ${error}`);
  }
}

async function pointsOverMonth() {
  try {
    const profils = await getProfils();
    const connection = await getDbInstance();
    const res = [];
    for (const profil of profils) {
      const [row, field] = await connection.execute('SELECT IFNULL(SUM(tasks.points),0) as score FROM records INNER JOIN tasks ON records.tasks = tasks.task_name WHERE records.date >= DATE(NOW()) - INTERVAL 30 DAY AND records.profil = ?', [profil]);
      res.push(row[0].score);
    }
    await connection.end();
    return res;
  } catch (error) {
    console.log(`Error from pointsOverMonth function : ${error}`);
  }
}

async function pointsOverStart() {
  try {
    const profils = await getProfils();
    const connection = await getDbInstance();
    const res = [];
    for (const profil of profils) {
      const [row, field] = await connection.execute('SELECT IFNULL(SUM(tasks.points),0) as score FROM records INNER JOIN tasks ON records.tasks = tasks.task_name WHERE records.profil = ?', [profil]);
      res.push(row[0].score);
    }
    await connection.end();
    return res;
  } catch (error) {
    console.log(`Error from pointsOverStart function : ${error}`);
  }
}

async function deleteProfil(id) {
  try {
    const connection = await getDbInstance();
    return await connection.query('DELETE FROM profils WHERE id = ?;', [id]);
  } catch (error) {
    console.log(`Error from deleteProfile function : ${error}`);
  }
}

async function createProfil(name) {
  try {
    const connection = await getDbInstance();
    return await connection.query('INSERT INTO profils (name) VALUES (?);', [name]);
  } catch (error) {
    console.log(`Error from deleteProfile function : ${error}`);
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
  deleteProfil,
  createProfil,
};
