// const mysql = require('mysql2');
const mysql = require('mysql2/promise');
const mysql2 = require('mysql2');
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

async function getRegularDbInstance() {
  try {
    const connection = mysql2.createConnection({
      host: db.host,
      user: db.user,
      password: db.password,
      database: db.database,
    });
    return connection;
  } catch (error) {
    console.error(`Error getRegularDbInstance function ${error.message}`);
  }
}


function getCurrentDay() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

// Insert task checked
async function insertData(data) {
  try {
    const connection = await getDbInstance();
    const { task, profil } = data;
    let value = [];
    for (let i = 0; i < task.length; i++) {
      value.push([profil, task[i], getCurrentDay()]);
    }
    console.log(value);
    const query = await connection.query('INSERT INTO dev_records(profil, tasks, date) VALUES ? ',[value]);
    console.log(query);
    return query;
  } catch (error) {
    console.log('Error from insertData', error);
  }
}

async function updateTask(data) {
  try {
    // Update records.tasks (last time & profil)
    const connection = await getDbInstance();
    await connection.execute('UPDATE `tasks` SET date = CURDATE(), profil = ? WHERE task_name = ?', [data.profil, data.task]);
    await connection.end();
  } catch (error) {
    console.log('Error from updateTask function', error);
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


async function tasksOverPeriod(period) {
  try { // every tasks group by profil
    const connection = await getDbInstance();
    const [tasks] = await connection.execute('SELECT task_name as value FROM tasks ORDER BY task_name ASC');
    let obj = {};
    for(let i = 0; i < tasks.length; i++) {
      let expr = "%" + tasks[i].value + "%";
      if(period === "week") {
        let [temp, fields] = await connection.execute('SELECT COUNT(id) as count, profil from records WHERE tasks LIKE ? AND `date` >= DATE(NOW()) - INTERVAL 7 DAY GROUP BY profil', [expr])
        obj[tasks[i].value] = temp
      }
      else if(period === "month") {
        let [temp, fields] = await connection.execute('SELECT COUNT(id) as count, profil from records WHERE tasks LIKE ? AND `date` >= DATE(NOW()) - INTERVAL 30 DAY GROUP BY profil', [expr])
        obj[tasks[i].value] = temp 
      }
      else {
        let [temp, fields] = await connection.execute('SELECT COUNT(id) as count, profil from records WHERE tasks LIKE ? GROUP BY profil', [expr])
        obj[tasks[i].value] = temp
      }      
    }
    await connection.end();
    return obj;
  }
  catch(error) {
    console.log(`Error from tasksOverPeriod function, ${error}`);
  }
}


async function getWeek() {
  
}

async function getMonth() {
  return 'month';
}

module.exports = {
  insertData,
  getIndex,
  updateTask,
  getWeek,
  getMonth,
  tasksOverPeriod,
};
