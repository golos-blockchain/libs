## Подписчики

### Получение подписчиков
```js
golos.api.getFollowers(following, startFollower, followType, limit, (err, result) => {
    console.log(err, result);
});
```
#### Пример
```js
/**
 * getFollowers() returns subscribers
 * @param {String} following - username whom return subscribers
 * @param {String} startFollower - position from which item to return result
 * @param {String} followType - subscription type, value: 'blog' or null
 * @param {Integer} limit - how many records to return, the maximum value: 100
*/
var following = 'epexa';
var startFollower = '';
var followType = null;
var limit = 100;
golos.api.getFollowers(following, startFollower, followType, limit, (err, result) => {
    //console.log(err, result);
    if (!err) {
        for (const item of result) {
            console.log('getFollowers', item);
        }
    }
    else console.error(err);
});
```
### Получение тех, на кого подписан
```js
golos.api.getFollowing(follower, startFollowing, followType, limit, (err, result) => {
    console.log(err, result);
});
```
#### Пример:
```js
/**
 * getFollowing() returns subscriptions
 * @param {String} follower - username subscriber
 * @param {String} startFollower - position from which item to return result
 * @param {String} followType - subscription type, value: 'blog' или null
 * @param {Integer} limit - how many records to return, the maximum value: 100
*/
var follower = 'epexa';
var startFollower = '';
var followType = null;
var limit = 100;
golos.api.getFollowing(follower, startFollower, followType, limit, (err, result) => {
    //console.log(err, result);
    if (!err) {
        for (const item of result) {
            console.log('getFollowing', item);
        };
    }
    else console.error(err);
});
```
### Получение кол-ва подписчиков и подписок
```js
golos.api.getFollowCount(account, (err, result) => {
    console.log(err, result);
});
```
#### Пример:
```js
/**
 * getFollowCount() returns count of subscribers and subscriptions
 * @param {String} account - username of the user to return data
*/
var account = 'epexa';
golos.api.getFollowCount(account, (err, result) => {
    console.log(err, result);
    if (!err) {
        console.log('getFollowCount', result);
    }
    else console.error(err);
});
```
