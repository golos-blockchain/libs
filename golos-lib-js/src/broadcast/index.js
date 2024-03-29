import newDebug from 'debug';
import noop from 'lodash/noop';

import broadcastHelpers from './helpers';
import formatterFactory from '../formatter';
import operations from './operations';
import steemApi from '../api';
import steemAuth from '../auth';
import { camelCase } from '../utils';
import { promisifyAll, } from '../promisify';
import { mw, } from '../middlewares';
import config from '../config';

const debug = newDebug('golos:broadcast');
const formatter = formatterFactory(steemApi);

const steemBroadcast = {};

// Base transaction logic -----------------------------------------------------

/**
 * Sign and broadcast transactions on the steem network
 */

steemBroadcast.send = async function steemBroadcast$send(tx, privKeys, callback) {
    let keyMeta = new Set();
    if (privKeys) {
        for (let role in privKeys) {
            if (privKeys[role]) {
                const str = privKeys[role].toString();
                if (!str.startsWith('(')) {
                    keyMeta = null;
                    break;
                } else {
                    const keys = str.slice(1, -1).split(',');
                    keys.forEach(keyMeta.add, keyMeta);
                }
            }
        }
    }
    const broadcast = async (signedTransaction) => {
        const res = config.get('broadcast_transaction_with_callback') 
            ? await steemApi.broadcastTransactionWithCallbackAsync(() => {}, signedTransaction)
            : await steemApi.broadcastTransactionAsync(signedTransaction);
        return Object.assign(res, signedTransaction);
    };
    try {
        let res = null;
        if (keyMeta) {
            tx._meta = {
                _keys: Array.from(keyMeta),
            };
            debug(
                'Broadcasting transaction without signing (transaction, transaction.operations, transaction._meta)',
                tx, tx.operations, tx._meta
            );
            res = await mw().broadcast({ tx, privKeys, orig: broadcast,
                prepareTx: steemBroadcast._prepareTransaction });
        } else {
            const transaction = await steemBroadcast._prepareTransaction(tx);
            debug(
                'Signing transaction (transaction, transaction.operations)',
                transaction, transaction.operations
            );
            const signedTransaction = steemAuth.signTransaction(transaction, privKeys);
            debug(
                'Broadcasting transaction (transaction, transaction.operations)',
                transaction, transaction.operations
            );
            res = await mw().broadcast({ tx: signedTransaction,
                privKeys, orig: broadcast, });
        }
        if (callback) callback(null, res);
    } catch (err) {
        if (callback) callback(err, null);
    }
};

steemBroadcast._prepareTransaction = async function steemBroadcast$_prepareTransaction(tx) {
    const props = await steemApi.getDynamicGlobalPropertiesAsync();
    // Set defaults on the transaction
    const chainDate = new Date(props.time + 'Z');
    const refBlockNum = (props.head_block_number - 3) & 0xFFFF;

    const block = await steemApi.getBlockAsync(props.head_block_number - 2);
    const headBlockId = block.previous;
    return Object.assign({
        ref_block_num: refBlockNum,
        ref_block_prefix: new Buffer(headBlockId, 'hex').readUInt32LE(4),
        expiration: new Date(
            chainDate.getTime() +
            60 * 1000
        ),
    }, tx);
};

steemBroadcast._operations = {};

// Generated wrapper ----------------------------------------------------------

// Generate operations from operations.js
operations.forEach((operation) => {
  steemBroadcast._operations[operation.operation] = operation;

  const operationName = camelCase(operation.operation);
  const operationParams = operation.params || [];

  const useCommentPermlink =
    operationParams.indexOf('parent_permlink') !== -1 &&
    operationParams.indexOf('parent_permlink') !== -1;

  steemBroadcast[`${operationName}With`] =
    function steemBroadcast$specializedSendWith(wif, options, callback) {
      debug(`Sending operation "${operationName}" with`, {options, callback});
      const keys = {};
      if (operation.roles && operation.roles.length) {
        keys[operation.roles[0]] = wif; // TODO - Automatically pick a role? Send all?
      }
      return steemBroadcast.send({
        extensions: [],
        operations: [[operation.operation, Object.assign(
          {},
          options,
          options.json_metadata != null ? {
            json_metadata: toString(options.json_metadata),
          } : {},
          useCommentPermlink && options.permlink == null ? {
            permlink: formatter.commentPermlink(options.parent_author, options.parent_permlink),
          } : {}
        )]],
      }, keys, callback);
    };

  steemBroadcast[operationName] =
    function steemBroadcast$specializedSend(wif, ...args) {
      debug(`Parsing operation "${operationName}" with`, {args});
      const options = operationParams.reduce((memo, param, i) => {
        memo[param] = args[i]; // eslint-disable-line no-param-reassign
        return memo;
      }, {});
      const callback = args[operationParams.length];
      return steemBroadcast[`${operationName}With`](wif, options, callback);
    };
});

const toString = obj => typeof obj === 'object' ? JSON.stringify(obj) : obj;
broadcastHelpers(steemBroadcast);

promisifyAll(steemBroadcast);

exports = module.exports = steemBroadcast;
