# React Native RNCryptor
It's an easy-to-use library for encrypting data with AES 256 in React Native. 

[RNCryptor](http://rncryptor.github.io/JNCryptor/javadoc/) developed popular and easy-to-use AES libs, implementations are available in [C](https://github.com/RNCryptor/RNCryptor-C), [C++](https://github.com/RNCryptor/RNCryptor-cpp), [C#](https://github.com/RNCryptor/RNCryptor-cs), [Erlang](https://github.com/RNCryptor/RNCryptor-erlang), [Go](https://github.com/RNCryptor/RNCryptor-go), [Haskell](https://github.com/RNCryptor/rncryptor-hs), [Java](https://github.com/RNCryptor/JNCryptor),
[PHP](https://github.com/RNCryptor/RNCryptor-php), [Python](https://github.com/RNCryptor/RNCryptor-python),
[Javascript](https://github.com/chesstrian/JSCryptor), and [Ruby](https://github.com/RNCryptor/ruby_rncryptor).

The data format includes all the metadata required to securely implement AES encryption, as described in ["Properly encrypting with AES with CommonCrypto,"](http://robnapier.net/aes-commoncrypto). Specifically, it includes:

* AES-256 encryption
* CBC mode
* Password stretching with PBKDF2
* Password salting
* Random IV
* Encrypt-then-hash HMAC

## Getting started

`$ npm install react-native-rncryptor --save`

`$ react-native link react-native-rncryptor`

## Usage
```javascript
import RNCryptor from 'react-native-rncryptor';

RNCryptor.encrypt('a text', 'password').then((encryptedbase64)=>{
  console.log(encryptedbase64)
}).catch((error)=>{
  console.log(error)
})

RNCryptor.decrypt('encrypted base64', 'password').then((plaintext)=>{
  console.log(plaintext)
}).catch((error)=>{
  console.log(error)
})
```

## License
MIT