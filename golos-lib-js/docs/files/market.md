### Внутренняя биржа

#### Get Ticker
```js
/**
 * getTicker() receive statistic values of the internal GBG:GOLOS market for the last 24 hours
 * Market pair is optional. If omitted - will be equal to ["GOLOS", "GBG"].
*/
golos.api.getTicker(["GOLOS", "GBG"], (err, result) => {
    console.log(err, result);
});
```
#### Получить открытые ордеры в стаканах заданной пары
```js
/**
 * Market pair is optional. If omitted - will be equal to ["GOLOS", "GBG"].
*/
golos.api.getOrderBook(limit, ["GOLOS", "GBG"], (err, result) => {
    console.log(err, result);
});
```
#### Получить открытые ордеры заданного пользователя
```js
/**
 * Market pair is optional. If omitted - will be equal to ["GOLOS", "GBG"].
*/
golos.api.getOpenOrders(owner, ["GOLOS", "GBG"], (err, result) => {
    console.log(err, result);
});
```

#### Создать ордер
```js
golos.broadcast.limitOrderCreate(wif, owner, orderid, amountToSell, minToReceive, fillOrKill, expiration, function(err, result) => {
    console.log(err, result);
});
```
##### Пример:
```js
let wif = '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS'; // active private key

let orderid = Math.floor(Date.now() / 1000); // it is golos-ui way and it is preferred

let expiration = new Date();
expiration.setHours(expiration.getHours() + 1);
expiration = expiration.toISOString().substr(0, 19); // i.e. 2020-09-07T11:33:00

golos.broadcast.limitOrderCreate(wif, 'cyberfounder', orderid, '1000.000000 AAA', '1000.000 BBB', false, expiration, (err, res) => {
    if (err) {
        console.log(err);
        alert(err);
        return;
    }
    alert('order created');
});
```
Hint: to detect what order is filled you can:  
a) create order with fillOrKill = true, which will fail order creation if not filled instantly,  
b) or use callbacks to wait until order is filled,  
c) or repeative call `getAccountHistory` to wait until order is filled: 
```js
// 1st argument is owner of one of two orders in pair
golos.api.getAccountHistory('cyberfounder', -1, 1000, {select_ops: [ 'fill_order']}, (err, result) => {
    // repeat call if still not filled
});
```
#### Отменить ордер
```js
golos.broadcast.limitOrderCancel(wif, owner, orderid, (err, result) => {
    console.log(err, result);
});
```
##### Пример:
```js
let wif = '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS'; // active private key

golos.broadcast.limitOrderCancel(wif, 'cyberfounder', orderid, (err, res) => {
    if (err) {
        console.log(err);
        alert(err);
        return;
    }
    alert('order canceled');
});
```
