## Login API

### Login

/!\ It's **not safe** to use this method with your username and password. This method always return `true` and is only used in intern with empty values to enable broadcast.

```
golos.api.login('', '', function(err, result) {
  console.log(err, result);
});
```
#### Example:
```js
/**
 * login() authorization
 * @param {String} username - user username
 * @param {String} password - user password
*/
var username = 'epexa';
var password = 'qwerty12345';
golos.api.login(username, password, function(err, result) {
  //console.log(err, result);
  if (!err) {
    console.log('login', result);
  }
  else console.error(err);
});
```

### Get Api By Name
```
golos.api.getApiByName(apiName, function(err, result) {
  console.log(err, result);
});
```
