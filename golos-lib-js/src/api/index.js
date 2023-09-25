import EventEmitter from 'events';
import cloneDeep from 'lodash/cloneDeep';
import defaults from 'lodash/defaults';
import isNode from 'detect-node';
import newDebug from 'debug';
import config from '../config';
import methods from './methods';
import { camelCase } from '../utils';
import { promisifyAll, } from '../promisify';
import transports from './transports';

const debugEmitters = newDebug('golos:emitters');
const debugSetup = newDebug('golos:setup');

const DEFAULTS = {
  id: 0,
};

class Golos extends EventEmitter {
  constructor(options = {}) {
    super(options);
    defaults(options, DEFAULTS);
    this.options = cloneDeep(options);
    this._streamDefaults = {
      mode: 'head',
      startBlock: 0,
    };
  }
  _setTransport(url) {
      if (url && url.match('^((http|https)?:\/\/)')) {
        this.transport = new transports.http({ url })
        this.url = url;
      } else if (url && url.match('^((ws|wss)?:\/\/)')) {
        this.transport = new transports.ws({ url })
        this.url = url;
      } else {
      throw Error("unknown transport! [" + url + "]");
    }
  }

  setWebSocket(url) {
    this.customUrl = !!url
    if (this.transport) this.stop()
    this.url = url || config.get('websocket');
    debugSetup('Setting WS', this.url);
  }

  start() {
    if (!this.transport) {
      const url = this.url || config.get('websocket');
      this._setTransport(url);
    }
    return this.transport.start();
  }

  stop() {
    debugSetup('Stopping...');
    const ret = this.transport.stop();
    this.transport = null;
    this.url = null
    this.customUrl = false
    return ret;
  }

  send(api, data, callback) {
    debugSetup('Golos::send', api, data);
    if (!this.transport) {
      this.start();
    } else {
      if (!this.customUrl && this.url !== config.get('websocket')) {
        debugSetup('websocket URL changed, restarting transport...');
        this.stop();
        this.start();
      }
    }
    return this.transport.send(api, data, callback);
  }

  callReliable(method, ...args) {
    const callback = args[args.length - 1];
    const argsWithoutCb = args.slice(0, args.length - 1);
    this[method](...argsWithoutCb, (err, result)  => {
      if (err || !result) {
        console.error(method + ' reliable call - fail, retrying... Cause:', err ? err.message : 'API returned null');
        setTimeout(() => {
          this.callReliable(method, ...args);
        }, 1000);
        return;
      }
      callback(null, result);
    });
  };

  streamBlockNumber(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    defaults(options, this._streamDefaults);
    let startBlock = options.startBlock;
    let prevBlock = 0;
    let running = true;

    const update = () => {
      if (!running) return;

      this.callReliableAsync('getDynamicGlobalProperties')
        .then((result) => {
          const currentBlock = options.mode === 'irreversible'
            ? result.last_irreversible_block_num
            : result.head_block_number;

          if (!startBlock)
            startBlock = currentBlock;

          for (let i = startBlock; i <= currentBlock; i++) {
            const ret = callback(null, i);
            if (ret === true || !running) return;
          }
          startBlock = currentBlock + 1;

          setTimeout(() => {
            update();
          }, 1000);
        }, (err) => {
          callback(err);
        });
    };

    update();

    return function () {
      running = false;
    };
  }

  streamBlock(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    defaults(options, this._streamDefaults);

    let current = '';
    let last = '';

    const release = this.streamBlockNumber(options, (err, id) => {
      if (err) {
        release();
        callback(err);
        return;
      }

      current = id;
      if (current !== last) {
        last = current;
        this.callReliable('getBlock', current, (err, res) => {
          res.block_num = current;
          res.timestamp_prev = new Date(new Date(res.timestamp).getTime() - 3000).toISOString().split('.')[0];
          const ret = callback(err, res);
          if (ret === true) release();
        });
      }
    });

    return release;
  }

  streamTransactions(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    defaults(options, this._streamDefaults);

    const release = this.streamBlock(options, (err, block) => {
      if (err) {
        release();
        callback(err);
        return;
      }

      if (block && block.transactions) {
        block.transactions.forEach((transaction) => {
          const ret = callback(null, transaction, block);
          if (ret === true) release();
        });
      }
    });

    return release;
  }

  streamOperations(options = {}, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    defaults(options, this._streamDefaults);

    const release = this.streamTransactions(options, (err, transaction, block) => {
      if (err) {
        release();
        callback(err);
        return;
      }

      transaction.operations.forEach((operation) => {
        const ret = callback(null, operation, transaction, block);
        if (ret === true) release();
      });
    });

    return release;
  }

  streamEvents(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    defaults(options, this._streamDefaults);
    let current = '';
    let last = '';
    const release = this.streamBlockNumber(options, (err, id) => {
      if (err) {
        release();
        callback(err);
        return;
      }
      current = id;
      if (current !== last) {
        last = current;
        this.callReliable('getEventsInBlock', current, false, (err, res) => {
          for (const eventMeta of res) {
            const ret = callback(err, eventMeta.op, eventMeta);
            if (ret === true) release();
          }
        });
      }
    });
    return release;
  }
}

// Generate Methods from methods.js
methods.forEach((method) => {
  const methodName = method.method_name || camelCase(method.method);
  const methodParams = method.params || [];
  const defaultParms = {};
  const hasDefaultValues = method.has_default_values;

  if (hasDefaultValues) {
    methodParams.forEach( param => {
      const [p, value] = param.split('=');
      defaultParms[p] = value ? JSON.parse(value) : '';
    })
  }

  Golos.prototype[`${methodName}With`] =
    function Golos$$specializedSendWith(options, callback) {
      const params = methodParams.map((param) => options[hasDefaultValues ? param.split('=')[0] : param]);
      return this.send(method.api, {
        method: method.method,
        params,
      }, callback);
    };

  Golos.prototype[methodName] =
    function Golos$specializedSend(...args) {
      let options =  {};
      let callback
      if (hasDefaultValues) {
        callback = args.pop()
        if (typeof callback !== 'function') {
          args = [...args, callback]
        }
        methodParams.forEach((param, i) => {
          const [p, value] = param.split('=');
          if (args[i]) {
            options[p] = args[i];
          }
        })
        options = Object.assign({}, defaultParms, options);
      } else {
        const opt = methodParams.reduce((memo, param, i) => {
          memo[param] = args[i];
          return memo;
        }, {});
        options = Object.assign({}, opt);
        callback = args[methodParams.length]
      }

      return this[`${methodName}With`](options, callback);
    };
});

promisifyAll(Golos.prototype);

Golos.prototype['setBlockAppliedCallback'] =
  function Golos$setCallback(type, callback) {
    return this.send(
      'database_api',
      {
        method: 'set_block_applied_callback',
        params: [type],
      },
      callback
    );
};

Golos.prototype['setPendingTransactionCallback'] =
  function Golos$setCallback(callback) {
    return this.send(
      'database_api',
      {
        method: 'set_pending_transaction_callback',
        params: [],
      },
      callback
    );
 };

 Golos.prototype['setPrivateMessageCallback'] =
 function Golos$setCallback(query, callback) {
   return this.send(
     'private_message',
     {
       method: 'set_callback',
       params: [query],
     },
     callback
   );
};

 Golos.prototype['subscribeToMarket'] =
 function Golos$setCallback(query, callback) {
   return this.send(
     'market_history',
     {
       method: 'subscribe_to_market',
       params: [query],
     },
     callback
   );
};

Golos.prototype['waitEventAsync'] = async function(getData, startBlock = null, waitBlocks = 4) {
    if (!getData) throw new Error('waitEvent requires function/lambda as getData argument which will process event and return data')

    const { head_block_number, time } = await this.getDynamicGlobalPropertiesAsync()
    let data = undefined
    let block = head_block_number

    while (block < (head_block_number + waitBlocks)) {
        const res = await this.getEventsInBlockAsync(block, true)
        for (const op of res) {
            data = await getData(op.op)
            if (data !== undefined) break
        }
        if (data !== undefined) break

        let interval = 3000
        if (block === head_block_number) {
            const now = Date.now()
            const nowHB = +new Date(time)
            interval -= (now - nowHB)
            interval += 10
        }
        await new Promise(resolve => setTimeout(resolve, interval))
        ++block
    }
    if (data === undefined) {
      throw new Error('waitEvent timeouted - and still no event occured')
    }
    return data
};

// Export singleton instance
const golos = new Golos();
exports = module.exports = golos;
exports.Golos = Golos;
exports.Golos.DEFAULTS = DEFAULTS;
