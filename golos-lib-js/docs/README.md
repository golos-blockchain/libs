# Documentation

- [Database API](#api)
    - [Subscriptions](#subscriptions)
    - [Tags](#tags)
    - [Blocks and transactions](#blocks-and-transactions)
    - [Globals](#globals)
    - [Keys](#keys)
    - [Accounts](#accounts)
    - [Authority / validation](#authority--validation)
    - [Votes](#votes)
    - [Content](#content)
    - [Witnesses](#witnesses)
- [Login](#login)
- [Follow](#follow-api)
- [Worker](#worker-api)
- [Market](#market)
- [UIA](#uia-examples)
- [Broadcast API](#broadcast-api)
- [Broadcast](#broadcast)
- [Auth](#auth)
- [Private Messages](#private-messages)
- [Formatter](#formatter)
- [Utils](#utils)

## Установка
```
$ npm install golos-lib-js --save
```

Полная документация здесь:
https://github.com/golos-blockchain/libs/tree/master/golos-lib-js/docs

## Использование без npm/yarn

Библиотека доступна на [jsDelivr CND](https://cdn.jsdelivr.net/npm/golos-lib-js@latest/dist/golos.min.js) и [Unpkg CDN](https://unpkg.com/golos-lib-js@latest/dist/golos.min.js), и позволяет использовать библиотеку в любом проекте, даже не использующем Node.js. Все, что нужно, - это браузер.

```html 
<script src="./golos.min.js"></script>
<script>
// По умолчанию библиотека подключается к одной из нод майннета блокчейна Golos
golos.api.getAccounts(['ned', 'dan'], (err, response) => {
    console.log(err, response);
});
</script>
```

## Протоколы WebSockets и HTTP

Библиотека поддерживает 2 транспортных протокола: ws/wss и http/https, для общения с нодами блокчейна Golos. Данные внутри библиотеки передаются в формате JSON-RPC.

Рекомендуемые ноды:

wss://api-golos.blckchnd.com/ws<br/>
wss://api.aleksw.space/ws<br/>
wss://golos.lexai.host/ws<br/>

https://api-golos.blckchnd.com/<br/>
https://api.aleksw.space/<br/>
https://golos.lexai.host/<br/>

```js
golos.config.set('websocket','wss://golos.lexai.host/ws');
```
или
```js
golos.config.set('websocket','https://golos.lexai.host/');
```
