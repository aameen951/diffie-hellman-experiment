const {db_read_data, db_write_data} = require('./database');
const {generate_ecdh_keys, compute_shared_secret, encrypt_message, decrypt_message} = require('./crypto');
const {server_new_user, server_get_user_public_key, server_send_message, server_get_mailbox_for} = require('./server');

function user_create(name){
  const keys = generate_ecdh_keys();
  const data = {
    name,
    public: keys.public,
    private: keys.private,
  };
  db_write_data(`${name}.json`, data);
  server_new_user(data.name, data.public);
}
function user_send_message(user, to, message){
  const user_data = db_read_data(`${user}.json`);
  const to_public = server_get_user_public_key(to);

  const secret = compute_shared_secret(user_data.private, to_public);
  const encrypted_message = encrypt_message(secret, message);
  server_send_message(user, to, encrypted_message);
}
function user_get_mailbox_for(user){
  const user_data = db_read_data(`${user}.json`);

  return server_get_mailbox_for(user).map(m => {
    const from_public = server_get_user_public_key(m.from);
    const secret = compute_shared_secret(user_data.private, from_public);
    const message = decrypt_message(secret, m.encrypted_message);
    return {
      from:m.from,
      message
    };
  });
}

module.exports = {
  user_create,
  user_send_message,
  user_get_mailbox_for,
};
