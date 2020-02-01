
const {
  cmd_init_server,
  cmd_init_user,
  cmd_send_message,
  cmd_mailbox,
  cmd_clear_mailbox,
} = require('./commands');

function main(){

  const commands = {
    "init-server":{
      args: [],
      desc: "Initialize the server.",
      cb: cmd_init_server
    },
    "init-user":{
      args: ['user-name'],
      desc: "Create a new user.",
      cb: cmd_init_user
    },
    "send":{
      args: ['from', 'to', 'message'],
      desc: "Send an encrypted message.",
      cb: cmd_send_message
    },
    "mailbox":{
      args: ['for-user'],
      desc: "Get and decrypt all messages for specified user.",
      cb: cmd_mailbox
    },
    "clear-mailbox":{
      args: ['for-user'],
      desc: "Delete all messages for specified user.",
      cb: cmd_clear_mailbox
    },
  };

  const in_cmd = process.argv[2];
  let print_usage = true;
  if(commands[in_cmd])
  {
    const cmd = commands[in_cmd];
    print_usage = false;
    if(cmd.args.length === process.argv.length-3)
    {
      cmd.cb(...process.argv.slice(3));
    }
    else
    {
      console.error(`Wrong number of arguments for command '${in_cmd}'.`);
      console.error(` Usage:`);
      console.error(`   node main ${in_cmd} ${cmd.args.map(arg => `<${arg}>`).join(" ")}`);
    }
  }
  if(print_usage)
  {
    console.error();
    console.error(` Usage:`);
    console.error();
    Object.entries(commands).forEach(([cmd, data]) => {
      console.error(`   node main ${cmd} ${data.args.map(arg => `<${arg}>`).join(" ")}`);
      console.error(`        ${data.desc}`);
      console.error();
    });
  }
};
main();
