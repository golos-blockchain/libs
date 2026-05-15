declare namespace wasm_bindgen {
    /* tslint:disable */
    /* eslint-disable */

    export class StreamingHandle {
        private constructor();
        free(): void;
        [Symbol.dispose](): void;
    }

    export class _Asset {
        private constructor();
        free(): void;
        [Symbol.dispose](): void;
        _div(a: _Asset): _Asset;
        _div_num(num: number): _Asset;
        _eq(a: _Asset): boolean;
        _eq_num(num: number): boolean;
        _gt(a: _Asset): boolean;
        _gt_num(num: number): boolean;
        _gte(a: _Asset): boolean;
        _gte_num(num: number): boolean;
        _lt(a: _Asset): boolean;
        _lt_num(num: number): boolean;
        _lte(a: _Asset): boolean;
        _lte_num(num: number): boolean;
        _max(a: _Asset): _Asset;
        _max_num(num: number): _Asset;
        _min(a: _Asset): _Asset;
        _min_num(num: number): _Asset;
        _minus(a: _Asset): _Asset;
        _minus_num(num: number): _Asset;
        _mod(a: _Asset): _Asset;
        _mod_num(num: number): _Asset;
        _mul(a: _Asset): _Asset;
        _mul_num(num: number): _Asset;
        _mul_price(p: _Price, remain: _Asset): _Asset;
        _ne(a: _Asset): boolean;
        _ne_num(num: number): boolean;
        _plus(a: _Asset): _Asset;
        _plus_num(num: number): _Asset;
        clone(): _Asset;
        static fromString(value: string): _Asset;
        static new(amount: number, precision: number, symbol: string): _Asset;
        toString(dec_places?: number | null): string;
        updateAmountFloat(amount_str: string): string;
        amount: number;
        amountFloat: string;
        readonly floatString: string;
        readonly isUIA: boolean;
        precision: number;
        symbol: string;
    }

    export class _AssetEditor {
        private constructor();
        free(): void;
        [Symbol.dispose](): void;
        static fromAsset(asset: _Asset): _AssetEditor;
        static fromString(value: string): _AssetEditor;
        static new(amount: number, precision: number, symbol: string): _AssetEditor;
        withChange(str: string): _AssetEditor;
        readonly amountStr: string;
        readonly asset: _Asset;
        readonly hasChange: boolean;
    }

    export class _Price {
        private constructor();
        free(): void;
        [Symbol.dispose](): void;
        clone(): _Price;
        static new(base: _Asset, quote: _Asset): _Price;
        base: _Asset;
        quote: _Asset;
    }

    export function aes256_decrypt(key: Uint8Array, iv: Uint8Array, data: Uint8Array): Uint8Array;

    export function stream_block_number(get_dgp: Function, callback: Function): StreamingHandle;

}
declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg__asset_free: (a: number, b: number) => void;
    readonly _asset__div: (a: number, b: number) => number;
    readonly _asset__div_num: (a: number, b: number) => number;
    readonly _asset__eq: (a: number, b: number) => number;
    readonly _asset__eq_num: (a: number, b: number) => number;
    readonly _asset__gt: (a: number, b: number) => number;
    readonly _asset__gt_num: (a: number, b: number) => number;
    readonly _asset__gte: (a: number, b: number) => number;
    readonly _asset__gte_num: (a: number, b: number) => number;
    readonly _asset__lt: (a: number, b: number) => number;
    readonly _asset__lt_num: (a: number, b: number) => number;
    readonly _asset__lte: (a: number, b: number) => number;
    readonly _asset__lte_num: (a: number, b: number) => number;
    readonly _asset__max: (a: number, b: number) => number;
    readonly _asset__max_num: (a: number, b: number) => number;
    readonly _asset__min: (a: number, b: number) => number;
    readonly _asset__min_num: (a: number, b: number) => number;
    readonly _asset__minus: (a: number, b: number) => number;
    readonly _asset__minus_num: (a: number, b: number) => number;
    readonly _asset__mod: (a: number, b: number) => number;
    readonly _asset__mod_num: (a: number, b: number) => number;
    readonly _asset__mul: (a: number, b: number) => number;
    readonly _asset__mul_num: (a: number, b: number) => number;
    readonly _asset__mul_price: (a: number, b: number, c: number) => number;
    readonly _asset__ne: (a: number, b: number) => number;
    readonly _asset__ne_num: (a: number, b: number) => number;
    readonly _asset__plus: (a: number, b: number) => number;
    readonly _asset__plus_num: (a: number, b: number) => number;
    readonly _asset_amount: (a: number) => number;
    readonly _asset_amount_float: (a: number) => [number, number];
    readonly _asset_clone: (a: number) => number;
    readonly _asset_float_string: (a: number) => [number, number];
    readonly _asset_fromString: (a: number, b: number) => [number, number, number];
    readonly _asset_is_uia: (a: number) => number;
    readonly _asset_new: (a: number, b: number, c: number, d: number) => number;
    readonly _asset_precision: (a: number) => number;
    readonly _asset_set_amount: (a: number, b: number) => void;
    readonly _asset_set_amount_float: (a: number, b: number, c: number) => [number, number, number];
    readonly _asset_set_precision: (a: number, b: number) => void;
    readonly _asset_set_symbol: (a: number, b: number, c: number) => void;
    readonly _asset_symbol: (a: number) => [number, number];
    readonly _asset_toString: (a: number, b: number) => [number, number];
    readonly _asset_updateAmountFloat: (a: number, b: number, c: number) => [number, number, number, number];
    readonly __wbg__price_free: (a: number, b: number) => void;
    readonly __wbg_streaminghandle_free: (a: number, b: number) => void;
    readonly _price_base: (a: number) => number;
    readonly _price_clone: (a: number) => number;
    readonly _price_new: (a: number, b: number) => number;
    readonly _price_quote: (a: number) => number;
    readonly _price_set_base: (a: number, b: number) => void;
    readonly _price_set_quote: (a: number, b: number) => void;
    readonly aes256_decrypt: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
    readonly stream_block_number: (a: any, b: any) => number;
    readonly __wbg__asseteditor_free: (a: number, b: number) => void;
    readonly _asseteditor_amount_str: (a: number) => [number, number];
    readonly _asseteditor_asset: (a: number) => number;
    readonly _asseteditor_fromAsset: (a: number) => number;
    readonly _asseteditor_fromString: (a: number, b: number) => [number, number, number];
    readonly _asseteditor_has_change: (a: number) => number;
    readonly _asseteditor_new: (a: number, b: number, c: number, d: number) => number;
    readonly _asseteditor_withChange: (a: number, b: number, c: number) => number;
    readonly wasm_bindgen__convert__closures_____invoke__hdaea07da9a0c7a65: (a: number, b: number, c: any) => void;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
declare function wasm_bindgen (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
