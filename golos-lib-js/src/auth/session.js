import { PrivateKey, } from './ecc';

function toWif(key) {
    return key.toWif ? key.toWif() : key;
};

class Session {
    constructor(key = 'autopost2') { // key is compatible with Golos UI
        this.key = key;
    }
    ensure() {
        if (typeof(localStorage) === 'undefined')
            throw new Error('Browser should support localStorage.');
    }
    save(username, postingKey, memoKey, loginOwnerPubKey) {
        this.ensure();
        memoKey = memoKey ? toWif(memoKey) : '';
        loginOwnerPubKey = loginOwnerPubKey || '';
        const data = new Buffer(`${username}\t${toWif(postingKey)}\t${memoKey}\t${loginOwnerPubKey}`).toString('hex')
        localStorage.setItem(this.key, data)
    }
    load() {
        this.ensure();
        const data = localStorage.getItem(this.key);
        if (data) { 
            return new Buffer(data, 'hex').toString().split('\t');
        }
        return null;
    }
    clear() {
        this.ensure();
        localStorage.removeItem(this.key);
    }
}

class PageSession extends Session {
    constructor(key = 'session_id') {
        super();
        this.key = key;
    }
    ensure() {
        if (typeof(sessionStorage) === 'undefined')
            throw new Error('Browser should support sessionStorage.');
    }
    save(password, username, authType = 'active') {
        this.ensure();
        try {
            PrivateKey.fromWif(password);
        } catch (e) {
            password = PrivateKey.fromSeed(username + authType + password).toString();
        }
        const data = Date.now().toString() + '\t' + new Buffer(password).toString('hex');
        sessionStorage.setItem(this.key, data);
    }
    load() {
        this.ensure();
        const saved = sessionStorage.getItem(this.key);
        if (saved) {
            let arr = saved.split('\t');
            arr[0] = parseInt(arr[0]);
            arr[1] = new Buffer(arr[1], 'hex').toString();
            return arr;
        }
        return null;
    }
    clear() {
        this.ensure();
        sessionStorage.removeItem(this.key);
    }
}

module.exports = {
    session: new Session(),
    Session,
    pageSession: new PageSession(),
    PageSession,
};
