# Formatter

### Сгенерировать пароль
```js
var password = golos.formatter.createSuggestedPassword();
console.log(password);
// => 'GAz3GYFvvQvgm7t2fQmwMDuXEzDqTzn9'
```

### Сгенерировать пермлинк для комментария
```js
var parentAuthor = 'ned';
var parentPermlink = 'a-selfie';
var commentPermlink = golos.formatter.commentPermlink(parentAuthor, parentPermlink);
console.log(commentPermlink);
// => 're-ned-a-selfie-20170621t080403765z'
```

### Репутация
Позволяет перевести значение из поля reputation акков в удобный для пользователя вид.
```js
var reputation = golos.formatter.reputation(3512485230915);
console.log(reputation);
// => 56
```

### Отображение Силы Голоса в GOLOS и наоборот
Позволяет отображать Силу Голоса в удобном для людей виде.

Использует текущий курс (из `getDynamicGlobalProperties`).
```js
var golosPower = golos.formatter.vestToGolos(vestingShares, totalVestingShares, totalVestingFundGolos);
console.log(golosPower);

var vestingShares = golos.formatter.golosToVest(golosPower, totalVestingShares, totalVestingFundGolos);
console.log(vestingShares);
```
Параметры функции могут быть `Asset`, десятичными дробями или строками в формате блокчейна (пример: `'0.001 GOLOS'`).

Если хотя бы один из параметров является `Asset`, то функция возвращает `Asset`. Иначе - возвращает десятичную дробь.
