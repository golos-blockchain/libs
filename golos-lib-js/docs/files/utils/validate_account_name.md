## Валидация имен аккаунтов

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
