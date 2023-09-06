# NFT

Начиная с HF 29, в Блокчейне Golos доступны NFT (Невзаимозаменяемые Токены) - отдельный вид токенов, каждый экземпляр которых уникален, и в конкретный момент времени им обладает только один аккаунт.

Можно создать коллекцию NFT-токенов, присвоив ей некое имя, по аналогии с UIA. Например: `COOLGAME` - для токенов некой игры на платформе Golos).  
Затем можно выпустить один или несколько\много токенов в рамках этой коллекции. Каждый из них будет уникален, и может содержать в себе некую информацию в формате JSON или другом формате.  
Можно раздавать или продавать токены игрокам. Также и сами игроки смогут продавать друг другу токены, или дарить.  
Далее, игра сможет проверять, есть ли у данного игрока такой-то токен, и если есть, то давать ему те или иные бонусы  

### Создание NFT-коллекции

В приведенном выше примере коллекция создается аккаунтом-владельцем игры.

```js
const postingKey = '5HwQScueMZdELZpjVBD4gm6xhiKiMqGx18g4WtQ6wVr4nBdSxY5'
const json_metadata = '{}'
const max_token_count = 10

golos.broadcast.nftCollection(postingKey, 'cyberfounder', 'COOLGAME',
    json_metadata, max_token_count, [], (err, res) => {
        console.log(err, res)
})
```
- `COOLGAME` - уникальный идентификатор коллекции. Правила те же, что и для UIA: только латинские буквы и `.`, до 15 символов.
- `json_metadata` - метаданные коллекции (название, описание и т.п., любые даныне в формате JSON, не более 512 символов; можно оставить пустым).
- `max_token_count` - максимально возможное кол-во токенов в коллекции (по аналогии с supply у UIA). Можно поставить `4294967295` и тогда кол-во токенов фактически не будет ограничено.

Один владелец может создать не более 200 коллекций. Также, можно одновременно иметь не более 5 коллекций без единого токена.

### Выпуск токена в коллекции

```js
const activeKey = '5K67PNheLkmxkgJ5UjvR8Nyt3GVPoLEN1dMZjFuNETzrNyMecPG'
const to = 'cyberfounder'
const json_metadata = JSON.stringify({ "health": 10, "strength": 50 })

golos.broadcast.nftIssue(activeKey, 'cyberfounder', 'COOLGAME',
    to, json_metadata,  [], (err, res) => {
        console.log(err, res)
})
```
- `to` - аккаунт, который станет владельцем токена. Это может быть аккаунт владельца, или игрока, или любой другой.
- `json_metadata` - метаданные, которые будут храниться в токене. Они публичны и не шифруются. JSON, Не более 512 символов. Можно оставить пустым.

За выпуск токена с владельца взымается плата в GBG - см. делегатский параметр `nft_issue_cost` в chain_properties. 

### Удаление NFT-коллекции

```js
const postingKey = '5HwQScueMZdELZpjVBD4gm6xhiKiMqGx18g4WtQ6wVr4nBdSxY5'

golos.broadcast.nftCollectionDelete(postingKey, 'cyberfounder', 'ABC', [], (err, res) => {
        console.log(err, res)
})
```

Удалить NFT-коллекцию можно только пока в ней нет токенов.

### Выставить NFT-токен на продажу

Владелец коллекции (или иной обладатель конкретного токена) может выставить его на продажу. 

```js
const activeKey = '5K67PNheLkmxkgJ5UjvR8Nyt3GVPoLEN1dMZjFuNETzrNyMecPG'
const token_id = 2
const buyer = ''
const order_id = 10
const json_metadata = JSON.stringify({ "health": 10, "strength": 50 })

golos.broadcast.nftSell(activeKey, 'alice', token_id, buyer, order_id, '10.000 GOLOS', [], (err, res) => {
        console.log(err, res)
})
```

- ``alice`` - обладатель токена.
- `token_id` - идентификатор токена.
- `buyer` - покупатель. Если токен выставляется на продажу, то пустое. Если есть чей-то ордер с заказом на покупку данного токена (см. ниже), то в `buyer` указывается его имя аккаунта.
- `order_id` - уникальный id ордера на продажу\покупку. Или (в случае с заказом) - id ордера с заказом на покупку.
- `price` - цена продажи. Если токен выставляется на продажу, то будет создан ордер, и в нем будет указана эта цена. Либо, в случае с заказом, эта цена должна быть *не больше*, чем цена покупателя (но может быть и меньше, тогда с покупателя будет списана меньшая цена, и вы также получите меньше - коль скоро считаете, что цена от покупателя слишком высока).

### Купить NFT-токен

Любой пользователь может купить NFT-токен.

```js
const activeKey = '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS'
const collectionName = ''
const token_id = 1
const buyer = ''
const order_id = 1

golos.broadcast.nftBuy(activeKey, 'cyberfounder', collectionName, token_id, order_id, '11.000 GOLOS', [], (err, res) => {
        console.log(err, res)
})
```

- `'bob'` - покупатель.
- `collectionName` - имя NFT-коллекции. Заполняется в том случае, если вы хотите купить не тот токен, который продается и продавцом создан ордер на  продажу (с помощью nftSell), а любой из токенов данной коллекции.
- `token_id` - идентификатор токена. В случае покупки любого из токенов коллекции - `0`.
- `order_id` - идентификатор ордера на продажу. В случае покупки любого из токенов коллекции - уникальный идентификатор ордера, не совпадающий ни с каким другим из *ваших* ордеров (ни на покупку, ни на продажу).
- `buyer` - покупатель. Если токен выставляется на продажу, то пустое. Если есть чей-то ордер с заказом на покупку данного токена (см. ниже), то в `buyer` указывается его имя аккаунта.
- `11.000 GOLOS` - цена. В случае покупки конкретного токена: цена должна быть *не меньше*, чем цена продавца (но может быть и больше, тогда продавец получит от вас больше, это что-то вроде "чаевых" или доната).

### Отменить ордер на покупку\продажу

Пока ордер не удовлетворен (и сделка не состоялась. т.е. никто не продал вам токен или не купил ваш токен), можно его отменить.

```js
const activeKey = '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS'
const order_id = 1

golos.broadcast.nftCancelSell(activeKey, 'alice', order_id, [], (err, res) => {
    console.log(err, res)
})
```

- `'alice'` - владелец ордера.
- `order_id` - идентификатор ордера.

### Получение NFT-коллекций через API

Получить первые 20 коллекций владельца `cyberfounder`:

```js
golos.api.getNftCollections({
    creator: 'cyberfounder',
    start_name: '',
    limit: 20,
}, (err, res) => {
    //alert(JSON.stringify(err) + ' ' + JSON.stringify(res))
    console.log(err, res)
})
```

Запрос возвращает массив с коллекциями, не более 20 коллекций. Далее, если в ответе 20 коллекций, то это означает, что у владельца могут быть еще коллекции. Чтобы получить еще коллекции, можно повторить запрос, указав `start_name` - `name` 20-й коллекции. И делать так до тех пор, пока очередной запрос не вернет < 20 коллекций.
(`name` - это идентификатор коллекции, например: `'COOLGAME'`)

`limit` может быть от 1 до 100.

Сортировка по умолчанию в алфавитном порядке. Есть также другие варианты сортировки:

```js
{
    creator: 'cyberfounder',
    start_name: '',
    limit: 20,
    sort: 'by_created', // by_last_price, by_token_count, by_market_depth, by_market_asks, by_market_volume
    reverse_sort: false // true для сортировки в обратном порядке 
}
```

Существует также возможность выбрать 1 или несколько конкретных коллекций:
```js
{
    ...
    select_names: ['GOOLGAME`]
}
```
Сортировки в этом случае не будет. Порядок коллекций будет таким же, как пордок имен в `select_names`.

Параметр `creator` можно и не указывать, тогда будут выдаваться все NFT-коллекции в системе.

Кроме того, запрос поддерживает параметры `filter_creators` (массив - черный список имен владельцев, чьи коллекции не стоит возвращать в ответе) и `filter_names` (массив - черный список идентификаторов коллекций)

### Получение NFT-токенов через API

Получить первые 20 токенов владельца `alice`:

```js
const owner = ''
golos.api.getNftTokens({
    owner: 'alice',
    start_token_id: 0,
    limit: 20, // принцип работы пагинации описан на примере getNftCollections

//  select_token_ids: [], // выборка конкретных токенов
//  filter_creators: [],
//  filter_token_ids: [],
//  filter_names: [], // игнорировать токены из этих коллекций
//  state: 'any', // или 'selling_one' - только токены которые выставлены на продажу, или 'not_selling_one' - только которые не выставлены

//  sort: 'by_name', // by_issued, by_last_update, by_last_price
//  reverse_sort: false
}, (err, res) => {
    //alert(JSON.stringify(err) + ' ' + JSON.stringify(res))
    console.log(err, res)
})
```

Поле `owner` может быть пустым - для получения любых существующих NFT-токенов в системе.

### Получение NFT-ордеров

Получить первые 20 ордеров владельца `alice`:

```js
const owner = ''
golos.api.getNftOrders({
    owner: 'alice',
    start_order_id: 0,
    limit: 20, // принцип работы пагинации описан на примере getNftCollections

//  filter_creators: [],
//  filter_owners: [],
//  filter_token_ids: [],
//  filter_names: [], // игнорировать ордеры токенов из этих коллекций
//  filter_order_ids: [],
//  type: 'both', // или 'selling' - только ордеры на продажу, или 'buying' - только ордеры на покупку

//  sort: 'by_name', // by_created, by_price
//  reverse_sort: false
}, (err, res) => {
    //alert(JSON.stringify(err) + ' ' + JSON.stringify(res))
    console.log(err, res)
})
```

Кроме того, есть возможность выбрать ордера не конкретного пользоателя, а на рынке в целом. Тогда вместо `owner` указывается `collection` с идентификатором коллекции.
