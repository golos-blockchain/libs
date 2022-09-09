# Asset для финансовых расчетов

- [Операторы сравнения](./asset.md#операторы-сравнения)
- [Операторы арифметики](./asset.md#операторы-арифметики)
- [instanceof - проверка принадлежности](./asset.md#instanceof---проверка-принадлежности)
- [Использование Math](./asset.md#использование-math)
- [Торговля токенами](./asset.md#торговля-токенами)
- [Хранение Asset в стейте. AssetEditor](./asset.md#хранение-asset-в-стейте-asseteditor)
- [Отправка Asset или Price в операции](./asset.md#отправка-asset-или-price-в-операции)

#

:electron: Этот функционал использует WebAssembly. Перед первым действием вызовите `await golos.importNativeLib()`, или всегда вызывайте саму функцию с `await`. [Подробнее](../wasm.md).

В библиотеке есть класс `golos.utils.Asset`, который позволяет парсить строки с денежными суммами, полученные от блокчейна (такие, как '12.940 GOLOS'), получая при этом объект `Asset`, с которым можно проводить арифметические действия и действия из Math. И наоборот, Asset может создать такую строку из суммы, введенной пользователем, и затем отправить какую-нибудь операцию с этой строкой. Кроме того, Asset позволяет отображать суммы с заданной точностью (кол-во разрядов копеек) или вообще без копеек ('12 GOLOS').

`Asset` имеет такой же размер (`int64`), как и в блокчейне, в отличие от стандартных чисел в JavaScript, которые имеют несколько меньшую точность, и будут ошибаться в случае сумм, близких к предельным. Поэтому рекомендуется использовать именно `Asset`.

```js
await golos.importNativeLib();

let asset = golos.utils.Asset('12.940 GOLOS');  // или golos.utils.Asset(12940, 3, 'GOLOS')

console.log(asset.amount); // => 12940
console.log(asset.amountFloat); // => '12.94'
console.log(asset.precision); // => 3
console.log(asset.symbol); // => 'GOLOS'
console.log(asset.toString()); // => '12.940 GOLOS'
console.log(asset.toString(0)); // => '12 GOLOS'
console.log(asset.floatString); // => '12.94 GOLOS'

console.log(asset.plus('1.000 GOLOS').toString(); // 13.940 GOLOS

asset.amountFloat = '1.5'; // получится 1.500 GOLOS
asset.amountFloat = '3,1415'; // получится 3.141 GOLOS
asset.amountFloat = '-5'; // получится -5.000 GOLOS
```

### Операторы сравнения

```js
let asset1 = golos.utils.Asset('1.000 GOLOS');
let asset2 = golos.utils.Asset('2.000 GOLOS');
console.log(asset1.eq(asset2)); // ==
console.log(asset1.eq(2000)); // ==
console.log(asset1.lt(asset2)); // <
console.log(asset1.gt(asset2)); // >
console.log(asset1.lte(asset2)); // <=
console.log(asset1.gte(asset2)); // >=

console.log(asset1.min(asset2).amount); // 1000
console.log(asset1.max(asset2).amount); // 2000
console.log(asset1.max(2000).amount); // 2000
```

### Операторы арифметики

К Asset можно прибавить Asset или Number:

```js
let asset1 = golos.utils.Asset('1.000 GOLOS');
let asset2 = golos.utils.Asset('2.000 GOLOS');
let asset3 = asset1.plus(asset2); // 3.000 GOLOS
let asset4 = asset1.plus(2000); // 3.000 GOLOS
````

Также доступны действия: `minus`, `div`, `mul`, `mod` (остаток от деления).

Действия можно объединять в цепочки, например, при вычислении процента от суммы:

```js
var asset1 = golos.utils.Asset('1.000 GOLOS').mul(25).div(100);
console.log(asset1.toString()); // 0.250 GOLOS
```

### instanceof - проверка принадлежности

Возможно, вы заметили, что так называемый класс `Asset` создается без `new`. Это потому, что класс на самом деле называется `_Asset`, а `Asset` - это функция, которая позволяет создать его без `new` (для лаконичности).

```js
import { Asset, _Asset } from 'golos-lib-js/lib/utils'
...
const a1 = Asset('1.000 GOLOS')
console.log(a1 instanceof _Asset) // true
```

### Использование Math

В принципе, в `Asset` есть поле `amount`, которое позволяет работать с ним, как с обычным числом:

```js
let num = 1000;
let a1 = Asset(num, 3, 'GOLOS'); // создаем asset из числа
a1.amount = Math.abs(a1.amount);
```
Но стандартные числа JavaScript имеют не вполне достаточную точность, и при суммах, близких к предельно возможным, будут ошибаться. Поэтому по возможности не стоит использовать их в расчетах.

### Торговля токенами

Помимо `Asset`, есть класс `Price`, который позволяет рассчитывать сумму продажи по сумме покупки, и наоборот, используя цену:

```js
import { Asset, Price } from 'golos-lib-js/lib/utils'
...
const price = Price({
    base: '0.009 GOLOS',
    quote: '0.003 GBG'
}) // или Price(Asset(...), Asset(...)
const a1 = Asset('10.000 GOLOS')
console.log(a1.mul(price).toString()) // '3.333' GBG
```

В блокчейне цены у `limit_order`'ов именно целочисленные, так что такой подход верен. Если вы покупаете GOLOS, то сумму GBG в данном случае надо округлить в большую сторону, иначе сделка не пройдет. `Asset` дает возможность определить, что расчет получился неточным, и округлить сумму:
```js
const buy = Asset('10.000 GOLOS')
const remain = Asset('0.000 GOLOS')
const sell = buy.mul(price, remain)
if (remain.amount) {
    sell = sell.add(1)
}
```

### Хранение Asset в стейте. AssetEditor.

Если вы разрабатываете приложение на React и т.п., то у вас может возникнуть необходимость сделать некое поле, в которое пользователь вводит сумму, например, для операции `transfer` (перевод другому пользователю).

Пользователю неудобно вводить сумму в формате "10.000 GOLOS", который поддерживается блокчейном и классом `Asset`. Лучше сделать так, чтобы ему требовалось ввести лишь число "10", а если сумма с копейками, то "10.501", "10,500", "10.5". Для этого есть класс `AssetEditor`, который принимает сумму, введенную человеком, обеспечивает валидацию формата, хранит ее в стейте React (или подобном) и затем формирует Asset для отправки в блокчейн.

```js
import React from 'react'
import { AssetEditor } from 'golos-lib-js/lib/utils'

class TheForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    async componentDidMount() {
        this.setState({
            buyAmount: await AssetEditor(0, 3, 'GOLOS')
        })
    }

    onAmountChange = (e) => {
        const buyAmount = this.state.buyAmount.withChange(e.target.value)
        if (buyAmount.hasChange) {
            // здесь возможна валидация и формирование сообщений об ошибках
            this.setState({
                buyAmount
            })
        }
    }

    submit = (e) => {
        const { buyAmount } = this.state
        const a = buyAmount.asset // это Asset
        alert(a.toString())
    }

    render() {
        const { buyAmount } = this.state
        if (!buyAmount) {
            return (<div>Loading...</div>)
        }
        return (<div>
            <input type='text' value={buyAmount.amountStr} onChange={this.onAmountChange} />
            <button onClick={this.submit}>Submit</button>
        </div>)
    }
}
```

В основе `AssetEditor` лежит функция `Asset.updateAmountFloat()`, так что вы можете реализовать подобный функционал и без `AssetEditor`:

```js
asset.updateAmountFloat('') // получится 0, вернет ''
asset.updateAmountFloat('3') // получится 3, вернет '3'
asset.updateAmountFloat('3.') // получится 3, вернет '3.'
asset.updateAmountFloat('3.4') // получится 3.4, вернет '3.4'
```

### Отправка Asset или Price в операции

`Asset` и `Price` можно отправлять непосредственно в операции:

```js
const amount = Asset('0.001 GOLOS')
await golos.broadcast.transferAsync('5J...', 'aerostorm1', 'null', amount, '')
```

Также можно отправить `AssetEditor` в качестве `Asset`, без дополнительного преобразования. Это дает возможность прямо в стейте сконструировать операцию с полями `AssetEditor`, редактируемыми пользователем, а затем отправить эту операцию в "сыром" виде:

```js
const transfer = {
    from: 'aerostorm1',
    to: 'null',
    amount: AssetEditor('0.001 GOLOS'),
    memo: ''
}
const operations = [
    ['transfer', transfer]
]
const res = await golos.broadcast.sendAsync({
    operations,
    extensions: [],
}, ['5J...'])
```
