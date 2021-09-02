# Private Messages

Golos Blockchain provides instant messages subsystem, which allows users communicate with encrypted private messages. Messages are encrypting on client-side (using sender's private memo key and recipient's public memo key), sending to blockchain via `private_message_operation`, and next can be obtained from DB with `private_message` API, and decrypted on client-side (using private memo key of from/to and public memo key of another user).

### Encrypt and send

Messages are JSON objects. If you want they showing in Golos Messenger (in blogs, forums), you should use JSON objects with `body` field which containing string with text of message, and also, with `app` and `version` fields which are describing your client app. Also, you can add any custom fields. But if you using only `body`, we recommend you set `app` as `'golos-messenger'` and `version` as `1`.

To create a message, you should use the `golos.messages.newTextMsg` function.

Message should correspond to the following rules:
- `app` field should be a string with length from 1 to 16;
- `version` field should be an integer, beginning from 1;
- `body` should be a string.

Next, message object should be JSON-stringified, enciphered (uses SHA-512 with nonce, which is a UNIX timestamp-based unique identifier, and AES), and converted to HEX string (`encrypted_message`). You can do it easy with `golos.messages.encode` function.

Full example:

```js
let data = golos.messages.encode('alice private memo key', 'bob public memo key', golos.messages.newTextMsg('Hello world', 'golos-messenger', 1));

const json = JSON.stringify(['private_message', {
    from: 'alice',
    to: 'bob',
    nonce: data.nonce,
    from_memo_key: 'alice PUBLIC memo key',
    to_memo_key: 'bob public memo key',
    checksum: data.checksum,
    update: false,
    encrypted_message: data.encrypted_message,
}]);
golos.broadcast.customJson('alice private posting key', [], ['alice'], 'private_message', json, (err, result) => {
    alert(err);
    alert(JSON.stringify(result));
});
```

### Edit message

Messages are identifying by from+to+nonce, so when you updating message, you should encode it with same nonce as in its previous version.

```js
data = golos.messages.encode('alice private memo key', 'bob public memo key', golos.messages.newTextMsg('Goodbye world', 'golos-messenger', 1), data.nonce);
```

Next, this data should be sent with `private_message` operation, same as in previous case, but with `update` = `true`.

### Image messages

Image messages, same as text messages, are JSON objects. Besides `app` and `version` fields, these messages should contain following fields:
- `body` field, which should be a string, containing an Internet URL of the image (its full version);
- `type` field, which should be equal to `'image'`. It identifies the message as an image message;
- `previewWidth` and `previewHeight` fields, which are the integers, computed by fitting an image to the preview area (600x300px). (See this algorithm in `fitImageToSize` function in the source code of this repository).

You should create image messages with `golos.messages.newImageMsgAsync` and `golos.messages.newImageMsg` functions. (These functions return an image message with computed `previewWidth` and `previewHeight`).

**Warning:** Golos Blockchain willn't download this image and store its content. It will just store the URL. Thefore, you should provide an URL of image, storing in some reliable image hosting, which will never delete this message.

**Also, it is strongly recommended to use the `https://`**. Some clients (incl. our official ones) may not support the `http://` in the Content Security Policy, they willn't show such images.

Full example (asynchronous, should run in `async function`):

```js
let msg;
try {
    msg = await golos.messages.newImageMsgAsync('https://site.com/https-is-recommended.jpg', (progress, extra_data) => {
        console.log('Progress: %i%', progress);
        // also, if error occured, you can get error in extra_data.error
    }, 'golos-messenger', 1);
} catch (err) {
    alert(err);
    console.error(err);
}
if (msg) {
    let data = golos.messages.encode('alice private memo key', 'bob public memo key', msg);
    // ...and send it same as a text message
}
```

Full example #2 (synchronous):

```js
golos.messages.newImageMsg('https://site.com/https-is-recommended.jpg', (err, msg) => {
        if (err) {
            alert(err);
            console.error(err);
        } else {
            let data = golos.messages.encode('alice private memo key', 'bob public memo key', msg);
            // ...and send it same as a text message
        }
    }, (progress, extra_data) => {
        console.log('Progress: %i%', progress);
        // also, if error occured, you can get error in extra_data.error
    }, 'golos-messenger', 1);
```

### Obtain and decrypt

Message can be obtained with `golos.api.getThread`, each message is object with `from_memo_key`, `to_memo_key`, `nonce`, `checksum`, `encrypted_message` and another fields. Next, message can be decrypted with `golos.messages.decode` which supports batch processing (can decrypt few messages at once) and provides good performance.

```js
golos.api.getThread('alice', 'bob', {}, (err, results) => {
    results = golos.messages.decode('alice private key', 'bob public memo key', results);
    alert(results[0].message.body);
});
```

**Note:** it also validates messages to correspond to the following rules:
- message should be a correct JSON object, with fields conforming to the next rules;
- `app` field should be a string with length from 1 to 16;
- `version` field should be an integer, beginning from 1;
- `body` should be a string;
- for image messages: `previewWidth` and `previewHeight` should be the integers, which are result of fitting an image to 600x300 px area. 

**Note:** if message cannot be decoded, parsed as JSON and/or validated, it still adding to result, but has `message: null` (if cannot be parsed as JSON, or validated), and `raw_message: null` (if cannot be decoded at all). Such behaviour allows client to mark this message as read, but not display it to user. If you want to change this behaviour, you can use `on_error` parameter in `golos.messages.decode` (see the source code for more details).

### Mark Messages Read & Delete Messages

Blockchain provides `private_mark_message` operation for marking messages as read, and `private_delete_message` to delete them.
Each of these operations can be used by one of two cases:
- to process 1 message: set `nonce` to message nonce,
- to process range of few messages: set `start_date` to (1st message's create_date minus 1 sec), and `stop-date` to last message's create_date.
Also, you can process multiple ranges of messages by combining few operations in single transaction.

**Note: you should not use case with `nonce` if processing 2 or more sequential messages.**

To make ranges, you can use `golos.messages.makeDatedGroups`, which builds such ranges by a condition, and can wrap them into real operations in-place.

It accepts decoded messages from `golos.messages.decode`.

**Note: function should iterate messages from end to start.**

```js
let operations = golos.messages.makeDatedGroups(messages, (message_object, idx) => {
    return message_object.read_date.startsWith('19') && message_object.from !== 'bob'; // unread and not by bob
}, (group) => {
    const json = JSON.stringify(['private_mark_message', { // or 'private_delete_message'
        from: 'alice',
        to: 'bob',
        //requester: 'bob', // add it for delete case
        ...group,
    }]);
    return ['custom_json',
        {
            id: 'private_message',
            required_posting_auths: ['bob'],
            json,
        }
    ];
}, 0, messages.length); // specify right direction of iterating

golos.broadcast.send({
        operations,
        extensions: []
    }, ['bob private posting key'], (err, result) => {
    alert(err);
    alert(JSON.stringify(result));
});
```

### Replying

Starting from 0.8.3, library supports replying to messages. For user, it works as following:
- alice sends some message to bob;
- bob clicks this message, then clicks "Reply", and writes some reply message;
- messenger UI should display the quote of alice message on top of the bob message.

**Note:** also, alice can reply bob message, which already contains his reply to her message. In this case, quotes should not be nested (we are not supporting it), alice just quotes body of bob message, without re-quoting her first message quote.

You can reply messages of any type (text, image and any other), and your reply can be a message of any type, too.

As a regular message, reply message is a JSON object, which has `app`, `version`, `body` and etc. But it also contains `quote` field. `quote` field is an object, and should contain the following fields:
- `from` field is a nickname of "alice" (who wrote original message);
- `nonce` field is a nonce of original message;
- `type` field is a type of original message (for image message it should be `"image"`, and for text message it should be omitted);
- `body` is a **truncated** text of original message. If it is image message, `body` should have length <= 2000. In any another case, it is <= 200. If it is image message and its URL is too long, `type` should be omitted, and `body` should be truncated to 200.

This library provides `golos.messages.makeQuoteMsg` function, which can (and should) be used to easily construct reply messages, conforming to rules above. This function automatically truncates messages, so it works with any **valid** messages from `golos.messages.decode`.

It can be used by 2 different approaches. You can choose any of them, which is more convenient for your architecture.

#### Approach #1: Construct your message, and add a quote to it

```js
let msgOriginal = messages[0]; // messages is result returned from `golos.messages.decode`, with `from`, `nonce` and `message` field. It should be a valid (!) message object, otherwise makeQuoteMsg will throw

let msg = golos.messages.newTextMsg('Bob!'); // let! not const, because makeQuoteMsg changes it
golos.messages.makeQuoteMsg(msg, msgOriginal);
// now encode msg as usually, and send it
```

#### Approach #2: Pre-construct quote, and then construct your message with quote

```js
let msgOriginal = messages[0];
let quote = golos.messages.makeQuoteMsg({}, msgOriginal);
...
let msg = golos.messages.newTextMsg('Bob!'); // let! not const, because we will add quote here
msg = {...msg, ...quote}; // add quote to message
// now encode msg as usually, and send it
```

#### Obtaining messages with quotes

`golos.messages.decode` supports messages with quotes. Each such message has `quote` field in its `message` field. But, if `quote` of message is wrong (message composed with some wrong UI, which don't uses `makeQuoteMsg`, and composes quotes wrong), **the whole message object will be invalid**, and `message` field will be `null`.


#### Editing messages with quotes

To edit a message with quote, you should re-construct it with `newTextMsg`/`newImageMsg`/..., add the `quote` field (just get it from existing decoded message, not re-construct), and encode+send it as usually (see "Edit message" chapter).
