let wasm_bindgen;
(function() {
    const __exports = {};
    let wasm;

    const heap = new Array(32).fill(undefined);

    heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_0.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}
function __wbg_adapter_8(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hbcef8e440c0e4d5b(arg0, arg1, addHeapObject(arg2));
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

const u32CvtShim = new Uint32Array(2);

const int64CvtShim = new BigInt64Array(u32CvtShim.buffer);

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {Function} get_dgp
* @param {Function} callback
* @returns {StreamingHandle}
*/
__exports.stream_block_number = function(get_dgp, callback) {
    var ret = wasm.stream_block_number(addHeapObject(get_dgp), addHeapObject(callback));
    return StreamingHandle.__wrap(ret);
};

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {Uint8Array} key
* @param {Uint8Array} iv
* @param {Uint8Array} data
* @returns {Uint8Array}
*/
__exports.aes256_decrypt = function(key, iv, data) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray8ToWasm0(iv, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len2 = WASM_VECTOR_LEN;
        wasm.aes256_decrypt(retptr, ptr0, len0, ptr1, len1, ptr2, len2);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
class StreamingHandle {

    static __wrap(ptr) {
        const obj = Object.create(StreamingHandle.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_streaminghandle_free(ptr);
    }
}
__exports.StreamingHandle = StreamingHandle;
/**
*/
class _Asset {

    static __wrap(ptr) {
        const obj = Object.create(_Asset.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg__asset_free(ptr);
    }
    /**
    * @param {string} value
    * @returns {_Asset}
    */
    static fromString(value) {
        var ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm._asset_fromString(ptr0, len0);
        return _Asset.__wrap(ret);
    }
    /**
    * @param {BigInt} amount
    * @param {number} precision
    * @param {string} symbol
    * @returns {_Asset}
    */
    static new(amount, precision, symbol) {
        int64CvtShim[0] = amount;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ptr1 = passStringToWasm0(symbol, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm._asset_new(low0, high0, precision, ptr1, len1);
        return _Asset.__wrap(ret);
    }
    /**
    * @returns {BigInt}
    */
    get amount() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm._asset_amount(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = int64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {BigInt} value
    */
    set amount(value) {
        int64CvtShim[0] = value;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        wasm._asset_set_amount(this.ptr, low0, high0);
    }
    /**
    * @returns {number}
    */
    get amountFloat() {
        var ret = wasm._asset_amountFloat(this.ptr);
        return ret;
    }
    /**
    * @param {number} value
    */
    set amountFloat(value) {
        wasm._asset_set_amountFloat(this.ptr, value);
    }
    /**
    * @returns {number}
    */
    get precision() {
        var ret = wasm._asset_precision(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} value
    */
    set precision(value) {
        wasm._asset_set_precision(this.ptr, value);
    }
    /**
    * @returns {string}
    */
    get symbol() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm._asset_symbol(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} value
    */
    set symbol(value) {
        var ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm._asset_set_symbol(this.ptr, ptr0, len0);
    }
    /**
    * @returns {boolean}
    */
    isUIA() {
        var ret = wasm._asset_isUIA(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {number | undefined} _dec_places
    * @returns {string}
    */
    toString(_dec_places) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm._asset_toString(retptr, this.ptr, !isLikeNone(_dec_places), isLikeNone(_dec_places) ? 0 : _dec_places);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {BigInt} num
    * @returns {_Asset}
    */
    _plus_num(num) {
        int64CvtShim[0] = num;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ret = wasm._asset__plus_num(this.ptr, low0, high0);
        return _Asset.__wrap(ret);
    }
    /**
    * @param {_Asset} a
    * @returns {_Asset}
    */
    _plus(a) {
        _assertClass(a, _Asset);
        var ret = wasm._asset__plus(this.ptr, a.ptr);
        return _Asset.__wrap(ret);
    }
    /**
    * @param {BigInt} num
    * @returns {_Asset}
    */
    _minus_num(num) {
        int64CvtShim[0] = num;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ret = wasm._asset__minus_num(this.ptr, low0, high0);
        return _Asset.__wrap(ret);
    }
    /**
    * @param {_Asset} a
    * @returns {_Asset}
    */
    _minus(a) {
        _assertClass(a, _Asset);
        var ret = wasm._asset__minus(this.ptr, a.ptr);
        return _Asset.__wrap(ret);
    }
    /**
    * @param {BigInt} num
    * @returns {_Asset}
    */
    _mul_num(num) {
        int64CvtShim[0] = num;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ret = wasm._asset__mul_num(this.ptr, low0, high0);
        return _Asset.__wrap(ret);
    }
    /**
    * @param {_Asset} a
    * @returns {_Asset}
    */
    _mul(a) {
        _assertClass(a, _Asset);
        var ret = wasm._asset__mul(this.ptr, a.ptr);
        return _Asset.__wrap(ret);
    }
    /**
    * @param {BigInt} num
    * @returns {_Asset}
    */
    _div_num(num) {
        int64CvtShim[0] = num;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ret = wasm._asset__div_num(this.ptr, low0, high0);
        return _Asset.__wrap(ret);
    }
    /**
    * @param {_Asset} a
    * @returns {_Asset}
    */
    _div(a) {
        _assertClass(a, _Asset);
        var ret = wasm._asset__div(this.ptr, a.ptr);
        return _Asset.__wrap(ret);
    }
    /**
    * @param {_Asset} a
    * @returns {boolean}
    */
    eq(a) {
        _assertClass(a, _Asset);
        var ret = wasm._asset_eq(this.ptr, a.ptr);
        return ret !== 0;
    }
    /**
    * @param {_Asset} a
    * @returns {boolean}
    */
    ne(a) {
        _assertClass(a, _Asset);
        var ret = wasm._asset_ne(this.ptr, a.ptr);
        return ret !== 0;
    }
    /**
    * @param {_Asset} a
    * @returns {boolean}
    */
    lt(a) {
        _assertClass(a, _Asset);
        var ret = wasm._asset_lt(this.ptr, a.ptr);
        return ret !== 0;
    }
    /**
    * @param {_Asset} a
    * @returns {boolean}
    */
    lte(a) {
        _assertClass(a, _Asset);
        var ret = wasm._asset_lte(this.ptr, a.ptr);
        return ret !== 0;
    }
    /**
    * @param {_Asset} a
    * @returns {boolean}
    */
    gt(a) {
        _assertClass(a, _Asset);
        var ret = wasm._asset_gt(this.ptr, a.ptr);
        return ret !== 0;
    }
    /**
    * @param {_Asset} a
    * @returns {boolean}
    */
    gte(a) {
        _assertClass(a, _Asset);
        var ret = wasm._asset_gte(this.ptr, a.ptr);
        return ret !== 0;
    }
}
__exports._Asset = _Asset;

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        let src;
        if (typeof document === 'undefined') {
            src = location.href;
        } else {
            src = document.currentScript.src;
        }
        input = src.replace(/\.js$/, '_bg.wasm');
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        var ret = false;
        return ret;
    };
    imports.wbg.__wbg_call_e91f71ddf1f45cff = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_e3c72355d091d5d4 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_Promise_0fb5d7e26ca83626 = function(arg0) {
        var ret = getObject(arg0) instanceof Promise;
        return ret;
    };
    imports.wbg.__wbg_then_6d5072fec3fdb237 = function(arg0, arg1) {
        var ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_closure_wrapper79 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 18, __wbg_adapter_8);
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

wasm_bindgen = Object.assign(init, __exports);

})();
export default wasm_bindgen;
