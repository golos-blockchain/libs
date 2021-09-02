# Formatter

### Create Suggested Password
```
var password = golos.formatter.createSuggestedPassword();
console.log(password);
// => 'GAz3GYFvvQvgm7t2fQmwMDuXEzDqTzn9'
```

### Comment Permlink
```
var parentAuthor = 'ned';
var parentPermlink = 'a-selfie';
var commentPermlink = golos.formatter.commentPermlink(parentAuthor, parentPermlink);
console.log(commentPermlink);
// => 're-ned-a-selfie-20170621t080403765z'
```

### Estimate Account Value
```
var golosPower = golos.formatter.estimateAccountValue(account);
```

### Reputation
```
var reputation = golos.formatter.reputation(3512485230915);
console.log(reputation);
// => 56
```

### Vest To Golos
```
var golosPower = golos.formatter.vestToGolos(vestingShares, totalVestingShares, totalVestingFundGolos);
console.log(golosPower);
```
