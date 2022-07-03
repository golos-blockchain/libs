import newDebug from 'debug';

import config from '../config';
import { hash, } from '../auth/ecc';
import fetchEx from '../utils/fetchEx'
import { kcLogin, kcLoggedIn, waitForKc, assertKc, kcLogout } from './keychain'
import { delay } from '../utils/misc'

let _apiHost;
let _uiHost;
let _clientId;

let _oauthNode, _oauthChainId;

const debug = newDebug('golos:multiauth');

const AuthType = {
    OAUTH: 1,
    KEYCHAIN: 2,
}

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

// Keychain only signs transactions, but not sends them
// and we cannot use OAuth host if we are using KeyChain
// so we should use our node to send them
function setKeychainNodeIfCan() {
    const signedNode = config.get('signed.websocket')
    if (signedNode) {
        _oauthNode = config.get('websocket')
        config.set('websocket', signedNode)
    }
    const signedCid = config.get('signed.chain_id')
    if (signedCid) {
        _oauthChainId = config.get('chain_id')
        config.set('chain_id', signedCid)
    }
}

function switchBackToOAuth() {
    if (_oauthNode) {
        config.set('websocket', _oauthNode)
    }
    if (_oauthChainId) {
        config.set('chain_id', _oauthChainId)
    }
}

function _callApi(url, data, getHost = apiHost) {
    let request = {
        method: data ? 'post' : 'get',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-type': data ? 'application/json' : undefined,
        },
        body: data ? JSON.stringify(data) : undefined,
    };
    return fetchEx(new URL(url, getHost()), request);
}

async function check() {
    const resKC = await kcLoggedIn()
    if (resKC.authorized) {
        setKeychainNodeIfCan()
        return { ...resKC, authType: AuthType.KEYCHAIN }
    }
    let res = await _callApi('/api/oauth/check/' + clientId());
    res = await res.json()
    return { ...res, authType: AuthType.OAUTH } 
}

async function checkReliable(onError = undefined, retry = 1) {
    let res = null
    try {
        res = await check();
    } catch (err) {
        if (onError && onError({ retry, })) {
            throw err;
        }
        if (!onError) {
            if (retry > 10) {
                console.error('multiauth.check stopped retrying')
                throw err
            }
            console.error('multiauth.check error:', err, 'retrying...');
        }
        await delay(3000)
        res = await checkReliable(onError, ++retry)
    }
    return res
}

const waiters = new Set()
let waiterAutoInc = 0

const stopped = (id, onFail) => {
    if (!waiters.has(id)) {
        onFail()
        return true
    }
    return false
}

async function waitingLoop(id, onFinish, onFail, retries = 180, onRetry = undefined) {
    if (!retries) {
        console.error('waiting for login is timeouted')
        onFail()
        return;
    }

    if (stopped(id, onFail)) return
    const res = await checkReliable()
    if (stopped(id, onFail)) return

    if (res.authorized) {
        onFinish(res)
    } else {
        if (onRetry && onRetry({ retriesLeft: retries, })) {
            onFail()
            return
        }
        debug('waiting for login...')
        setTimeout(() => {
            waitingLoop(id, onFinish, onFail, --retries, onRetry)
        }, 1000)
    }
}

async function waitForLogin(onFinish, onFail, retries = 180, onRetry = undefined) {
    ++waiterAutoInc
    waiters.clear()
    waiters.add(waiterAutoInc)
    await waitingLoop(waiterAutoInc, onFinish, onFail, --retries, onRetry)
}

async function login(permissions = [], {
        type = AuthType.OAUTH,
        extraParams = ''
    } = {}) {
    if (typeof(document) === 'undefined') {
        throw new Error('MultiAuth works only in browser environment (window should be defined)');
    }
    if (type === AuthType.KEYCHAIN) {
        await assertKc()
        await kcLogin()
        return true
    }
    return window.open(uiHost() + '/oauth/' + clientId() + '/' + permissions.join(',') + extraParams);
}

async function logout() {
    if (!await kcLogout()) {
        const res = await _callApi('/api/oauth/logout/' + clientId());
    } else {
        switchBackToOAuth()
    }
}

function _hashOps(operations) {
    let json = JSON.stringify(operations);
    const idHash = hash.sha256(json, 'hex');
    return idHash;
}

async function keychainInfo() {
    let info = { installed: false, loadingBroken: false }
    try {
        info.installed = await waitForKc()
    } catch (err) {
        console.error(err)
        info.loadingBroken = true
    }
    return info
}

module.exports = {
    clientId,
    apiHost,
    uiHost,
    check,
    checkReliable,
    AuthType,
    login,
    waitForLogin,
    logout,
    keychainInfo,
    _callApi,
    _hashOps,
};
