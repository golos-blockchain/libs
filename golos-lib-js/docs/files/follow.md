## Follow API

### Get Followers
```
golos.api.getFollowers(following, startFollower, followType, limit, function(err, result) {
  console.log(err, result);
});
```
#### Example
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
golos.api.getFollowers(following, startFollower, followType, limit, function(err, result) {
  //console.log(err, result);
  if ( ! err) {
    result.forEach(function(item) {
      console.log('getFollowers', item);
    });
  }
  else console.error(err);
});
```
### Get Following
```
golos.api.getFollowing(follower, startFollowing, followType, limit, function(err, result) {
  console.log(err, result);
});
```
#### Example:
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
golos.api.getFollowing(follower, startFollower, followType, limit, function(err, result) {
  //console.log(err, result);
  if ( ! err) {
    result.forEach(function(item) {
      console.log('getFollowing', item);
    });
  }
  else console.error(err);
});
```
### Get Follow Count
```
golos.api.getFollowCount(account, function(err, result) {
  console.log(err, result);
});
```
#### Example:
```js
/**
 * getFollowCount() returns count of subscribers and subscriptions
 * @param {String} account - username of the user to return data
*/
var account = 'epexa';
golos.api.getFollowCount(account, function(err, result) {
  console.log(err, result);
  if (!err) {
    console.log('getFollowCount', result);
  }
  else console.error(err);
});
```
