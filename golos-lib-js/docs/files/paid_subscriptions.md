# Платные подписки

Начиная с HF 29, в Блокчейне Golos доступна подсистема платных подписок. Авторы могут создавать игры, боты, сервисы и взымать плату с пользователей за их использование. Сервисы смогут через API проверять, подписан ли тот или иной пользователь, или нет. Оплату можно взымать токенами GOLOS и любыми UIA, как с TIP-баланса, так и с ликвидного, а также токенами GBG.

Существует 3 варианта платных подписок:
- Пожизненная подписка. Пользователь 1 раз вносит требуемую сумму, и блокчейн пожизненно считает его подписчиком, пока пользователь сам не отпишется.
- Подписка с **регулярными автоплатежами**. Пользователь вносит сумму за первый период, например, 30 дней; затем каждые 30 дней блокчейн автоматически списывает такую же сумму с его баланса. Если однажды средств на балансе не хватит, то подписка станет неактивной. Пользователь сможет продлить ее, повторно внеся средства.
- Подписка с **регулярными автоплатежами и предоплатой**. В этом варианте пользователь может внести сумму сразу за несколько периодов, сумма будет храниться на балансе подписки и с него переводиться автору. Однако этот вариант накладывает некоторые ограничения на автора, об этом ниже.

### Создание сущности для подписки

Создается автором.

```js
const postingKey = '...'
const oid = { app: 'game', name: 'access', version: 1 }
const cost = '10.000 GOLOS'
const tipCost = false
const allowPrepaid = false
const intervalSec = 30
const executions = 3
golos.broadcast.paidSubscriptionCreate(postingKey, 'cyberfounder', oid,
    cost, tipCost, allowPrepaid, intervalSec, executions, [], (err, res) => {
        console.log(err, res)
})
```
- `oid` - уникальный идентификатор сущности. Обязательно содержит поля:
  - `app` - строка до 16 символов, поддерживаются те же символы, что и в никах (именах аккаунтов). Имя сервиса\бота\игры.
  - `name` - также строка до 16 символов. Услуга\товар\сущность, за которую нужно платить.
  - `version` - версия услуги\товара\сущности. При создании новой версии, автоматического переноса подписчиков из старой версии нет.
- `tipCost` - взымать оплату токенами с TIP-баланса, если `true`. Иначе - ликвидными.
- `allowPrepaid` - создать подписку с предоплатой.
- `intervalSec` - интервал между автоплатежами, в секундах. Например, `30*24*3600` - для автоплатежа каждые 30 дней. При создании пожизненной подписки, интервал должен быть 0.
- `executions` - на сколько интервалов предоставляется подписка (не считая первого интервала). Например, если интервал 30 дней, и executions = **5**, то подписка действует **6** месяцев; плата за 1-й месяц взымается при подписке, а затем каждый месяц происходит автоплатеж. Для пожизненной подписки (без автоплатежей) - 0. Для подписки с бесконечными автоплатежами - 4294967295. 
- `cost` - цена подписки за 1 интервал. Либо, если она пожизненная, то цена подписки за всё время.

### Подписка пользователем на сущность

```js
const activeKey = '...' // или postingKey, если fromTip = true
const oid = { app: 'game', name: 'access', version: 1 }
const amount = '10.000 GOLOS'
const memo = ''
const fromTip = false
golos.broadcast.paidSubscriptionTransfer(activeKey, 'alice', 'cyberfounder', oid,
    amount, memo, fromTip, [], (err, res) => {
        console.log(err, res)
})
```
- `fromTip` - если true, то переводить с TIP-баланса (подписка должна иметь `tipCost` = true).

При этом действии с баланса подписчика сразу взымается `amount`.
- Если подписка пожизненная (без автоплатежей), то `amount` может быть больше, чем цена подписки. Все эти средства будут мгновенно переведены автору подписки.
- Если подписка периодическая и разрешает предоплату, то `amount` также может быть больше, чем цена подписки. Цена подписки сразу переводится автору, а остальные средства кладутся на баланс подписки для дальнейшей оплаты автоплатежей.
- Если подписка периодическая и не разрешает предоплату, то `amount` должен быть строго равен цене подписки.

### Изменение условий подписки автором

```js
const postingKey = '...'
const oid = { app: 'game', name: 'access', version: 1 }
const cost = '10.000 GOLOS'
const tipCost = false
const intervalSec = 30
const executions = 3
golos.broadcast.paidSubscriptionUpdate(postingKey, 'cyberfounder', oid,
    cost, tipCost, intervalSec, executions, [], (err, res) => {
        console.log(err, res)
})
```

Если подписка пожизненная или периодическая с предоплатой, то можно изменить любые условия (`cost`, `tip_cost`, `interval`, `executions`), но они будут изменены только для новых подписчиков. У прежних подписчиков останутся прежние условия.

Если подписка периодическая без предоплаты, то изменить можно только `cost` (например, в случае падения курса токена автор может увеличить цену, или перейти на другой токен), остальные условия должны быть указаны прежние. Но `cost` будет изменен как для новых, так и для уже действующих подписчиков.

### Получение подписчиков, проверка состояния подписки

Получить список подписчиков можно с помощью следующего API-метода (писать код нужно в async-функции):

```js
let resp = []
try {
    resp = await golos.api.getPaidSubscribersAsync({
        author: 'cyberfounder',
        oid: { app: 'game', name: 'access', version: 1 },
        from: '',
        limit: 20,
        sort: 'by_name',
        state: 'active_inactive'
    })
} catch (err) {
    console.error(err)
    //alert(err.toString())
}
console.log(resp)
//alert(JSON.stringify(resp))
```

В списке будут все подписчики (объекты с текущим состоянием подписок), как активные, так и неактивные. Неактивные подписчики - это те, у которых закончилась подписка (закончились `executions`) либо не хватило средств на очередной автоплатеж, если они не продлили свою подписку после этого.

Если `state` указать `active`, то это позволит получить список только активных подписчиков. `inactive` - только неактивных. 

Если подписчиков много, то за 1 запрос можно получить не всех подписчиков, а только первую порцию, чтобы не перегружать ноду и сетевой канал. Рекомендуется `limit: 20`. Чтобы получить следующую порцию подписчиков, отправляйте новый запрос, указав в параметре `from` имя последнего подписчика из текущей порции. Когда размер массива `response` станет меньше 20, это будет означать, что больше порций нет.

Если нужно получить список подписчиков отсортированным по убыванию даты подписки (сначала более новые) можно указать `sort: 'by_date'`

Кроме того, вы можете проверить конкретных пользователей, являются ли они вашими подписчиками, добавив в запрос следующий параметр:
```js
        select_subscribers: ['alice', 'bob']
```
Тогда в списке будут объекты только выбранных пользователей, а если кто-то из них не подписан, то его объекта в ответе не будет.

А еще есть специальный API-метод для проверки, подписан ли конкретный пользователь:

```js
let resp = {}
try {
    resp = await golos.api.getPaidSubscribeAsync({
        author: 'cyberfounder',
        oid: { app: 'game', name: 'access', version: 1 },
        subscriber: 'alice',
    })
} catch (err) {
    console.error(err)
    //alert(err.toString())
}
console.log(resp)
//alert(JSON.stringify(resp))
```

Если `resp.subscriber` будет пустой строкой, то пользователь не подписан.

Если `resp.active` будет `false`, то пользователь подписан, но подписка неактивна.

### Получение платных подписок, созданных автором

Получить список платных подписок можно с помощью следующего API-метода (писать код нужно в async-функции):

```js
let resp = []
try {
    resp = await golos.api.getPaidSubscriptionsByAuthorAsync({
        author: 'cyberfounder',
        from: { app: '', : '', version: 1 },
        limit: 20
    })
} catch (err) {
    console.error(err)
    //alert(err.toString())
}
console.log(resp)
//alert(JSON.stringify(resp))
```

Если подписок много, то за 1 запрос можно получить не всех подписок, а только первую порцию. Рекомендуется `limit: 20`. Чтобы получить следующую порцию подписчиков, отправляйте новый запрос, указав в параметре `from` идентификатор подписки из предыдущей порции. Когда размер массива `response` станет меньше 20, это будет означать, что больше порций нет.

Также есть специальный API-метод для получения информации о конкретной подписке:

```js
let pso = {}
try {
    pso = await golos.api.getPaidSubscriptionOptionsAsync({
        author: 'cyberfounder',
        oid: { app: 'game', name: 'access', version: 1 },
    })
} catch (err) {
    console.error(err)
    //alert(err.toString())
}
console.log(pso)
//alert(JSON.stringify(pso))
```

Если такой подписки не существует, то будет возвращен объект с пустыми полями, в частности как "маркер" можно использовать условие `pso.author === ''`.

### Получение подписок с точки зрения подписчика (т.е. "на что я подписан")

```js
let resp = []
try {
    resp = await golos.api.getPaidSubscriptionsAsync({
        subscriber: 'alice',
        start_author: '',
        start_oid: { app: '', : '', version: 1 },
        limit: 20,
        sort: 'by_author_oid',
        state: 'active_inactive'
    })
} catch (err) {
    console.error(err)
    //alert(err.toString())
}
console.log(resp)
//alert(JSON.stringify(resp))
```
 
В списке будут все подписки, как активные, так и неактивные.

Если `state` указать `active`, то это позволит получить список только активных подписок. `inactive` - только неактивных. 

Если подписок много, то за 1 запрос можно получить не всех подписок. Рекомендуется `limit: 20`. Чтобы получить следующую порцию подписок, отправляйте новый запрос, указав в параметре `start_author`/`start_oid` имя автора и идентификатор последней подписки из предыдущей порции. Когда размер массива `response` станет меньше 20, это будет означать, что больше порций нет.

Если нужно получить список подписок отсортированным по убыванию даты подписки (сначала более новые), то можно указать `sort: 'by_date'`

Кроме того, вы можете проверить конкретных авторов, подписан ли на них данный подписчик, если добавите в запрос следующий параметр:
```js
        select_items: [['alice'], ['cyberfounder', { app: 'game', name: 'access', version: 1 }]]
```
Тогда в ответном списке будут только подписки от `alice` (с любыми oid), и подписка от `bob` с указанным вами oid. Если чего-то не существует или если `subscriber` на это не подписан, то этого в ответном списке не будет.

### Отмена подписки. Возврат предоплаченных средств

Подписчик может отписаться от сущности с помощью соответствующей операции:

```js
const postingKey = '...'
const oid = { app: 'game', name: 'access', version: 1 }
golos.broadcast.paidSubscriptionCancel(postingKey, 'alice', 'cyberfounder', oid,
    [], (err, res) => {
        console.log(err, res)
})
```

Подписка при этом не становится неактивной (как при неудачном проходе регулярного платежа или окончании `executions`), а удаляется полностью.

Если подписка поддерживает предоплату и на ее балансе есть какие-то средства, то они будут немедленно возвращены подписчику.

Кроме того, сам автор подписки может удалить подписку.

```js
const postingKey = '...'
const oid = { app: 'game', name: 'access', version: 1 }
golos.broadcast.paidSubscriptionDelete(postingKey, 'cyberfounder', oid,
    [], (err, res) => {
        console.log(err, res)
})
```

Это удаляет подписку и всех действующих подписчиков, точно так же, как если бы они отписались сами. Средства с балансов подписок также возвращаются подписчикам.
