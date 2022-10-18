import { PrivateKey, } from '../ecc'

class MultiSessionData {
	constructor({ key, currentName, accounts }) {
		this.key = key
		this.currentName = currentName
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
	setCurrent(account) {
		if (!this.accounts[account])
			throw new Error('Cannot set current account to: ' + account + ' because it does not saved')
		this.currentName = account
		return this
	}
	logout(account, newCurrent = undefined) {
		delete this.accounts[account]
		if (this.currentName === account) {
			this.currentName = ''
			if (newCurrent) {
				const arr = Object.entries(this.accounts)
				if (arr[0]) {
					this.currentName = arr[0][0]
					newCurrent.name = arr[0][0]
					newCurrent.data = arr[0][1]
				}
			}
		}
		return this
	}
    clear() {
        this.accounts = {}
        this.currentName = ''
        return this
    }
	save() {
		const json = JSON.stringify({currentName: this.currentName,
			accounts: this.accounts})
		const buf = new Buffer(json).toString('hex')
		localStorage.setItem(this.key, buf)
		return this
	}
}

module.exports = MultiSessionData
