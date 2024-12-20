const api = require('./api');
const auth = require('./auth');
const multiauth = require('./multiauth');
const middlewares = require('./middlewares');
const broadcast = require('./broadcast');
const config = require('./config');
const formatter = require('./formatter')(api);
const memo = require('./auth/memo');
const messages = require('./auth/messages');
const utils = require('./utils');
const Libs = require('./libs')
const { importNativeLibCtx, importNativeLib,
    isNativeLibLoaded, assertNativeLib, } = require('./core');

const golos = {
    importNativeLibCtx,
    importNativeLib,
    isNativeLibLoaded,
    assertNativeLib,
    api,
    auth,
    multiauth,
    broadcast,
    config,
    formatter,
    memo,
    messages,
    middlewares,
    use: middlewares.use,
    utils,
};

new Libs(golos)

if (typeof window !== 'undefined') {
    window.golos = golos;
}

if (typeof global !== 'undefined') {
    global.golos = golos;
}

exports = module.exports = golos;
