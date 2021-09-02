### Воркеры

#### Получение заявок на работу
```js
// query: объект, состоящий из полей: limit, start_author, start_permlink, select_authors, select_states
// sort: `by_created`, `by_net_rshares`, `by_upvotes` или `by_downvotes`
// state: `created`, `payment`, `payment_complete`, `closed_by_author`, `closed_by_expiration`, `closed_by_voters`
golos.api.getWorkerRequests(query, sort, fillPosts, (err, result) => {
    console.log(err, result);
});
```
#### Получение списка голосов ("лайков\дизлайков") под заявкой
```js
golos.api.getWorkerRequestVotes(author, permlink, startVoter, limit, (err, result) => {
    console.log(err, result);
});
```
