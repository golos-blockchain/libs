import newDebug from 'debug';
import config from '../../config';
import fetch from 'cross-fetch';
import Transport from './base';
import { nodeify, } from '../../promisify';

const cbMethods = [
  'set_block_applied_callback',
  'set_pending_transaction_callback',
  'set_callback'
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
  const payload = {id, jsonrpc: '2.0', method, params};
  let req = {
    body: JSON.stringify(payload),
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  }
  req.credentials = config.get('credentials');
  if (!req.credentials) delete req.credentials;
  return fetch(uri, req).then(res => {
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
    super(Object.assign({id: 0}, options));

    this._requests = new Map();
  }

  send(api, data, callback) {
  	const id = data.id || this.id++;

    this.currentP = new Promise((resolve, reject) => {
      this._requests[id] = {id, resolve, reject};
      const params = [api, data.method, data.params];
      const url = config.get("websocket");
      jsonRpc(url, {method: 'call', id, params})
        .then(res => {
          this._requests[res.id].resolve(res.result);
          delete this._requests[res.id];
        }, err => {
          this._requests[err.resid].reject(err);
          delete this._requests[err.resid];
        })
      })

    this.currentP = nodeify(this.currentP, callback);

    return this.currentP;
  }
}