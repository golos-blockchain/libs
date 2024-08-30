# Личные сообщения

Блокчейн Golos предоставляет подсистему мгновенных сообщений, которая позволяет создать полноценный мессенджер с приватными, шифрованными сообщениями, а также с группами с поддержкой шифрования сообщений.

Сообщения в приватных чатах шифруются на стороне клиента (приватные: с использованием закрытого мемо-ключа отправителя и открытого мемо-ключа получателя).  
Сообщения в группах, поддерживающих шифрование, шифруются на ноде блокчейна, при этом оригиналы **не** сохраняются ни в какую-либо базу данных, ни в block-log.

Зашифрованные сообщения отправляются в блокчейн через `private_message_operation`, а затем могут быть получены из БД с помощью API `private_message` и расшифрованы на стороне клиента.

### Шифрование и отправка

Сообщения - это объекты JSON. Если вы хотите, чтобы отправленные вами сообщения отображались в Golos Messenger, вы должны использовать объекты JSON с полем `body`, содержащим строку с текстом сообщения, а также с полями `app` и `version`, описывающими ваше приложение. Также вы можете добавлять любые ваши собственные поля. Но если вы используете только `body`, мы рекомендуем вам установить `app` - `'golos-messenger'`, а `version` - `1`.

Для создания объекта-сообщения используйте функцию `golos.messages.newTextMsg`.

Сообщение должно соответствовать следующим правилам:
- `app` должно быть строкой, длиной от 1 до 16 символов;
- `version` должно быть целым числом, начиная с 1;
- `body` должно быть строкой.

Полсе создания объекта-сообщения, следует преобразовать его в JSON-строку, а затем зашифровать.  
- В приватных чатах используется SHA-512 с nonce, который является уникальным идентификатором на основе UNIX timestamp, и затем AES, после этого результат преобразуется в HEX-строку (`encrypted_message`).  
- В группах, поддерживающих шифрование, JSON-строку надо отправить в `golos.api.encryptBodyAsync`, затем обернуть результат в JSON-строку формата `{"t":"em","c":"результат шифрования"}` и преобразовать ее в HEX-строку.  
- В группах без шифрования, JSON-строку надо сразу преобразовать в HEX-строку.  
Все это можно сделать автоматически, просто вызвав функцию `golos.messages.encodeMsg`.

Пример для приватного чата:

```js
let data = await golos.messages.encodeMsg({ private_memo: 'alice private memo key',
    to_public_memo: 'bob public memo key',
    msg: golos.messages.newTextMsg('Hello world', 'golos-messenger', 1)
})

const json = JSON.stringify(['private_message', {
    from: 'alice',
    to: 'bob',
    nonce: data.nonce,
    from_memo_key: data.from_memo_key,
    to_memo_key: data.to_memo_key,
    checksum: data.checksum,
    update: false,
    encrypted_message: data.encrypted_message,
}]);
golos.broadcast.customJson('alice private posting key', [], ['alice'], 'private_message', json, (err, result) => {
    alert(err);
    alert(JSON.stringify(result));
});
```

Пример для группы:

```js
// group - это объект группы, полученный через `golos.api.getGroupsAsync`,
// содержащий по меньшей мере поля `name` и `is_encrypted`, необходимые для
// правильного формирования сообщения

let data = await golos.messages.encodeMsg({ group,
    msg: golos.messages.newTextMsg('Hello world', 'golos-messenger', 1)
})

const json = JSON.stringify(['private_message', {
    from: 'alice',
    to: 'bob',
    nonce: data.nonce,
    from_memo_key: data.from_memo_key,
    to_memo_key: data.to_memo_key,
    checksum: data.checksum,
    update: false,
    encrypted_message: data.encrypted_message,
    extensions: [[0, {
        group: group.name
    }]],
}]);
golos.broadcast.customJson('alice private posting key', [], ['alice'], 'private_message', json, (err, result) => {
    alert(err);
    alert(JSON.stringify(result));
});
```

### Редактирование сообщений

Сообщения идентифицируются с помощью group+from+to+nonce, поэтому при обновлении сообщения вы должны кодировать его тем же значением nonce, что и в предыдущей версии.

```js
data = await golos.messages.encodeMsg({ private_memo: 'alice private memo key',
    to_public_memo: 'bob public memo key', msg: golos.messages.newTextMsg('Goodbye world', 'golos-messenger', 1),
    nonce: data.nonce
})
```

Затем эти данные должны быть отправлены с помощью операции `private_message`, как и в предыдущем случае, но с `update` = `true`.

### Отправка изображений

Image messages, same as text messages, are JSON objects. Besides `app` and `version` fields, these messages should contain following fields:
- `body` field, which should be a string, containing an Internet URL of the image (its full version);
- `type` field, which should be equal to `'image'`. It identifies the message as an image message;
- `previewWidth` and `previewHeight` fields, which are the integers, computed by fitting an image to the preview area (600x300px). (See this algorithm in `fitImageToSize` function in the source code of this repository).

You should create image messages with `golos.messages.newImageMsgAsync` and `golos.messages.newImageMsg` functions. (These functions return an image message with computed `previewWidth` and `previewHeight`).

**Предупреждение:** изображения не скачиваются блокчейном и не хранятся в нем. Блокчейн просто сохраняет их URL-адреса. Поэтому вы должны предоставить URL-адрес изображения, хранящегося на каком-либо надежном хостинге, который никогда не удалит это изображение.

**Также необходимо использовать `https://`**. Некоторые клиенты (в том числе наши официальные) могут не поддерживать `http://` в Политике безопасности контента, и тогда ваши изображения не будут отображаться.

Пример (асинхронный, должен быть заключен в `async function`):

```js
let msg;
try {
    msg = await golos.messages.newImageMsgAsync('https://site.com/https-is-recommended.jpg', (progress, extra_data) => {
        console.log('Progress: %i%', progress);
        // если произойдет ошибка, вы можете получить ее в поле extra_data.error
    }, 'golos-messenger', 1);
} catch (err) {
    alert(err);
    console.error(err);
}
if (msg) {
    let data = await golos.messages.encodeMsg({ private_memo: 'alice private memo key', to_public_memo: 'bob public memo key', msg })
    // ...и отправьте, так же, как обычное текстовое сообщение
}
```

Пример #2 (синхронный):

```js
golos.messages.newImageMsg('https://site.com/https-is-recommended.jpg', (err, msg) => {
        if (err) {
            alert(err);
            console.error(err);
        } else {
            golos.messages.encodeMsg({ private_memo: 'alice private memo key', to_public_memo: 'bob public memo key', msg}).then((data) => {
                // ...и отправьте, так же, как обычное текстовое сообщение
            })
        }
    }, (progress, extra_data) => {
        console.log('Progress: %i%', progress);
        // если произойдет ошибка, вы можете получить ее в поле extra_data.error
    }, 'golos-messenger', 1);
```

### Получение сообщений при открытии мессенджера. Расшифровка сообщений

Сообщение можно получить с помощью `golos.api.getThread`, каждое сообщение является объектом с полями `from_memo_key`, `to_memo_key`, `nonce`, `checksum`, `encrypted_message` и другими полями. Затем сообщение можно расшифровать с помощью `golos.messages.decodeMsgs`, который поддерживает пакетную обработку (может расшифровать несколько сообщений одновременно) и обеспечивает высокую производительность. Метод позволяет за один вызов расшифровывать сообщения даже из разных групп и разных приватных чатов (актуально для получения "последних сообщений" в списке Контактов).

:electron: `golos.messages.decodeMsgs` использует WebAssembly.

Пример для приватного чата:

```js
golos.api.getThread({ from: 'alice', to: 'bob', }, (err, results) => {
    results = await golos.messages.decodeMsgs({ private_memo: 'alice private key', msgs: results })
    alert(results[0].message.body);
});
```

В случае с группой, getThread позволяет **сразу** расшифровать сообщения.
От Алисы для этого нужен не memo-, а posting-ключ.

```js
const results = await golos.auth.withNodeLogin({ account: 'alice', keys: {
    posting: 'alice POSTING key',
}, call: async (loginData) => {
    const th = await golos.api.getThreadAsync({
        ...loginData,
        group: 'test-group',
    })
    return th
}})
alert(results)
```

Однако, перед рендерингом сообщений в uI вам все равно нужно вызвать `decodeMsgs`, чтобы:
- проверить сообщения на соответствие правилам (об этом ниже) и по результатам проверки либо исключить, либо пометить ошибочные сообщения;
- можно было вызывать `getThread` только при открытии пользователем группы, как более тяжелый, а при получении новых сообщений через Golos Notify Service вызывать лишь `decodeMsgs`.

При этом, `decodeMsgs` расшифрует лишь те сообщения в массиве, которые не были расшифрованы до этого (встроенной расшифровкой в `getThread`, или прошлым вызовом `decodeMsgs`).  
Для еще большей оптимизации вы можете кешировать сообщения, используя `before_decode` и `for_each`, как это делаем мы в коде Golos Messenger.

**Примечание:** `decodeMsgs` также проверяет сообщения на соответствие следующим правилам:
- сообщение должно быть правильным объектом JSON с полями, соответствующими следующим правилам;
- поле `app` должно быть строкой длиной от 1 до 16;
- поле `версия` должно быть целым числом, начиная с 1;
- body должно быть строкой;
- для сообщений-изображений: previewWidth и previewHeight должны быть целыми числами, которые являются результатом подгонки изображения к области 600x300 пикселей.

**Примечание:** если сообщение не может быть расшифровано, распарсено как JSON и/или проверено, оно все равно добавляется к результату, но имеет `message: null` (если не может быть распарсено как JSON или проверено) и `raw_message: null` (если вообще не может быть расшифровано). Такое поведение позволяет клиенту пометить это сообщение как прочитанное в блокчейне, но не отображать его пользователю. Если вы хотите изменить это поведение, вы можете переопределить параметр `on_error` в `golos.messages.decodeMsgs` (подробнее см. в коде).

### Мгновенное получение сообщений

`getThread` позволяет легко и быстро получить список сообщений беседы при открытии страницы мессенджера. Однако `getThread` не годится для того, чтобы получать дальнейшие сообщения от собеседника (и других пользователей) мгновенно, без перезагрузки страницы. Это будет медленно, неудобно, к тому же, блокчейн расценит это как DDoS-атаку. Для мгновенности следует использовать [Golos Notify Service](https://github.com/golos-blockchain/notify).

### Отметка сообщений прочитанными & удаление сообщеннй

Блокчейн предоставляет операцию `private_mark_message` для пометки сообщений как прочитанных (получателем) и `private_delete_message` для их удаления (как получателем, так и отправителем).
Каждая из этих операций может использоваться двумя способами:
- для обработки 1 сообщения: установить `nonce` в значение nonce сообщения,
- для обработки диапазона нескольких сообщений: установите `start_date` равным (create_date 1-го сообщения минус 1 секунда), а `stop_date` - равным `create_date` последнего сообщения.
Кроме того, вы можете обрабатывать несколько диапазонов сообщений, объединив несколько операций в одной транзакции.

**Примечание: не следует отправлять множество операций с `nonce` при обработке 2 или более последовательных сообщений. Это не оптимально по нагрузке на блокчейн и интерфейс мессенджеров.**

Для создания диапазонов вы можете использовать `golos.messages.makeDatedGroups`, который строит такие диапазоны по условию и может превращать их в реальные операции "на лету".

Он принимает декодированные сообщения от `golos.messages.decodeMsgs`.

**Примечание: функция должна перебирать сообщения от start к end.**

```js
let operations = golos.messages.makeDatedGroups(messages, (message_object, idx) => {
    return message_object.read_date.startsWith('19') && message_object.from !== 'bob'; // непрочитанное и не от Боба
}, (group) => {
    const json = JSON.stringify(['private_mark_message', { // или 'private_delete_message'
        from: 'alice',
        to: 'bob',
        //requester: 'bob', // это нужно в случае удаления
        ...group,
    }]);
    return ['custom_json',
        {
            id: 'private_message',
            required_posting_auths: ['bob'],
            json,
        }
    ];
}, 0, messages.length); // в последних 2 параметрах - задается направление обхода сообщений

golos.broadcast.send({
        operations,
        extensions: []
    }, ['bob private posting key'], (err, result) => {
    alert(err);
    alert(JSON.stringify(result));
});
```

### Цитирование сообщений

Начиная с версии 0.8.3, библиотека поддерживает ответы на сообщения. Для пользователя это работает следующим образом:
- Алиса отправляет сообщение Бобу;
- Боб нажимает на это сообщение, затем нажимает «Ответить» и пишет ответное сообщение;
- Пользовательский интерфейс мессенджера должен отображать цитату сообщения Алисы над сообщением Боба.

**Примечание:** также Алиса может ответить на сообщение Боба, которое уже содержит его ответ на ее сообщение. В этом случае кавычки не должны быть вложенными (мы не поддерживаем это), Алиса просто цитирует тело сообщения Боба без повторного цитирования своей первой цитаты сообщения.

Вы можете отвечать на сообщения любого типа (текстовые, изображения и любые другие), и ваш ответ также может быть сообщением любого типа.

Как и обычное сообщение, ответное сообщение представляет собой объект JSON, который имеет `app`, `version`, `body` и т.д. Но оно также содержит поле `quote`. Поле `quote` является объектом и должно содержать следующие поля:
- поле `from` - это имя автора сообщения, на которое дается ответ;
- поле nonce - это nonce этого сообщения;
- поле `type` - это тип этого сообщения (для графического сообщения это должно быть `"image"`, а для текстового сообщения это поле должно отсутствовать);
- `body` - **урезанный** текст исходного сообщения. Если это изображение, то body должно иметь длину <= 2000. В любом другом случае это <= 200. Если это графическое сообщение и его URL-адрес слишком длинный, `type` следует опустить, а` body` следует усечь до 200.

Эта библиотека предоставляет функцию `golos.messages.makeQuoteMsg`, которую можно (и нужно) использовать для простого создания ответных сообщений в соответствии с приведенными выше правилами. Эта функция автоматически обрезает сообщения, поэтому она работает с любыми **корректными** сообщениями, полученными `golos.messages.decode`.

Его можно использовать двумя разными способами. Вы можете выбрать любой из них, который удобнее для архитектуры вашего приложения.

#### Способ #1: Сначала создать ответное сообщение, а потом добавить к нему цитатуote to it

```js
let msgOriginal = messages[0]; // messages - это результат, возвращенный из `golos.messages.decode`, с полями `from`, `nonce` и `message`. Это должно быть корректное (!) сообщение, иначе makeQuoteMsg выбросит исключением

let msg = golos.messages.newTextMsg('Bob!'); // let! не const, поскольку makeQuoteMsg изменяет сообщение - добавляет цитату
golos.messages.makeQuoteMsg(msg, msgOriginal);
// и теперь вызываем encode для msg, и отправляем. Здесь все как с обычным сообщением
```

#### Способ #2: Сначала создать цитату, а потом уже к ней сообщение, которое на эту цитату отвечает

```js
let msgOriginal = messages[0];
let quote = golos.messages.makeQuoteMsg({}, msgOriginal);
...
let msg = golos.messages.newTextMsg('Bob!'); // let! не const, поскольку мы добавим сюда цитату
msg = {...msg, ...quote}; // добавляем цитату
// и теперь вызываем encode для msg, и отправляем. Здесь все как с обычным сообщением
```

#### Отображение сообщений с цитатами

`golos.messages.decodeMsgs` поддерживает сообщения с цитатами. Каждое такое сообщение имеет поле `quote` в своем поле `сообщение`. Но, если `quote` сообщения неверна (сообщение составлено с некорректным пользовательским интерфейсом, который не использует `makeQuoteMsg` и неправильно составляет цитаты), **весь объект сообщения будет считаться некорректным**, то есть поле `message` будет `null`.

#### Редактирование сообщений с цитатами

Чтобы отредактировать сообщение с цитатой, вы должны заново выстроить его с помощью `newTextMsg` /` newImageMsg` / ..., добавить поле `quote` (просто взять его из существующего декодированного сообщения) и зашифровать + отправить его как обычно (см. параграф «Редактирование сообщений»).
