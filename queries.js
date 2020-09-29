// const mysql = require('mysql2');
const mysql = require('mysql2/promise');

const table = 'dev_records';

async function getDbInstance() {
  try {
    return await mysql.createConnection({
      host: 'localhost',
      user: 'adloox',
      password: 'adloox',
      database: 'housework',
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
    await connection.execute(`INSERT INTO ${table} (profil, tasks, date) VALUES(?, ?, CURDATE())`, [data.profil, data.task]);
    await connection.end();
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
    const [rows, fields] = await connection.execute('SELECT task_name, profil, DATE_FORMAT(date, "%d/%c/%Y") as date FROM `tasks` ORDER BY task_name ASC');
    console.log(fields);
    await connection.end();
    // console.log(rows);
    return rows;
  } catch (error) {
    console.log('Error from lastTime function', error);
    return false;
  }
}

module.exports = {
  insertData,
  getIndex,
  updateTask,
};
