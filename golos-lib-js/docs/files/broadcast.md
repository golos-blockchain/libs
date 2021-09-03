### Отправка операций

#### Отправка транзакции
```
golos.api.broadcastTransaction(trx, (err, result) => {
  console.log(err, result);
});
```
#### Синхронная отправка транзакции
```
golos.api.broadcastTransactionSynchronous(trx, (err, result) => {
  console.log(err, result);
});
```
#### Отправка блока
```
golos.api.broadcastBlock(b, (err, result) => {
  console.log(err, result);
});
```
#### Отправка транзакции с callback'ом
```
golos.api.broadcastTransactionWithCallback(confirmationCallback, trx, (err, result) => {
  console.log(err, result);
});
```
### Примеры отправки операций

#### Account Create
```
golos.broadcast.accountCreate(wif, fee, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata, (err, result) => {
    console.log(err, result);
});
```
##### Пример:
```js
/**
 * accountCreate() new account registration
 * @param {Base58} wif - private active key
 * @param {String} fee - the cost of creating an account. It will be listed by virtue of the voice of the new account
 * @param {String} creator - name of user who registers an account
 * @param {String} newAccountName - new account username
 * @param {Object} owner - object containing a new owner key
 * @param {Object} active - object containing a active key
 * @param {Object} posting - object containing a posting key
 * @param {String} memoKey - new memo key
 * @param {String} jsonMetadata - additional data for a new account (avatar, location, etc.)
*/
var wif = '5K...';
var fee = '90.000 GOLOS';
var creator = 'epexa';
var newAccountName = name;
var owner = {
  weight_threshold: 1,
  account_auths: [],
  key_auths: [[newKeys.owner, 1]]
};
var active = {
  weight_threshold: 1,
  account_auths: [],
  key_auths: [[newKeys.active, 1]]
};
var posting = {
  weight_threshold: 1,
  account_auths: [],
  key_auths: [[newKeys.posting, 1]]
};
var memoKey = newKeys.memo;
var jsonMetadata = '{}';
golos.broadcast.accountCreate(wif, fee, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata, (err, result) => {
    //console.log(err, result);
    if (!err) {
        console.log('accountCreate', result);
    }
    else console.error(err);
});
```
#### Account Create With Delegation
```
golos.broadcast.accountCreateWithDelegation(wif, fee, delegation, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata, extensions, (err, result) => {
    console.log(err, result);
});
```
#### Delegate Vesting Shares
```
golos.broadcast.delegateVestingShares(wif, delegator, delegatee, vesting_shares, (err, result) => {
    console.log(err, result);
});
```
#### Account Update
```
golos.broadcast.accountUpdate(wif, account, owner, active, posting, memoKey, jsonMetadata, (err, result) => {
    console.log(err, result);
});
```
#### Account Witness Proxy
```
golos.broadcast.accountWitnessProxy(wif, account, proxy, (err, result) => {
    console.log(err, result);
});
```
#### Account Witness Vote
```
golos.broadcast.accountWitnessVote(wif, account, witness, approve, (err, result) => {
    console.log(err, result);
});
```
#### Challenge Authority
```
golos.broadcast.challengeAuthority(wif, challenger, challenged, requireOwner, (err, result) => {
    console.log(err, result);
});
```
#### Change Recovery Account
```
golos.broadcast.changeRecoveryAccount(wif, accountToRecover, newRecoveryAccount, extensions, (err, result) => {
    console.log(err, result);
});
```
#### Comment
```
golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, (err, result) => {
    console.log(err, result);
});
```
##### Пример создания поста:
```js
/**
 * comment() add a post
 * @param {Base58} wif - private posting key
 * @param {String} parentAuthor - for add a post, empty field
 * @param {String} parentPermlink - main tag
 * @param {String} author - author of the post
 * @param {String} permlink - url-address of the post
 * @param {String} title - header of the post
 * @param {String} body - text of the post
 * @param {String} jsonMetadata - meta-data of the post (images etc.)
*/
var wif = '5K...';
var parentAuthor = '';
var parentPermlink = 'dev';
var author = 'epexa';
var permlink = 'test-url';
var title = 'test';
var body = 'test2';
var jsonMetadata = '{}';
golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, (err, result) => {
    //console.log(err, result);
    if (!err) {
        console.log('comment', result);
    }
    else console.error(err);
});
```
##### Пример добавления комментария:
```js
/**
 * comment() add a comment
 * @param {Base58} wif - private posting key
 * @param {String} parentAuthor - for add a comment, author of the post
 * @param {String} parentPermlink - for add a comment, url-address of the post
 * @param {String} author - author of the comment
 * @param {String} permlink - unique url-address of the comment
 * @param {String} title - for create a comment, empty field
 * @param {String} body - text of the comment
 * @param {String} jsonMetadata - meta-data of the post (images etc.)
*/
var wif = '5K...';
var parentAuthor = 'epexa';
var parentPermlink = 'test-url';
var author = 'epexa';
var permlink = 're-' + parentAuthor + '-' + parentPermlink + '-' + Date.now(); // re-epexa-test-url-1517333064308
var title = '';
var body = 'hi!';
var jsonMetadata = '{}';
golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, (err, result) => {
    //console.log(err, result);
    if (!err) {
        console.log('comment', result);
    }
    else console.error(err);
});
```
#### Comment Options
```
golos.broadcast.commentOptions(wif, author, permlink, maxAcceptedPayout, percentGolosDollars, allowVotes, allowCurationRewards, extensions, (err, result) => {
    console.log(err, result);
});
```
#### Comment Reward
```
golos.broadcast.commentReward(wif, author, permlink, sbdPayout, vestingPayout, (err, result) => {
    console.log(err, result);
});
```
#### Convert
```
golos.broadcast.convert(wif, owner, requestid, amount, (err, result) => {
    console.log(err, result);
});
```
#### Custom
```
golos.broadcast.custom(wif, requiredAuths, id, data, (err, result) => {
    console.log(err, result);
});
```
#### Custom Binary
```
golos.broadcast.customBinary(wif, id, data, (err, result) => {
    console.log(err, result);
});
```
#### Custom Json
```
golos.broadcast.customJson(wif, requiredAuths, requiredPostingAuths, id, json, (err, result) => {
    console.log(err, result);
});
```
#### Delete Comment
```
golos.broadcast.deleteComment(wif, author, permlink, (err, result) => {
    console.log(err, result);
});
```
#### Escrow Dispute
```
golos.broadcast.escrowDispute(wif, from, to, agent, who, escrowId, (err, result) => {
    console.log(err, result);
});
```
#### Escrow Release
```
golos.broadcast.escrowRelease(wif, from, to, agent, who, receiver, escrowId, sbdAmount, golosAmount, (err, result) => {
    console.log(err, result);
});
```
#### Escrow Transfer
```
golos.broadcast.escrowTransfer(wif, from, to, agent, escrowId, sbdAmount, golosAmount, fee, ratificationDeadline, escrowExpiration, jsonMeta, (err, result) => {
    console.log(err, result);
});
```
#### Escrow Approve
```
golos.broadcast.escrowApprove(wif, from, to, agent, who, escrowId, approve, (err, result) => {
    console.log(err, result);
});
```
#### Feed Publish
```
golos.broadcast.feedPublish(wif, publisher, exchangeRate, (err, result) => {
    console.log(err, result);
});
```
#### Fill Convert Request
```
golos.broadcast.fillConvertRequest(wif, owner, requestid, amountIn, amountOut, (err, result) => {
    console.log(err, result);
});
```
#### Fill Vesting Withdraw
```
golos.broadcast.fillVestingWithdraw(wif, fromAccount, toAccount, withdrawn, deposited, (err, result) => {
    console.log(err, result);
});
```
#### Interest
```
golos.broadcast.interest(wif, owner, interest, (err, result) => {
    console.log(err, result);
});
```
#### Prove Authority
```
golos.broadcast.proveAuthority(wif, challenged, requireOwner, (err, result) => {
    console.log(err, result);
});
```
#### Recover Account
```
golos.broadcast.recoverAccount(wif, accountToRecover, newOwnerAuthority, recentOwnerAuthority, extensions, (err, result) => {
    console.log(err, result);
});
```
#### Request Account Recovery
```
golos.broadcast.requestAccountRecovery(wif, recoveryAccount, accountToRecover, newOwnerAuthority, extensions, (err, result) => {
    console.log(err, result);
});
```
#### Set Withdraw Vesting Route
```
golos.broadcast.setWithdrawVestingRoute(wif, fromAccount, toAccount, percent, autoVest, (err, result) => {
    console.log(err, result);
});
```
#### Transfer
```
golos.broadcast.transfer(wif, from, to, amount, memo, (err, result) => {
    console.log(err, result);
});
```
##### Пример:
```js
/**
 * transfer() transfer golos or golos gold
 * @param {Base58} wif - private owner key
 * @param {String} from - username who send, whose owner key
 * @param {String} to - username who get
 * @param {String} amount - number of coins in the format: 0.001 GOLOS
 * @param {String} memo - a comment
*/
var wif = '5J...';
var from = 'epexa';
var to = 'melnikaite';
var amount = '0.001 GOLOS';
var memo = 'gift';
golos.broadcast.transfer(wif, from, to, amount, memo, (err, result) => {
    //console.log(err, result);
    if (!err) {
        console.log('transfer', result);
    }
    else console.error(err);
});
```
#### Transfer To Vesting
```
golos.broadcast.transferToVesting(wif, from, to, amount, (err, result) => {
    console.log(err, result);
});
```
#### Vote
```
golos.broadcast.vote(wif, voter, author, permlink, weight, (err, result) => {
    console.log(err, result);
});
```
#### Withdraw Vesting
```
golos.broadcast.withdrawVesting(wif, account, vestingShares, (err, result) => {
    console.log(err, result);
});
```
#### Witness Update
```
golos.broadcast.witnessUpdate(wif, owner, url, blockSigningKey, props, fee, (err, result) => {
    console.log(err, result);
});
```
#### Fill Transfer From Savings
```
golos.broadcast.fillTransferFromSavings(wif, from, to, amount, requestId, memo, (err, result) => {
    console.log(err, result);
});
```
#### Transfer To Savings
```
golos.broadcast.transferToSavings(wif, from, to, amount, memo, (err, result) => {
    console.log(err, result);
});
```
#### Transfer From Savings
```
golos.broadcast.transferFromSavings(wif, from, requestId, to, amount, memo, (err, result) => {
    console.log(err, result);
});
```
#### Cancel Transfer From Savings
```
golos.broadcast.cancelTransferFromSavings(wif, from, requestId, (err, result) => {
    console.log(err, result);
});
```
#### Transfer To Tip
```
golos.broadcast.transferToTip(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', '', '1.000 SUPER', 'Hello world!',
    [], (err, result) => {
    console.log(err, result);
});
```
#### Donate
```
golos.broadcast.donate(wif, 'alice', 'bob', '1.000 GOLOS', {app: 'golos-blog', version: 1, comment: 'Hello', target: {author: 'bob', permlink: 'test'}}, [], (err, result) => {
    console.log(err, result);
});
```
#### Invite
```
golos.broadcast.invite(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', '11.000 SUPER', 'GLS7Pbawjjr71ybgT6L2yni3B3LXYiJqEGnuFSq1MV9cjnV24dMG3',
    [], (err, result) => {
    console.log(err, result);
});
```
#### Invite Claim
```
golos.broadcast.inviteClaim(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', 'cyberfounder', '5JFZC7AtEe1wF2ce6vPAUxDeevzYkPgmtR14z9ZVgvCCtrFAaLw',
    [], (err, result) => {
    console.log(err, result);
});
```
