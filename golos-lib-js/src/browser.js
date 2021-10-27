const api = require('./api');
const auth = require('./auth');
const oauth = require('./oauth');
const middlewares = require('./middlewares');
const broadcast = require('./broadcast');
const config = require('./config');
const formatter = require('./formatter')(api);
const memo = require('./auth/memo');
const messages = require('./auth/messages');
const utils = require('./utils');
const { importNativeLibCtx, importNativeLib,
    isNativeLibLoaded, assertNativeLib, } = require('./core');

const golos = {
    importNativeLibCtx,
    importNativeLib,
    isNativeLibLoaded,
    assertNativeLib,
    api,
    auth,
    oauth,
    broadcast,
    config,
    formatter,
    memo,
    messages,
    middlewares,
    use: middlewares.use,
    utils,
};

if (typeof window !== 'undefined') {
    window.golos = golos;
}

if (typeof global !== 'undefined') {
    global.golos = golos;
}

exports = module.exports = golos;
