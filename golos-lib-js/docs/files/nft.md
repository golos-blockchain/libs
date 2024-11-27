# NFT

Начиная с HF 29, в Блокчейне Golos доступны NFT (Невзаимозаменяемые Токены) - отдельный вид токенов, каждый экземпляр которых уникален, и в конкретный момент времени им обладает только один аккаунт.

Можно создать коллекцию NFT-токенов, присвоив ей некое имя, по аналогии с UIA. Например: `COOLGAME` - для токенов некой игры на платформе Golos).  
Затем можно выпустить один или несколько\много токенов в рамках этой коллекции. Каждый из них будет уникален, и может содержать в себе некую информацию в формате JSON или другом формате.  
Можно раздавать или продавать токены игрокам. Также и сами игроки смогут продавать друг другу токены, или дарить.  
Далее, игра сможет проверять, есть ли у данного игрока такой-то токен, и если есть, то давать ему те или иные бонусы  

### Создание NFT-коллекции

В приведенном выше примере коллекция создается аккаунтом-владельцем игры.

```js
const activeKey = '5K67PNheLkmxkgJ5UjvR8Nyt3GVPoLEN1dMZjFuNETzrNyMecPG'
const json_metadata = '{}'
const max_token_count = 10

golos.broadcast.nftCollection(activeKey, 'cyberfounder', 'COOLGAME',
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
- `json_metadata` - метаданные, которые будут храниться в токене. Они публичны и не шифруются. JSON, Не более 32768 символов. Можно оставить пустым.

За выпуск токена с владельца взымается плата в GBG - см. делегатский параметр `nft_issue_cost` в chain_properties.

С помощью специального евента вы можете получить `token_id` - идентификатор выпущенного токена:
```js
const { api, broadcast } = golos

async function issueIt() {
    const activeKey = '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS'
    const to = 'oauth'
    const json_metadata = JSON.stringify({ "health": 10, "strength": 50 })

    let res
    try {
        res = await broadcast.nftIssueAsync(activeKey, 'cyberfounder', 'COOLGAMEG',
            to, json_metadata, [])
    } catch (err) {
        console.error('Cannot issue:', err)
        return
    }

    console.log('Issued:', res, 'Waiting for event with token_id...')

    let token_id
    try {
        token_id = await api.waitEventAsync((event) => {
            if (event[0] === 'nft_token') return event[1].token_id
            return undefined
        }, res.ref_block_num)
    } catch (err) {
        console.error('Cannot obtain token_id:', err)
        return
    }

    console.log('token_id is', token_id)
}

issueIt()
```

### Удаление NFT-коллекции

```js
const activeKey = '5K67PNheLkmxkgJ5UjvR8Nyt3GVPoLEN1dMZjFuNETzrNyMecPG'

golos.broadcast.nftCollectionDelete(activeKey, 'cyberfounder', 'ABC', [], (err, res) => {
        console.log(err, res)
})
```

Удалить NFT-коллекцию можно только пока в ней нет токенов.

### Выставить NFT-токен на продажу

Владелец коллекции (или иной обладатель конкретного токена) может продать его одним из 4 способов:
- По фиксированной цене, которую сам назначит.
- "Заказ": покупатель разместит ордер на покупку либого из токенов данной NFT-коллекции, и любой владелец токена может продать его по цене покупателя.
- **(с HF 30)** Выставить на аукционе. Указать минимальную ставку (и в какой криптовалюте), и сроки проведения аукциона. По окочнании сроков система автоматически продаст токен по максимальной цене. Пользователь не может продать токен до окончания аукциона, если не отменит его вместе со ставками.
- **(с HF 30)** Покупатели сами могут предлагать цены любому владельцу NFT, даже если он не собирался его продавать. Цены могут быть в любой из доступных криптовалют. Если какое-то предложение его устроит, то он продаст токен.

#### Продать по фиксированной цене

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
- `price` - цена продажи. Если токен выставляется на продажу, то будет создан ордер, и в нем будет указана эта цена. Либо, в случае с заказом (см. выше), эта цена должна быть *не больше*, чем цена покупателя (но может быть и меньше, тогда с покупателя будет списана меньшая цена, и вы также получите меньше - коль скоро считаете, что цена от покупателя слишком высока).

#### Продать на аукционе (с HF 30)

```js
async function main() {
    const { api, broadcast } = golos

    const activeKey = '5K67PNheLkmxkgJ5UjvR8Nyt3GVPoLEN1dMZjFuNETzrNyMecPG'
    const token_id = 2
    const min_price = '1.000 GOLOS' // а в случае отмены начатого аукциона надо поставить '0.000 GOLOS'

    let gprops
    try {
        gprops = await api.getDynamicGlobalProperties()
    } catch (err) {
        console.error('Cannot get head block time', err)
        throw err
    }
    // как работать с датами Golos:
    let expiration = new Date(gprops.time)
    expiration.setSeconds(expiration.getSeconds() + 7*24*3600) // 7 дней
    expiration = expiration.toISOString().split('.')[0]

    let res
    try {
        res = await broadcast.nftAuctionAsync(activeKey, 'alice', token_id, min_price, expiration, [])
    } catch (err) {
        console.error(err)
        throw err
    }
    console.log(res)
}

main()
```

### Купить NFT-токен

Любой пользователь может купить NFT-токен.
Существует 4 способа покупки:
- купить токен, выставленный на продажу продавцом, по цене продавца;
- создать ордер на покупку любого токена из коллекции, затем владелец любого токена может продать токен по вашей цене;
- начиная с **HF 30**: "предложения": даже если токен не продается владельцем, любой пользователь может создать свой ордер на покупку этого токена по своей цене. Продавец может продать токен тому, у кого цена будет наибольшей.
- начиная с **HF 30**: "аукцион": владелец выставляет токен на аукцион, указав минимальную ставку и срок аукциона, пользователи делают ставки, спустя срок система автоматически продаст токен по макс. ставке.

```js
const activeKey = '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS'
const collectionName = ''
const token_id = 1
const order_id = 1

golos.broadcast.nftBuy(activeKey, 'cyberfounder', collectionName, token_id, order_id, '11.000 GOLOS', [], (err, res) => {
    console.log(err, res)
})
```

- `'bob'` - покупатель.
- `collectionName` - имя NFT-коллекции. Заполняется в том случае, если вы хотите купить любой из токенов данной коллекции, а также заполняется наряду с `token_id` в случае "предложения" (если вы сами предлагаете цену). Не заполняется в случае "аукциона" или покупки токена, выставленного на продажу по фикс. цене.
- `token_id` - идентификатор токена. В случае покупки любого из токенов коллекции - `0`.
- `order_id` - идентификатор ордера на продажу. В случае покупки любого из токенов коллекции - уникальный идентификатор ордера, не совпадающий ни с каким другим из *ваших* ордеров (ни на покупку, ни на продажу). В случае "аукциона" - 0.
- `11.000 GOLOS` - цена. В случае покупки токена, выставленного на продажу: цена должна быть *не меньше*, чем цена продавца (но может быть и больше, тогда продавец получит от вас больше, это что-то вроде "чаевых" или доната). В случае варианта "предложения": ваша цена не должна быть равна цене другого покупателя на этот же токен. В случае варианта "аукцион": аналогично.

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

### Подарить (передать) NFT-токен

```js
const activeKey = '5K67PNheLkmxkgJ5UjvR8Nyt3GVPoLEN1dMZjFuNETzrNyMecPG'
const token_id = 1
const memo = ''

golos.broadcast.nftTransfer(activeKey, token_id, 'alice', 'bob', memo, [], (err, res) => {
    console.log(err, res)
})
```

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

//  select_collections: [], // выбирает токены из заданных коллекций
//  collection_limit: 1, // Например - чтобы в списке коллекций (getNftCollections) добавить к каждой коллекции информацию о первом токене в ней

//  select_token_ids: [], // выборка конкретных токенов
//  filter_creators: [],
//  filter_token_ids: [],
//  filter_names: [], // игнорировать токены из этих коллекций
//  state: 'any_not_burnt', // 'selling_only' - только токены которые выставлены на продажу, или 'not_selling_only' - только которые не выставлены; 'selling_auction_only', 'selling_not_auction_only', 'any_not_burnt', 'burnt_only', 'any'

//  sort: 'by_name', // by_issued, by_last_update, by_last_price
//  reverse_sort: false,

//  illformed: 'sort_down',  // 'nothing', 'ignore' - what to do with tokens without title and/or image
//  selling_sorting: 'nothing', // 'sort_up', 'sort_up_by_price'
//  sorting_priority: 'selling' // 'illformed'
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

//  select_collections: [], // выбирает ордеры из заданных коллекций
//  select_token_ids: [123], // выбирает ордеры по конкретному токену (или токенам). Полезно для варианта "аукцион".
//  collection_limit: 1, // Например - чтобы в списке коллекций (getNftCollections) добавить к каждой коллекции информацию о первом ордере в ней

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

### Получение NFT-ставок

Получить первые 20 ставок:

```js
const owner = ''
golos.api.getNftBets({
    owner: 'alice', // ставки пользователя alice. Или оставить пустым, если нужны ставки разных пользователей по конкретному токену

    start_bet_id: 0,
    limit: 20, // принцип работы пагинации описан на примере getNftCollections

//  select_token_ids: [123], // получить все ставки по конкретному токену

//  tokens, // загрузить также данные о токенах, по которым сделаны ставки (картинка и т.п.)
}, (err, res) => {
    //alert(JSON.stringify(err) + ' ' + JSON.stringify(res))
    console.log(err, res)
})
```

