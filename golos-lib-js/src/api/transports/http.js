import newDebug from 'debug';

import config from '../../config';
import Transport from './base';
import { nodeify, } from '../../promisify';
import fetchEx from '../../utils/fetchEx'

const cbMethods = [
    'set_block_applied_callback',
    'set_pending_transaction_callback',
    'set_callback',
    'subscribe_to_market',
];

const debugProtocol = newDebug('golos:protocol');
const debugHttp = newDebug('golos:http');

export class RPCError extends Error {
    constructor(rpcError, rpcRes) {
        super(rpcError.message);
        this.name = 'RPCError';
        this.code = rpcError.code;
        this.data = rpcError.data;
        this.resid = rpcRes.id;
    }
}

export function jsonRpc(uri, {method, id, params}) {
    const payload = { id, jsonrpc: '2.0', method, params, };
    let req = {
        body: JSON.stringify(payload),
        method: 'post',
        mode: 'cors',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        timeout: config.get('node_timeout')
    };
    req.credentials = config.get('credentials');
    if (!req.credentials) delete req.credentials;
    return fetchEx(uri, req).then(res => {
        if (!res.ok) {
            throw new Error(`HTTP ${ res.status }: ${ res.statusText }`);
        }
        return res.json();
    }).then(rpcRes => {
        if (rpcRes.id !== id) {
            throw new Error(`Invalid response id: ${ rpcRes.id }`);
        }
        if (rpcRes.error) {
            throw new RPCError(rpcRes.error, rpcRes);
        }
        return rpcRes;
    });
}

export default class HttpTransport extends Transport {
    constructor(options = {}) {
        super(Object.assign({ id: 0, }, options));
    }

    send(api, data, callback) {
        const id = data.id || this.id++;

        this.currentP = new Promise((resolve, reject) => {
            const params = [ api, data.method, data.params, ];
            const url = this.getURL()
            jsonRpc(url, { method: 'call', id, params, })
                .then(res => {
                    resolve(res.result);
                }, err => {
                    reject(err);
                });
        });

        this.currentP = nodeify(this.currentP, callback);

        return this.currentP;
    }
}
