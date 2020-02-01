const fs = require("fs");

function db_write_data(file, data)
{
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}
function db_read_data(file)
{
  try {

    return JSON.parse(fs.readFileSync(file, 'utf8'));

  } catch(e) {
    return null;
  }
}

module.exports = {
  db_read_data,
  db_write_data,
};
