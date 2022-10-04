# Авторизация и ключи

Обычно, когда вы разрабатываете сайт или приложение, вы авторизуете пользователя на своем сервере. Причем, как правило, пользователь передает на сервер свои логин и пароль, а сервер их проверяет. Это не очень безопасно и требует дополнительной работы от вас.

Поскольку БЧ Golos сам является "сервером", от вашего сервера в простом случае не требуется никаких действий. И нет, отправлять логин и пароль в Golos не нужно. Нужно просто запросить аккаунт у БЧ Golos (прямо с клиента) и проверить, соответствует ли его публичный ключ приватному ключу posting, введенному пользователем. Если соответствует, то этим приватным ключом следует подписывать все операции, отправляемые с клиента в БЧ (а сам ключ отправлять опять-таки не нужно), и они будут проходить.

Пользователь сможет авторизоваться, вводя непосредственно приватный posting, или же вводя пароль, поскольку пароль дает posting и другие ключи.

Для этого в библиотеке есть готовая функция `golos.auth.login` - которая по сути просто проверяет, что пользователь ввел правильный ключ\пароль, чтобы не было такого, что пользователь думает, что он авторизован, а на самом деле БЧ не принимает операции, подписанные его ключами.

Но что делать, если ваш сайт или приложение достаточно новые? Многие пользователи будут бояться вводить на ваших страницах ключи и пароли, опасаясь, что ваши скрипты их каким-то образом украдут. Чтобы такого не было, надо использовать один из наших сервисов: [OAuth](https://github.com/golos-blockchain/ui-auth/blob/master/API.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-oauth) или [Golos KeyChain](https://github.com/golos-blockchain/ui-keychain/blob/master/API.md).

- [Вход пользователя с помощью OAuth/KeyChain](#вход-пользователя-с-помощью-oauthkeychain)
- [Вход с паролем (клиентская авторизация без OAuth)](#вход-с-паролем-клиентская-авторизация-без-oauth)
- [Хранение сессии и авторизация сразу в нескольких аккаунтах](#хранение-сессии-и-авторизация-сразу-в-нескольких-аккаунтах)
- [Серверная авторизация](#серверная-авторизация)
- [Вспомогательные функции](#вспомогательные-функции)

### Вход пользователя с помощью OAuth/KeyChain

[OAuth (Golos Signer)](https://github.com/golos-blockchain/ui-auth/blob/master/API.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-oauth) - это сервис, который авторизует пользователей по принципу OAuth. Ваше приложение сможет отправлять транзакции не на одну из нод GOLOS, а на сервер [golos.app](golos.app). Сначала пользователь нажмет кнопку "Войти" в вашем приложении, и откроется окно Golos Signer с просьбой разрешить доступ. Он будет видеть, какие виды действий вы собираетесь делать. И если разрешит, то все будет работать. При этом ваше приложение не получит никаких ключей или паролей, так что пользователь будет больше вам доверять.

- Чтобы это работало, вы должны сперва [обратиться к нам для регистрации вашего приложения](https://github.com/golos-blockchain/ui-auth/blob/master/API.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-oauth) Обращения рассматриваются в течение 1-3 дней.
- Вы сможете отправлять не любые операции, а только те, которые поддерживает OAuth.

[Golos KeyChain](https://github.com/golos-blockchain/ui-keychain) - расширение для браузеров. Пользователь может установить расширение и сохранить туда пароль или ключи. Дальше все как в OAuth. Отличие в том, что расширение не отправляет операций (поскольку оно позиционируется как особо защищенный способ авторизации). Оно только будет их подписывать, а отправлять их на одну из нод - вам.

- Обращаться к нам в этом случае не нужно. Вы можете все сделать сами.
- Вы сможете отправлять любые операции (по крайней мере пока мы не собираемся вводить в KeyChain какие-то ограничения).

Вы можете совмещать OAuth и KeyChain в своем приложении, чтобы у пользователя был выбор. Так будет даже лучше.

#### Настройка golos-lib-js для OAuth

```js
const API_HOST = 'golos.app';

golos.config.set('oauth.client', 'hotdog-website');
golos.config.set('oauth.host', API_HOST);
golos.config.set('websocket', API_HOST + '/api/oauth/sign');
golos.config.set('credentials', 'include');
golos.use(new golos.middlewares.MultiAuthMiddleware());
```
А чтобы поддерживать **KeyChain**, добавьте к этому еще и:
```
golos.config.set('signed.websocket', 'любая из нод - https или wss');
```

Подробнее про OAuth: https://github.com/golos-blockchain/ui-auth/blob/master/API.md#%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0-golos-lib-js-%D0%B4%D0%BB%D1%8F-oauth

#### Вход

Чтобы поддерживать **OAuth**, в вашем приложении должна быть кнопка "Войти", при нажатии на которую:
1. Открывать нашу страницу авторизации, где пользователь разрешит (или не разрешит) доступ вашему приложению:

```js
const permissions = ['transfer', 'account_create_with_delegation', 'private_message'];
await golos.multiauth.login(permissions); // обработчик клика должен быть async
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

Чтобы поддерживать **KeyChain**, сделайте еще одну кнопку - "Войти через GolosKeyChain". Там все точно так же, за исключением пункта 1:
```js
// permissions в KeyChain нет
await golos.multiauth.login([], { type: golos.multiauth.AuthType.KEYCHAIN});
```

Примеры:  
[jQuery](https://github.com/golos-blockchain/libs/blob/examples-oauth-and-keychain/jquery/main.js)  
[React](https://github.com/golos-blockchain/libs/tree/examples-oauth-and-keychain/)

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
        // res.authType позволяет определить - KeyChain или OAuth
        // а res.allowed содержит список полученных разрешений (в случае OAuth)
    } else {
        // Скрыть кнопку Выйти,
        // показать кнопку Войти,
        // заблокировать кнопки отправляющие операции
    }
    // Кроме того, если используете анимацию или надпись "загрузка...", чтобы показать, что данные авторизации загружаются, то в этот момент следует ее скрывать.
    // Например, чтобы не блокировать кнопки, вы можете просто вместо всего UI отображать экран "Загрузка...", а в данный момент прятать его, и отображать форму входа, либо основной интерфейс.
}
init();
```

Примеры:  
[jQuery](https://github.com/golos-blockchain/libs/blob/examples-oauth-and-keychain/jquery/main.js)  
[React](https://github.com/golos-blockchain/libs/tree/examples-oauth-and-keychain/)

#### Кнопка Выйти

```js
$('.logout').click(async (e) => {
    await golos.oauth.logout();
    window.location.reload();
});
```

Примеры:  
[jQuery](https://github.com/golos-blockchain/libs/blob/examples-oauth-and-keychain/jquery/main.js)  
[React](https://github.com/golos-blockchain/libs/tree/examples-oauth-and-keychain/)

#### Отправка операций

При авторизации через OAuth/KeyChain следует отправлять транзакции, не указывая каких-либо ключей, то есть первый параметр - пустая строка.
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

KeyChain всегда использует второй способ (разовых подтверждений).

Примеры:  
[jQuery](https://github.com/golos-blockchain/libs/blob/examples-oauth-and-keychain/jquery/main.js)  
[React](https://github.com/golos-blockchain/libs/tree/examples-oauth-and-keychain/)

#### Отправка операций, которым требуется особое разрешение

При отправке без ключей сервис подписывает транзакцию ключом по умолчанию. Например, одни операции всегда подписываются ключом posting, другие - ключом active. Но есть операции, которые можно подписывать разными ключами. Например, custom_json по умолчанию подписывается ключом posting:
https://github.com/golos-blockchain/libs/blob/master/golos-lib-js/src/broadcast/operations.js (см. операцию custom_json - там в roles первый элемент - это 'posting'). Но там же видно, что операцию иногда нужно подписывать ключом active. Сервис OAuth или KeyChain не в состоянии сам определить, в каком случае каким ключом подписывать операцию. Поэтому если нужен не ключ по умолчанию, то нужно принудительно задать это при вызове:
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

#### Получение номера блока, txid

Как и в случае без OAuth, используется настройка (перед отправкой операций):

```js
golos.config.set('broadcast_transaction_with_callback', true);
```

### Вход с паролем (клиентская авторизация без OAuth)

Для того, чтобы пользователь мог войти в приложение без OAuth/Keychain, в приложении должна быть форма входа, где он введет свое имя и свой пароль или приватный ключ (как правило, posting). 

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
Ваше приложение может сохранить response.posting в localStorage или document.cookie, и тем самым запомнит авторизацию пользователя. Об этом речь пойдет в следующем параграфе.

### Хранение сессии и авторизация сразу в нескольких аккаунтах

Как показано выше, с помощью `golos.auth.login` вы можете выполнить авторизацию. Однако после того, как пользователь перезагрузит страницу (или откроет и закроет браузер и т.п.) ему придется авторизовываться заново.

Чтобы этого не происходило, можно использовать такой инструмент, как `golos.auth.multiSession`. Он позволяет сохранить `response.posting` (см. выше) в localStorage, то есть на жесткий диск, в относительно безопасном формате (не слишком простом для кражи).

#### Типичный пример хранения сессии (posting-ключ)

Авторизация (при нажатии кнопки "Войти" после того, как пользователь ввел логин и пароль):

```js
import { multiSession, } from 'golos-lib-js/lib/auth';
// или: let { multiSession, } = golos.auth;

const res = await golos.auth.login(username, password) // логин и пароль, введенные пользователем
if (!res.posting) {
    alert('Неверный пароль')
} // тут могут быть другие дополнительные проверки, помогающие пользователю понять, что он сделал не так

multiSession
    .load()
    .addKey(username, 'posting', res.posting)
    .setCurrent(username)
    .save()
```

Получение сессии:

```js
const data = multiSession.load()
if (!data.currentName) {
// Пользователь не авторизован. Здесь можно показать ему форму входа и т.п.
} else {
// Пользователь авторизован. Сохраненный posting-ключ можно получить через data.getVal(data.currentName, 'posting') и использовать его для отправки операций
}
```

#### Хранение сессии active-ключа

Как правило, не следует хранить active-ключ: следует непосредственно перед каждой операцией показывать пользователю форму, похожую на форму входа, и просить его ввести ключ для подписи этой операции.

Однако, если на странице пользователь делает много таких операций, то можно хранить active-ключ в sessionStorage (но не в localStorage), чтобы он был доступен только в этой вкладке (и очищен после ее закрытия), а также очищать его, если вкладка долгое время висит открытой без пользователя.

В этом также поможет класс `multiSession`. В нем есть и временное хранилище, основанное на sessionStorage.

```js
multiSession
    .loadTmp()
    .addKey('anna-ahmatova', 'active', activeKey)
    .save()
```

```js
const current = multiSession.load().currentName
const activeKey = multiSession.loadTmp().getVal(current, 'active')
```

Кроме того, можно сделать на странице таймер, который будет, скажем, каждую секунду проверять, не прошло ли 5 минут с момента ввода active-ключа, и стирать его.
Это позволяет избежать кражи ключа злоумышленником из sessionStorage, если он воспользуется компьютером жертвы, когда она куда-нибудь отойдет.

```js
setInterval(() => {
    multiSession.clearExpired(5*60*1000) // 5 минут
}, 1000)
```

#### Авторизация сразу в нескольких аккаунтах

Возможно, вы заметили, что в названии `multiSession` есть слово `multi`, а само API выглядит сложновато, если считать, что оно хранит ключ от всего 1 аккаунта.

Дело в том, что это API дает возможность быть авторизованным (хранить ключи) не только в одном аккаунте, но и сразу в нескольких, с возможностью переключаться между аккаунтами в 1 клик.

Это бывает удобно некоторым пользователям.

Напомним, вот авторизация:

```js
multiSession
    .load()
    .addKey('anna-ahmatova', 'posting', postingKey)
    .setCurrent('anna-ahmatova')
    .save()

multiSession
    .load()
    .addKey('marina-cvetaeva', 'posting', postingKey2)
    .setCurrent('marina-cvetaeva')
    .save()
```

И в этом случае будут храниться ключи от обоих аккаунтов. `currentName` будет `'marina-cvetaeva'`, но можно легко переключить:

```js
multiSession.load().setCurrent('anna-ahmatova').save()
```

Чтобы удалить ключ аккаунта, можно использовать `multiSession.load().logout('anna-ahmatova').save()`.
Если `currentName` в этот момент будет `anna-ahmatova`, то после вызова он станет `marina-cvetaeva`.

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
