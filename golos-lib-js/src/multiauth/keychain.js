import { singles } from './asyncKeychain'
import { delay } from '../utils/misc'

async function waitForKc() {
    if (typeof(document) === 'undefined' ||
        !document.getElementById('golos_keychain_inpage')) {
        return false
    }
    let init = false
    for (let i = 0; i < 200; ++i) {
        init = typeof(window.golosKeychain) !== 'undefined'
        if (init) break
        await delay(10)
    }
    if (!init) {
        throw new Error('Golos Keychain extension is broken due to some bug')
    }
    return true
}

async function assertKc() {
    if (!await waitForKc()) {
        throw new Error('Golos Keychain extension is not installed or disabled')
    }
}

async function kcLogin() {
    await assertKc()
    await singles.login()
}

async function kcLoggedIn() {
    if (!await waitForKc()) return { authorized: false }
    return await singles.loggedIn()
}

async function kcLogout() {
    const state = await kcLoggedIn()
    if (state && state.authorized) {
        await singles.logout()
        return true
    }
    return false
}

async function kcSign({ tx }) {
    await assertKc()
    return await singles.sign({ tx })
}

module.exports = {
    kcLogin,
    kcLoggedIn,
    kcLogout,
    waitForKc,
    assertKc,
    kcSign
}
