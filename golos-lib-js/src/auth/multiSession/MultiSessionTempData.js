import { PrivateKey, } from '../ecc'

class MultiSessionTempData {
    constructor({ key, accounts }) {
        this.key = key
        this.accounts = accounts
    }
    getVal(account, field, defaultVal = '') {
        if (this.accounts[account])
            return this.accounts[account][field] || defaultVal
        return defaultVal
    }
    setVal(account, field, val) {
        this.accounts[account] = this.accounts[account] || {}
        this.accounts[account][field] = val
        this.accounts[account]._created = Date.now()
        return this
    }
    addKey(account, authType, val) {
        if (val && val.toWif) val = val.toWif()
        try {
            PrivateKey.fromWif(val);
        } catch (e) {
            val = PrivateKey.fromSeed(account + authType + val).toString()
        }
        return this.setVal(account, authType, val)
    }
    clearExpired(expirationMsec = 3600000, nowMsec = undefined, onClear = undefined) {
        nowMsec = nowMsec || Date.now()
        const cleared = (acc, deltaMsec) => {
            let defaultLog = true
            if (onClear) {
                const info = { acc, deltaMsec }
                const { log } = onClear(info)
                if (log) {
                    log(info)
                    defaultLog = false
                }
            }
            if (defaultLog)
                console.log('MultiSessionTempData cleared', deltaMsec)
        }
        for (let [acc, data] of Object.entries(this.accounts)) {
            if (data._created) {
                const deltaMsec = nowMsec - data._created
                if (deltaMsec >= expirationMsec) {
                    delete this.accounts[acc]
                    cleared(acc, deltaMsec)
                }
            }
        }
        return this
    }
    logout(account) {
        delete this.accounts[account]
        return this
    }
    clear() {
        this.accounts = {}
        return this
    }
    save() {
        const json = JSON.stringify({
            accounts: this.accounts})
        const buf = new Buffer(json).toString('hex')
        sessionStorage.setItem(this.key, buf)
        return this
    }
}

module.exports = MultiSessionTempData
