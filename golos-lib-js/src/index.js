const api = require('./api');
const auth = require('./auth');
const multiauth = require('./multiauth');
const middlewares = require('./middlewares');
const broadcast = require('./broadcast');
const formatter = require('./formatter')(api);
const memo = require('./auth/memo');
const messages = require('./auth/messages');
const config = require('./config');
const utils = require('./utils');
const Libs = require('./libs')
const ecc = require('./auth/ecc/');
const { importNativeLibCtx, importNativeLib,
    isNativeLibLoaded, assertNativeLib, } = require('./core');

const rootObj = {
    importNativeLibCtx,
    importNativeLib,
    isNativeLibLoaded,
    assertNativeLib,
    api,
    auth,
    broadcast,
    formatter,
    memo,
    messages,
    middlewares,
    multiauth,
    config,
    use: middlewares.use,
    utils,
    ecc,
}

new Libs(rootObj)

module.exports = rootObj
