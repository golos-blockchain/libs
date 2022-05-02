import fetch from 'cross-fetch'
import AbortController from 'abort-controller'

const COMMON_TIMEOUT = 10000

async function fetchEx(url, opts) {
    let { timeout, ...restOpts } = opts
    if (!restOpts.signal) {
        if (timeout === 0 || timeout === undefined) {
            timeout = COMMON_TIMEOUT
        }
        if (timeout !== null) {
            const controller = new AbortController()
            setTimeout(() => controller.abort(), timeout)
            restOpts.signal = controller.signal
        }
    }
    return await fetch(url, restOpts)
}

fetchEx.COMMON_TIMEOUT = COMMON_TIMEOUT
fetchEx.AbortController = AbortController

export default fetchEx
