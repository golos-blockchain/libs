# Руководство по обновлению golos-lib-js с версии <0.9.35

В свое время в golos-lib-js появился `golos.oauth` - инструмент для авторизации через сервис Golos Signer, без ввода пароля в самом приложении.

Позже мы создали еще один такой сервис - Golos Keychain, который представляет собой дополнение к браузеру и дает особо высокий уровень безопасности. Об этом нас попросили пользователи.

И в golos-lib-js, начиная с версии 0.9.35, нам пришлось заменить `golos.oauth` на `golos.multiauth`, который поддерживает оба сервиса.

Если у вас есть приложение, которое использует `golos.oauth`, то оно будет работать по-прежнему, но только пока вы не обновите golos-lib-js на версию 0.9.35 или новее.

При таком обновлении вам необходимо ввести в код ряд изменений:

### Собственно обновить библиотеку

Так:
```js
npm remove golos-lib-js
npm install golos-lib-js
```

Или так:
```js
yarn remove golos-lib-js
yarn add golos-lib-js
```

Или возьмите файл golos.min.js с [CDN](https://github.com/golos-blockchain/libs/tree/master/golos-lib-js#%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B1%D0%B5%D0%B7-npmyarn).

### OAuthMiddleware теперь зовется MultiAuthMiddleware

Было:
```js
golos.use(new middlewares.OAuthMiddleware())
```
Стало
```
golos.use(new middlewares.MultiAuthMiddleware())
```

### MultiAuthMiddleware теперь стал обязательным

В отличие от `OAuthMiddleware`.

Убедитесь, что в вашем коде есть строчка из пункта выше. Ее надо добавить после настроек `golos.config.set()`

### Замените везде golos.oauth на golos.multiauth

Было:
```js
golos.oauth.login(что-то)
```
Стало
```js
golos.multiauth.login(что-то)
```

Это касается и `require`, `import`.

### login() стал асинхронным

Было:
```js
$('.login').click((e) => {
    try {
        oauth.login(['transfer', 'account_metadata', 'donate']);
    } catch (err) {
        console.error(err)
        alert(err)
        return
    }
    oauth.waitForLogin(что-то, что-то);
});
```

Стало:
```
$('.login').click(async (e) => {
    try {
        await multiauth.login(['transfer', 'account_metadata', 'donate']);
    } catch (err) {
        console.error(err)
        alert(err)
        return
    }
    multiauth.waitForLogin(что-то, что-то);
});
```
