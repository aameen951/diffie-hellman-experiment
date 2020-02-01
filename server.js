const {db_write_data, db_read_data} = require('./database');

const SERVER_FILE_NAME = 'server.json';

function server_init()
{
  const data = {
    users:{},
  };
  db_write_data(SERVER_FILE_NAME, data);
}
function server_new_user(name, user_ik){
  const data = db_read_data(SERVER_FILE_NAME);
  data.users[name] = {
    name, user_ik, mailbox:[],
  };
  db_write_data(SERVER_FILE_NAME, data);
}
function server_get_user_public_key(user){
  const data = db_read_data(SERVER_FILE_NAME);
  return data.users[user].user_ik;
}
function server_send_message(from, to, encrypted_message){
  const data = db_read_data(SERVER_FILE_NAME);
  data.users[to].mailbox.push({
    from, encrypted_message
  });
  db_write_data(SERVER_FILE_NAME, data);
}
function server_get_mailbox_for(user){
  const data = db_read_data(SERVER_FILE_NAME);
  return data.users[user].mailbox;
}
function server_clear_mailbox_for(user){
  const data = db_read_data(SERVER_FILE_NAME);
  data.users[user].mailbox = [];
  db_write_data(SERVER_FILE_NAME, data);
}

module.exports = {
  server_init,
  server_new_user,
  server_get_user_public_key,
  server_send_message,
  server_get_mailbox_for,
  server_clear_mailbox_for,
};
