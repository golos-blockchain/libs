let wasm_bindgen = (function(exports) {
    let script_src;
    if (typeof document !== 'undefined' && document.currentScript !== null) {
        script_src = new URL(document.currentScript.src, location.href).toString();
    }

    class StreamingHandle {
        static __wrap(ptr) {
            const obj = Object.create(StreamingHandle.prototype);
            obj.__wbg_ptr = ptr;
            StreamingHandleFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            StreamingHandleFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_streaminghandle_free(ptr, 0);
        }
    }
    if (Symbol.dispose) StreamingHandle.prototype[Symbol.dispose] = StreamingHandle.prototype.free;
    exports.StreamingHandle = StreamingHandle;

    class _Asset {
        static __wrap(ptr) {
            const obj = Object.create(_Asset.prototype);
            obj.__wbg_ptr = ptr;
            _AssetFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            _AssetFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg__asset_free(ptr, 0);
        }
        /**
         * @param {_Asset} a
         * @returns {_Asset}
         */
        _div(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__div(this.__wbg_ptr, a.__wbg_ptr);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {number} num
         * @returns {_Asset}
         */
        _div_num(num) {
            const ret = wasm._asset__div_num(this.__wbg_ptr, num);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {_Asset} a
         * @returns {boolean}
         */
        _eq(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__eq(this.__wbg_ptr, a.__wbg_ptr);
            return ret !== 0;
        }
        /**
         * @param {number} num
         * @returns {boolean}
         */
        _eq_num(num) {
            const ret = wasm._asset__eq_num(this.__wbg_ptr, num);
            return ret !== 0;
        }
        /**
         * @param {_Asset} a
         * @returns {boolean}
         */
        _gt(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__gt(this.__wbg_ptr, a.__wbg_ptr);
            return ret !== 0;
        }
        /**
         * @param {number} num
         * @returns {boolean}
         */
        _gt_num(num) {
            const ret = wasm._asset__gt_num(this.__wbg_ptr, num);
            return ret !== 0;
        }
        /**
         * @param {_Asset} a
         * @returns {boolean}
         */
        _gte(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__gte(this.__wbg_ptr, a.__wbg_ptr);
            return ret !== 0;
        }
        /**
         * @param {number} num
         * @returns {boolean}
         */
        _gte_num(num) {
            const ret = wasm._asset__gte_num(this.__wbg_ptr, num);
            return ret !== 0;
        }
        /**
         * @param {_Asset} a
         * @returns {boolean}
         */
        _lt(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__lt(this.__wbg_ptr, a.__wbg_ptr);
            return ret !== 0;
        }
        /**
         * @param {number} num
         * @returns {boolean}
         */
        _lt_num(num) {
            const ret = wasm._asset__lt_num(this.__wbg_ptr, num);
            return ret !== 0;
        }
        /**
         * @param {_Asset} a
         * @returns {boolean}
         */
        _lte(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__lte(this.__wbg_ptr, a.__wbg_ptr);
            return ret !== 0;
        }
        /**
         * @param {number} num
         * @returns {boolean}
         */
        _lte_num(num) {
            const ret = wasm._asset__lte_num(this.__wbg_ptr, num);
            return ret !== 0;
        }
        /**
         * @param {_Asset} a
         * @returns {_Asset}
         */
        _max(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__max(this.__wbg_ptr, a.__wbg_ptr);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {number} num
         * @returns {_Asset}
         */
        _max_num(num) {
            const ret = wasm._asset__max_num(this.__wbg_ptr, num);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {_Asset} a
         * @returns {_Asset}
         */
        _min(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__min(this.__wbg_ptr, a.__wbg_ptr);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {number} num
         * @returns {_Asset}
         */
        _min_num(num) {
            const ret = wasm._asset__min_num(this.__wbg_ptr, num);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {_Asset} a
         * @returns {_Asset}
         */
        _minus(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__minus(this.__wbg_ptr, a.__wbg_ptr);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {number} num
         * @returns {_Asset}
         */
        _minus_num(num) {
            const ret = wasm._asset__minus_num(this.__wbg_ptr, num);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {_Asset} a
         * @returns {_Asset}
         */
        _mod(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__mod(this.__wbg_ptr, a.__wbg_ptr);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {number} num
         * @returns {_Asset}
         */
        _mod_num(num) {
            const ret = wasm._asset__mod_num(this.__wbg_ptr, num);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {_Asset} a
         * @returns {_Asset}
         */
        _mul(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__mul(this.__wbg_ptr, a.__wbg_ptr);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {number} num
         * @returns {_Asset}
         */
        _mul_num(num) {
            const ret = wasm._asset__mul_num(this.__wbg_ptr, num);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {_Price} p
         * @param {_Asset} remain
         * @returns {_Asset}
         */
        _mul_price(p, remain) {
            _assertClass(p, _Price);
            _assertClass(remain, _Asset);
            const ret = wasm._asset__mul_price(this.__wbg_ptr, p.__wbg_ptr, remain.__wbg_ptr);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {_Asset} a
         * @returns {boolean}
         */
        _ne(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__ne(this.__wbg_ptr, a.__wbg_ptr);
            return ret !== 0;
        }
        /**
         * @param {number} num
         * @returns {boolean}
         */
        _ne_num(num) {
            const ret = wasm._asset__ne_num(this.__wbg_ptr, num);
            return ret !== 0;
        }
        /**
         * @param {_Asset} a
         * @returns {_Asset}
         */
        _plus(a) {
            _assertClass(a, _Asset);
            const ret = wasm._asset__plus(this.__wbg_ptr, a.__wbg_ptr);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {number} num
         * @returns {_Asset}
         */
        _plus_num(num) {
            const ret = wasm._asset__plus_num(this.__wbg_ptr, num);
            return _Asset.__wrap(ret);
        }
        /**
         * @returns {number}
         */
        get amount() {
            const ret = wasm._asset_amount(this.__wbg_ptr);
            return ret;
        }
        /**
         * @returns {string}
         */
        get amountFloat() {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm._asset_amount_float(this.__wbg_ptr);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally {
                wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
        /**
         * @returns {_Asset}
         */
        clone() {
            const ret = wasm._asset_clone(this.__wbg_ptr);
            return _Asset.__wrap(ret);
        }
        /**
         * @returns {string}
         */
        get floatString() {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm._asset_float_string(this.__wbg_ptr);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally {
                wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
        /**
         * @param {string} value
         * @returns {_Asset}
         */
        static fromString(value) {
            const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm._asset_fromString(ptr0, len0);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return _Asset.__wrap(ret[0]);
        }
        /**
         * @returns {boolean}
         */
        get isUIA() {
            const ret = wasm._asset_is_uia(this.__wbg_ptr);
            return ret !== 0;
        }
        /**
         * @param {number} amount
         * @param {number} precision
         * @param {string} symbol
         * @returns {_Asset}
         */
        static new(amount, precision, symbol) {
            const ptr0 = passStringToWasm0(symbol, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm._asset_new(amount, precision, ptr0, len0);
            return _Asset.__wrap(ret);
        }
        /**
         * @returns {number}
         */
        get precision() {
            const ret = wasm._asset_precision(this.__wbg_ptr);
            return ret >>> 0;
        }
        /**
         * @param {number} value
         */
        set amount(value) {
            wasm._asset_set_amount(this.__wbg_ptr, value);
        }
        /**
         * @param {string} amount_str
         * @returns {number}
         */
        set amountFloat(amount_str) {
            const ptr0 = passStringToWasm0(amount_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm._asset_set_amount_float(this.__wbg_ptr, ptr0, len0);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return ret[0];
        }
        /**
         * @param {number} value
         */
        set precision(value) {
            wasm._asset_set_precision(this.__wbg_ptr, value);
        }
        /**
         * @param {string} value
         */
        set symbol(value) {
            const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm._asset_set_symbol(this.__wbg_ptr, ptr0, len0);
        }
        /**
         * @returns {string}
         */
        get symbol() {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm._asset_symbol(this.__wbg_ptr);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally {
                wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
        /**
         * @param {number | null} [dec_places]
         * @returns {string}
         */
        toString(dec_places) {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm._asset_toString(this.__wbg_ptr, isLikeNone(dec_places) ? Number.MAX_SAFE_INTEGER : (dec_places) >>> 0);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally {
                wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
        /**
         * @param {string} amount_str
         * @returns {string}
         */
        updateAmountFloat(amount_str) {
            let deferred3_0;
            let deferred3_1;
            try {
                const ptr0 = passStringToWasm0(amount_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
                const len0 = WASM_VECTOR_LEN;
                const ret = wasm._asset_updateAmountFloat(this.__wbg_ptr, ptr0, len0);
                var ptr2 = ret[0];
                var len2 = ret[1];
                if (ret[3]) {
                    ptr2 = 0; len2 = 0;
                    throw takeFromExternrefTable0(ret[2]);
                }
                deferred3_0 = ptr2;
                deferred3_1 = len2;
                return getStringFromWasm0(ptr2, len2);
            } finally {
                wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
            }
        }
    }
    if (Symbol.dispose) _Asset.prototype[Symbol.dispose] = _Asset.prototype.free;
    exports._Asset = _Asset;

    class _AssetEditor {
        static __wrap(ptr) {
            const obj = Object.create(_AssetEditor.prototype);
            obj.__wbg_ptr = ptr;
            _AssetEditorFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            _AssetEditorFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg__asseteditor_free(ptr, 0);
        }
        /**
         * @returns {string}
         */
        get amountStr() {
            let deferred1_0;
            let deferred1_1;
            try {
                const ret = wasm._asseteditor_amount_str(this.__wbg_ptr);
                deferred1_0 = ret[0];
                deferred1_1 = ret[1];
                return getStringFromWasm0(ret[0], ret[1]);
            } finally {
                wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
            }
        }
        /**
         * @returns {_Asset}
         */
        get asset() {
            const ret = wasm._asseteditor_asset(this.__wbg_ptr);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {_Asset} asset
         * @returns {_AssetEditor}
         */
        static fromAsset(asset) {
            _assertClass(asset, _Asset);
            const ret = wasm._asseteditor_fromAsset(asset.__wbg_ptr);
            return _AssetEditor.__wrap(ret);
        }
        /**
         * @param {string} value
         * @returns {_AssetEditor}
         */
        static fromString(value) {
            const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm._asseteditor_fromString(ptr0, len0);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return _AssetEditor.__wrap(ret[0]);
        }
        /**
         * @returns {boolean}
         */
        get hasChange() {
            const ret = wasm._asseteditor_has_change(this.__wbg_ptr);
            return ret !== 0;
        }
        /**
         * @param {number} amount
         * @param {number} precision
         * @param {string} symbol
         * @returns {_AssetEditor}
         */
        static new(amount, precision, symbol) {
            const ptr0 = passStringToWasm0(symbol, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm._asseteditor_new(amount, precision, ptr0, len0);
            return _AssetEditor.__wrap(ret);
        }
        /**
         * @param {string} str
         * @returns {_AssetEditor}
         */
        withChange(str) {
            const ptr0 = passStringToWasm0(str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm._asseteditor_withChange(this.__wbg_ptr, ptr0, len0);
            return _AssetEditor.__wrap(ret);
        }
    }
    if (Symbol.dispose) _AssetEditor.prototype[Symbol.dispose] = _AssetEditor.prototype.free;
    exports._AssetEditor = _AssetEditor;

    class _Price {
        static __wrap(ptr) {
            const obj = Object.create(_Price.prototype);
            obj.__wbg_ptr = ptr;
            _PriceFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }
        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            _PriceFinalization.unregister(this);
            return ptr;
        }
        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg__price_free(ptr, 0);
        }
        /**
         * @returns {_Asset}
         */
        get base() {
            const ret = wasm._price_base(this.__wbg_ptr);
            return _Asset.__wrap(ret);
        }
        /**
         * @returns {_Price}
         */
        clone() {
            const ret = wasm._price_clone(this.__wbg_ptr);
            return _Price.__wrap(ret);
        }
        /**
         * @param {_Asset} base
         * @param {_Asset} quote
         * @returns {_Price}
         */
        static new(base, quote) {
            _assertClass(base, _Asset);
            _assertClass(quote, _Asset);
            const ret = wasm._price_new(base.__wbg_ptr, quote.__wbg_ptr);
            return _Price.__wrap(ret);
        }
        /**
         * @returns {_Asset}
         */
        get quote() {
            const ret = wasm._price_quote(this.__wbg_ptr);
            return _Asset.__wrap(ret);
        }
        /**
         * @param {_Asset} value
         */
        set base(value) {
            _assertClass(value, _Asset);
            wasm._price_set_base(this.__wbg_ptr, value.__wbg_ptr);
        }
        /**
         * @param {_Asset} value
         */
        set quote(value) {
            _assertClass(value, _Asset);
            wasm._price_set_quote(this.__wbg_ptr, value.__wbg_ptr);
        }
    }
    if (Symbol.dispose) _Price.prototype[Symbol.dispose] = _Price.prototype.free;
    exports._Price = _Price;

    /**
     * @param {Uint8Array} key
     * @param {Uint8Array} iv
     * @param {Uint8Array} data
     * @returns {Uint8Array}
     */
    function aes256_decrypt(key, iv, data) {
        const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(iv, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.aes256_decrypt(ptr0, len0, ptr1, len1, ptr2, len2);
        var v4 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v4;
    }
    exports.aes256_decrypt = aes256_decrypt;

    /**
     * @param {Function} get_dgp
     * @param {Function} callback
     * @returns {StreamingHandle}
     */
    function stream_block_number(get_dgp, callback) {
        const ret = wasm.stream_block_number(get_dgp, callback);
        return StreamingHandle.__wrap(ret);
    }
    exports.stream_block_number = stream_block_number;
    function __wbg_get_imports() {
        const import0 = {
            __proto__: null,
            __wbg___wbindgen_throw_9c31b086c2b26051: function(arg0, arg1) {
                throw new Error(getStringFromWasm0(arg0, arg1));
            },
            __wbg__wbg_cb_unref_3fa391f3fcdb55f8: function(arg0) {
                arg0._wbg_cb_unref();
            },
            __wbg_call_13665d9f14390edc: function() { return handleError(function (arg0, arg1) {
                const ret = arg0.call(arg1);
                return ret;
            }, arguments); },
            __wbg_call_dfde26266607c996: function() { return handleError(function (arg0, arg1, arg2) {
                const ret = arg0.call(arg1, arg2);
                return ret;
            }, arguments); },
            __wbg_instanceof_Promise_09012cfa9708520a: function(arg0) {
                let result;
                try {
                    result = arg0 instanceof Promise;
                } catch (_) {
                    result = false;
                }
                const ret = result;
                return ret;
            },
            __wbg_new_1f236d63ba0c4784: function(arg0, arg1) {
                const ret = new Error(getStringFromWasm0(arg0, arg1));
                return ret;
            },
            __wbg_then_7b57a40e3ee05615: function(arg0, arg1) {
                const ret = arg0.then(arg1);
                return ret;
            },
            __wbindgen_cast_0000000000000001: function(arg0, arg1) {
                // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 4, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
                const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__hdaea07da9a0c7a65);
                return ret;
            },
            __wbindgen_init_externref_table: function() {
                const table = wasm.__wbindgen_externrefs;
                const offset = table.grow(4);
                table.set(0, undefined);
                table.set(offset + 0, undefined);
                table.set(offset + 1, null);
                table.set(offset + 2, true);
                table.set(offset + 3, false);
            },
        };
        return {
            __proto__: null,
            "./golos_lib_bg.js": import0,
        };
    }

    function wasm_bindgen__convert__closures_____invoke__hdaea07da9a0c7a65(arg0, arg1, arg2) {
        wasm.wasm_bindgen__convert__closures_____invoke__hdaea07da9a0c7a65(arg0, arg1, arg2);
    }

    const StreamingHandleFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg_streaminghandle_free(ptr, 1));
    const _AssetFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg__asset_free(ptr, 1));
    const _AssetEditorFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg__asseteditor_free(ptr, 1));
    const _PriceFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg__price_free(ptr, 1));

    function addToExternrefTable0(obj) {
        const idx = wasm.__externref_table_alloc();
        wasm.__wbindgen_externrefs.set(idx, obj);
        return idx;
    }

    function _assertClass(instance, klass) {
        if (!(instance instanceof klass)) {
            throw new Error(`expected instance of ${klass.name}`);
        }
    }

    const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(state => wasm.__wbindgen_destroy_closure(state.a, state.b));

    function getArrayU8FromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
    }

    function getStringFromWasm0(ptr, len) {
        return decodeText(ptr >>> 0, len);
    }

    let cachedUint8ArrayMemory0 = null;
    function getUint8ArrayMemory0() {
        if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
            cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachedUint8ArrayMemory0;
    }

    function handleError(f, args) {
        try {
            return f.apply(this, args);
        } catch (e) {
            const idx = addToExternrefTable0(e);
            wasm.__wbindgen_exn_store(idx);
        }
    }

    function isLikeNone(x) {
        return x === undefined || x === null;
    }

    function makeMutClosure(arg0, arg1, f) {
        const state = { a: arg0, b: arg1, cnt: 1 };
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
                state.a = a;
                real._wbg_cb_unref();
            }
        };
        real._wbg_cb_unref = () => {
            if (--state.cnt === 0) {
                wasm.__wbindgen_destroy_closure(state.a, state.b);
                state.a = 0;
                CLOSURE_DTORS.unregister(state);
            }
        };
        CLOSURE_DTORS.register(real, state, state);
        return real;
    }

    function passArray8ToWasm0(arg, malloc) {
        const ptr = malloc(arg.length * 1, 1) >>> 0;
        getUint8ArrayMemory0().set(arg, ptr / 1);
        WASM_VECTOR_LEN = arg.length;
        return ptr;
    }

    function passStringToWasm0(arg, malloc, realloc) {
        if (realloc === undefined) {
            const buf = cachedTextEncoder.encode(arg);
            const ptr = malloc(buf.length, 1) >>> 0;
            getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len, 1) >>> 0;

        const mem = getUint8ArrayMemory0();

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
            ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
            const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
            const ret = cachedTextEncoder.encodeInto(arg, view);

            offset += ret.written;
            ptr = realloc(ptr, len, offset, 1) >>> 0;
        }

        WASM_VECTOR_LEN = offset;
        return ptr;
    }

    function takeFromExternrefTable0(idx) {
        const value = wasm.__wbindgen_externrefs.get(idx);
        wasm.__externref_table_dealloc(idx);
        return value;
    }

    let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    function decodeText(ptr, len) {
        return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
    }

    const cachedTextEncoder = new TextEncoder();

    if (!('encodeInto' in cachedTextEncoder)) {
        cachedTextEncoder.encodeInto = function (arg, view) {
            const buf = cachedTextEncoder.encode(arg);
            view.set(buf);
            return {
                read: arg.length,
                written: buf.length
            };
        };
    }

    let WASM_VECTOR_LEN = 0;

    let wasmModule, wasmInstance, wasm;
    function __wbg_finalize_init(instance, module) {
        wasmInstance = instance;
        wasm = instance.exports;
        wasmModule = module;
        cachedUint8ArrayMemory0 = null;
        wasm.__wbindgen_start();
        return wasm;
    }

    async function __wbg_load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);
                } catch (e) {
                    const validResponse = module.ok && expectedResponseType(module.type);

                    if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else { throw e; }
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

        function expectedResponseType(type) {
            switch (type) {
                case 'basic': case 'cors': case 'default': return true;
            }
            return false;
        }
    }

    function initSync(module) {
        if (wasm !== undefined) return wasm;


        if (module !== undefined) {
            if (Object.getPrototypeOf(module) === Object.prototype) {
                ({module} = module)
            } else {
                console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
            }
        }

        const imports = __wbg_get_imports();
        if (!(module instanceof WebAssembly.Module)) {
            module = new WebAssembly.Module(module);
        }
        const instance = new WebAssembly.Instance(module, imports);
        return __wbg_finalize_init(instance, module);
    }

    async function __wbg_init(module_or_path) {
        if (wasm !== undefined) return wasm;


        if (module_or_path !== undefined) {
            if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
                ({module_or_path} = module_or_path)
            } else {
                console.warn('using deprecated parameters for the initialization function; pass a single object instead')
            }
        }

        if (module_or_path === undefined && script_src !== undefined) {
            module_or_path = script_src.replace(/\.js$/, "_bg.wasm");
        }
        const imports = __wbg_get_imports();

        if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
            module_or_path = fetch(module_or_path);
        }

        const { instance, module } = await __wbg_load(await module_or_path, imports);

        return __wbg_finalize_init(instance, module);
    }

    return Object.assign(__wbg_init, { initSync }, exports);
})({ __proto__: null });
export default wasm_bindgen;
