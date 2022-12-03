### UIA

#### Получить информацию о токенах (supply, владелец и т.п.)

Все UIA-токены в системе:

```js
// creator: ''
// symbols: []
// start symbol: '' // для получения следующей страницы используйте symbol последнего UIA из прошлой выдачи, например: YMDASH
// limit: 20 // макс. кол-во UIA за 1 запрос
const res = await golos.api.getAssetsAsync('', [], '', 20)
console.log(res);
```

Все токены в системе, как UIA, так и GOLOS и GBG в том же унифицированном формате:

```js
const res = await golos.api.getAssetsAsync('', [], '', 20, 'by_symbol_name', { system: true })
console.log(res);
```

Конкретные токены:

```js
const res = await golos.api.getAssetsAsync('', ['GOLOS', 'GBG'])
console.log(res);
```

Токены, созданные конкретным владельцем:

```js
const res = await golos.api.getAssetsAsync('ecurrex-ru')
console.log(res);
```

#### Получить информацию о UIA-балансах

Все UIA-балансы данного пользователя:

```js
const res = await golos.api.getAccountsBalancesAsync(['your_name'])
console.log(res);
```

Все балансы данного пользователя, в том числе GOLOS и GBG в том же формате:

```js
const res = await golos.api.getAccountsBalancesAsync(['your_name'], { system: true })
console.log(res);
```

Балансы данного пользователя в указанных токенах:

```js
const res = await golos.api.getAccountsBalancesAsync(['your_name'], { symbols: ['YMDASH', 'GOLOS', 'GBG'] })
console.log(res);
```

#### Создание своего токена
```js
golos.broadcast.assetCreate(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', '1000.000 SUPER', true, true, "{\"image_url\":\"https://market.rudex.org/asset-symbols/rudex.golos.png\",\"description\":\"https://golos.id/\"}",
    [], function(err, result) {
  console.log(err, result);
});
```
#### Редактирование токена
```js
golos.broadcast.assetUpdate(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', 'SUPER', ['GOLOS'], 10000, "{\"image_url\":\"https://market.rudex.org/asset-symbols/rudex.golos.png\",\"description\":\"http://golos.id/\"}",
    [], function(err, result) {
  console.log(err, result);
});
```
#### Выпуск токена
"Напечатать" определенную сумму токена.
```js
golos.broadcast.assetIssue(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', '1000.000 SUPER', '',
    [], function(err, result) {
  console.log(err, result);
});
```
#### Возврат средств с баланса пользователя (если токен это поддерживает)
```js
golos.broadcast.overrideTransfer(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', 'test', 'test2', '1.000 SUPER', 'Hello world!',
    [], function(err, result) {
  console.log(err, result);
});
```
#### Передача прав на токен другому пользователю
```js
golos.broadcast.assetTransfer(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', 'SUPER', 'test',
    [], function(err, result) {
  console.log(err, result);
});
```
