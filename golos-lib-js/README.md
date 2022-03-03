# golos-lib-js

Golos.js - JavaScript API для блокчейна Golos.

[![npm version](https://badge.fury.io/js/golos-lib-js.svg)](https://badge.fury.io/js/golos-lib-js)

## Установка
```
$ npm install golos-lib-js --save
```

Полная документация здесь:
https://github.com/golos-blockchain/libs/tree/master/golos-lib-js/docs

#### React и Webpack 5

В этом случае есть свои важные нюансы, описано [здесь](./docs/files/webpack5.md).

## Использование без npm/yarn

Библиотека доступна на [jsDelivr CDN](https://cdn.jsdelivr.net/npm/golos-lib-js@latest/dist/golos.min.js) и [Unpkg CDN](https://unpkg.com/golos-lib-js@latest/dist/golos.min.js), и может быть использована в любых Web-страницах, даже если вы не используете Node.js. Просто добавьте ее через `<script>`, как показано в примере ниже. Проблем с полифиллами в этом случае нет, все включено в саму библиотеку. Все, что нужно, - это браузер.

```html 
<script src="./golos.min.js"></script>
<script>
// По умолчанию библиотека подключается к одной из нод майннета блокчейна Golos
golos.api.getAccounts(['ned', 'dan'], (err, response) => {
    console.log(err, response);
});
</script>
```

## Загрузка модуля WebAssembly

[См. здесь](https://github.com/golos-blockchain/libs/tree/master/golos-lib-js/docs/files/wasm.md).

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

## Примеры

Проголосовать за пост или комментарий:
```js
var golos = require('golos');

var wif = golos.auth.toWif(username, password, 'posting');
golos.broadcast.vote(wif, voter, author, permlink, weight, (err, result) => {
    console.log(err, result);
});
```

Получить данные об аккаунтах:
```js
golos.api.getAccounts(['ned', 'dan'], (err, result) => {
    console.log(err, result);
});
```

Прочие примеры см. в [документации](https://github.com/golos-blockchain/libs/tree/master/golos-lib-js/docs).

## Issues
Если вы нашли какой-то баг, пожалуйста, сообщите об этом, создав issue!

## Лицензия
MIT
