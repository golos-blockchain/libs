const EmptyMiddleware = require('./EmptyMiddleware');
const multiauth = require('../multiauth');
const { kcLoggedIn, kcSign } = require('../multiauth/keychain')
const { delay, } = require('../utils');
const { RPCError, } = require('../api/transports/http');

class MultiAuthMiddleware extends EmptyMiddleware {
    async _checkPendingAllowed(tx) {
        let url = new URL('/api/oauth/check/' + multiauth.clientId(), multiauth.apiHost());
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
            ret.txHash = multiauth._hashOps(tx.operations);
            ret.win = await multiauth.login([], {
                extraParams: '?ops_hash=' + ret.txHash,
            })
        }
        return ret;
    }

    async _preparePending(tx, txHash) {
        let res = await multiauth._callApi('/api/oauth/prepare_pending', {
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
            let res = await multiauth._callApi('/api/oauth/wait_for_pending/' + txHash)
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
            await this._checkPendingAllowed(tx);
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

    async broadcast({ tx, privKeys, orig, prepareTx, signTx, }) {
        let result = { broadcast: true, };
        if (tx._meta && tx._meta._keys) {
            const kcState = await kcLoggedIn()
            if (kcState && kcState.authorized) {
                tx = await prepareTx(tx)
                tx = await kcSign({ tx })
                if (!tx) {
                    result.broadcast = false
                    result.err = new Error('Forbidden by KeyChain user')
                }
            } else {
                result = await this._processPending(tx)
            }
        } else {
            tx = await prepareTx(tx)
            tx = await signTx(tx)
        }
        if (result.broadcast) {
            return await super.broadcast({ tx, privKeys, orig, });
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
            console.error('MultiAuthMiddleware broadcast', err);
        }
    }
}

module.exports = MultiAuthMiddleware;
