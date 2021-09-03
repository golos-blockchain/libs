# Авторизация и ключи

Обычно, когда вы разрабатываете сайт или приложение, вы авторизуете пользователя на своем сервере. Причем, как правило, пользователь передает на сервер свои логин и пароль, а сервер их проверяет. Это не очень безопасно и требует дополнительной работы от вас.

Поскольку БЧ Golos сам является "сервером", от вашего сервера в простом случае не требуется никаких действий. И нет, отправлять логин и пароль в Golos не нужно. Нужно просто запросить аккаунт у БЧ Golos (прямо с клиента) и проверить, соответствует ли его публичный ключ приватному ключу posting, введенному пользователем. Если соответствует, то этим приватным ключом следует подписывать все операции, отправляемые с клиента в БЧ (а сам ключ отправлять опять-таки не нужно), и они будут проходить.

Пользователь сможет авторизоваться, вводя непосредственно приватный posting, или же вводя пароль, поскольку пароль дает posting и другие ключи.

Для этого в библиотеке есть готовая функция `golos.auth.login`.

### Вход пользователя на ваш сайт или в приложение
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

### Вспомогательные функции

Помимо `golos.auth.login`, есть и другие функции, которые для авторизации понадобятся навряд ли, но могут быть нужны для регистрации новых пользователей и для других более редких задач, связанных с ключами.

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
