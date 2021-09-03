# Документация

- [Авторизация](./files/auth.md)
- [Database API](./files/database.md)
    - [Подписка на события](./files/database.md#подписка-на-события)
    - [Тэги постов](./files/database.md#тэги-постов)
    - [Блоки и транзакции](./files/database.md#блоки-и-транзакции)
    - [Глобальные объекты](./files/database.md#глобальные-объекты)
    - [Ключи](./files/database.md#ключи)
    - [Аккаунты](./files/database.md#аккаунты)
    - [Authority и валидация](./files/database.md#authority-и-валидация)
    - [Посты и комментарии](./files/database.md#посты-и-комментарии)
    - [Голосование за посты](./files/database.md#голосование-за-посты)
    - [Делегаты](./files/database.md#делегаты)
- [Подписчики](./files/follow.md)
- [Воркеры](./files/workers.md)
- [Внутренняя биржа](./files/market.md)
- [UIA](./files/UIA.md)
- [Отправка операций](./files/broadcast.md)
- [Примеры отправки операций](./files/broadcast.md#примеры-отправки-операций)
- [Golos Messenger](./files/msgs.md)
- [Formatter](./files/formatter.md)
- [Утилиты, ускоряющие разработку клиентов](./files/utils.md)
    - [Валидация имен аккаунтов](./files/utils.md#валидация-имен-аккаунтов)
    - [Asset для финансовых расчетов](./files/utils.md#asset-для-финансовых-расчетов)

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
