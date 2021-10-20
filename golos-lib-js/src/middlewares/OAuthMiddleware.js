const EmptyMiddleware = require('./EmptyMiddleware');
const oauth = require('../oauth');
const Promise = require('bluebird');
const { delay, } = require('../utils');
const { RPCError, } = require('../api/transports/http');

class OAuthMiddleware extends EmptyMiddleware {
    _checkPendingAllowed(tx) {
        let url = new URL('/api/oauth/check/' + oauth.clientId(), oauth.apiHost());
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url.toString(), false);
        xhr.withCredentials = true;
        xhr.send(JSON.stringify({
            tx,
        }));
        const res = JSON.parse(xhr.responseText);
        const { requiredPerms, } = res;
        let ret = { allowed: true, };
        if (requiredPerms && requiredPerms.length) {
            ret.allowed = false;
            ret.txHash = oauth._hashOps(tx.operations);
            ret.win = oauth.login([], '?ops_hash=' + ret.txHash);
        }
        return ret;
    }

    async _preparePending(tx, txHash) {
        let res = await oauth._callApi('/api/oauth/prepare_pending', {
            tx,
            txHash,
        });
        res = await res.json();
        if (res.status === 'ok') {
            return;
        } else if (res.error) {
            throw new Error(json.error);
        } else {
            throw new Error('Internal Server Error');
        }
    }

    async _waitForPending(txHash) {
        const interval = 2 * 1000;
        const max = interval * 30;
        const loop = async (waited = 0) => {
            await delay(interval);
            let res = await oauth._callApi('/api/oauth/wait_for_pending/' + txHash)
            let json = await res.json();
            if (json.status === 'ok') {
                let { forbidden, err, res, } = json;
                if (forbidden) {
                    throw new Error('Transaction forbidden');
                }
                return { err, res };
            } else {
                waited += interval;
                if (waited >= max) {
                    throw new Error('Transaction timeouted');
                } else {
                    return await loop(waited);
                }
            }
        };
        return await loop();
    }

    async _processPending(tx) {
        let { allowed, win, txHash, } =
            this._checkPendingAllowed(tx);
        if (!allowed) {
            const closeWin = () => {
                if (win && !win.closed) {
                    win.close();
                };
            };
            try {
                await this._preparePending(tx, txHash);
            } catch (err) {
                console.error('_preparePending', err);
                closeWin();
                throw err;
            }
            let res, err;
            try {
                const result = await this._waitForPending(txHash);
                res = result.res;
                err = result.err;
            } catch (err) {
                console.error('_waitForPending', err);
                closeWin();
                throw err;
            }
            return { broadcast: false, res, err, };
        } else {
            return { broadcast: true, };
        }
    }

    broadcast({ tx, privKeys, orig, }) {
        return new Promise(async (resolve, reject) => {
            try {
                if (tx._meta && tx._meta._keys) {
                    const res = await this._processPending(tx);
                    resolve(res);
                } else {
                    resolve({ broadcast: true, });
                }
            } catch (err) {
                reject(err);
            }
        }).then((result) => {
            if (result.broadcast) {
                return super.broadcast({ tx, privKeys, orig, });
            } else {
                if (result.res)
                    return result.res;
                const { err, } = result;
                // http
                if (err && err.name === 'RPCError')
                    throw new RPCError(err, err);
                // ws should not be here, but...
                if (err && err.message) {
                    let t = new Error(err.message);
                    t.payload = err.payload;
                    throw t;
                }
                console.error('OAuthMiddleware broadcast', err);
            }
        });
    }
}

module.exports = OAuthMiddleware;
