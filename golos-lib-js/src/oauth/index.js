import fetch from 'cross-fetch';
import newDebug from 'debug';
import config from '../config';

let _apiHost;
let _uiHost;
let _clientId;

const debug = newDebug('golos:oauth');

function apiHost() {
    if (_apiHost) return _apiHost;

    const KEY = 'oauth.host';
    let host = config.get(KEY);
    if (!host) throw new Error(KEY + ' is not set in golos.config');
    if (!host.startsWith('http://') && !host.startsWith('https://'))
        host = 'https://' + host;
    try {
        _apiHost = new URL(host).origin;
    } catch (err) {
        throw new Error(KEY + ' cannot be parsed as URL: ' + host);
    }
    return _apiHost;
}

function uiHost() {
    if (_uiHost) return _uiHost;

    const KEY = 'oauth.ui_host';
    let host = config.get(KEY);
    if (!host) {
        _uiHost = apiHost();
        return _uiHost;
    }
    if (!host.startsWith('http://') && !host.startsWith('https://'))
        host = 'https://' + host;
    try {
        _uiHost = new URL(host).origin;
    } catch (err) {
        throw new Error(KEY + ' cannot be parsed as URL: ' + host);
    }
    return _uiHost;
}

function clientId() {
    if (_clientId)
        return _clientId;

    const KEY = 'oauth.client';
    let client = config.get(KEY);
    if (!client) throw new Error(KEY + ' is not set in golos.config');
    _clientId = client;
    return _clientId;
}

async function check() {
    let url = new URL('/api/oauth/check/' + clientId(), apiHost());
    const res = await fetch(url.toString(), {
        credentials: 'include',
    });
    return await res.json();
}

async function checkReliable(onError = undefined, retry = 1) {
    let res = null;
    try {
        res = await check();
        return res;
    } catch (err) {
        if (onError && onError({ retry, })) {
            throw err;
        }
        if (!onError)
            console.error('oauth.check error:', err, 'retrying...');
        setTimeout(() => {
            checkReliable(onError, ++retry);
        }, 3000);
    }
}

async function waitForLogin(onFinish, onFail, retries = 180, onRetry = undefined) {
    if (!retries) {
        console.error('waiting for login is timeouted');
        onFail();
        return;
    }
    const res = await checkReliable();
    if (res.authorized) {
        onFinish(res);
    } else {
        if (onRetry && onRetry({ retriesLeft: retries, })) {
            onFail();
            return;
        }
        debug('waiting for login...');
        setTimeout(() => {
            waitForLogin(onFinish, onFail, --retries, onRetry);
        }, 1000);
    }
}

function login() {
    if (typeof(window) === 'undefined') {
        throw new Error('OAuth works only in browser environment (window should be defined)');
    }
    window.open(uiHost() + '/oauth/' + clientId());
}

async function logout() {
    let url = new URL('/api/oauth/logout/' + clientId(), apiHost());
    const res = await fetch(url.toString(), {
        credentials: 'include',
    });
}

module.exports = {
    clientId,
    apiHost,
    uiHost,
    check,
    checkReliable,
    login,
    waitForLogin,
    logout,
};
