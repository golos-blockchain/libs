import code from './code';
import init from './golos_lib';

const {
    _Asset, aes256_decrypt,
} = init;

global.tef_str = init.tef_str;
global.tef_arr = init.tef_arr;
global.tef_int = init.tef_int;
global.tef = init.tef;

export class NativeLibContext {
}

const fromHexString = str =>
  new Uint8Array(str.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const fromBase64String = (str) => {
    if (typeof atob !== 'undefined') {
        return Uint8Array.from(atob(str), c => c.charCodeAt(0));
    } else {
        return Buffer.from(str, 'base64');
    }
};

export async function importNativeLibCtx() {
    if (!code || !init || !_Asset) {
        const what = !code ? 'wasm code' : 'init()';
        throw new Error(`Native golos-lib core is not included into this golos-lib-js library. There is no ${what}.`);
    }
    await init(fromBase64String(code));
    return new NativeLibContext();
}

export async function importNativeLib() {
    if (global._golos_native_ctx) {
        return global._golos_native_ctx;
    }
    global._golos_native_ctx = await importNativeLibCtx();
    return global._golos_native_ctx;
}

export function isNativeLibLoaded() {
    return !!global._golos_native_ctx;
}

export function assertNativeLib(forWhat, version = '0.9.0') {
    if (!isNativeLibLoaded()) {
        throw new Error(`Starting from ${version}, golos-lib-js requires "await golos.importNativeLib()" before calling ${forWhat}`);
    }
}

function wrapNative(orig) {
    return function(...args) {
        const hasContext = args[0] instanceof NativeLibContext;
        if (!hasContext && !isNativeLibLoaded()) {
            return importNativeLib().then(() => {
                return orig(...args);
            });
        }
        if (hasContext) {
            args = args.slice(1, args.length);
        }
        return orig(...args);
    };
}

export let Asset = wrapNative((amount, precision, symbol) => {
    let a = null;
    if (precision !== undefined && symbol) {
        amount = BigInt(amount);
        a = _Asset.new(amount, precision, symbol);
    } else {
        const str = amount;
        a = _Asset.fromString(str);
    }
    const wrapBinOp = function(op) {
        return function(asset2) {
            if (!(asset2 instanceof _Asset))
                return this[`_${op}_num`](BigInt(asset2));
            return this[`_${op}`](asset2);
        };
    };
    _Asset.prototype.plus = wrapBinOp('plus');
    _Asset.prototype.minus = wrapBinOp('minus');
    _Asset.prototype.mul = wrapBinOp('mul');
    _Asset.prototype.div = wrapBinOp('div');
    return a;
});

export let aes_decrypt = wrapNative((key, iv, data) => {
    return aes256_decrypt(key, iv, data);
});
