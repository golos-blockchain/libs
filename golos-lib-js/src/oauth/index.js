import fetch from 'cross-fetch';
import newDebug from 'debug';
import config from '../config';
import { hash, } from '../auth/ecc';
import { createPopup, } from './loginPopup';

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
    return fetch(new URL(url, getHost()), request);
}

async function check() {
    const res = await _callApi('/api/oauth/check/' + clientId());
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

function login(permissions = [], extraParams = '') {
    if (typeof(window) === 'undefined') {
        throw new Error('OAuth works only in browser environment (window should be defined)');
    }
    const client = clientId();
    createPopup(async () => {
        let res = await _callApi('/api/oauth/get_client/' + client);
        res = await res.json();
        // TODO: what if no client?
        return {
            title: res.client.title,
        };
    }, ({ closePopup, }) => {
        const win = window.open(uiHost() + '/oauth/' + client + '/' + permissions.join(',') + extraParams);
        closePopup();
    }, ({ closePopup, }) => {
        closePopup();
    })
}

async function logout() {
    const res = await _callApi('/api/oauth/logout/' + clientId());
}

function _hashOps(operations) {
    let json = JSON.stringify(operations);
    const idHash = hash.sha256(json, 'hex');
    return idHash;
}

module.exports = {
    clientId,
    apiHost,
    uiHost,
    _callApi,
    check,
    checkReliable,
    login,
    waitForLogin,
    logout,
    _hashOps,
};
