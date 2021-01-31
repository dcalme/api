/* eslint-disable no-plusplus */
function getCurrentDay() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();
  today = `${yyyy}-${mm}-${dd}`;
  return today;
}

function prepareQueryParams(data) {
  const { task, profil } = data;
  const value = [];
  for (let i = 0; i < task.length; i++) {
    value.push([profil, task[i], getCurrentDay()]);
  }
  return value;
}

module.exports = {
  prepareQueryParams,
};
