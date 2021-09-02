# Documentation

- [Database](#api)
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

# Install
```
$ npm install golos-classic-js --save
```

or

```
$ npm install git+https://github.com/golos-blockchain/golos-lib-js.git --save
```

# Browser 
Online library minify js available in [jsDelivr CND](https://cdn.jsdelivr.net/npm/golos-classic-js@latest/dist/golos.min.js) and [Unpkg CDN](https://unpkg.com/golos-classic-js@latest/dist/golos.min.js).

```html 
<script src="./golos.min.js"></script>
<script>
golos.api.getAccounts(['ned', 'dan'], function(err, response){
    console.log(err, response);
});
</script>
```

## WebSockets and HTTP transport

Library support 2 transport types: ws, wss for websocket and http, https for pure HTTP JSONRPC.

wss://api-golos.blckchnd.com/ws<br/>
wss://api.aleksw.space/ws<br/>
wss://golos.lexai.host/ws<br/>

https://api-golos.blckchnd.com/<br/>
https://api.aleksw.space/<br/>
https://golos.lexai.host/<br/>

```js
golos.config.set('websocket','wss://golos.lexai.host/ws');
```
or
```js
golos.config.set('websocket','https://golos.lexai.host/');
```
