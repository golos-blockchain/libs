## Worker API

### Get Worker Requests
```
// query: limit, start_author, start_permlink, select_authors, select_states
// sort: by_created, by_net_rshares, by_upvotes, by_downvotes
// state: created, payment, payment_complete, closed_by_author, closed_by_expiration, closed_by_voters
golos.api.getWorkerRequests(query, sort, fillPosts, function(err, result) {
  console.log(err, result);
});
```
### Get Worker Request Votes
```
golos.api.getWorkerRequestVotes(author, permlink, startVoter, limit, function(err, result) {
  console.log(err, result);
});
```
