
function getCurrentDay() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

function prepareQueryParams(data) {
  const { task, profil } = data;
  let value = [];
  for (let i = 0; i < task.length; i++) {
    value.push([profil, task[i], getCurrentDay()]);
  }
  return value;
}

module.exports = {
  prepareQueryParams
}