# Auth

### Verify
```
golos.auth.verify(name, password, auths);
```
#### Example:
```js
var username = 'epexa';
var password = 'P5...';  // master password
// object in which the key type public key (active, memo, owner, posting), and the value of the array in the array itself is the public key
var auths = {
  posting: [['GLS6...']]
};
var verifyResult = golos.auth.verify(username, password, auths);
console.log('verify', verifyResult);
```

### Generate Keys
```
golos.auth.generateKeys(name, password, roles);
```
#### Example:
```js
/**
 * generateKeys() generating new keys for a new account
 * @param {String} name - new account username
 * @param {String} password - master-password for a new account
*/
var name = 'epexa4';
var password = 'qwerty12345';
var newKeys = golos.auth.generateKeys(name, password, ['owner', 'active', 'posting', 'memo']);
console.log('newKeys', newKeys);
```

### Get Private Keys
```
golos.auth.getPrivateKeys(name, password, roles);
```
#### Example:
```js
var username = 'epexa';
var password = 'P5H...'; // master password
var roles = ['owner', 'active', 'posting', 'memo']; // optional parameter, if not specify, then all keys will return
var keys = golos.auth.getPrivateKeys(username, password, roles);
console.log('getPrivateKeys', keys);
```

### Is Wif
```
golos.auth.isWif(privWif);
```
#### Example:
```js
var privWif = '5J...';
var resultIsWif = golos.auth.isWif(privWif);
console.log('isWif', resultIsWif);
```

### Login Form Validation
```
golos.auth.login(name, privWifOrPassword, callback);
```
Recommended for usage in login forms in dApps on Golos Blockchain.
Obtains specified account (using `getAccounts` API), compares each of account keys with specified string, and returns object with WIFs (private keys) which this string provides and which should be used to authorize operations. Object has fields: `active`, `posting`, `owner`, and `memo`. Each field is `true` if string provides this role, or `false` otherwise. Also, it has field `password`. If provided string is a password (not key) and this password provides `posting` role, field `password` has password's value.
#### Example:
```js
var name = 'alice';
var privWifOrPassword = '5J...'; // or 'P5J...'
golos.auth.login(name, privWifOrPassword, function(err, response) {
  console.log(response); // Object { owner: '5J...', active: null, posting: '5J...', memo: '5J...' }
  if (response.active && !response.password) {
    console.log('Login failed! It is not recommended to authorize users with active key (or key which can be used as active), except case if it is also the password!');
    return;
  }
  if (!response.posting) {
    console.log('Login failed! Incorrect password');
    return;
  }
  console.log('Login OK! To authorize most of operations, use following WIF: ' + response.posting)
});
```

### To Wif
```
golos.auth.toWif(name, password, role);
```
#### Example:
```js
var username = 'epexa';
var password = 'P5H...'; // master password
var role = 'posting'; // private key type, one of owner, active, posting, memo
var privateKey = golos.auth.toWif(username, password, role);
console.log('toWif', privateKey);
```

### Wif Is Valid
```
golos.auth.wifIsValid(privWif, pubWif);
```
#### Example:
```js
var privWif = '5J...'; // private key
var pubWif = 'GLS6...'; // public key
var resultWifIsValid = golos.auth.wifIsValid(privWif, pubWif);
console.log('wifIsValid', resultWifIsValid);
```

### Wif To Public
```
golos.auth.wifToPublic(privWif);
```
#### Example:
```js
var privWif = '5J...'; // private key
var resultWifToPublic = golos.auth.wifToPublic(privWif, pubWif);
console.log('wifToPublic', resultWifToPublic);
```

### Sign Transaction
```
golos.auth.signTransaction(trx, keys);
```
