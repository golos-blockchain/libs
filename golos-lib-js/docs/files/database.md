# Database API

### Подписка на события

#### Подписаться на транзакции
```js
golos.api.setPendingTransactionCallback(cb, (err, result) => {
    console.log(err, result);
});
```
#### Подписаться на блоки
```js
golos.api.setBlockAppliedCallback(cb, (err, result) => {
    console.log(err, result);
});
```

### Тэги постов

#### Получить популярные тэги
```js
golos.api.getTrendingTags(afterTag, limit, (err, result) => {
    console.log(err, result);
});
```
#### Получить посты по популярности
```js
golos.api.getDiscussionsByTrending(query, (err, result) => {
    console.log(err, result);
});
```
##### Пример:
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
golos.api.getDiscussionsByTrending(query, (err, result) => {
    //console.log(err, result);
    if (!err) {
        for (const item of result) {
            console.log('getDiscussionsByTrending', item.title);
        }
    }
    else console.error(err);
});
```
#### Получить посты по дате создания (от новых к старым)
```js
golos.api.getDiscussionsByCreated(query, (err, result) => {
    console.log(err, result);
});
```
#### Получить посты по активности
```js
golos.api.getDiscussionsByActive(query, (err, result) => {
    console.log(err, result);
});
```
#### Получить посты по выплатам
```js
golos.api.getDiscussionsByCashout(query, (err, result) => {
    console.log(err, result);
});
```
#### Получить посты по выплатам
```js
golos.api.getDiscussionsByPayout(query, (err, result) => {
    console.log(err, result);
});
```
#### Получить посты по лайкам\дизлайкам
```js
golos.api.getDiscussionsByVotes(query, (err, result) => {
    console.log(err, result);
});
```
#### Получить посты по кол-ву комментариев
```js
golos.api.getDiscussionsByChildren(query, (err, result) => {
    console.log(err, result);
});
```
#### Получить горячие посты
```js
golos.api.getDiscussionsByHot(query, (err, result) => {
    console.log(err, result);
});
```
#### Получить посты в ленте
```js
golos.api.getDiscussionsByFeed(query, (err, result) => {
    console.log(err, result);
});
```
#### Получить посты в блоге
```js
golos.api.getDiscussionsByBlog(query, (err, result) => {
    console.log(err, result);
});
```
##### Пример:
```js
/**
 * getDiscussionsByBlog() receiving posts by author and tag
 * @param {Object} query - search object that includes the author, tag, limit
*/
var query = {
    select_authors: ['epexa'],
    select_tags: ['dev'],
    limit: 100,
};
golos.api.getDiscussionsByBlog(query, (err, result) => {
    //console.log(err, result);
    if (!err) {
        for (const item of result) {
            console.log('getDiscussionsByBlog', item.title);
        }
    }
    else console.error(err);
});
```
#### Получить посты по кол-ву комментариев
```js
golos.api.getDiscussionsByComments(query, (err, result) => {
    console.log(err, result);
});
```

### Блоки и транзакции

#### Получить заголовок блока
```js
golos.api.getBlockHeader(blockNum, (err, result) => {
    console.log(err, result);
});
```
#### Получить блок
```js
golos.api.getBlock(blockNum, (err, result) => {
    console.log(err, result);
});
```

### Глобальные объекты

#### Получить конфиг ноды
```js
golos.api.getConfig((err, result) => {
    console.log(err, result);
});
```
#### Получить DGP
```js
golos.api.getDynamicGlobalProperties((err, result) => {
    console.log(err, result);
});
```
#### Получить параметры чейна (выбираемые голосованием делегатов)
```js
golos.api.getChainProperties((err, result) => {
    console.log(err, result);
});
```
#### Get Current Median History Price
```js
golos.api.getCurrentMedianHistoryPrice((err, result) => {
    console.log(err, result);
});
```
#### Получить текущий хардфорк Golos
```js
golos.api.getHardforkVersion((err, result) => {
    console.log(err, result);
});
```

### Ключи

#### Get Key References
```js
golos.api.getKeyReferences(key, (err, result) => {
    console.log(err, result);
});
```
##### Пример:
```js
var publicKeys = ['GLS6...', 'GLS6...'];
golos.api.getKeyReferences(publicKeys, (err, result) => {
    //console.log(err, result);
    if (!err) {
        for (const item of result) {
            console.log('getKeyReferences', 'username: [', item[0], ']');
        }
    }
    else console.error(err);
});
```

### Аккаунты

#### Получить данные об аккаунтах
Балансы GOLOS, GBG и GESTS. Кол-во постов, комментариев. Дата регистрации. И другое...
```js
golos.api.getAccounts(names, (err, result) => {
    console.log(err, result);
});
```
##### Пример:
```js
var accounts = [ 'epexa', 'epexa2' ];
golos.api.getAccounts(accounts, (err, result) => {
    //console.log(err, result);
    if (!err) {
        for (const item of result) {
            console.log('getAccounts', 'username: [', item.name, '] id: [', item.id, ']');
        }
    }
    else console.error(err);
});
```
#### Получить UIA-балансы аккаунтов
```js
golos.api.getAccountsBalances(accounts, (err, result) => {
    console.log(err, result);
});
```
##### Пример:
```js
var accounts = [ 'epexa', 'epexa2' ];
golos.api.getAccountsBalances(accounts, (err, result) => {
    //console.log(err, result);
    if (!err) {
        for (const item of result) {
            console.log('Account\'s UIAs', item);
        }
    }
    else console.error(err);
});
```
#### Поиск имен аккаунтов
Рекомендуется для использования в input'ах с автодополнением.
```js
golos.api.lookupAccountNames(accountNames, (err, result) => {
    console.log(err, result);
});
```
##### Пример:
```js
var usernames = ['epexa', 'epexa2'];
golos.api.lookupAccountNames(usernames, (err, result) => {
    //console.log(err, result);
    if (!err) {
        for (const item of result) {
            if (item) console.log('lookupAccountNames', 'username: [', item.name, '] id: [', item.id, ']');
            else console.log('lookupAccountNames', 'account not found!');
        }
    }
    else console.error(err);
});
```
#### Поиск аккаунтов
```js
golos.api.lookupAccounts(lowerBoundName, limit, (err, result) => {
    console.log(err, result);
});
```
##### Пример:
```js
var searchAccountsQuery = 'epe';
var limitResults = 10;
golos.api.lookupAccounts(searchAccountsQuery, limitResults, (err, result) => {
    //console.log(err, result);
    if (!err) {
        for (const item of result) {
            console.log('lookupAccounts', 'username: [', item, ']');
        }
    }
    else console.error(err);
});
```
#### Получить кол-во аккаунтов в БЧ
```js
golos.api.getAccountCount((err, result) => {
    console.log(err, result);
});
```
#### Получить запросы на конвертацию GOLOS-GBG и обратно
```js
golos.api.getConversionRequests(accountName, (err, result) => {
    console.log(err, result);
});
```
#### Получить историю операций аккаунта
```js
golos.api.getAccountHistory(account, from, limit, (err, result) => {
    console.log(err, result);
});
```js
#### Get Owner History
```
golos.api.getOwnerHistory(account, (err, result) => {
    console.log(err, result);
});
```
#### Получить запрос на восстановление доступа к аккаунту
```js
golos.api.getRecoveryRequest(account, (err, result) => {
    console.log(err, result);
});
```

### Authority и валидация

#### Get Transaction Hex
```js
golos.api.getTransactionHex(trx, (err, result) => {
    console.log(err, result);
});
```
#### Get Transaction
```js
golos.api.getTransaction(trxId, (err, result) => {
    console.log(err, result);
});
```
#### Get Required Signatures
```
golos.api.getRequiredSignatures(trx, availableKeys, (err, result) => {
    console.log(err, result);
});
```
#### Get Potential Signatures
```js
golos.api.getPotentialSignatures(trx, (err, result) => {
    console.log(err, result);
});
```
#### Verify Authority
```js
golos.api.verifyAuthority(trx, (err, result) => {
    console.log(err, result);
});
```
#### Verify Account Authority
```js
golos.api.verifyAccountAuthority(nameOrId, signers, (err, result) => {
    console.log(err, result);
});
```

### Посты и комментарии

Идентификатор поста или комментария состоит из автора и пермлинка.
Например, в этом URL:
https://golos.id/@hipster/post-dobra
равно как и в этом:
https://golos.id/ru--vpered/@hipster/post-dobra
Идентификатором поста будет пара: hipster (автор) и post-dobra (пермлинк).

#### Получить пост или комментарий
```
golos.api.getContent(author, permlink, (err, result) => {
    console.log(err, result);
});
```
##### Пример:
```js
/**
 * getContent() получает пост\комментарий
 * @param {String} author - автор
 * @param {String} permlink - URL, уникальный для автора
*/
var author = 'hipster';
var permlink = 'post-dobra'; // https://golos.id/@hipster/post-dobra
golos.api.getContent(author, permlink, (err, result) => {
    //console.log(err, result);
    if (!err) {
        console.log('getContent', result.title);
    }
    else console.error(err);
});
```
#### Получить комментарии под постом или комментарием
```
golos.api.getContentReplies(parent, parentPermlink, (err, result) => {
    console.log(err, result);
});
```
##### Пример:
```js
/**
 * getContentReplies() получает дочерние комментарии
 * @param {String} parent - автор
 * @param {String} parentPermlink - URL, уникальный для автора
*/
var parent = 'epexa';
var parentPermlink = 'test-url';
golos.api.getContentReplies(parent, parentPermlink, (err, result) => {
    //console.log(err, result);
    if (!err) {
        result.forEach(function(item) {
            console.log('getContentReplies', item.body);
        });
    }
    else console.error(err);
});
```
#### Get Discussions By Author Before Date
```
golos.api.getDiscussionsByAuthorBeforeDate(author, startPermlink, beforeDate, limit, (err, result) => {
    console.log(err, result);
});
```
#### Get Replies By Last Update
```
golos.api.getRepliesByLastUpdate(startAuthor, startPermlink, limit, (err, result) => {
    console.log(err, result);
});
```

### Голосование за посты

Лайки\дизлайки на постах и комментариях.

#### Получить голоса, находящиеся в пределах окна голосования (7 дней)
```js
golos.api.getActiveVotes(author, permlink, (err, result) => {
    console.log(err, result);
});
```
#### Получить голоса, отданные аккаунтом
```js
golos.api.getAccountVotes(voter, (err, result) => {
    console.log(err, result);
});
```

### Делегаты

#### Получить делегатов по id
```js
golos.api.getWitnesses(witnessIds, (err, result) => {
    console.log(err, result);
});
```
#### Получить делегата по аккаунту
```js
golos.api.getWitnessByAccount(accountName, (err, result) => {
    console.log(err, result);
});
```
#### Получить ТОП делегатов (по голосам пользователей)
```js
golos.api.getWitnessesByVote(from, limit, (err, result) => {
    console.log(err, result);
});
```
#### Поиск аккаунтов-делегатов
```js
golos.api.lookupWitnessAccounts(lowerBoundName, limit, (err, result) => {
    console.log(err, result);
});
```
#### Получить активных делегатов
```js
golos.api.getActiveWitnesses((err, result) => {
    console.log(err, result);
});
```
