## Использование golos-lib-js с react-scripts и Webpack 5

В библиотеке golos-lib-js используются некоторые модули Node.js. Если вы собираете проект с помощью webpack 5 (например, с помощью новых версий react-scripts), то необходимо вручную добавить в конфиг Webpack соответствующие полифиллы.

Допустим, вы создали проект React с помощью create-react-app. В этом случае сборка проекта будет осуществляться с помощью react-scripts. Новые версии этого компонента используют Webpack 5, и вы столкнетесь с такой ошибкой:

```
Module not found: Error: Can't resolve 'stream' in '/root/Desktop/mra/node_modules/cipher-base'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "stream": require.resolve("stream-browserify") }'
	- install 'stream-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "stream": false }
```

Чтобы решить эту проблему, надо добавить полифиллы в конфиг Webpack. Сами модули не нужно устанавливать через npm - они уже входят в golos-lib-js. А вот с конфигом мы ничего не можем сделать - туда добавить полифиллы должны вы.

### react-scripts

В случае с react-scripts необходимо установить [react-app-rewired](https://www.npmjs.com/package/react-app-rewired) и создать в корне проекта файл `config-overrides.js` с таким кодом:
```js
const webpack = require('webpack')

module.exports = function override(config, env) {
    let resolve = config.resolve
    resolve.alias = {
        ...resolve.alias,
        process: 'process/browser',
        stream: 'stream-browserify',
    }
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    )
    return config
}
```
