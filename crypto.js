const SYM_ALGORITHM = 'aes-256-gcm';
const CURVE = 'prime256v1';
const crypto = require("crypto");

function hkdf(ikm, length, {salt='', info=''}={}) {
  const b_ikm = Buffer.isBuffer(ikm) ? ikm : Buffer.from(ikm);
  const b_salt = (salt && salt.length) ? Buffer.from(salt) : Buffer.alloc(32, 0);
  const prk = crypto.createHmac('sha256', b_salt).update(b_ikm).digest();
  const b_info = Buffer.from(info || '');
  const info_len = b_info.length;
  const steps = Math.ceil(length / 32);
  if(steps > 0xFF)throw new Error(`OKM length ${length} is too long for 'sha256' hash`);
  const t = Buffer.alloc(32 * steps + info_len + 1);
  for(let c=1, start=0, end=0; c<=steps; ++c){
    b_info.copy( t, end );
    t[end + info_len] = c;
    crypto.createHmac('sha256', prk).update(t.slice(start, end + info_len + 1)).digest().copy(t, end);
    start = end;
    end += 32;
  }
  return t.slice(0, length);
}

function generate_ecdh_keys(){
  const ecdh = crypto.createECDH(CURVE);
  ecdh.generateKeys();
  return {
    public:ecdh.getPublicKey('hex'),
    private:ecdh.getPrivateKey('hex'),
  };
}
function compute_shared_secret(private_key, public_key)
{
  const ecdh = crypto.createECDH(CURVE);
  ecdh.setPrivateKey(private_key, 'hex');
  const result = ecdh.computeSecret(public_key, 'hex');
  return result;
}
function encrypt_message(secret, message)
{
  const salt = crypto.randomBytes(32);
  const key = hkdf(secret, 32, {salt});
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(SYM_ALGORITHM, key, iv);
  const cipher_text = Buffer.concat([cipher.update(message), cipher.final()]);
  const auth_tag = cipher.getAuthTag();
  return {
    salt:salt.toString('hex'),
    iv:iv.toString('hex'),
    cipher_text:cipher_text.toString('hex'),
    auth_tag:auth_tag.toString('hex')
  };
}
function decrypt_message(secret, encrypted_message)
{
  const salt = Buffer.from(encrypted_message.salt, 'hex');
  const iv = Buffer.from(encrypted_message.iv, 'hex');
  const cipher_text = Buffer.from(encrypted_message.cipher_text, 'hex');
  const auth_tag = Buffer.from(encrypted_message.auth_tag, 'hex');
  const key = hkdf(secret, 32, {salt});
  const decipher = crypto.createDecipheriv(SYM_ALGORITHM, key, iv);
  decipher.setAuthTag(Buffer.from(auth_tag));
  const message = Buffer.concat([decipher.update(cipher_text), decipher.final()]);
  return message.toString();
}
module.exports = {
  generate_ecdh_keys,
  compute_shared_secret, 
  encrypt_message, 
  decrypt_message
};
