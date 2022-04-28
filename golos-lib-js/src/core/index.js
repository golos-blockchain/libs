import code from './code';
import init from './golos_lib';

const {
    _Asset, _AssetEditor, _Price, aes256_decrypt,
} = init;

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

let globalNativeCtx = null;

export async function importNativeLib() {
    if (globalNativeCtx) {
        return globalNativeCtx;
    }
    globalNativeCtx = await importNativeLibCtx();
    return globalNativeCtx;
}

export function unloadNativeLib() {
    globalNativeCtx = null;
}

export function isNativeLibLoaded() {
    return !!globalNativeCtx;
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
        a = _Asset.new(amount, precision, symbol);
    } else {
        const str = amount;
        a = _Asset.fromString(str);
    }
    const wrapBinOp = function(op) {
        return function(asset2) {
            if (!(asset2 instanceof _Asset))
                return this[`_${op}_num`](asset2);
            return this[`_${op}`](asset2);
        };
    };
    _Asset.prototype.plus = wrapBinOp('plus');
    _Asset.prototype.minus = wrapBinOp('minus');
    _Asset.prototype.mul = function(price, remainderAsset) {
        if (price instanceof _Price) {
            if (!remainderAsset) {
                remainderAsset = this.clone()
            }
            return this._mul_price(price, remainderAsset)
        }
        const asset2 = price
        if (!(asset2 instanceof _Asset))
            return this._mul_num(asset2)
        return this._mul(asset2)
    };
    _Asset.prototype.div = wrapBinOp('div');
    _Asset.prototype.mod = wrapBinOp('mod')
    _Asset.prototype.toJSON = function() {
        return this.toString()
    }
    return a;
});

export let AssetEditor = wrapNative((amount, precision, symbol) => {
    let ae = null
    if (amount instanceof _Asset) {
        ae = _AssetEditor.fromAsset(amount)
    } else if (precision !== undefined && symbol) {
        ae = _AssetEditor.new(amount, precision, symbol)
    } else {
        const str = amount
        ae = _AssetEditor.fromString(str)
    }
    _AssetEditor.prototype.toJSON = function() {
        return this.asset.toString()
    }
    _AssetEditor.prototype.toString = function() {
        return JSON.stringify({
            asset: this.asset,
            amount_str: this.amountStr
        })
    }
    return ae
});

export let Price = wrapNative((base, quote) => {
    let pr = null
    if (!quote) {
        pr = _Price.new(Asset(base.base), Asset(base.quote))
    } else {
        pr = _Price.new(base, quote)
    }
    _Price.prototype.toJSON = function() {
        return { base: this.base.toJSON(), quote: this.quote.toJSON() }
    }
    _Price.prototype.toString = function() {
        return this.toJSON().toString()
    }
    return pr
});

export { _Asset, _AssetEditor, _Price }

export let aes_decrypt = wrapNative((key, iv, data) => {
    return aes256_decrypt(key, iv, data);
});
