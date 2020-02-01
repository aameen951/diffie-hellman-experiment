
## About

An experiment with Elliptic Curve Diffie-Hellman (ECDH) Key Exchange as a simple way for implementing end-to-end encryption.

## How to Use

1. Initialize the server:
```
node main init-server
```

2. Create users that will communicate with each other:
```
node main init-user alice
node main init-user bob
```

3. Send a message from alice to bob:
```
node main send alice bob "Hello"
```

4. View the mailbox for bob:
```
node main send alice bob "Hello"
```

## How does it works?
The `init-server` command will create `server.json` file. This file contains the public keys and the mailbox for
all the users.
This file represents the database that will be used if this was a real server.

The `init-user` command will create a separate `<user>.json` file per user that will contains the
private key and public key for that user.
_This file represents the data stored in the user device that doesn't need/mustn't be shared with the server._

The `send` command will take the `sender`, the `receiver`, and the `message` and will do the following:

1. read the private key of the sender from `<sender>.json` as `Sender`<sub>`private`</sub>.

    <i>Note: the `send` command can read `<sender>.json` but not `<receiver>.json` because in reality, the
    encryption process happen on the sender device.</i>
2. Get the public key of the receiver from `server.json` as `Receiver`<sub>`public`</sub>.

3. Compute the shared secret:
   
    `SS = ECDH(Sender`<sub>`private`</sub>`, Receiver`<sub>`public`</sub>`)`

4. Derive a key from the shared secret using HKDF (HMAC Key Derivation Function):

    `K = HKDF(SS)`

5. Generate random IV using a secure random byte generator `IV`.

6. Encrypt the message using `AES-256-GCM` with the resulting key:

    `C = ENCRYPT(K, IV, M)`

7. Mail the encrypted message `C`, `IV`, and `receiver` to the server.

8. The server will store the received message in the mailbox for the receiver.

The `mailbox` command will do the following:

1. Get all the encrypted messages for the user from the mailbox.

2. Read the private key for the user from the file `<user>.json` as `Receiver`<sub>`private`</sub>.

3. For each message in the mailbox do the following steps:
  
    1. Get the public key for the sender from the server as `Sender`<sub>`public`</sub>
    2. Compute the shared secret:
      
        `SS = ECDH(Receiver`<sub>`private`</sub>`, Sender`<sub>`public`</sub>`)`

    3. Derive a key from the shared secret using HKDF (HMAC Key Derivation Function):

        `K = HKDF(SS)`

    4. Decrypt the message using the resulting key:

        `M = DECRYPT(K, IV, C)`

## Resources

- [Secret Key Exchange (Diffie-Hellman) - Computerphile](https://www.youtube.com/watch?v=NmM9HA2MQGI)
- [Diffie Hellman -the Mathematics bit- Computerphile](https://www.youtube.com/watch?v=Yjrfm_oRO0w)
- [Key Exchange Problems - Computerphile](https://www.youtube.com/watch?v=vsXMMT2CqqE)
- [Elliptic Curves - Computerphile](https://www.youtube.com/watch?v=NF1pwjL9-DE)


## Command List
```
 Usage:

   node main init-server
        Initialize the server.

   node main init-user <user-name>
        Create a new user.

   node main send <from> <to> <message>
        Send an encrypted message.

   node main mailbox <for-user>
        Get and decrypt all messages for specified user.

   node main clear-mailbox <for-user>
        Delete all messages for specified user.

```
