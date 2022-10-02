const MultiSessionData = require('./MultiSessionData')
const MultiSessionTempData = require('./MultiSessionTempData')

class MultiSession {
    constructor(key = 'multi_session') {
        this.key = key;
    }
    ensure() {
        if (typeof(localStorage) === 'undefined' || typeof(sessionStorage) === 'undefined')
            throw new Error('Browser should support localStorage and sessionStorage.');
    }
    load() {
    	this.ensure()
    	const obj = { key: this.key, currentName: '', accounts: {} }
        let data = localStorage.getItem(this.key);
        if (data) {
        	try {
	        	data = new Buffer(data, 'hex').toString()
	        	data = JSON.parse(data)
	        	if (data.currentName) obj.currentName = data.currentName
	        	if (data.accounts) obj.accounts = data.accounts
        	} catch (err) {
        		console.warn('MultiSession.load', err)
        	}
        }
        return new MultiSessionData(obj)
    }
    loadTemp() {
    	this.ensure()
    	const obj = { key: this.key, accounts: {} }
        let data = sessionStorage.getItem(this.key);
        if (data) {
        	try {
	        	data = new Buffer(data, 'hex').toString()
	        	data = JSON.parse(data)
	        	if (data.accounts) obj.accounts = data.accounts
        	} catch (err) {
        		console.warn('MultiSession.loadTemp', err)
        	}
        }
        return new MultiSessionTempData(obj)
    }
    clearExpired(...args) {
        this.ensure()
        return this.loadTemp()
            .clearExpired(...args)
            .save()
    }
    logout(account, newCurrent = undefined) {
        this.loadTemp().logout(account).save()
        return this.load().logout(account, newCurrent).save()
    }
    clear() {
        this.loadTemp().clear().save()
        return this.load().clear().save()
    }
}

module.exports = MultiSession
