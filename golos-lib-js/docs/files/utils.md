## Утилиты, ускоряющие разработку клиентов

#### Валидация имен аккаунтов
Возвращает строку на английском языке, а также идентификатор ошибки. Вы можете использовать идентификатор для создания локализованных сообщений об ошибках в своем приложении.
```js
var nameRes = golos.utils.validateAccountName('test1234');
console.log(nameRes.error); // => 'null'
console.log(nameRes.msg); // => ''

var nameRes = golos.utils.validateAccountName('a1');
if (nameRes.error) {
    console.log(nameRes.error); // => 'account_name_should_be_longer'
    console.log(nameRes.msg); // => 'Account name should be longer.'
}
```
Все возможные ошибки:
```js
{ error: "account_name_should_not_be_empty", msg: "Account name should not be empty." }
{ error: "account_name_should_be_longer", msg: "Account name should be longer." }
{ error: "account_name_should_be_shorter", msg: "Account name should be shorter." }
{ error: "each_account_segment_should_start_with_a_letter", msg: "Each account segment should start with a letter." }
{ error: "each_account_segment_should_have_only_letters_digits_or_dashes", msg: "Each account segment should have only letters, digits, or dashes." }
{ error: "each_account_segment_should_have_only_one_dash_in_a_row", msg: "Each account segment should have only one dash in a row." }
{ error: "each_account_segment_should_end_with_a_letter_or_digit", msg: "Each account segment should end with a letter or digit." }
{ error: "each_account_segment_should_be_longer", msg: "Each account segment should be longer" }
```

#### Asset для финансовых расчетов
:electron: Этот функционал использует WebAssembly. Перед первым действием вызовите `await golos.importNativeLib()`, или всегда вызывайте саму функцию с `await`.

В библиотеке есть класс `golos.utils.Asset`, который позволяет парсить строки с денежными суммами, полученные от блокчейна (такие, как '99.999 GOLOS'), получая при этом объект `Asset`, с которым можно проводить арифметические действия и действия из Math. И наоборот, Asset может создать такую строку из суммы, введенной пользователем, и затем отправить какую-нибудь операцию с этой строкой. Кроме того, Asset позволяет отображать суммы с заданной точностью (кол-во разрядов копеек) или вообще без копеек ('99 GOLOS'). 

Суммы в Asset хранятся в виде (https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/BigInt)[BigInt].

```js
await golos.importNativeLib();

let asset = golos.utils.Asset('99.999 GOLOS');  // или golos.utils.Asset(99999, 3, 'GOLOS')
                                                // или golos.utils.Asset(99999n, 3, 'GOLOS')
console.log(asset.amount); // => 99999n
console.log(asset.amountFloat); // => 99.999
console.log(asset.precision); // => 3
console.log(asset.symbol); // => 'GOLOS'
console.log(asset.toString()); // => '99.999 GOLOS'
console.log(asset.toString(0)); // => '99 GOLOS'

console.log(asset.plus('1.000 GOLOS').toString(); // 19

// amount (тип BigInt) и amountFloat поддерживают все арифметические и Math.* действия
asset.amount += BigInt(1); // получится '100.000 GOLOS'
asset.amountFloat -= 1; // получится 99.000 GOLOS
```

##### Операторы сравнения

```js
let asset1 = golos.utils.Asset('1.000 GOLOS');
let asset2 = golos.utils.Asset('2.000 GOLOS');
console.log(asset1.eq(asset2)); // ==
console.log(asset1.lt(asset2)); // <
console.log(asset1.gt(asset2)); // >
console.log(asset1.lte(asset2)); // <=
console.log(asset1.gte(asset2)); // >=
```

##### Операторы арифметики

К Asset можно прибавить Asset, BigInt или обычный Number:

```js
let asset1 = golos.utils.Asset('1.000 GOLOS');
let asset2 = golos.utils.Asset('2.000 GOLOS');
let asset3 = asset1.plus(asset2); // 3.000 GOLOS
let asset4 = asset1.plus(2000); // 3.000 GOLOS
let asset5 = asset1.plus(2000n); // 3.000 GOLOS
````

Также доступны действия: `minus`, `div`, `mul`.

Действия можно объединять в цепочки, например, при вычислении процента от суммы:

```js
var asset1 = golos.utils.Asset(1.000 GOLOS').mul(25).div(100);
console.log(asset1.toString()); // 0.250 GOLOS
```

#### Formatter

[Formatter](./formatter.md)
