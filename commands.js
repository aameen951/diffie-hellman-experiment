const {server_init, server_clear_mailbox_for} = require('./server');
const {user_create, user_send_message, user_get_mailbox_for} = require('./user');

function cmd_init_server(){
  server_init();
}
function cmd_init_user(name){
  user_create(name);
}
function cmd_send_message(from, to, message){
  user_send_message(from, to, message);
}
function cmd_mailbox(user){
  const line = "-".repeat(18+user.length);
  console.log();
  console.log(line);
  console.log("  Mailbox for: ", user);
  console.log(line);
  let empty = true;
  user_get_mailbox_for(user).forEach(m => {
    empty = false;
    console.log(`${m.from}:`, m.message);
  });
  if(empty)
  {
    console.log("  Mailbox is empty!");
  }
  console.log(line);
}
function cmd_clear_mailbox(user){
  server_clear_mailbox_for(user);
}

module.exports = {
  cmd_init_server,
  cmd_init_user,
  cmd_send_message,
  cmd_mailbox,
  cmd_clear_mailbox,
};
