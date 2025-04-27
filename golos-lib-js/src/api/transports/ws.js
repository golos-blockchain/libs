import isNode from 'detect-node';
import newDebug from 'debug';
import Transport from './base';
import { nodeify, } from '../../promisify';

const cbMethods = [
  'set_block_applied_callback',
  'set_pending_transaction_callback',
  'set_callback',
  'subscribe_to_market'
];

let WebSocket;
if (isNode) {
  WebSocket = require('ws'); // eslint-disable-line global-require
} else if (typeof window !== 'undefined') {
  WebSocket = window.WebSocket;
} else {
  throw new Error('Couldn\'t decide on a `WebSocket` class');
}

const debugProtocol = newDebug('golos:protocol');
const debugWs = newDebug('golos:ws');

export default class WsTransport extends Transport {
  constructor(options = {}) {
    super(Object.assign({id: 0}, options));

    this.isOpen = false;
  }

  start() {
  	if (this.startP) {
      return this.startP;
    }

    let startP
    startP = new Promise((resolve, reject) => {
      if (startP !== this.startP) return;
      const url = this.getURL();
      this.ws = new WebSocket(url);

      const releaseOpen = this.listenTo(this.ws, 'open', () => {
        debugWs('Opened WS connection with', url);
        this.isOpen = true;
        releaseOpen();
        resolve();
      });

      const errHandler = () => {
        const wasOpen = this.isOpen;
        this.isOpen = false;
        delete this.ws;
        this.stop();

        const err = new Error('The WS connection was closed before this operation was made');
        if (!wasOpen) {
          reject(err);
        }

        for (let [id, val] of Object.entries(this.requests)) {
          delete this.requests[id];
          val.reject(err);
        }

        for (let [id, val] of Object.entries(this.callbacks)) {
          delete this.callbacks[id];
          val.cb(err, null);
        }
      }

      const releaseClose = this.listenTo(this.ws, 'close', () => {
        debugWs('Closed WS connection with', url);
        errHandler();
      });

      const releaseError = this.listenTo(this.ws, 'error', (error) => {
        debugWs('Closed WS connection with', url, 'error is', error);
        errHandler();
      });

      const releaseMessage = this.listenTo(this.ws, 'message', (message) => {
        debugWs('Received message', message.data);
        const data = JSON.parse(message.data);
        const id = data.id;
        const request = this.requests[id] || this.callbacks[id];
        if (!request) {
          debugWs('Golos.onMessage error: unknown request ', id);
          return;
        }
        delete this.requests[id];
        this.onMessage(data, request);
      });

      this.releases = this.releases.concat([
        releaseOpen,
        releaseClose,
        releaseError,
        releaseMessage,
      ]);
    });

    this.startP = startP;

    return startP;
  }

  stop() {
    if (this.ws) {
      try {
        this.listenTo(this.ws, 'error', (error) => {})
        this.ws.close()
      } catch (err) {}
    }
    delete this.startP;
    delete this.ws;
    this.releases.forEach((release) => release());
    this.releases = [];
  }

  onMessage(message, request) {
    const {api, data, resolve, reject, start_time} = request;
    debugWs('-- Golos.onMessage -->', message.id);
    const errorCause = message.error;
    if (errorCause) {
      const err = new Error(
        // eslint-disable-next-line prefer-template
        (errorCause.message || 'Failed to complete operation') +
        ' (see err.payload for the full error payload)'
      );
      err.payload = message;
      reject(err);
      return;
    }

    debugProtocol('Resolved', api, data, '->', message);
    if (cbMethods.includes(data.method)) {
      this.callbacks[message.id].cb(null, message.result);
    } else {
      delete this.requests[message.id];
      resolve(message.result);
    }
  }

  send(api, data, callback) {
  	const id = data.id || this.id++;
    const startP = this.start();

    this.currentP = startP
    .then(() => new Promise((resolve, reject) => {
        if (!this.ws) {
          reject(new Error('The WS connection was closed while this request was pending'));
          return;
        }

        const payload = JSON.stringify({
          id,
          method: 'call',
          jsonrpc: '2.0',
          params: [
            api,
            data.method,
            data.params,
          ],
        });

        debugWs('Sending message', payload);
        if (cbMethods.includes(data.method)) {
          this.callbacks[id] = {
            api,
            data,
            cb: callback
          };
        } else {
          this.requests[id] = {
            api,
            data,
            resolve,
            reject,
            start_time: Date.now()
          };
        }

        this.ws.send(payload);
      }));

    this.currentP = nodeify(this.currentP, callback);

    return this.currentP;
  }
}