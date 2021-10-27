# Авторизация и ключи

Обычно, когда вы разрабатываете сайт или приложение, вы авторизуете пользователя на своем сервере. Причем, как правило, пользователь передает на сервер свои логин и пароль, а сервер их проверяет. Это не очень безопасно и требует дополнительной работы от вас.

Поскольку БЧ Golos сам является "сервером", от вашего сервера в простом случае не требуется никаких действий. И нет, отправлять логин и пароль в Golos не нужно. Нужно просто запросить аккаунт у БЧ Golos (прямо с клиента) и проверить, соответствует ли его публичный ключ приватному ключу posting, введенному пользователем. Если соответствует, то этим приватным ключом следует подписывать все операции, отправляемые с клиента в БЧ (а сам ключ отправлять опять-таки не нужно), и они будут проходить.

Пользователь сможет авторизоваться, вводя непосредственно приватный posting, или же вводя пароль, поскольку пароль дает posting и другие ключи.

Для этого в библиотеке есть готовая функция `golos.auth.login` - которая по сути просто проверяет, что пользователь ввел правильный ключ\пароль, чтобы не было такого, что пользователь думает, что он авторизован, а на самом деле БЧ не принимает операции, подписанные его ключами.

Но что делать, если ваш сайт или приложение достаточно новые? Многие пользователи будут бояться вводить на ваших страницах ключи и пароли, опасаясь, что ваши скрипты их каким-то образом украдут. Чтобы такого не было, следует использовать [наш сервис OAuth](https://github.com/golos-blockchain/ui-auth/blob/master/API.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-oauth).

- [Вход пользователя с помощью OAuth](#вход-пользователя-с-помощью-oauth)
- [Вход с паролем (клиентская авторизация без OAuth)](#вход-с-паролем-клиентская-авторизация-без-oauth)
- [Сохранение сессии при авторизации без OAuth](#сохранение-сессии-при-авторизации-без-oauth)
- [Серверная авторизация](#серверная-авторизация)
- [Вспомогательные функции](#вспомогательные-функции)

### Вход пользователя с помощью OAuth

#### Настройка golos-lib-js для OAuth

```js
const API_HOST = 'golos.app';

golos.config.set('oauth.client', 'hotdog-website');
golos.config.set('oauth.host', API_HOST);
golos.config.set('websocket', API_HOST + '/api/oauth/sign');
golos.config.set('credentials', 'include');
golos.use(new golos.middlewares.OAuthMiddleware());
```

Подробнее: https://github.com/golos-blockchain/ui-auth/blob/master/API.md#%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0-golos-lib-js-%D0%B4%D0%BB%D1%8F-oauth

#### Вход

В вашем приложении должна быть кнопка "Войти", при нажатии на которую:
1. Открывать нашу страницу авторизации, где пользователь разрешит (или не разрешит) доступ вашему приложению:

```js
const permissions = ['transfer', 'account_create_with_delegation', 'private_message'];
golos.oauth.login(permissions);
```
permissions - это набор разрешений, которые надо предоставить вашему приложению. Большинство из них - это непосредственно операции, которые ваше приложение будет отправлять от имени пользователя. Но в некоторых случаях нужны особые разрешения. И некоторые операции вообще не поддерживаются в OAuth. Весь список возможных разрешений [здесь](https://github.com/golos-blockchain/ui-auth/blob/master/server/utils/oauthPermissions.js).

2. Ожидать, когда пользователь авторизуется на этой странице.
```js
golos.oauth.waitForLogin((res) => {
    // Эта функция будет вызвана, когда (если) пользователь разрешит вашему приложению доступ.
    //
    // Если ваше приложение использует React state, Redux и т.п., то в этом месте вы можете изменять стейт, так, чтобы UI обновился, и отобразил, что пользователь авторизован.
    // (используйте res.account, чтобы отобразить имя авторизованного пользователя; res.allowed содержит список полученных от него разрешений)
    //
    // А можно просто обновить страницу (при повторном открытии страницы вы проверите авторизацию):
    window.location.reload();
}, () => {
    // Эта функция будет вызвана, если пользователь НЕ разрешит вашему приложению доступ
    // Здесь можно отобразить, что:
    alert('Авторизоваться не получилось');
    // ...или не отображать. Пользователь не обязан авторизоваться, возможно он захочет просто читать контент в вашем приложении.
});
```

Примеры:  
[jQuery](https://github.com/golos-blockchain/ui-auth/blob/master/oauth_examples/jquery/main.js)  
[React](https://github.com/golos-blockchain/ui-auth/tree/master/oauth_examples/)

#### Проверка, что пользователь авторизован

Если пользователь уже прошел авторизацию, то не следует отображать ему "Войти", а стоит отображать кнопку "Выйти" и имя пользователя.
В том числе, если после успешной авторизации вы просто делаете reload(), то при обновлении страницы уже должна быть учтена авторизация.
Для этого на странице должен быть скрипт такого вида:

```js
async function init() {
    const res = await golos.oauth.checkReliable();
    if (res.authorized) {
        // Скрыть кнопку Войти,
        // показать кнопку Выйти,
        // разблокировать кнопки отправляющие операции,
        // из res.account взять имя пользователя и отобразить, что пользователь авторизован под этим именем
        alert('Вы авторизованы как ' + res.account);
        // а res.allowed содержит список полученных разрешений
    } else {
        // Скрыть кнопку Выйти,
        // показать кнопку Войти,
        // заблокировать кнопки отправляющие операции
    }
    // Кроме того, если используете анимацию или надпись "загрузка...", чтобы показать, что данные авторизации загружаются, то здесь следует ее скрывать.
    // Например, чтобы не блокировать кнопки, вы можете просто вместо всего UI отображать экран "Загрузка...", и здесь его прятать, отображая форму входа, либо основной интерфейс.
}
init();
```

Примеры:  
[jQuery](https://github.com/golos-blockchain/ui-auth/blob/master/oauth_examples/jquery/main.js)  
[React](https://github.com/golos-blockchain/ui-auth/tree/master/oauth_examples/)

#### Кнопка Выйти

```js
$('.logout').click(async (e) => {
    await golos.oauth.logout();
    window.location.reload();
});
```

Примеры:  
[jQuery](https://github.com/golos-blockchain/ui-auth/blob/master/oauth_examples/jquery/main.js)  
[React](https://github.com/golos-blockchain/ui-auth/tree/master/oauth_examples/)

#### Отправка операций

При авторизации через OAuth следует отправлять транзакции, не указывая каких-либо ключей, то есть первый параметр - пустая строка.
```js
try {
    let res = await broadcast.transferAsync('', 'cyberfounder', 'alice',
        '0.001 GOLOS', 'Buy a coffee with caramel :)');
} catch (err) {
    console.error(err);
    alert(err);
    return;
}
alert('Success!');
```

Если при авторизации вы запрашивали соответствующее разрешение, то сервис OAuth сам подпишет операцию, отправит ее в блокчейн и она пройдет как обычно, без дополнительных действий со стороны пользователя.  
Если нет (или наша схема разрешений изменилась с момента авторизации пользователя в вашем приложении), то будет открыта новая вкладка с вопросом пользователю - разрешать ли эту транзакцию или нет. Также пользователь может сохранить это разрешение (как если бы оно было выдано при авторизации). Если же пользователь запретит операцию или просто закроет окно, то спустя некоторое время будет выполнена ветка `catch` с соответствующей ошибкой.

Примеры:  
[jQuery](https://github.com/golos-blockchain/ui-auth/blob/master/oauth_examples/jquery/main.js)  
[React](https://github.com/golos-blockchain/ui-auth/tree/master/oauth_examples/)

#### Отправка операций, которым требуется особое разрешение

При отправке без ключей сервис подписывает транзакцию ключом по умолчанию. Например, одни операции всегда подписываются ключом posting, другие - ключом active. Но есть операции, которые можно подписывать разными ключами. Например, custom_json по умолчанию подписывается ключом posting:
https://github.com/golos-blockchain/libs/blob/master/golos-lib-js/src/broadcast/operations.js (см. операцию custom_json - там в roles первый элемент - это 'posting'). Но там же видно, что операцию иногда нужно подписывать ключом active. Сервис OAuth не в состоянии сам определить, в каком случае каким ключом подписывать операцию. Поэтому если нужен не ключ по умолчанию, то нужно принудительно задать это при вызове:
```js
try {
    let res = await broadcast.customJsonAsync(
        '(active)', ['cyberfounder'], [], 'test_active', '{"alice":"bob"}');
} catch (err) {
    console.error(err);
    alert(err);
    return;
}
```

Или, если нужен наоборот posting-ключ: `'(posting)'`.  
Или, если нужно несколько ключей: `'(posting,active)'`.

### Вход с паролем (клиентская авторизация без OAuth)

Для того, чтобы пользователь мог войти в приложение без OAuth, в приложении должна быть форма входа, где он введет свое имя и свой пароль или приватный ключ (как правило, posting). 

Примечание: чтобы пользователь согласился вводить свой пароль или ключ, он должен доверять приложению. Если вы в этом не уверены, лучше использовать OAuth.

```
golos.auth.login(name, privWifOrPassword, callback);
```
Эта функция рекомендуется для использования в формах входа в приложениях на блокчейне Golos.
Получает указанный аккаунт в блокчейне (используя API `getAccounts`), сравнивает каждый из ключей аккаунта с указанной строкой и возвращает объект с WIF (приватными ключами), которые предоставляет эта строка и которые следует использовать для авторизации операций. У объекта есть поля: `active`, `posting`, `owner` и `memo`. Каждое поле имеет значение `true`, если строка предоставляет эту роль, или «ложь» в противном случае. Также в нем есть поле `password`. Если предоставленная строка является паролем (а не ключом), и этот пароль предоставляет роль `posting`, то в поле `password` лежит пароль, переданный в функцию.
#### Рекомендуемый алгоритм авторизации:
```js
var accountName = 'alice';
var privWifOrPassword = '5J...'; // или 'P5J...'
golos.auth.login(accountName, privWifOrPassword, function(err, response) {
  console.log(response); // Object { owner: '5J...', active: null, posting: '5J...', memo: '5J...' }
  if (response.active && !response.password) {
    console.log('Авторизоваться не удалось! Не рекомендуется авторизовать пользователей на сайте с active ключом. Active-ключ следует вводить только непосредственно перед вызовом операций, для отправки которых он требуется, а не хранить его как сессию авторизации.');
    return;
  }
  if (!response.posting) {
    console.log('Авторизоваться не удалось! Неверный пароль (Переданная строка не является ни posting-ключом, ни паролем.)');
    return;
  }
  console.log('Авторизация успешна! При отправке большинства операций, используйте этот WIF: ' + response.posting)
});
```
Ваше приложение может сохранить response.posting в localStorage или document.cookie, и тем самым запомнит авторизацию пользователя, а при нажатии кнопки "Выход" должно будет удалить response.posting из localStorage.

Однако не рекомендуется сохранять posting-ключ в чистом виде. Иначе разработчики вирусов изучат ваш сайт или приложение и легко напишут вирус, который будет воровать ключ, если попадет на ПК пользователя. Применяйте хоть какое-нибудь "шифрование".

### Сохранение сессии при авторизации без OAuth

Если клиентская авторизация выполняется силами вашего приложения (с помощью `golos.auth.login`), то и хранить авторизованную сессию также следует в вашем приложении.

#### Хранение сессии posting-ключа

При отправке большинства операций с помощью golos-lib-js нужен приватный posting-ключ. Поэтому при авторизации пользователя необходимо сохранять его в localStorage, для того, чтобы он был доступным и при обновлении страницы, и при открытии страниц в новых вкладках, перезапуске браузера и т.п.

Для этого следует использовать хранилище `golos.auth.session`, основанное на localStorage.

```js
import { session, } from 'golos-lib-js/lib/auth';
// или: let { session, } = golos.auth;

session.save(username, postingKey, memoKey, loginOwnerPubKey);
// username - имя пользователя
// postingKey - приватный posting-ключ (строка или PrivateKey)
// memoKey - приватный memo-ключ (необходимо для memo в истории transfer и т.п., а также для Golos Messenger; необязательно)
// loginOwnerPubkey - необязательно

const [ username, postingKey, memoKey, loginOwnerPubKey, ] = session.load();

session.clear();
```

#### Хранение сессии active-ключа

Как правило, не следует хранить active-ключ: следует непосредственно перед каждой операцией показывать пользователю форму, похожую на форму входа, и просить его ввести ключ для подписи этой операции.

Однако, если на странице пользователь делает много таких операций, то можно хранить active-ключ в sessionStorage, чтобы он был доступен только в этой вкладке (и очищен после ее закрытия), а также очищать его, если вкладка долгое время висит открытой без пользователя.

```js
import { pageSession, } from 'golos-lib-js/lib/auth';
// или: let { pageSession, } = golos.auth;

pageSession.save(activeKey);
// или: pageSession.save(passwordOrActiveKey, username, 'active');

const [ timestamp, activeKey, ] = pageSession.load();
// timestamp - это Date.now() на момент pageSession.save. Позволяет очистить сессию, в случае, если прошло достаточно времени.

pageSession.clear();
```

### Серверная авторизация

Используется в случаях, когда пользователя надо авторизовать не только в вашем клиенте, но и в каком-то из сервисов:
- [Golos Auth & Registration Service (GARS)](https://github.com/golos-blockchain/ui-auth)
- [Golos Notify Service](https://github.com/golos-blockchain/notify) (использует GARS для авторизации)

В этом случае нужно не приватный ключ пользователя отправлять на сервис (сервер), а подписать этим ключом некие данные, выданные сервером, и отправить серверу подпись.
```js
const signatures = golos.auth.signData(data, { posting: '5J...', });
```

Существует и возможность авторизовать пользователя на своем собственном сервере, проверяя данные, формируемые с помощью `golos.auth.signData`.
```js
const verified = golos.auth.verifySignedData(data, signatures, accountName, ['posting']);
```

### Вспомогательные функции

Есть и другие функции, которые для авторизации понадобятся навряд ли, но могут быть нужны для регистрации новых пользователей и для других более редких задач, связанных с ключами.

#### Проверка пароля
Похожа на `golos.auth.login`, но не запрашивает аккаунт у БЧ, вы должны сами это сделать, извлечь из него публичные ключи и передать их в эту функцию.
```
golos.auth.verify(name, password, auths);
```
##### Пример:
```js
var username = 'epexa';
var password = 'P5...';  // master password
// object in which the key type public key (active, memo, owner, posting), and the value of the array in the array itself is the public key
var auths = {
  posting: [['GLS6...']]
};
var verifyResult = golos.auth.verify(username, password, auths);
console.log('verify', verifyResult);
```

#### Генерация ключей
При **регистрации нового** пользователя он придумывает пароль. Этот пароль всегда дает приватные posting-, active-, owner- и memo-ключ (их можно получить из него криптографически). А по приватному ключу можно получить публичные. Именно эти **публичные** ключи (а не приватные и не пароль) нужно передать в операцию, которая создает аккаунт в БЧ. Данная функция позволяет получить **публичные** ключи из пароля.
```
golos.auth.generateKeys(name, password, roles);
```
##### Пример:
```js
/**
 * generateKeys() generating new keys for a new account
 * @param {String} name - new account username
 * @param {String} password - master-password for a new account
*/
var name = 'epexa4';
var password = 'qwerty12345';
var newKeys = golos.auth.generateKeys(name, password, ['owner', 'active', 'posting', 'memo']);
console.log('newKeys', newKeys);
```

### Получение приватных ключей по паролю
Аналогично `generateKeys`, но получает и публичные, и приватные ключи
```
golos.auth.getPrivateKeys(name, password, roles);
```
##### Пример:
```js
var username = 'epexa';
var password = 'P5H...'; // master password
var roles = ['owner', 'active', 'posting', 'memo']; // optional parameter, if not specify, then all keys will return
var keys = golos.auth.getPrivateKeys(username, password, roles);
console.log('getPrivateKeys', keys);
```

### Проверить, является ли строка корректным приватным ключом
Но эта функция не проверяет, принадлежит ли ключ какому-то аккаунту. Пригодна для случаев, когда ключ нужен не для авторизации пользователя на сайте, а для каких-то других задач с криптографией.
```
golos.auth.isWif(privWif);
```
##### Пример:
```js
var privWif = '5J...';
var resultIsWif = golos.auth.isWif(privWif);
console.log('isWif', resultIsWif);
```

### Получить приватный ключ по паролю
Аналогично `getPrivateKeys`, но получает только приватный ключ и только один.
```
golos.auth.toWif(name, password, role);
```
##### Пример:
```js
var username = 'epexa';
var password = 'P5H...'; // master password
var role = 'posting'; // private key type, one of owner, active, posting, memo
var privateKey = golos.auth.toWif(username, password, role);
console.log('toWif', privateKey);
```

### Проверить, соответствует ли приватный ключ - публичному
Своего рода, низкоуровневый аналог функции `login`, который работает лишь с отдельным ключом.
```
golos.auth.wifIsValid(privWif, pubWif);
```
##### Пример:
```js
var privWif = '5J...'; // private key
var pubWif = 'GLS6...'; // public key
var resultWifIsValid = golos.auth.wifIsValid(privWif, pubWif);
console.log('wifIsValid', resultWifIsValid);
```

### По приватному ключу получить публичный
...но не наоборот, естественно.
```
golos.auth.wifToPublic(privWif);
```
##### Пример:
```js
var privWif = '5J...'; // private key
var resultWifToPublic = golos.auth.wifToPublic(privWif, pubWif);
console.log('wifToPublic', resultWifToPublic);
```

### Подписать транзакцию (а отправить потом)
Нужно разве что в каких-то специфических случаях.
```
golos.auth.signTransaction(trx, keys);
```
