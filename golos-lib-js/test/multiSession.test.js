import { assert } from 'chai'

import { multiSession as session } from '../src/auth'
import { delay, } from '../src/utils'

const mock = () => {
    global._data = {}
    const createStorage = (name) => {
        global._data[name] = {}
        global[name] = {
            getItem: (key) => {
                return global._data[name][key]
            },
            setItem: (key, val) => {
                global._data[name][key] = val
            },
            removeItem: (key, val) => {
                delete global._data[name][key]
            }
        }
    }
    createStorage('localStorage')
    createStorage('sessionStorage')
}

const unmock = () => {
    delete global._data
    delete global.localStorage
    delete global.sessionStorage
}

describe('golos.auth: multiSession', function() {
    beforeEach(function() {
        unmock()
    })

    it('ensure()', async function() {
        assert.throws(() => session.load(), 'Browser should support localStorage and sessionStorage.')
        assert.throws(() => session.loadTemp(), 'Browser should support localStorage and sessionStorage.')
    })

    it('load, save', async function() {
        mock()

        var s = session.load()
        assert.equal(s.key, 'multi_session')
        assert.equal(s.currentName, '')
        assert.equal(JSON.stringify(s.accounts), '{}')

        s.setVal('alice', 'posting', 'abc')
            .setVal('bob', 'posting', 'ABD')
            .setVal('bob', 'memo', 'ZZZ')
            .setCurrent('bob')
            .save()

        var s = session.load()
        assert.equal(s.key, 'multi_session')
        assert.equal(s.currentName, 'bob')
        assert.equal(s.getVal('alice', 'posting'), 'abc')
        assert.equal(s.getVal('bob', 'posting'), 'ABD')
        assert.equal(s.getVal('bob', 'memo'), 'ZZZ')
        assert.equal(s.getVal('bob', 'no'), '')
        assert.equal(s.getVal('bob', 'no', null), null)
    })

    it('loadTemp + clearExpired', async function() {
        mock()

        var s = session.loadTemp()
        assert.equal(s.key, 'multi_session')
        assert.equal(JSON.stringify(s.accounts), '{}')

        s.setVal('alice', 'active', 'x49').save()

        assert.equal(session.loadTemp().getVal('alice', 'active'), 'x49')

        session.clearExpired()
        session.clearExpired(250)

        assert.equal(session.loadTemp().getVal('alice', 'active'), 'x49')

        await delay(250)

        session.clearExpired(250)

        assert.equal(session.loadTemp().getVal('alice', 'active'), '')
    })
})
