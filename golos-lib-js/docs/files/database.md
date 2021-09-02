# Database API

## Subscriptions

### Set Subscribe Callback
```
golos.api.setSubscribeCallback(callback, clearFilter, function(err, result) {
  console.log(err, result);
});
```
### Set Pending Transaction Callback
```
golos.api.setPendingTransactionCallback(cb, function(err, result) {
  console.log(err, result);
});
```
### Set Block Applied Callback
```
golos.api.setBlockAppliedCallback(cb, function(err, result) {
  console.log(err, result);
});
```
### Cancel All Subscriptions
```
golos.api.cancelAllSubscriptions(function(err, result) {
  console.log(err, result);
});
```

## Tags

### Get Trending Tags
```
golos.api.getTrendingTags(afterTag, limit, function(err, result) {
  console.log(err, result);
});
```
### Get Discussions By Trending
```
golos.api.getDiscussionsByTrending(query, function(err, result) {
  console.log(err, result);
});
```
#### Example:
```js
/**
 * getDiscussionsByTrending() receiving posts by tags
 * @param {Object} query - A search object that includes tags and a limit or authors username and url-address of post
*/
var query = {
  select_tags: ['dev', 'test'],
  limit: 100,
  //start_author: 'epexa',
  //start_permlink: 'test-url'
};
golos.api.getDiscussionsByTrending(query, function(err, result) {
  //console.log(err, result);
  if (!err) {
    result.forEach(function(item) {
      console.log('getDiscussionsByTrending', item.title);
    });
  }
  else console.error(err);
});
```
### Get Discussions By Created
```
golos.api.getDiscussionsByCreated(query, function(err, result) {
  console.log(err, result);
});
```
### Get Discussions By Active
```
golos.api.getDiscussionsByActive(query, function(err, result) {
  console.log(err, result);
});
```
### Get Discussions By Cashout
```
golos.api.getDiscussionsByCashout(query, function(err, result) {
  console.log(err, result);
});
```
### Get Discussions By Payout
```
golos.api.getDiscussionsByPayout(query, function(err, result) {
  console.log(err, result);
});
```
### Get Discussions By Votes
```
golos.api.getDiscussionsByVotes(query, function(err, result) {
  console.log(err, result);
});
```
### Get Discussions By Children
```
golos.api.getDiscussionsByChildren(query, function(err, result) {
  console.log(err, result);
});
```
### Get Discussions By Hot
```
golos.api.getDiscussionsByHot(query, function(err, result) {
  console.log(err, result);
});
```
### Get Discussions By Feed
```
golos.api.getDiscussionsByFeed(query, function(err, result) {
  console.log(err, result);
});
```
### Get Discussions By Blog
```
golos.api.getDiscussionsByBlog(query, function(err, result) {
  console.log(err, result);
});
```
#### Example:
```js
/**
 * getDiscussionsByBlog() receiving posts by author and tag
 * @param {Object} query - search object that includes the author, tag, limit
*/
var query = {
  select_authors: ['epexa'],
  select_tags: ['dev'],
  limit: 100
};
golos.api.getDiscussionsByBlog(query, function(err, result) {
  //console.log(err, result);
  if (!err) {
    result.forEach(function(item) {
      console.log('getDiscussionsByBlog', item.title);
    });
  }
  else console.error(err);
});
```
### Get Discussions By Comments
```
golos.api.getDiscussionsByComments(query, function(err, result) {
  console.log(err, result);
});
```

## Blocks and transactions

### Get Block Header
```
golos.api.getBlockHeader(blockNum, function(err, result) {
  console.log(err, result);
});
```
### Get Block
```
golos.api.getBlock(blockNum, function(err, result) {
  console.log(err, result);
});
```
### Get State
```
golos.api.getState(path, function(err, result) {
  console.log(err, result);
});
```

## Globals

### Get Config
```
golos.api.getConfig(function(err, result) {
  console.log(err, result);
});
```
### Get Dynamic Global Properties
```
golos.api.getDynamicGlobalProperties(function(err, result) {
  console.log(err, result);
});
```
### Get Chain Properties
```
golos.api.getChainProperties(function(err, result) {
  console.log(err, result);
});
```
### Get Current Median History Price
```
golos.api.getCurrentMedianHistoryPrice(function(err, result) {
  console.log(err, result);
});
```
### Get Hardfork Version
```
golos.api.getHardforkVersion(function(err, result) {
  console.log(err, result);
});
```

## Keys

### Get Key References
```
golos.api.getKeyReferences(key, function(err, result) {
  console.log(err, result);
});
```
#### Example:
```js
var publicKeys = ['GLS6...', 'GLS6...'];
golos.api.getKeyReferences(publicKeys, function(err, result) {
  //console.log(err, result);
  if (!err) {
    result.forEach(function(item) {
      console.log('getKeyReferences', 'username: [', item[0], ']');
    });
  }
  else console.error(err);
});
```

## Accounts

### Get Accounts
```
golos.api.getAccounts(names, function(err, result) {
  console.log(err, result);
});
```
#### Example:
```js
var accounts = [ 'epexa', 'epexa2' ];
golos.api.getAccounts(accounts, function(err, result) {
  //console.log(err, result);
  if (!err) {
    result.forEach(function(item) {
      console.log('getAccounts', 'username: [', item.name, '] id: [', item.id, ']');
    });
  }
  else console.error(err);
});
```
### Get Accounts Balances
```
golos.api.getAccountsBalances(accounts, function(err, result) {
  console.log(err, result);
});
```
#### Example:
```js
var accounts = [ 'epexa', 'epexa2' ];
golos.api.getAccountsBalances(accounts, function(err, result) {
  //console.log(err, result);
  if (!err) {
    result.forEach(function(item) {
        console.log('Account\'s UIAs', item);
    });
  }
  else console.error(err);
});
```
### Lookup Account Names
```
golos.api.lookupAccountNames(accountNames, function(err, result) {
  console.log(err, result);
});
```
#### Example:
```js
var usernames = ['epexa', 'epexa2'];
golos.api.lookupAccountNames(usernames, function(err, result) {
  //console.log(err, result);
  if (!err) {
    result.forEach(function(item) {
    if (item) console.log('lookupAccountNames', 'username: [', item.name, '] id: [', item.id, ']');
    else console.log('lookupAccountNames', 'account not found!');
    });
  }
  else console.error(err);
});
```
### Lookup Accounts
```
golos.api.lookupAccounts(lowerBoundName, limit, function(err, result) {
  console.log(err, result);
});
```
#### Example:
```js
var searchAccountsQuery = 'epe';
var limitResults = 10;
golos.api.lookupAccounts(searchAccountsQuery, limitResults, function(err, result) {
  //console.log(err, result);
  if (!err) {
    result.forEach(function(item) {
      console.log('lookupAccounts', 'username: [', item, ']');
    });
  }
  else console.error(err);
});
```
### Get Account Count
```
golos.api.getAccountCount(function(err, result) {
  console.log(err, result);
});
```
### Get Conversion Requests
```
golos.api.getConversionRequests(accountName, function(err, result) {
  console.log(err, result);
});
```
### Get Account History
```
golos.api.getAccountHistory(account, from, limit, function(err, result) {
  console.log(err, result);
});
```
### Get Owner History
```
golos.api.getOwnerHistory(account, function(err, result) {
  console.log(err, result);
});
```
### Get Recovery Request
```
golos.api.getRecoveryRequest(account, function(err, result) {
  console.log(err, result);
});
```

## Authority / validation

### Get Transaction Hex
```
golos.api.getTransactionHex(trx, function(err, result) {
  console.log(err, result);
});
```
### Get Transaction
```
golos.api.getTransaction(trxId, function(err, result) {
  console.log(err, result);
});
```
### Get Required Signatures
```
golos.api.getRequiredSignatures(trx, availableKeys, function(err, result) {
  console.log(err, result);
});
```
### Get Potential Signatures
```
golos.api.getPotentialSignatures(trx, function(err, result) {
  console.log(err, result);
});
```
### Verify Authority
```
golos.api.verifyAuthority(trx, function(err, result) {
  console.log(err, result);
});
```
### Verify Account Authority
```
golos.api.verifyAccountAuthority(nameOrId, signers, function(err, result) {
  console.log(err, result);
});
```

## Votes

### Get Active Votes
```
golos.api.getActiveVotes(author, permlink, function(err, result) {
  console.log(err, result);
});
```
### Get Account Votes
```
golos.api.getAccountVotes(voter, function(err, result) {
  console.log(err, result);
});
```

## Content


### Get Content
```
golos.api.getContent(author, permlink, function(err, result) {
  console.log(err, result);
});
```
#### Example:
```js
/**
 * getContent() receiving a post
 * @param {String} author - author of the post
 * @param {String} permlink - url-address of the post
*/
var author = 'epexa';
var permlink = 'test-url';
golos.api.getContent(author, permlink, function(err, result) {
  //console.log(err, result);
  if (!err) {
    console.log('getContent', result.title);
  }
  else console.error(err);
});
```
### Get Content Replies
```
golos.api.getContentReplies(parent, parentPermlink, function(err, result) {
  console.log(err, result);
});
```
#### Example:
```js
/**
 * getContentReplies() receiving a comments
 * @param {String} parent - author of the post
 * @param {String} parentPermlink - url-address of the post
*/
var parent = 'epexa';
var parentPermlink = 'test-url';
golos.api.getContentReplies(parent, parentPermlink, function(err, result) {
  //console.log(err, result);
  if (!err) {
    result.forEach(function(item) {
      console.log('getContentReplies', item.body);
    });
  }
  else console.error(err);
});
```
### Get Discussions By Author Before Date
```
golos.api.getDiscussionsByAuthorBeforeDate(author, startPermlink, beforeDate, limit, function(err, result) {
  console.log(err, result);
});
```
### Get Replies By Last Update
```
golos.api.getRepliesByLastUpdate(startAuthor, startPermlink, limit, function(err, result) {
  console.log(err, result);
});
```

## Witnesses


### Get Witnesses
```
golos.api.getWitnesses(witnessIds, function(err, result) {
  console.log(err, result);
});
```
### Get Witness By Account
```
golos.api.getWitnessByAccount(accountName, function(err, result) {
  console.log(err, result);
});
```
### Get Witnesses By Vote
```
golos.api.getWitnessesByVote(from, limit, function(err, result) {
  console.log(err, result);
});
```
### Lookup Witness Accounts
```
golos.api.lookupWitnessAccounts(lowerBoundName, limit, function(err, result) {
  console.log(err, result);
});
```
### Get Active Witnesses
```
golos.api.getActiveWitnesses(function(err, result) {
  console.log(err, result);
});
```
